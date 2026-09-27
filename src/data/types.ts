export type Kind = "formal" | "informal";
export type Mode = "cable" | "sitp" | "colectivo" | "comunitaria";
export interface Stop { id: string; name: string; lat: number; lng: number; kind: Kind | "mixto"; accessible: boolean; landmark: string; }
export interface Schedule { days: ("L"|"M"|"X"|"J"|"V"|"S"|"D")[]; from: string; to: string; }
export interface Route {
  id: string; name: string; operator: string; mode: Mode; kind: Kind; color: string;
  stops: string[]; segMin: number[]; headwayMin: number; irregular: boolean;
  schedule: Schedule[]; fareCOP: number; reliability: number; bidirectional: boolean; note: string;
}
export interface Poi { id: string; name: string; type: "colegio"|"universidad"|"salud"|"mercado"|"jac"; lat: number; lng: number; nearestStop: string; walkMin: number; }
export type ReportType = "bloqueo" | "demora" | "cambio";
export interface Report {
  id: string; type: ReportType; routeId: string; from?: string; to?: string; severity: 1 | 2 | 3;
  minutesExtra?: number; headwayMultiplier?: number; description: string; minutesAgo: number; ttlMin: number;
  confirmations: number; source: "ciudadano" | "JAC" | "operador";
}
