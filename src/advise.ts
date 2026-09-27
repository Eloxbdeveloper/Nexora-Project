import { plan, Query, LiveReport } from "./engine/router";
import { buildPayload, getRecommendation } from "./agent/agent";

/** Motor + agente en un solo paso; lo usan la web y el chat de WhatsApp. */
export async function advise(q: Query, reports: LiveReport[]) {
  const now = Date.now();
  const p = plan(q, reports, now);
  if (!p) return null;
  const r = await getRecommendation(buildPayload(q, p, reports, now));
  const rec = p.candidates.find(c => c.id === r.reply.recommendedId) ?? p.chosen;
  return { plan: p, rec, ...r };
}
