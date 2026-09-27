# Muévete CB — Hackathon 5.0

Datos 100 % simulados. Funciona sin internet (agente local + mapa con polilíneas).

## Correr en VS Code
1. Abre la carpeta `muevete-cb` (Archivo → Abrir carpeta). Requiere Node 18+.
2. Terminal (Ctrl+Ñ): `npm install`
3. `npm run selftest`  → debe imprimir 4 ✔ (28 → 53 → 34 min, ahorro 19)
4. `npm run dev`       → abre http://localhost:5173 (también en el celular por la IP de red)
5. Presentación: `npm run build && npm run preview`

## Demo de 90 s
Inicio ya viene precargado (Lucero Alto → U. Distrital, 40 min) → "Buscar mi ruta" (28 min, ruta habitual)
→ "🚧 Reportar" → "Enviar reporte" → banner + reroute (34 min, −19 min).
Botón ↺ reinicia la demo. Pestaña 💬 WhatsApp muestra el mismo motor en chat.

## IA en vivo (opcional)
Copia `.env.example` a `.env`, pon `VITE_USE_LLM=true` y `VITE_LLM_URL` de un proxy propio (la API key va en el servidor).
Si falla o tarda más de 4 s, cae al agente local sin que el usuario lo note.
