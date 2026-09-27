# Muévete CB — Plataforma inteligente de movilidad para Ciudad Bolívar

Prototipo funcional para el reto **"Muévete CB"**. Integra rutas formales
(TransMiCable, SITP) e informales (colectivos, rutas veredales), un agente
de IA con cuatro roles (recomendador de rutas, red social comunitaria,
moderación de seguridad, y ruta protegida para menores de edad).

No usa frameworks, no usa módulos ES ni `fetch()` a archivos externos: es
HTML + CSS + JavaScript clásico, con los datos incrustados directamente en
el código. Por eso **funciona abriendo `index.html` con doble clic**, sin
servidor, sin `npm install` y sin internet. Es la versión más robusta
posible para una demo en vivo.

## Qué incluye

- **Motor de rutas determinista** (`js/engine.js`): Dijkstra sobre un grafo
  único de paraderos formales e informales, con penalizaciones en vivo por
  reportes ciudadanos (bloqueo, demora, cambio).
- **Agente de IA de 4 roles** (`js/agent.js`):
  1. Explica la ruta calculada por el motor (nunca inventa tiempos).
  2. Modera y redacta el feed social (`js/moderation.js` + `js/social.js`).
  3. Filtra lenguaje ofensivo, spam e imágenes sensibles.
  4. Ruta protegida para menores: detecta desvíos de la ruta habitual y
     escala una alerta a los contactos de confianza (`js/safety.js`).
- **Mapa propio en SVG** (`js/map.js`): funciona sin internet, sin Leaflet
  ni tiles externos — dibuja paraderos, rutas (línea continua = formal,
  punteada = informal) y reportes activos.
- **Red social de movilidad**: feed de reportes/noticias con restricciones
  por edad (las publicaciones de menores quedan en modo supervisado).
- **Botón de pánico** siempre visible en el encabezado, y panel completo de
  "Ruta protegida" con contactos de confianza y puntos seguros.
- Datos 100% simulados de Ciudad Bolívar (paraderos, rutas, reportes),
  siempre visibles con el sello "DATOS SIMULADOS".

## Cómo correrlo en Visual Studio Code

### Opción A — la más simple (recomendada)

1. Descomprime el ZIP y abre la carpeta `muevete-cb` en VS Code
   (`Archivo → Abrir carpeta...`).
2. En el explorador de archivos de VS Code, haz clic derecho sobre
   `index.html` → **"Reveal in File Explorer"** (o "Revelar en el
   explorador de archivos") y ábrelo con doble clic. También puedes
   arrastrar `index.html` directamente a una ventana de Chrome/Edge/Firefox.
3. Listo — no hace falta instalar nada más. Todo corre en el navegador.

### Opción B — con la extensión Live Server (si prefieres recarga automática)

1. Instala la extensión **"Live Server"** (de Ritwick Dey) desde la
   pestaña de Extensiones de VS Code.
2. Clic derecho sobre `index.html` → **"Open with Live Server"**.
3. Se abre en `http://127.0.0.1:5500`. Útil si vas a seguir editando el
   código y quieres que se recargue solo, pero no es obligatoria.

## Cómo probar las funciones clave en la demo

- **Buscar ruta**: la pantalla de Inicio ya viene precargada con el caso
  de demo (Lucero Alto → U. Distrital). Presiona "Buscar mi ruta".
- **Reporte ciudadano en vivo**: toca el chip "⚠ reportes activos", crea un
  reporte de tipo "Bloqueo" sobre la ruta R04, y vuelve a buscar la misma
  ruta — verás cómo el agente recalcula y explica el cambio.
- **Red social**: pestaña "Social". Publica un mensaje; si escribes una
  palabra ofensiva o marcas la casilla de "imagen sensible", el agente de
  moderación lo bloqueará y te dirá por qué.
- **Modo menor de edad**: pestaña "Perfil" → cambia a "Menor de edad".
  Vuelve a "Social" y publica: verás la etiqueta "supervisado".
- **Ruta protegida y botón de pánico**: pestaña "Seguridad". Presiona
  "Simular desvío de ruta" para ver el protocolo escalonado (chequeo
  silencioso → alerta a contactos), o presiona directamente el botón de
  pánico (🆘, visible también en el encabezado desde cualquier pantalla).

## Estructura del proyecto

```
muevete-cb/
├─ index.html          (toda la estructura de pantallas)
├─ css/styles.css       (paleta de diseño y estilos)
├─ js/
│  ├─ data.js            (todos los datos simulados: paraderos, rutas, POIs,
│  │                       reportes, red social, tutores — como constantes JS)
│  └─ app.js             (toda la lógica: motor de rutas con Dijkstra, agente
│                          de IA de 4 roles, moderación, mapa propio en SVG,
│                          red social, ruta protegida, navegación y modales)
└─ README.md
```

Todo vive en un solo script (`app.js`) a propósito: evita cualquier
problema de orden de carga entre archivos y hace que el proyecto sea a
prueba de errores al abrirlo directo en el navegador. Está dividido
internamente por secciones con comentarios (motor de rutas, moderación,
agente, mapa, UI) para que sea fácil de navegar y extender.

## Siguientes pasos sugeridos (para después del hackathon)

- Conectar la sección "AGENTE DE IA" de `app.js` a la API de Claude para
  reemplazar las plantillas de explicación por generación real de lenguaje
  natural (dejando el cálculo de tiempos siempre en la sección "MOTOR DE
  RUTAS", nunca en el LLM).
- Conectar la sección "MAPA" a Leaflet + OpenStreetMap cuando haya
  internet disponible, manteniendo el SVG propio como respaldo offline.
- Reemplazar la simulación de posición de la sección "RUTA PROTEGIDA" por
  `navigator.geolocation.watchPosition()` real, con el mismo protocolo de
  chequeo silencioso → alerta.
- Sustituir la verificación de edad y de relación con tutores (hoy
  simulada en `data.js`) por un flujo real de registro con validación de
  identidad, y mover los datos a un backend cuando el proyecto crezca más
  allá del prototipo.
