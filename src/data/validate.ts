import { ROUTES, STOPS, POIS } from "../engine/router";
import reportsJson from "./reports.json";

/** Devuelve la lista de errores de integridad de los datos mock (vacía = todo bien). */
export function validateData(): string[] {
  const errs: string[] = [];
  const stops = new Set(STOPS.map(s => s.id));
  const routes = new Map(ROUTES.map(r => [r.id, r]));
  for (const r of ROUTES) {
    if (r.segMin.length !== r.stops.length - 1) errs.push(`${r.id}: segMin no coincide con stops`);
    r.stops.forEach(s => { if (!stops.has(s)) errs.push(`${r.id}: paradero ${s} no existe`); });
  }
  POIS.forEach(p => { if (!stops.has(p.nearestStop)) errs.push(`${p.id}: nearestStop ${p.nearestStop} no existe`); });
  for (const rp of reportsJson.reports as any[]) {
    const r = routes.get(rp.routeId);
    if (!r) { errs.push(`${rp.id}: ruta ${rp.routeId} no existe`); continue; }
    [rp.from, rp.to].filter(Boolean).forEach((s: string) => { if (!r.stops.includes(s)) errs.push(`${rp.id}: ${s} no está en ${r.id}`); });
  }
  return errs;
}
