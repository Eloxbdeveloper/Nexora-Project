import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import seed from "../data/reports.json";
import type { LiveReport } from "../engine/router";

const KEY = "muevete-cb-reports-v1";
const seeds = (): LiveReport[] => (seed.reports as any[]).map(r => ({ ...r, t0: Date.now() }));
const load = (): LiveReport[] => {
  try { const s = localStorage.getItem(KEY); if (s) return JSON.parse(s); } catch { /* sin storage */ }
  return seeds();
};

type NewReport = Omit<LiveReport, "id" | "t0" | "minutesAgo" | "confirmations">;
interface Ctx {
  reports: LiveReport[];
  addReport: (r: NewReport) => LiveReport;
  confirm: (id: string) => void;
  resetDemo: () => void;
}
const C = createContext<Ctx>(null as any);
export const useReports = () => useContext(C);

export function ReportsProvider({ children }: { children: ReactNode }) {
  const [reports, setReports] = useState<LiveReport[]>(load);
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(reports)); } catch { /* ignorar */ } }, [reports]);

  const addReport = (r: NewReport) => {
    const n: LiveReport = { ...r, id: `LIVE-${Date.now()}`, t0: Date.now(), minutesAgo: 0, confirmations: 1 };
    setReports(prev => [n, ...prev]);
    return n;
  };
  const confirm = (id: string) =>
    setReports(prev => prev.map(r => (r.id === id ? { ...r, confirmations: r.confirmations + 1 } : r)));
  const resetDemo = () => { try { localStorage.removeItem(KEY); } catch { /* ignorar */ } setReports(seeds()); };

  return <C.Provider value={{ reports, addReport, confirm, resetDemo }}>{children}</C.Provider>;
}
