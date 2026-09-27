import { useEffect, useRef, useState } from "react";
import { useReports } from "../context/ReportsContext";
import { advise } from "../advise"; 
import { Query } from "../engine/router";
import sc from "../data/scenario.json";

type Msg = { from: "bot" | "me"; text: string; time: string; buttons?: [string, string][] };
const Q: Query = { origin: sc.query.origin, destination: sc.query.destination, minutesAvailable: sc.query.minutesAvailable,
  profile: "estudiante", clock: sc.demoClock, day: sc.demoDay, usualRouteId: sc.persona.usualRouteId };
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
const MENU: [string, string][] = [["🔍 Buscar ruta", "buscar"], ["🚧 Reportar", "reportar"], ["❓ ¿Cómo funciona?", "como"]];

export default function WhatsAppChat({ onOpenMap }: { onOpenMap: () => void }) {
  const { reports, addReport } = useReports();
  const [msgs, setMsgs] = useState<Msg[]>([{ from: "bot", time: sc.demoClock, buttons: MENU,
    text: "Hola 👋 Soy Muévete CB. Te ayudo a llegar más rápido en Ciudad Bolívar. ¿Qué necesitas?" }]);
  const [typing, setTyping] = useState(false);
  const [text, setText] = useState("");
  const [source, setSource] = useState("local");
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => { end.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, typing]);

  const say = async (m: Omit<Msg, "from" | "time">) => {
    setTyping(true); await sleep(800); setTyping(false);
    setMsgs(p => [...p, { from: "bot", time: sc.demoClock, ...m }]);
  };
  const me = (t: string) => setMsgs(p => [...p, { from: "me", text: t, time: sc.demoClock }]);
  const NEXT: [string, string][] = [["🗺 Ver mapa", "mapa"], ["🚧 Reportar", "reportar"], ["🔁 Otra ruta", "otra"]];

  const answer = async (list = reports, prefix = "") => {
    const r = await advise(Q, list);
    if (!r) return say({ text: "No encontré ruta a esa hora 🙈", buttons: MENU });
    setSource(r.source);
    const rep = r.reply, mins = Math.round(r.rec.totalMin), margin = Math.round(r.rec.marginMin);
    await say({ buttons: NEXT, text: `${prefix}*${rep.headline}*\n${rep.why}\n⏱ ${mins} min (${margin >= 5 ? "+" + margin + " de margen ✅" : "vas justo ⚠"})${rep.warning ? "\n⚠ " + rep.warning : ""}` });
  };

  const act = async (k: string) => {
    if (typing) return;
    if (k === "buscar") { me("De Lucero Alto a la Distrital, tengo 40 min"); await answer(); }
    else if (k === "reportar") {
      me("Hay obra en Sierra Morena, el colectivo no pasa");
      const n = addReport(sc.liveReportTemplate as any);
      await answer([n, ...reports], "⚠ Gracias, vecino. Reporte recibido.\n");
    } else if (k === "otra") {
      me("Otra ruta");
      const r = await advise(Q, reports);
      const alt = r?.plan.candidates.find(c => c.id === r.reply.alternativeId);
      await say({ buttons: NEXT, text: alt ? `Otra opción: ${alt.summary}. ${Math.round(alt.totalMin)} min (${Math.round(alt.marginMin)} de margen).` : "Por ahora esa es la única ruta viable 🙏" });
    } else if (k === "mapa") { onOpenMap(); }
    else { me("¿Cómo funciona?"); await say({ buttons: MENU, text: "Cruzo colectivos, TransMiCable y SITP en una sola consulta. Si un vecino reporta un bloqueo, recalculo tu ruta al instante 🚡" }); }
  };
  const send = async () => {
    const t = text.trim(); if (!t) return; setText("");
    if (/bloqueo|obra|derrumbe|report/i.test(t)) return act("reportar");
    if (/ruta|voy|llegar|distrital|lucero|clase|bus|cuanto|cuánto/i.test(t)) return act("buscar");
    me(t); await say({ text: "No te entendí 🙈 Toca una opción:", buttons: MENU });
  };

  return (
    <div className="flex flex-col h-full bg-wa-bg">
      <div className="bg-wa-head text-white px-4 py-3 flex items-center gap-3">
        <span className="text-2xl">🚡</span>
        <div className="leading-tight"><div className="font-bold">Muévete CB <span className="text-sm">✓</span></div>
          <div className="text-sm opacity-80">{typing ? "escribiendo…" : `Cuenta verificada · ${source === "llm" ? "IA en vivo" : "modo demo"}`}</div></div>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2" aria-live="polite">
        <div className="text-center text-xs text-black/50">Simulación del canal WhatsApp Business · datos simulados</div>
        {msgs.map((m, i) => (
          <div key={i} className={m.from === "me" ? "flex justify-end" : "flex justify-start"}>
            <div className={`max-w-[85%] rounded-xl px-3 py-2 shadow-sm ${m.from === "me" ? "bg-wa-out" : "bg-white"}`}>
              <div className="whitespace-pre-line text-[17px]">{m.text.split("*").map((s, j) => (j % 2 ? <b key={j}>{s}</b> : s))}</div>
              <div className="text-[11px] text-black/40 text-right">{m.time} {m.from === "me" && "✓✓"}</div>
              {m.buttons && i === msgs.length - 1 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {m.buttons.map(([l, k]) => <button key={k} onClick={() => act(k)} className="min-h-[48px] px-3 rounded-lg border border-line text-wa-head font-bold bg-white">{l}</button>)}
                </div>)}
            </div>
          </div>))}
        {typing && <div className="bg-white rounded-xl px-4 py-3 w-16 shadow-sm flex gap-1 animate-pulse"><i>•</i><i>•</i><i>•</i></div>}
        <div ref={end} />
      </div>
      <div className="p-2 flex gap-2 bg-[#F0F0F0]">
        <input value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === "Enter" && send()}
          placeholder="Escribe un mensaje" className="flex-1 min-h-[48px] rounded-full px-4 border border-line" />
        <button onClick={send} className="w-12 h-12 rounded-full bg-wa-head text-white text-xl" aria-label="Enviar">➤</button>
      </div>
    </div>
  );
}
