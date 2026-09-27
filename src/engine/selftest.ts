import { plan, LiveReport } from "./router";
import { validateData } from "../data/validate";
import seed from "../data/reports.json";
import sc from "../data/scenario.json";

const errs = validateData();
if (errs.length) { console.error("DATOS INVÁLIDOS:\n" + errs.join("\n")); process.exit(1); }

const now = Date.now();
const q = { ...sc.query, minutesAvailable: sc.query.minutesAvailable, profile: "estudiante" as const,
  clock: sc.demoClock, day: sc.demoDay, usualRouteId: sc.persona.usualRouteId };
const base: LiveReport[] = (seed.reports as any[]).map(r => ({ ...r, t0: now }));
const live: LiveReport = { ...(sc.liveReportTemplate as any), id: "LIVE", minutesAgo: 0, t0: now };

const before = plan(q, base, now)!;
const after = plan(q, [live, ...base], now)!;
const show = (t: string, p: typeof before) =>
  console.log(t, p.chosen.rsig, `${Math.round(p.chosen.totalMin)} min`, `margen ${Math.round(p.chosen.marginMin)}`, `ahorro ${p.savedMin}`);
show("SIN REPORTE:", before);
show("CON BLOQUEO:", after);

const t = (ok: boolean, m: string) => { console.log(ok ? "  ✔" : "  ✘", m); if (!ok) process.exitCode = 1; };
t(before.chosen.rsig === "R04" && Math.round(before.chosen.totalMin) === 28, "sin reporte: R04 directo, 28 min");
t(after.usual && Math.round(after.usual.totalMin) === 53, "con bloqueo: ruta habitual sube a 53 min");
t(after.chosen.rsig === "R05+R01+R02" && Math.round(after.chosen.totalMin) === 34, "con bloqueo: reroutea a R05+R01+R02, 34 min");
t(Math.round(after.chosen.marginMin) === 6 && after.savedMin === 19, "margen 6 min y ahorro 19 min");
