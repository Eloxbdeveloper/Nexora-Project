import { useEffect, useMemo, useRef, useState } from "react";
import { ReportsProvider, useReports } from "./context/ReportsContext";
import MapView from "./components/MapView";
import WhatsAppChat from "./components/WhatsAppChat";
import { STOPS, POIS, ROUTES, plan as makePlan, factor, confidence, Profile, Query, Leg } from "./engine/router";
import { buildPayload, getRecommendation, AgentReply } from "./agent/agent";
import { validateData } from "./data/validate";
import sc from "./data/scenario.json";

const MINUTES = [20, 30, 40, 60];
const PROFILES: [Profile, string][] = [["estudiante", "🎒 Estudiante"], ["trabajador", "💼 Trabajo"], ["comercio", "🛒 Comercio"], ["accesible", "♿ Accesible"]];
const EMO: Record<string, string> = { cable: "🔴", sitp: "🔵", colectivo: "🟠", comunitaria: "🟢" };
const TYPE_EMO: Record<string, string> = { bloqueo: "🚫", demora: "⏱", cambio: "🔄" };
const btn = "min-h-[56px] rounded-2xl font-bold px-4";

function Chip({ l }: { l: Leg }) {
  if (l.kind === "walk") return <span className="px-2 py-1 rounded-lg bg-line text-sm font-bold">🚶 {Math.round(l.move)} min</span>;
  const r = ROUTES.find(x => x.id === l.routeId)!;
  return <span className="px-2 py-1 rounded-lg border-2 text-sm font-bold" style={{ borderColor: r.color, borderStyle: r.kind === "informal" ? "dashed" : "solid" }}>
    {EMO[r.mode]} {r.mode === "cable" ? "TransMiCable" : r.mode === "sitp" ? `SITP ${r.id}` : `${r.mode === "colectivo" ? "Colectivo" : "Comunitaria"} ${r.id}`} · {r.kind}</span>;
}

function ReportSheet({ onClose, onSend }: { onClose: () => void; onSend: (r: any) => void }) {
  const t = sc.liveReportTemplate;
  const [type, setType] = useState<string>(t.type);
  const [routeId, setRouteId] = useState<string>(t.routeId);
  const route = ROUTES.find(r => r.id === routeId)!;
  const segs = route.stops.slice(0, -1).map((s, i) => [s, route.stops[i + 1]]);
  const [seg, setSeg] = useState(Math.max(0, segs.findIndex(([a]) => a === t.from)));
  const [sev, setSev] = useState<1 | 2 | 3>(t.severity as 2);
  const [note, setNote] = useState("");
  const name = (id: string) => STOPS.find(s => s.id === id)!.name;
  const pill = (on: boolean) => `${btn} border-2 ${on ? "bg-brand text-white border-brand" : "bg-white border-line"}`;
  const send = () => onSend({
    type, routeId, severity: sev, ttlMin: 90, source: "ciudadano",
    description: note || (type === "bloqueo" ? t.description : type === "demora" ? "Demora en el recorrido" : "Cambio de horario o ruta"),
    ...(type !== "cambio" ? { from: segs[seg][0], to: segs[seg][1] } : { headwayMultiplier: 2 }),
    ...(type === "demora" ? { minutesExtra: 10 } : {}),
  });
  return (
    <div className="fixed inset-0 z-[2000] bg-black/40 flex items-end lg:items-center justify-center" onClick={onClose}>
      <div className="bg-paper w-full max-w-lg rounded-t-3xl lg:rounded-3xl p-5 space-y-3 max-h-[92vh] overflow-y-auto" onClick={e => e.stopPropagation()} role="dialog" aria-label="Reportar">
        <h2 className="text-2xl font-extrabold">🚧 Reportar algo</h2>
        <div><b>1 · ¿Qué pasa?</b><div className="grid grid-cols-3 gap-2 mt-1">
          {[["bloqueo", "🚫 Bloqueo"], ["demora", "⏱ Demora"], ["cambio", "🔄 Cambio"]].map(([k, l]) => <button key={k} className={pill(type === k)} onClick={() => setType(k)}>{l}</button>)}</div></div>
        <div><b>2 · ¿En qué ruta?</b>
          <select className="w-full min-h-[56px] rounded-2xl border-2 border-line px-3 mt-1 bg-white" value={routeId} onChange={e => { setRouteId(e.target.value); setSeg(0); }}>
            {ROUTES.map(r => <option key={r.id} value={r.id}>{r.id} · {r.name}</option>)}</select>
          {type !== "cambio" && <select className="w-full min-h-[56px] rounded-2xl border-2 border-line px-3 mt-2 bg-white" value={seg} onChange={e => setSeg(+e.target.value)}>
            {segs.map(([a, b], i) => <option key={i} value={i}>{name(a)} → {name(b)}</option>)}</select>}</div>
        <div><b>3 · ¿Qué tan grave?</b><div className="grid grid-cols-3 gap-2 mt-1">
          {([[1, "Leve"], [2, "Fuerte"], [3, "Cerrada"]] as const).map(([k, l]) => <button key={k} className={pill(sev === k)} onClick={() => setSev(k)}>{l}</button>)}</div></div>
        <input className="w-full min-h-[56px] rounded-2xl border-2 border-line px-3 bg-white" placeholder="📝 Nota (opcional)" value={note} onChange={e => setNote(e.target.value)} />
        <button className={`${btn} w-full bg-brand text-white text-xl`} onClick={send}>✅ Enviar reporte</button>
      </div>
    </div>);
}

function Main() {
  const { reports, addReport, confirm, resetDemo } = useReports();
  const [tab, setTab] = useState<"app" | "chat">("app");
  const [origin, setOrigin] = useState<string>(sc.query.origin);
  const [dest, setDest] = useState<string>(sc.query.destination);
  const [minutes, setMinutes] = useState<number>(sc.query.minutesAvailable);
  const [profile, setProfile] = useState<Profile>("estudiante");
  const [q, setQ] = useState<Query | null>(null);
  const [sheet, setSheet] = useState(false);
  const [banner, setBanner] = useState(false);
  const [toast, setToast] = useState("");
  const [ai, setAi] = useState<{ reply: AgentReply; source: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const errors = useMemo(validateData, []);

  const result = useMemo(() => (q ? makePlan(q, reports, Date.now()) : null), [q, reports]);
  useEffect(() => {
    if (!q || !result) { setAi(null); return; }
    let live = true; setLoading(true);
    getRecommendation(buildPayload(q, result, reports, Date.now())).then(r => { if (live) { setAi(r); setLoading(false); } });
    return () => { live = false; };
  }, [result]);

  const prev = useRef(reports.length);
  useEffect(() => {
    if (reports.length > prev.current) { setBanner(true); setTimeout(() => setBanner(false), 3800); }
    prev.current = reports.length;
  }, [reports.length]);

  const rec = result && (result.candidates.find(c => c.id === ai?.reply.recommendedId) ?? result.chosen);
  const saved = result?.usual && rec ? Math.round(result.usual.totalMin) - Math.round(rec.totalMin) : null;
  const alt = result?.candidates.find(c => c.id === ai?.reply.alternativeId);
  const active = reports.filter(r => factor(r, Date.now()) > 0);
  const search = () => setQ({ origin, destination: dest, minutesAvailable: minutes, profile, clock: sc.demoClock, day: sc.demoDay,
    usualRouteId: origin === sc.query.origin && dest === sc.query.destination ? sc.persona.usualRouteId : undefined });
  const sendReport = (r: any) => { addReport(r); setSheet(false); setToast("✅ Reporte enviado. Gracias, vecino."); setTimeout(() => setToast(""), 2500); };
  const sel = "w-full min-h-[56px] rounded-2xl border-2 border-line px-3 bg-white";

  return (
    <div className="h-full flex flex-col lg:flex-row">
      <div className={`${tab === "chat" ? "hidden lg:block" : ""} h-[40vh] lg:h-full lg:flex-1 lg:order-2 relative`}>
        <MapView chosen={tab === "app" ? rec ?? null : rec ?? null} reports={reports} />
      </div>
      <section className="flex-1 lg:flex-none lg:w-[440px] lg:order-1 overflow-y-auto bg-paper border-r border-line">
        <header className="flex items-center gap-2 px-4 py-3 bg-white border-b border-line sticky top-0 z-10">
          <h1 className="text-xl font-extrabold flex-1">🚡 Muévete CB</h1>
          <button onClick={() => setTab("app")} className={`px-3 min-h-[44px] rounded-xl font-bold ${tab === "app" ? "bg-brand text-white" : "bg-line"}`}>Web</button>
          <button onClick={() => setTab("chat")} className={`px-3 min-h-[44px] rounded-xl font-bold ${tab === "chat" ? "bg-wa-head text-white" : "bg-line"}`}>💬 WhatsApp</button>
          <button onClick={() => { resetDemo(); setQ(null); }} title="Reiniciar demo" aria-label="Reiniciar demo" className="w-11 h-11 rounded-xl bg-line">↺</button>
        </header>

        {tab === "chat" ? <div className="h-[calc(100%-68px)] min-h-[480px]"><WhatsAppChat onOpenMap={() => setTab("app")} /></div> : (
          <div className="p-4 space-y-4 pb-16">
            {errors.length > 0 && <div className="bg-red-100 text-alert p-3 rounded-xl">Datos inválidos: {errors.join(" · ")}</div>}
            {!result ? (<>
              <h2 className="text-3xl font-extrabold">¿A dónde vas hoy?</h2>
              <label className="block font-bold">⚫ Origen
                <select className={sel} value={origin} onChange={e => setOrigin(e.target.value)}>{STOPS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></label>
              <label className="block font-bold">🎯 Destino
                <select className={sel} value={dest} onChange={e => setDest(e.target.value)}>
                  <optgroup label="Lugares">{POIS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</optgroup>
                  <optgroup label="Paraderos">{STOPS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</optgroup></select></label>
              <div><b>⏱ ¿Cuánto tiempo tienes?</b><div className="grid grid-cols-4 gap-2 mt-1">
                {MINUTES.map(m => <button key={m} onClick={() => setMinutes(m)} className={`${btn} border-2 ${minutes === m ? "bg-brand text-white border-brand" : "bg-white border-line"}`}>{m}</button>)}</div></div>
              <div><b>Soy:</b><div className="grid grid-cols-2 gap-2 mt-1">
                {PROFILES.map(([k, l]) => <button key={k} onClick={() => setProfile(k)} className={`${btn} border-2 ${profile === k ? "bg-ink text-white border-ink" : "bg-white border-line"}`}>{l}</button>)}</div></div>
              {origin === dest && <p className="text-alert font-bold">Elige dos lugares distintos</p>}
              <button disabled={origin === dest} onClick={search} className={`${btn} w-full bg-brand text-white text-xl disabled:opacity-40`}>🔍 Buscar mi ruta</button>
              <div className="bg-white rounded-2xl border border-line p-3 space-y-2">
                <b>⚠ {active.length} reportes activos hoy</b>
                {active.map(r => (<div key={r.id} className="flex items-center gap-2 text-base">
                  <span>{TYPE_EMO[r.type]}</span><span className="flex-1">{r.description} <i className="text-sm text-black/50">({confidence(r) >= 0.8 ? "confirmado" : "sin confirmar"})</i></span>
                  <button onClick={() => confirm(r.id)} className="min-h-[44px] px-2 rounded-xl bg-line">👍 {r.confirmations}</button></div>))}
                {!active.length && <p>Hoy todo tranquilo 🎉</p>}</div>
              <button onClick={() => setTab("chat")} className={`${btn} w-full bg-wa-head text-white`}>💬 Prefiero WhatsApp</button>
            </>) : rec && (<>
              <button onClick={() => setQ(null)} className="font-bold text-brand min-h-[44px]">← Cambiar búsqueda</button>
              <div className="bg-white rounded-3xl border border-line p-4 space-y-3 shadow-sm" aria-live="polite">
                <div className="text-xs font-bold tracking-wider uppercase text-black/60">{ai?.source === "llm" ? "✨ IA en vivo" : "📴 Modo demo (offline)"}</div>
                {loading || !ai ? <div className="space-y-2 animate-pulse"><div className="h-7 bg-line rounded" /><div className="h-14 bg-line rounded" /><div className="h-16 bg-line rounded" /></div> : (<>
                  <h2 className="text-[26px] leading-tight font-bold">{ai.reply.headline}</h2>
                  <div className="flex items-end gap-3 flex-wrap">
                    <span key={Math.round(rec.totalMin)} className="text-[56px] leading-none font-extrabold animate-drop">{Math.round(rec.totalMin)} min</span>
                    <span className={`px-2 py-1 rounded-lg font-bold ${rec.marginMin >= 5 ? "bg-[#DCFAE6] text-[#067647]" : "bg-[#FEF0C7] text-[#B54708]"}`}>
                      {rec.marginMin >= 5 ? `✅ ${Math.round(rec.marginMin)} de margen` : "⚠ vas justo"}</span></div>
                  {saved !== null && saved > 0 && <div className="font-extrabold text-[#067647] text-xl">💰 −{saved} min vs tu ruta habitual</div>}
                  <div className="flex flex-wrap gap-2 items-center">{rec.legs.filter(l => l.kind === "ride" || l.move > 0).map((l, i) => <Chip key={i} l={l} />)}</div>
                  <p><b>¿Por qué?</b> {ai.reply.why}</p>
                  {ai.reply.warning && <p className="bg-[#FEF0C7] text-[#B54708] rounded-xl p-2 font-bold">⚠ {ai.reply.warning}</p>}
                  {alt && <details className="bg-paper rounded-xl p-2"><summary className="font-bold cursor-pointer">▸ Alternativa ({Math.round(alt.totalMin)} min)</summary>
                    <div className="mt-1 text-base">{alt.summary} · {Math.round(alt.marginMin)} de margen</div></details>}
                </>)}
                <button onClick={() => setSheet(true)} className={`${btn} w-full bg-white border-2 border-ink`}>🚧 Reportar</button>
              </div>
            </>)}
            {q && !result && <p className="font-bold">No encontramos ruta a esa hora. Prueba otro horario.</p>}
          </div>)}
      </section>

      {banner && <div className="fixed top-0 inset-x-0 z-[1500] bg-[#FEF0C7] text-[#B54708] font-extrabold text-center p-3 animate-slidedown" role="alert" aria-live="assertive">⚠ Ruta reordenada por bloqueo</div>}
      {toast && <div className="fixed bottom-14 left-1/2 -translate-x-1/2 z-[1500] bg-[#067647] text-white font-bold px-4 py-2 rounded-xl">{toast}</div>}
      {sheet && <ReportSheet onClose={() => setSheet(false)} onSend={sendReport} />}
      <div className="fixed bottom-2 left-2 z-[1400] text-[12px] bg-white/90 px-2 py-1 rounded font-bold">DATOS SIMULADOS · Hackathon 5.0</div>
    </div>);
}

export default function App() { return <ReportsProvider><Main /></ReportsProvider>; }
