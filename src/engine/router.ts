import routesJson from "../data/routes.json";
import stopsJson from "../data/stops.json";
import poisJson from "../data/pois.json";
import pen from "../data/penalties.json";
import type { Route, Stop, Poi, Report } from "../data/types";

export const ROUTES = routesJson.routes as unknown as Route[];
export const STOPS = stopsJson.stops as unknown as Stop[];
export const POIS = poisJson.pois as unknown as Poi[];
const WALKS = stopsJson.walks as { a: string; b: string; min: number }[];
export const stopById = (id: string) => STOPS.find(s => s.id === id)!;
export const placeName = (id: string) => POIS.find(p => p.id === id)?.name ?? stopById(id)?.name ?? id;

export type Profile = "estudiante" | "trabajador" | "comercio" | "accesible";
export type LiveReport = Report & { t0: number };
export interface Leg {
  kind: "ride" | "walk"; routeId?: string; from: string; to: string; stops: string[];
  wait: number; move: number; extra: number; affected: boolean;
}
export interface Candidate {
  id: string; sig: string; rsig: string; summary: string; legs: Leg[];
  totalMin: number; waitMin: number; walkMin: number; transfers: number; cost: number;
  marginMin: number; affectedByReport: boolean; kinds: ("formal" | "informal")[]; informalRides: number;
}
export interface Query {
  origin: string; destination: string; minutesAvailable: number;
  profile: Profile; clock: string; day: string; usualRouteId?: string;
}
export interface Plan { candidates: Candidate[]; chosen: Candidate; usual?: Candidate; savedMin: number | null; }

const mm = (h: string) => { const [a, b] = h.split(":").map(Number); return a * 60 + b; };
const isOpen = (r: Route, clock: string, day: string) =>
  r.schedule.some(s => (s.days as string[]).includes(day) && mm(s.from) <= mm(clock) && mm(clock) <= mm(s.to));

/** 1 = efecto pleno; baja lineal a 0 entre 70 % y 100 % del TTL; 0 = vencido. */
export function factor(r: LiveReport, now: number) {
  const age = r.minutesAgo + (now - r.t0) / 60000;
  if (age >= r.ttlMin) return 0;
  const f = age / r.ttlMin, s = pen.decay.startsAtTtlFraction;
  return f <= s ? 1 : (1 - f) / (1 - s);
}
export const confidence = (r: Report) =>
  Math.min(pen.confidence.max, pen.confidence.base + pen.confidence.perConfirmation * r.confirmations);

/** Minutos extra que un reporte suma a su tramo (para mostrar y para el agente). */
export function reportExtra(r: Report) {
  if (r.type === "bloqueo") return r.severity === 3 ? 0 : ((pen.reportRules.bloqueo as any)[String(r.severity)].extraMin as number);
  if (r.type === "demora") return r.minutesExtra ?? 0;
  return 0;
}

type Rep = { r: LiveReport; f: number };

function rideLeg(rt: Route, i: number, j: number, reps: Rep[]): Leg | null {
  const lo = Math.min(i, j), hi = Math.max(i, j);
  let move = 0;
  for (let k = lo; k < hi; k++) move += rt.segMin[k];
  let mult = 1, extra = 0, affected = false;
  for (const { r: p, f } of reps) {
    if (p.routeId !== rt.id) continue;
    if (p.type === "cambio") { mult *= 1 + ((p.headwayMultiplier ?? 1) - 1) * f; affected = true; continue; }
    const ia = p.from ? rt.stops.indexOf(p.from) : 0;
    const ib = p.to ? rt.stops.indexOf(p.to) : rt.stops.length - 1;
    const a = Math.min(ia, ib), b = Math.max(ia, ib);
    if (!(a < hi && b > lo)) continue;
    affected = true;
    if (p.type === "bloqueo" && p.severity === 3) return null; // vía cerrada
    extra += reportExtra(p) * f;
  }
  const seq = rt.stops.slice(lo, hi + 1);
  return { kind: "ride", routeId: rt.id, from: rt.stops[i], to: rt.stops[j], stops: i <= j ? seq : seq.reverse(),
    wait: rt.headwayMin * 0.5 * mult, move, extra, affected };
}

const label = (l: Leg) => {
  if (l.kind === "walk") return `caminata ${Math.round(l.move)} min`;
  const r = ROUTES.find(x => x.id === l.routeId)!;
  return r.mode === "cable" ? "TransMiCable" : r.mode === "sitp" ? `SITP ${r.id}`
    : r.mode === "colectivo" ? `Colectivo ${r.id}` : `Ruta comunitaria ${r.id}`;
};

export function findCandidates(q: Query, reports: LiveReport[], now: number): Candidate[] {
  const poi = POIS.find(p => p.id === q.destination);
  const target = poi ? poi.nearestStop : q.destination;
  const finalWalk = poi ? poi.walkMin : 0;
  const reps: Rep[] = reports.map(r => ({ r, f: factor(r, now) })).filter(x => x.f > 0);
  const open = ROUTES.filter(r => isOpen(r, q.clock, q.day));
  const ok = (s: string) => q.profile !== "accesible" || stopById(s).accessible || s === q.origin || s === target;
  const tf = pen.transferPenaltyMin * (q.profile === "comercio" || q.profile === "accesible" ? 2 : 1);
  const found = new Map<string, Candidate>();

  const finish = (legs0: Leg[]) => {
    const legs = finalWalk
      ? [...legs0, { kind: "walk", from: target, to: q.destination, stops: [target], wait: 0, move: finalWalk, extra: 0, affected: false } as Leg]
      : legs0;
    const rides = legs.filter(l => l.kind === "ride");
    const total = legs.reduce((s, l) => s + l.wait + l.move + l.extra, 0);
    const transfers = Math.max(0, rides.length - 1);
    const unrel = rides.reduce((s, l) => s + (1 - ROUTES.find(r => r.id === l.routeId)!.reliability) * pen.unreliabilityWeight * (l.wait + l.move), 0);
    const kinds = [...new Set(rides.map(l => ROUTES.find(r => r.id === l.routeId)!.kind))];
    const sig = legs.map(l => (l.kind === "ride" ? l.routeId : "W")).join(">");
    const c: Candidate = {
      id: "", sig, rsig: rides.map(l => l.routeId).join("+"),
      summary: legs.filter((l, i) => !(l.kind === "walk" && i === legs.length - 1 && finalWalk)).map(label).join(" → ") + (rides.length === 1 && legs.length <= 2 ? " directo" : ""),
      legs, totalMin: total, waitMin: legs.reduce((s, l) => s + l.wait, 0),
      walkMin: legs.filter(l => l.kind === "walk").reduce((s, l) => s + l.move, 0),
      transfers, cost: total + transfers * tf + unrel, marginMin: q.minutesAvailable - total,
      affectedByReport: legs.some(l => l.affected), kinds,
      informalRides: rides.filter(l => ROUTES.find(r => r.id === l.routeId)!.kind === "informal").length,
    };
    const prev = found.get(sig);
    if (!prev || c.cost < prev.cost) found.set(sig, c);
  };

  const dfs = (stop: string, legs: Leg[], used: Set<string>, seen: Set<string>) => {
    if (stop === target && legs.length) { finish(legs); return; }
    const last = legs[legs.length - 1];
    if (used.size < 3) for (const r of open) {
      const i = r.stops.indexOf(stop);
      if (used.has(r.id) || i < 0 || !ok(stop)) continue;
      for (let j = 0; j < r.stops.length; j++) {
        const to = r.stops[j];
        if (j === i || seen.has(to) || !ok(to)) continue;
        const leg = rideLeg(r, i, j, reps);
        if (leg) dfs(to, [...legs, leg], new Set(used).add(r.id), new Set(seen).add(to));
      }
    }
    if (last && last.kind === "ride") for (const w of WALKS) {
      const to = w.a === stop ? w.b : w.b === stop ? w.a : null;
      if (!to || seen.has(to)) continue;
      dfs(to, [...legs, { kind: "walk", from: stop, to, stops: [stop, to], wait: 0, move: w.min, extra: 0, affected: false }],
        used, new Set(seen).add(to));
    }
  };
  dfs(q.origin, [], new Set(), new Set([q.origin]));
  return [...found.values()];
}

/** Política: descarta sin margen (< 5 min); menor costo; empate (< 2) prefiere menos tramos informales. */
export function pick(cs: Candidate[]): Candidate {
  const withMargin = cs.filter(c => c.marginMin >= 5);
  const pool = withMargin.length ? withMargin : [[...cs].sort((a, b) => a.totalMin - b.totalMin)[0]];
  const best = pool.reduce((a, b) => (b.cost < a.cost ? b : a));
  return pool.filter(c => c.cost - best.cost < 2)
    .sort((a, b) => a.informalRides - b.informalRides || a.cost - b.cost)[0];
}

export function plan(q: Query, reports: LiveReport[], now = Date.now()): Plan | null {
  const all = findCandidates(q, reports, now).sort((a, b) => a.cost - b.cost);
  if (!all.length) return null;
  const chosen = pick(all);
  const usual = q.usualRouteId ? all.find(c => c.rsig === q.usualRouteId) : undefined;
  const top = all.slice(0, 3);
  for (const x of [chosen, usual]) if (x && !top.includes(x)) top[2] = x;
  top.sort((a, b) => a.cost - b.cost).forEach((c, i) => (c.id = `C${i + 1}`));
  return { candidates: top, chosen, usual, savedMin: usual ? Math.round(usual.totalMin) - Math.round(chosen.totalMin) : null };
}
