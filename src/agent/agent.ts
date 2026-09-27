import { Plan, Query, LiveReport, factor, confidence, reportExtra, placeName, stopById, ROUTES } from "../engine/router";

export interface AgentReply {
  recommendedId: string; headline: string; why: string;
  warning: string | null; alternativeId: string | null; confidence: "alta" | "media" | "baja";
}

export const SYSTEM_PROMPT = `Eres "Muévete", asistente de movilidad de Ciudad Bolívar (Bogotá). Hablas con estudiantes, trabajadores y comerciantes, muchos desde el celular. Tono cercano, claro y respetuoso; tuteas. Frases cortas. Sin tecnicismos.

REGLAS
1. Recibes un JSON con rutas candidatas calculadas por un motor. Elige UNA como recomendada, usando SOLO los IDs del JSON.
2. NUNCA inventes rutas, paraderos, horarios ni cifras. Todo minuto que menciones debe aparecer en el JSON.
3. Prefiere la candidata con menor costo y margen >= 5 min. Si ninguna tiene colchón, dilo con honestidad.
4. Si un reporte ciudadano afecta la ruta habitual, dilo primero. Si tiene pocas confirmaciones, di que "aún no está confirmado".
5. Explica el porqué en máximo 60 palabras: tiempo total, margen y qué tramo es informal si lo hay.
6. Si hay tramos de colectivo informal, avisa que "sale cuando se llena".
7. Si el usuario requiere accesibilidad, no recomiendes paraderos no accesibles.
8. Responde ÚNICAMENTE con JSON válido, sin texto adicional:
{"recommendedId": string, "headline": string (máx. 8 palabras), "why": string (máx. 60 palabras), "warning": string | null (máx. 20 palabras), "alternativeId": string | null, "confidence": "alta" | "media" | "baja"}`;

const r0 = (n: number) => Math.round(n);

export function buildPayload(q: Query, p: Plan, reports: LiveReport[], now: number) {
  const usualId = p.usual && p.candidates.find(c => c.rsig === p.usual!.rsig)?.id;
  const active = reports.filter(r => factor(r, now) > 0).map(r => {
    const rt = ROUTES.find(x => x.id === r.routeId)!;
    return {
      id: r.id, routeName: rt.name, type: r.type, severity: r.severity, extraMin: r0(reportExtra(r)),
      confirmations: r.confirmations, confidence: confidence(r), description: r.description,
      where: r.from && r.to ? `${stopById(r.from).name} → ${stopById(r.to).name}` : rt.name,
      affectsUsual: r.routeId === q.usualRouteId,
    };
  });
  return {
    userQuery: { origin: placeName(q.origin), destination: placeName(q.destination), minutesAvailable: q.minutesAvailable, profile: q.profile, clock: q.clock },
    usualRouteId: usualId ?? null,
    engineChoiceId: p.candidates.find(c => c.sig === p.chosen.sig)!.id,
    activeReports: active,
    candidates: p.candidates.map(c => ({
      id: c.id, summary: c.summary, totalMin: r0(c.totalMin), waitMin: r0(c.waitMin), walkMin: r0(c.walkMin),
      transfers: c.transfers, cost: Math.round(c.cost * 10) / 10, marginMin: r0(c.marginMin),
      affectedByReport: c.affectedByReport, kinds: c.kinds, usual: c.id === usualId,
    })),
    savedMinVsUsual: p.savedMin,
  };
}

/* ---------- Guardrail: el LLM no puede inventar IDs ni cifras ---------- */
const words = (s: string) => s.trim().split(/\s+/).length;
export function validateReply(reply: AgentReply, payload: any): AgentReply | null {
  const ids = new Set<string>(payload.candidates.map((c: any) => c.id));
  if (!ids.has(reply.recommendedId)) return null;
  if (reply.alternativeId && !ids.has(reply.alternativeId)) return null;
  if (words(reply.why) > 70 || words(reply.headline) > 10) return null;
  const allowed = new Set<number>([0, 1, 2, 3, 5, 6, 10]);
  const collect = (v: any) => {
    if (typeof v === "number") allowed.add(Math.round(v));
    else if (Array.isArray(v)) v.forEach(collect);
    else if (v && typeof v === "object") Object.values(v).forEach(collect);
  };
  collect(payload);
  const text = `${reply.headline} ${reply.why} ${reply.warning ?? ""}`;
  if ((text.match(/\d+/g) ?? []).map(Number).some(n => !allowed.has(n))) return null;
  return reply;
}

/* ---------- Modo local: plantillas con números del motor ---------- */
const TYPE: Record<string, string> = { bloqueo: "un bloqueo", demora: "una demora", cambio: "un cambio de servicio" };

export function localReply(p: any): AgentReply {
  const rec = p.candidates.find((c: any) => c.id === p.engineChoiceId);
  const usual = p.candidates.find((c: any) => c.usual);
  const hit = p.activeReports.find((r: any) => r.affectsUsual);
  const alt = p.candidates.find((c: any) => c.id !== rec.id && c.marginMin >= 0);
  const informal = rec.kinds.includes("informal");
  const warning = informal ? "El colectivo sale cuando se llena." : null;
  const dest = p.userQuery.destination;

  if (rec.marginMin < 5)
    return { recommendedId: rec.id, headline: "Ninguna ruta te da colchón", warning: informal ? warning : "Sal ya para llegar a tiempo.",
      why: `La más rápida es ${rec.summary}: ${rec.totalMin} min. Vas justo, avisa que podrías llegar tarde.`,
      alternativeId: null, confidence: "media" };

  if (hit && usual && usual.id !== rec.id)
    return { recommendedId: rec.id, headline: "Cambia tu ruta de hoy", warning, alternativeId: alt?.id ?? null,
      confidence: hit.confidence >= 0.8 ? "alta" : "media",
      why: `Hay ${TYPE[hit.type]} en ${hit.where} (${hit.confidence >= 0.8 ? "confirmado" : "aún no está confirmado"}). Tu ruta habitual pasaría a ${usual.totalMin} min. Por ${rec.summary} llegas en ${rec.totalMin} min, con ${rec.marginMin} de margen. Ahorras ${p.savedMinVsUsual} min.` };

  return { recommendedId: rec.id, headline: usual?.id === rec.id ? "Tu ruta de siempre va bien" : "Esta es tu mejor ruta",
    why: `${rec.summary} te deja en ${dest} en ${rec.totalMin} min y te sobran ${rec.marginMin}. No hay reportes que la afecten.`,
    warning, alternativeId: alt?.id ?? null, confidence: "alta" };
}

/* ---------- Proveedor con timeout de 4 s y fallback ---------- */
async function callLLM(payload: any, signal: AbortSignal): Promise<string> {
  // VITE_LLM_URL apunta a un proxy propio que agrega la API key (nunca la pongas en el cliente).
  const res = await fetch(import.meta.env.VITE_LLM_URL as string, {
    method: "POST", headers: { "Content-Type": "application/json" }, signal,
    body: JSON.stringify({ system: SYSTEM_PROMPT, payload }),
  });
  return (await res.json()).text as string;
}

export async function getRecommendation(payload: any): Promise<{ reply: AgentReply; source: "llm" | "local" }> {
  if (navigator.onLine && import.meta.env.VITE_USE_LLM === "true" && import.meta.env.VITE_LLM_URL) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 4000);
    try {
      const ok = validateReply(JSON.parse(await callLLM(payload, ctrl.signal)), payload);
      if (ok) return { reply: ok, source: "llm" };
    } catch { /* cae al modo local */ } finally { clearTimeout(t); }
  }
  return { reply: localReply(payload), source: "local" };
}
