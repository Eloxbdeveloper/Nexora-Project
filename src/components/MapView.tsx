import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ROUTES, STOPS, POIS, stopById, factor, Candidate, LiveReport } from "../engine/router";

const EMOJI: Record<string, string> = { colegio: "🏫", universidad: "🎓", salud: "🏥", mercado: "🛒", jac: "🏛" };
const ll = (id: string): [number, number] => { const s = stopById(id); return [s.lat, s.lng]; };
const at = (id: string): [number, number] => { const p = POIS.find(x => x.id === id); return p ? [p.lat, p.lng] : ll(id); };

export default function MapView({ chosen, reports }: { chosen: Candidate | null; reports: LiveReport[] }) {
  const el = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map>();
  const layer = useRef<L.LayerGroup>();

  useEffect(() => {
    const m = L.map(el.current!, { zoomControl: false }).setView([4.552, -74.158], 13);
    L.control.zoom({ position: "bottomright" }).addTo(m);
    // Con internet: mosaicos OSM. Sin internet: fondo propio + polilíneas (todo sigue funcionando).
    if (navigator.onLine)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 18, attribution: "© OpenStreetMap" }).addTo(m);
    map.current = m; layer.current = L.layerGroup().addTo(m);
    return () => { m.remove(); };
  }, []); 

  useEffect(() => {
    const g = layer.current!, m = map.current!;
    g.clearLayers();
    const dim = !!chosen;
    ROUTES.forEach(r => L.polyline(r.stops.map(ll), {
      color: r.color, weight: 4, opacity: dim ? 0.25 : 0.85, lineCap: "round",
      dashArray: r.kind === "informal" ? "2 8" : undefined,
    }).bindTooltip(`${r.name} · ${r.kind}`).addTo(g));

    STOPS.forEach(s => L.circleMarker([s.lat, s.lng], {
      radius: 7, color: "#fff", weight: 2, fillColor: s.kind === "informal" ? "#C77700" : "#0056A8", fillOpacity: 1,
    }).bindTooltip(`${s.name}${s.accessible ? " ♿" : ""}`).addTo(g));

    POIS.forEach(p => L.marker([p.lat, p.lng], {
      icon: L.divIcon({ className: "emoji-icon", html: EMOJI[p.type], iconSize: [22, 22] }), title: p.name,
    }).bindTooltip(p.name).addTo(g));

    chosen?.legs.forEach(l => {
      if (l.stops.length < 2) return;
      const pts = l.stops.map(ll);
      const rt = ROUTES.find(r => r.id === l.routeId);
      L.polyline(pts, { color: "#fff", weight: 13, opacity: 0.95 }).addTo(g);
      L.polyline(pts, {
        color: rt ? rt.color : "#0F1B2D", weight: 7, lineCap: "round",
        dashArray: !rt ? "1 8" : rt.kind === "informal" ? "2 10" : undefined,
      }).addTo(g);
    });

    reports.filter(r => factor(r, Date.now()) > 0 && r.type !== "cambio").forEach(r => {
      const rt = ROUTES.find(x => x.id === r.routeId)!;
      const a = ll(r.from ?? rt.stops[0]), b = ll(r.to ?? rt.stops[rt.stops.length - 1]);
      const mid: [number, number] = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
      const bloq = r.type === "bloqueo";
      L.marker(mid, { icon: L.divIcon({
        className: "", iconSize: [30, 30],
        html: `<div class="w-[30px] h-[30px] rounded-full flex items-center justify-center text-white text-base font-bold animate-drop ${bloq ? "bg-alert animate-pulseRing" : "bg-[#B54708]"}">${bloq ? "✖" : "⏱"}</div>`,
      }) }).bindTooltip(r.description).addTo(g);
    });

    if (chosen) {
      const pts = chosen.legs.flatMap(l => l.stops.map(ll));
      const last = chosen.legs[chosen.legs.length - 1];
      if (last.kind === "walk" && POIS.some(p => p.id === last.to)) pts.push(at(last.to));
      if (pts.length) m.fitBounds(L.latLngBounds(pts), { padding: [50, 50], maxZoom: 15 });
    }
  }, [chosen, reports]);

  return <div ref={el} className="w-full h-full" role="application" aria-label="Mapa de Ciudad Bolívar" />;
}
