// ==========================================
// 1. ESCENARIO: HORA PICO (Tráfico masivo, alta congestión y caos general con fuerte foco en Ciudad Bolívar)
// ==========================================
export const mockReportsHourPeak = [
  // --- CIUDAD BOLÍVAR (Alta concentración) ---
  {
    id: 101, type: "Congestion", severity: "alta", status: "Activo",
    location: { address: "Tv 18L # 70G - 30 Sur", coordinates: { lat: 4.5420, lng: -74.1580 }, locality: "Ciudad Bolívar" },
    time: "Hace 4 minutos", description: "Trancón monumental de alimentadores y rutas zonales bajando hacia el portal por hora pico.", reportsCount: 52
  },
  {
    id: 102, type: "Accidente", severity: "alta", status: "Activo",
    location: { address: "Cl 68 Sur # 19 - 20", coordinates: { lat: 4.5490, lng: -74.1520 }, locality: "Ciudad Bolívar" },
    time: "Hace 8 minutos", description: "Colisión entre bus zonal y colectivo bloqueando el único carril de acceso al sector.", reportsCount: 38
  },
  {
    id: 103, type: "Congestion", severity: "alta", status: "Activo",
    location: { address: "Av Villavicencio # 36 - 10 Sur", coordinates: { lat: 4.5710, lng: -74.1550 }, locality: "Ciudad Bolívar" },
    time: "Hace 6 minutos", description: "Fila interminable de vehículos particulares intentando conectar con la Autopista Sur.", reportsCount: 46
  },
  {
    id: 104, type: "Estacion", severity: "alta", status: "Activo",
    location: { address: "Av Villavicencio # 59 - 52 Sur", coordinates: { lat: 4.5815, lng: -74.1375 }, locality: "Ciudad Bolívar" },
    time: "Hace 3 minutos", description: "Desbordamiento total de usuarios en plataforma de TransMiCable y buses zonales.", reportsCount: 60
  },
  {
    id: 105, type: "Bloqueo", severity: "alta", status: "Activo",
    location: { address: "Cra 27 # 71 Sur - 15", coordinates: { lat: 4.5440, lng: -74.1610 }, locality: "Ciudad Bolívar" },
    time: "Hace 12 minutos", description: "Plantón de comunidad por fallas en rutas alimentadoras bloquea vía principal.", reportsCount: 41
  },
  {
    id: 106, type: "Congestion", severity: "alta", status: "Activo",
    location: { address: "Tv 74 # 62 Sur - 40", coordinates: { lat: 4.5550, lng: -74.1680 }, locality: "Ciudad Bolívar" },
    time: "Hace 15 minutos", description: "Tráfico completamente detenido en subida empinada por sobrecarga vehicular.", reportsCount: 34
  },

  // --- OTRAS LOCALIDADES DE BOGOTÁ ---
  {
    id: 107, type: "Congestion", severity: "alta", status: "Activo",
    location: { address: "Cra 7 # 72 - 41", coordinates: { lat: 4.6560, lng: -74.0560 }, locality: "Chapinero" },
    time: "Hace 5 minutos", description: "Trancón sentido Sur-Norte por alto flujo vehicular.", reportsCount: 28
  },
  {
    id: 108, type: "Accidente", severity: "alta", status: "Activo",
    location: { address: "Autopista Norte # 100 - 12", coordinates: { lat: 4.6850, lng: -74.0550 }, locality: "Usaquén" },
    time: "Hace 10 minutos", description: "Choque entre dos particulares afectando carril mixto.", reportsCount: 19
  },
  {
    id: 109, type: "Bloqueo", severity: "alta", status: "Activo",
    location: { address: "Cl 26 # 13 - 50", coordinates: { lat: 4.6140, lng: -74.0700 }, locality: "Santa Fe" },
    time: "Hace 12 minutos", description: "Manifestación afectando carril exclusivo y mixto.", reportsCount: 35
  },
  {
    id: 110, type: "Retraso", severity: "media", status: "En revisión",
    location: { address: "Av Caracas # 45 - 20", coordinates: { lat: 4.6310, lng: -74.0650 }, locality: "San Cristóbal" },
    time: "Hace 15 minutos", description: "Demoras operativas por saturación de estaciones.", reportsCount: 17
  },
  {
    id: 111, type: "Congestion", severity: "alta", status: "Activo",
    location: { address: "Av Boyacá # 68 - 90", coordinates: { lat: 4.6920, lng: -74.0850 }, locality: "Engativá" },
    time: "Hace 8 minutos", description: "Flujo vehicular lento en ambos sentidos.", reportsCount: 22
  },
  {
    id: 112, type: "Estacion", severity: "media", status: "Activo",
    location: { address: "Autopista Sur # 57 - 30", coordinates: { lat: 4.5920, lng: -74.1500 }, locality: "Bosa" },
    time: "Hace 20 minutos", description: "Saturación en torniquetes de acceso.", reportsCount: 15
  },
  {
    id: 113, type: "Congestion", severity: "alta", status: "Activo",
    location: { address: "Cra 30 # 19 - 00", coordinates: { lat: 4.6190, lng: -74.0870 }, locality: "Los Mártires" },
    time: "Hace 3 minutos", description: "Conexión NQS con Calle 19 colapsada.", reportsCount: 25
  },
  {
    id: 114, type: "Congestion", severity: "alta", status: "Activo",
    location: { address: "Autopista Sur # 38 - 00", coordinates: { lat: 4.5800, lng: -74.1400 }, locality: "Tunjuelito" },
    time: "Hace 4 minutos", description: "Trancón masivo hacia el sur.", reportsCount: 29
  },
  {
    id: 115, type: "Congestion", severity: "alta", status: "Activo",
    location: { address: "Av 1 de Mayo # 68 - 40", coordinates: { lat: 4.6150, lng: -74.1350 }, locality: "Kennedy" },
    time: "Hace 18 minutos", description: "Tráfico pesado por semáforo descompuesto.", reportsCount: 21
  },
  {
    id: 116, type: "Retraso", severity: "alta", status: "Activo",
    location: { address: "Av Suba # 145 - 50", coordinates: { lat: 4.7470, lng: -74.0898 }, locality: "Suba" },
    time: "Hace 7 minutos", description: "Filas largas para alimentadores.", reportsCount: 24
  },
  {
    id: 117, type: "Infraestructura", severity: "media", status: "Activo",
    location: { address: "Cra 68 # 26 - 10", coordinates: { lat: 4.6470, lng: -74.1110 }, locality: "Puente Aranda" },
    time: "Hace 25 minutos", description: "Reparación vial parcial.", reportsCount: 12
  },
  {
    id: 118, type: "Congestion", severity: "alta", status: "Activo",
    location: { address: "Cl 13 # 100 - 00", coordinates: { lat: 4.6720, lng: -74.1450 }, locality: "Fontibón" },
    time: "Hace 14 minutos", description: "Alto flujo de carga pesada y mixta.", reportsCount: 18
  },
  {
    id: 119, type: "Retraso", severity: "baja", status: "Activo",
    location: { address: "Cra 9 # 1 - 00", coordinates: { lat: 4.5950, lng: -74.0820 }, locality: "Antonio Nariño" },
    time: "Hace 11 minutos", description: "Tráfico moderado en zona comercial.", reportsCount: 10
  },
  {
    id: 120, type: "Congestion", severity: "media", status: "Activo",
    location: { address: "Cra 24 # 53 - 10", coordinates: { lat: 4.6390, lng: -74.0750 }, locality: "Teusaquillo" },
    time: "Hace 9 minutos", description: "Vehículos detenidos temporalmente.", reportsCount: 14
  },
  {
    id: 121, type: "Obras", severity: "baja", status: "Activo",
    location: { address: "Cl 140 # 15 - 20", coordinates: { lat: 4.7150, lng: -74.0320 }, locality: "Usaquén" },
    time: "Hace 30 minutos", description: "Mantenimiento vial preventivo.", reportsCount: 8
  },
  {
    id: 122, type: "Congestion", severity: "baja", status: "Activo",
    location: { address: "Cra 5 Este # 12 - 50", coordinates: { lat: 4.6030, lng: -74.0680 }, locality: "La Candelaria" },
    time: "Hace 16 minutos", description: "Flujo lento por peatones.", reportsCount: 9
  },
  {
    id: 123, type: "Accidente", severity: "media", status: "Activo",
    location: { address: "Av Boyacá # 72 - 00", coordinates: { lat: 4.6980, lng: -74.0910 }, locality: "Barrios Unidos" },
    time: "Hace 19 minutos", description: "Choque simple de motocicleta.", reportsCount: 11
  },
  {
    id: 124, type: "Retraso", severity: "baja", status: "Activo",
    location: { address: "Cra 24 # 29 - 10 Sur", coordinates: { lat: 4.5750, lng: -74.1120 }, locality: "Rafael Uribe Uribe" },
    time: "Hace 22 minutos", description: "Lentitud en rutas zonales.", reportsCount: 10
  },
  {
    id: 125, type: "Congestion", severity: "baja", status: "Activo",
    location: { address: "Av Boyacá # 12 - 00 Sur", coordinates: { lat: 4.3000, lng: -74.3500 }, locality: "Sumapaz" },
    time: "Hace 40 minutos", description: "Paso alternado por neblina matutina.", reportsCount: 5
  },
  {
    id: 126, type: "Bloqueo", severity: "media", status: "Activo",
    location: { address: "Cl 48 Sur # 5 - 20 Este", coordinates: { lat: 4.5580, lng: -74.1020 }, locality: "Usme" },
    time: "Hace 25 minutos", description: "Vehículo varado obstaculiza carril de subida.", reportsCount: 13
  }
];

// ==========================================
// 2. ESCENARIO: LLUVIA / EMERGENCIA CLIMÁTICA (Inundaciones, accidentes múltiples y caos climático con fuerte foco en Ciudad Bolívar)
// ==========================================
export const mockReportsRain = [
  // --- CIUDAD BOLÍVAR (Alta concentración de deslizamientos, encharcamientos y accidentes por piso mojado) ---
  {
    id: 201, type: "Infraestructura", severity: "alta", status: "Activo",
    location: { address: "Dg 68 Sur # 20 - 40", coordinates: { lat: 4.5470, lng: -74.1530 }, locality: "Ciudad Bolívar" },
    time: "Hace 5 minutos", description: "Deslizamiento leve de tierra y piedras sobre la vía por saturación de agua.", reportsCount: 58
  },
  {
    id: 202, type: "Accidente", severity: "alta", status: "Activo",
    location: { address: "Av Villavicencio # 24 - 10 Sur", coordinates: { lat: 4.5700, lng: -74.1480 }, locality: "Ciudad Bolívar" },
    time: "Hace 9 minutos", description: "Motociclista resbala en pavimento mojado y colisiona contra bus de servicio público.", reportsCount: 45
  },
  {
    id: 203, type: "Infraestructura", severity: "alta", status: "Activo",
    location: { address: "Tv 18L # 74 - 12 Sur", coordinates: { lat: 4.5390, lng: -74.1600 }, locality: "Ciudad Bolívar" },
    time: "Hace 14 minutos", description: "Colapso de sumideros genera inundación profunda que inmoviliza vehículos.", reportsCount: 50
  },
  {
    id: 204, type: "Retraso", severity: "alta", status: "Activo",
    location: { address: "Cra 38 # 58 - 15 Sur", coordinates: { lat: 4.5790, lng: -74.1400 }, locality: "Ciudad Bolívar" },
    time: "Hace 7 minutos", description: "Suspensión temporal preventiva del servicio de TransMiCable por fuertes ráfagas de viento y lluvia.", reportsCount: 65
  },
  {
    id: 205, type: "Accidente", severity: "alta", status: "Activo",
    location: { address: "Cl 70 Sur # 18 - 50", coordinates: { lat: 4.5430, lng: -74.1570 }, locality: "Ciudad Bolívar" },
    time: "Hace 18 minutos", description: "Choque múltiple (3 vehículos) debido a pérdida de frenos por piso mojado en pendiente.", reportsCount: 42
  },
  {
    id: 206, type: "Infraestructura", severity: "media", status: "Activo",
    location: { address: "Cra 20 # 64 - 30 Sur", coordinates: { lat: 4.5510, lng: -74.1490 }, locality: "Ciudad Bolívar" },
    time: "Hace 22 minutos", description: "Caída de árbol sobre red eléctrica secundaria interrumpe el paso vehicular.", reportsCount: 36
  },

  // --- OTRAS LOCALIDADES DE BOGOTÁ ---
  {
    id: 207, type: "Infraestructura", severity: "alta", status: "Activo",
    location: { address: "NQS # 92 - 10", coordinates: { lat: 4.6820, lng: -74.0620 }, locality: "Barrios Unidos" },
    time: "Hace 6 minutos", description: "Inundación severa de la calzada mixta.", reportsCount: 30
  },
  {
    id: 208, type: "Accidente", severity: "alta", status: "Activo",
    location: { address: "Autopista Norte # 170 - 45", coordinates: { lat: 4.7420, lng: -74.0430 }, locality: "Usaquén" },
    time: "Hace 14 minutos", description: "Vehículo patinó y chocó contra separador.", reportsCount: 22
  },
  {
    id: 209, type: "Congestion", severity: "alta", status: "Activo",
    location: { address: "Cl 100 # 15 - 30", coordinates: { lat: 4.6860, lng: -74.0510 }, locality: "Chapinero" },
    time: "Hace 9 minutos", description: "Tráfico colapsado por lluvia intensa.", reportsCount: 28
  },
  {
    id: 210, type: "Infraestructura", severity: "media", status: "En revisión",
    location: { address: "Av Suba # 116 - 20", coordinates: { lat: 4.7010, lng: -74.0720 }, locality: "Suba" },
    time: "Hace 20 minutos", description: "Rama caída sobre vía principal.", reportsCount: 17
  },
  {
    id: 211, type: "Infraestructura", severity: "alta", status: "Activo",
    location: { address: "Cra 68 # 26 - 10", coordinates: { lat: 4.6470, lng: -74.1110 }, locality: "Puente Aranda" },
    time: "Hace 25 minutos", description: "Deprimido inundado (>40cm de agua).", reportsCount: 32
  },
  {
    id: 212, type: "Accidente", severity: "media", status: "Activo",
    location: { address: "Av Boyacá # 53 - 12", coordinates: { lat: 4.6700, lng: -74.0950 }, locality: "Engativá" },
    time: "Hace 11 minutos", description: "Choque simple por frenado brusco.", reportsCount: 15
  },
  {
    id: 213, type: "Estacion", severity: "media", status: "Activo",
    location: { address: "Cl 19 # 3 - 20", coordinates: { lat: 4.6017, lng: -74.0662 }, locality: "Santa Fe" },
    time: "Hace 4 minutos", description: "Filtraciones masivas en torniquetes.", reportsCount: 18
  },
  {
    id: 214, type: "Infraestructura", severity: "alta", status: "Activo",
    location: { address: "Autopista Sur # 33 - 50", coordinates: { lat: 4.5980, lng: -74.1280 }, locality: "Tunjuelito" },
    time: "Hace 8 minutos", description: "Encharcamiento inmoviliza vehículos.", reportsCount: 25
  },
  {
    id: 215, type: "Infraestructura", severity: "alta", status: "Activo",
    location: { address: "Av Calle 26 # 68 - 00", coordinates: { lat: 4.6550, lng: -74.1100 }, locality: "Fontibón" },
    time: "Hace 18 minutos", description: "Acumulación de agua cerca al aeropuerto.", reportsCount: 27
  },
  {
    id: 216, type: "Retraso", severity: "alta", status: "Activo",
    location: { address: "Autopista Sur # 57 - 30", coordinates: { lat: 4.5820, lng: -74.1620 }, locality: "Bosa" },
    time: "Hace 15 minutos", description: "Usuarios refugiándose de la tormenta.", reportsCount: 26
  },
  {
    id: 217, type: "Accidente", severity: "media", status: "Activo",
    location: { address: "Cra 30 # 8 - 00", coordinates: { lat: 4.6110, lng: -74.0830 }, locality: "Los Mártires" },
    time: "Hace 30 minutos", description: "Colisión por visibilidad reducida.", reportsCount: 14
  },
  {
    id: 218, type: "Infraestructura", severity: "media", status: "Activo",
    location: { address: "Cra 7 # 10 - 00", coordinates: { lat: 4.5980, lng: -74.0730 }, locality: "La Candelaria" },
    time: "Hace 21 minutos", description: "Bajada de agua copiosa por andenes.", reportsCount: 12
  },
  {
    id: 219, type: "Accidente", severity: "media", status: "Activo",
    location: { address: "Av 1 de Mayo # 27 - 00", coordinates: { lat: 4.5920, lng: -74.1150 }, locality: "Rafael Uribe Uribe" },
    time: "Hace 13 minutos", description: "Automóvil desliza contra separador.", reportsCount: 13
  },
  {
    id: 220, type: "Infraestructura", severity: "alta", status: "Activo",
    location: { address: "Cl 48 Sur # 5 - 00 Este", coordinates: { lat: 4.5620, lng: -74.0950 }, locality: "Usme" },
    time: "Hace 16 minutos", description: "Vía inundada limita paso de alimentadores.", reportsCount: 19
  },
  {
    id: 221, type: "Accidente", severity: "baja", status: "Activo",
    location: { address: "Cra 24 # 12 - 00", coordinates: { lat: 4.5990, lng: -74.0850 }, locality: "Antonio Nariño" },
    time: "Hace 24 minutos", description: "Caída leve de motociclista sin lesionados.", reportsCount: 10
  },
  {
    id: 222, type: "Infraestructura", severity: "baja", status: "Activo",
    location: { address: "Cl 53 # 15 - 00", coordinates: { lat: 4.6390, lng: -74.0680 }, locality: "Teusaquillo" },
    time: "Hace 28 minutos", description: "Encharcamiento menor en esquina.", reportsCount: 9
  }
];

// ==========================================
// 3. ESCENARIO: DÍA DESPEJADO / NORMAL (Ciudad tranquila, fluida, con reportes mínimos y puntuales también con leve referencia en Ciudad Bolívar)
// ==========================================
export const mockReportsClearDay = [
  // --- CIUDAD BOLÍVAR (Mínimos reportes de obras o eventos cotidianos) ---
  {
    id: 301, type: "Obras", severity: "baja", status: "Activo",
    location: { address: "Tv 18L # 65 - 10 Sur", coordinates: { lat: 4.5500, lng: -74.1550 }, locality: "Ciudad Bolívar" },
    time: "Hace 45 minutos", description: "Labores menores de mantenimiento vial y bacheo sin afectar el paso.", reportsCount: 6
  },
  {
    id: 302, type: "Estacion", severity: "baja", status: "Solucionado",
    location: { address: "Av Villavicencio # 59 - 52 Sur", coordinates: { lat: 4.5815, lng: -74.1375 }, locality: "Ciudad Bolívar" },
    time: "Hace 1 hora", description: "Operación de TransMiCable y rutas zonales totalmente fluida.", reportsCount: 4
  },

  // --- OTRAS LOCALIDADES DE BOGOTÁ ---
  {
    id: 303, type: "Obras", severity: "baja", status: "Activo",
    location: { address: "Cl 72 # 10 - 34", coordinates: { lat: 4.6580, lng: -74.0580 }, locality: "Chapinero" },
    time: "Hace 45 minutos", description: "Trabajos menores de señalización vial.", reportsCount: 3
  },
  {
    id: 304, type: "Estacion", severity: "baja", status: "Solucionado",
    location: { address: "Autopista Norte # 170 - 00", coordinates: { lat: 4.7470, lng: -74.0350 }, locality: "Usaquén" },
    time: "Hace 1 hora", description: "Operación normal en todos los servicios.", reportsCount: 2
  },
  {
    id: 305, type: "Obras", severity: "baja", status: "Activo",
    location: { address: "Cra 15 # 100 - 12", coordinates: { lat: 4.6880, lng: -74.0480 }, locality: "Usaquén" },
    time: "Hace 2 horas", description: "Labores menores de bacheo sobre carril derecho.", reportsCount: 3
  },
  {
    id: 306, type: "Congestion", severity: "baja", status: "Activo",
    location: { address: "Cl 100 # 19 - 10", coordinates: { lat: 4.6850, lng: -74.0530 }, locality: "Chapinero" },
    time: "Hace 30 minutos", description: "Leve aumento de tráfico por semáforo, flujo constante.", reportsCount: 4
  },
  {
    id: 307, type: "Obras", severity: "baja", status: "Activo",
    location: { address: "Cl 26 # 68 - 00", coordinates: { lat: 4.6550, lng: -74.1100 }, locality: "Fontibón" },
    time: "Hace 1 hora", description: "Mantenimiento preventivo de luminarias.", reportsCount: 2
  },
  {
    id: 308, type: "Estacion", severity: "baja", status: "Solucionado",
    location: { address: "Autopista Sur # 57 - 30", coordinates: { lat: 4.5820, lng: -74.1620 }, locality: "Bosa" },
    time: "Hace 2 horas", description: "Servicio fluido sin aglomeraciones.", reportsCount: 3
  }
];