// ==========================================
// DATOS — constantes JS (no JSON externo) para que la app funcione
// abriendo index.html directamente con doble clic, sin servidor.
// ==========================================
window.APPDATA = {
  stops: [
    { id: "S01", name: "TransMiCable Mirador del Paraíso", lat: 4.5432, lng: -74.1668, kind: "formal", accessible: true, landmark: "Estación terminal alta" },
    { id: "S02", name: "TransMiCable Manitas", lat: 4.5498, lng: -74.1605, kind: "formal", accessible: true, landmark: "Estación intermedia, junto al CAMI" },
    { id: "S03", name: "TransMiCable Juan Pablo II", lat: 4.5575, lng: -74.1530, kind: "mixto", accessible: true, landmark: "Estación con paradero SITP en la vía" },
    { id: "S04", name: "Portal Tunal", lat: 4.5715, lng: -74.1305, kind: "formal", accessible: true, landmark: "Conexión con TransMilenio" },
    { id: "S05", name: "Paraíso (paradero comunitario)", lat: 4.5445, lng: -74.1690, kind: "informal", accessible: false, landmark: "Frente a la tienda Doña Rosa" },
    { id: "S06", name: "Lucero Alto (parque principal)", lat: 4.5380, lng: -74.1590, kind: "informal", accessible: false, landmark: "Esquina del parque, junto a la panadería" },
    { id: "S07", name: "Sierra Morena (La Esquina)", lat: 4.5560, lng: -74.1620, kind: "informal", accessible: false, landmark: "Tienda La Esquina" },
    { id: "S08", name: "Ismael Perdomo", lat: 4.5650, lng: -74.1585, kind: "mixto", accessible: true, landmark: "Paradero SITP y salida de colectivos" },
    { id: "S09", name: "Meissen", lat: 4.5677, lng: -74.1465, kind: "formal", accessible: true, landmark: "Frente al hospital" },
    { id: "S10", name: "Arborizadora Alta", lat: 4.5480, lng: -74.1440, kind: "formal", accessible: true, landmark: "Paradero SITP, plaza de mercado" },
    { id: "S11", name: "Jerusalén", lat: 4.5290, lng: -74.1730, kind: "informal", accessible: false, landmark: "Salón comunal" },
    { id: "S12", name: "Mochuelo Alto (vereda)", lat: 4.5010, lng: -74.1750, kind: "informal", accessible: false, landmark: "Escuela rural" },
    { id: "S13", name: "Quiba Alta", lat: 4.5150, lng: -74.1760, kind: "informal", accessible: false, landmark: "Cruce de la vía principal" }
  ],
  walks: [
    { a: "S05", b: "S01", min: 2 },
    { a: "S02", b: "S07", min: 6 },
    { a: "S03", b: "S08", min: 12 }
  ],
  routes: [
    { id: "R01", name: "TransMiCable", operator: "TransMilenio S.A.", mode: "cable", kind: "formal", color: "#E4002B",
      stops: ["S01", "S02", "S03", "S04"], segMin: [4, 4, 5], headwayMin: 0.5, irregular: false,
      fareCOP: 3550, reliability: 0.97, bidirectional: true, note: "Cabinas continuas; se suspende con vientos fuertes." },
    { id: "R02", name: "SITP CB-1 Juan Pablo II – Portal Tunal", operator: "SITP zonal", mode: "sitp", kind: "formal", color: "#0077C8",
      stops: ["S03", "S08", "S09", "S04"], segMin: [6, 5, 7], headwayMin: 8, irregular: false,
      fareCOP: 3550, reliability: 0.85, bidirectional: true, note: "Pasa por Perdomo y Meissen." },
    { id: "R03", name: "SITP CB-2 Arborizadora – Portal Tunal", operator: "SITP zonal", mode: "sitp", kind: "formal", color: "#0077C8",
      stops: ["S10", "S09", "S04"], segMin: [8, 6], headwayMin: 10, irregular: false,
      fareCOP: 3550, reliability: 0.85, bidirectional: true, note: "Alimenta el Portal Tunal desde Arborizadora Alta." },
    { id: "R04", name: "Colectivo Lucero Alto – Sierra Morena – Perdomo", operator: "Asociación de conductores (informal)", mode: "colectivo", kind: "informal", color: "#C77700",
      stops: ["S06", "S07", "S08"], segMin: [7, 11], headwayMin: 12, irregular: true,
      fareCOP: 2500, reliability: 0.70, bidirectional: true, note: "Sale cuando se llena. Tramo Sierra Morena–Perdomo con obras frecuentes." },
    { id: "R05", name: "Colectivo Lucero Alto – Paraíso", operator: "Asociación de conductores (informal)", mode: "colectivo", kind: "informal", color: "#C77700",
      stops: ["S06", "S05"], segMin: [6], headwayMin: 8, irregular: true,
      fareCOP: 2000, reliability: 0.75, bidirectional: true, note: "Conecta con TransMiCable a pie, en 2 min." },
    { id: "R06", name: "Colectivo Jerusalén – Sierra Morena", operator: "JAC Jerusalén (informal)", mode: "colectivo", kind: "informal", color: "#C77700",
      stops: ["S11", "S07"], segMin: [9], headwayMin: 15, irregular: true,
      fareCOP: 2500, reliability: 0.65, bidirectional: true, note: "Servicio reducido los sábados." },
    { id: "R07", name: "Ruta comunitaria Mochuelo Alto – Quiba – Jerusalén – Manitas", operator: "Cooperativa veredal (informal)", mode: "comunitaria", kind: "informal", color: "#1F8A4C",
      stops: ["S12", "S13", "S11", "S02"], segMin: [12, 8, 10], headwayMin: 25, irregular: true,
      fareCOP: 3000, reliability: 0.60, bidirectional: true, note: "Solo en horas pico. Es la única conexión de la vereda con TransMiCable." }
  ],
  pois: [
    { id: "P01", name: "U. Distrital – Sede Tecnológica", type: "universidad", lat: 4.5662, lng: -74.1570, nearestStop: "S08", walkMin: 4 },
    { id: "P02", name: "IED Paraíso Mirador", type: "colegio", lat: 4.5440, lng: -74.1655, nearestStop: "S01", walkMin: 5 },
    { id: "P03", name: "Colegio Sierra Morena", type: "colegio", lat: 4.5555, lng: -74.1610, nearestStop: "S07", walkMin: 3 },
    { id: "P04", name: "Hospital Meissen", type: "salud", lat: 4.5680, lng: -74.1470, nearestStop: "S09", walkMin: 3 },
    { id: "P05", name: "Centro de Salud Lucero", type: "salud", lat: 4.5385, lng: -74.1600, nearestStop: "S06", walkMin: 4 },
    { id: "P06", name: "CAMI Manitas", type: "salud", lat: 4.5500, lng: -74.1610, nearestStop: "S02", walkMin: 3 },
    { id: "P07", name: "Plaza de Mercado Perdomo", type: "mercado", lat: 4.5655, lng: -74.1595, nearestStop: "S08", walkMin: 5 },
    { id: "P08", name: "Plaza de Mercado Arborizadora", type: "mercado", lat: 4.5485, lng: -74.1450, nearestStop: "S10", walkMin: 3 },
    { id: "P09", name: "Salón Comunal JAC Mirador", type: "jac", lat: 4.5428, lng: -74.1672, nearestStop: "S01", walkMin: 2 },
    { id: "P10", name: "Escuela Rural Mochuelo Alto", type: "colegio", lat: 4.5012, lng: -74.1755, nearestStop: "S12", walkMin: 2 }
  ],
  reports: [
    { id: "RP-001", type: "demora", routeId: "R02", from: "S08", to: "S09", severity: 1, minutesExtra: 4,
      description: "Tráfico lento por obra en la vía a Meissen", minutesAgo: 25, ttlMin: 60, confirmations: 3, source: "ciudadano" },
    { id: "RP-002", type: "cambio", routeId: "R07", severity: 1, headwayMultiplier: 1.5,
      description: "La cooperativa reduce salidas por falta de vehículos", minutesAgo: 90, ttlMin: 240, confirmations: 2, source: "JAC" },
    { id: "RP-003", type: "bloqueo", routeId: "R06", from: "S11", to: "S07", severity: 3,
      description: "Vía cerrada por derrumbe (ya despejada)", minutesAgo: 200, ttlMin: 120, confirmations: 5, source: "ciudadano" }
  ],
  penalties: {
    transferPenaltyMin: 3,
    walkSpeedFactor: 1.0,
    unreliabilityWeight: 0.5,
    reportRules: {
      bloqueo: { "1": { extraMin: 8 }, "2": { extraMin: 25 }, "3": { closed: true } },
      demora: { usesField: "minutesExtra" },
      cambio: { usesField: "headwayMultiplier" }
    },
    confidence: { base: 0.5, perConfirmation: 0.15, max: 1.0 },
    decay: { startsAtTtlFraction: 0.7, endsAtTtlFraction: 1.0 }
  },
  scenario: {
    demoClock: "06:20",
    demoDay: "L",
    persona: { name: "Camila", role: "estudiante", usualRouteId: "R04" },
    query: { origin: "S06", destination: "P01", minutesAvailable: 40 },
    liveReportTemplate: {
      type: "bloqueo", routeId: "R04", from: "S07", to: "S08",
      severity: 2, description: "Obra y paso a un solo carril en Sierra Morena",
      ttlMin: 90, confirmations: 1, source: "ciudadano"
    },
    calibration: {
      beforeReport: { bestRoute: "R04", totalMin: 28 },
      afterReport: { usualRouteMin: 53, bestRoute: "R05 + R01 + R02", totalMin: 33, savedMin: 20, marginMin: 7 }
    }
  },
  social: [
    { id: "PST-001", authorName: "Don Jairo", authorMode: "adult", zone: "Sierra Morena", type: "bloqueo",
      text: "Obra en la vía cerca a La Esquina, un solo carril habilitado.", minutesAgo: 12, confirmations: 4, status: "publicado" },
    { id: "PST-002", authorName: "Vecina Marcela", authorMode: "adult", zone: "Lucero Alto", type: "alerta",
      text: "El colectivo R05 está tardando más de lo normal esta mañana.", minutesAgo: 30, confirmations: 2, status: "publicado" },
    { id: "PST-003", authorName: "Camila (14 años)", authorMode: "minor", zone: "Paraíso", type: "informativo",
      text: "Llegué bien al colegio, todo tranquilo por la ruta de siempre.", minutesAgo: 5, confirmations: 1, status: "publicado_supervisado" }
  ],
  guardians: {
    minorProfile: { id: "U-CAMILA", name: "Camila", age: 14, usualRouteId: "R04", originStopId: "S06", destinationPoiId: "P01", corridorToleranceMeters: 250 },
    guardians: [
      { id: "G1", name: "Rosa (mamá)", relation: "madre", verified: true, notify: ["push", "sms"] },
      { id: "G2", name: "Andrés (tío autorizado)", relation: "tío", verified: true, notify: ["push"] }
    ],
    puntosSeguros: [
      { id: "PS1", name: "CAI Sierra Morena", nearestStop: "S07" },
      { id: "PS2", name: "IED Paraíso Mirador (portería)", nearestStop: "S01" },
      { id: "PS3", name: "Salón Comunal JAC Mirador", nearestStop: "S01" }
    ]
  }
};
