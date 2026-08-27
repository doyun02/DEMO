import type { Evaluation, PendingResult, ScreeningResult } from "./types";
import { SEAT_COUNT } from "./types";

/**
 * The core promise of the product: nothing is silently discarded.
 * Every candidate that goes through screening comes back with a verdict
 * and — when they aren't seated — an explicit reason why.
 */
export function seatCandidates(results: PendingResult[]): ScreeningResult[] {
  const withPass = results.map((r) => ({
    ...r,
    meetsAll: r.priorityResults.length > 0 && r.priorityResults.every((p) => p.met),
  }));

  const passing = withPass
    .filter((r) => r.meetsAll && !r.errored)
    .sort((a, b) => b.score - a.score || a.candidateName.localeCompare(b.candidateName));

  const seatedIds = new Set(passing.slice(0, SEAT_COUNT).map((r) => r.candidateId));

  return withPass.map((r) => {
    const seated = seatedIds.has(r.candidateId);
    return {
      ...r,
      seated,
      notSeatedReason: seated ? undefined : r.meetsAll && !r.errored ? "rank" : "requirement",
    };
  });
}

/** Order the room: seated candidates by score, best in the centre seat outward. */
export function seatOrder(seated: ScreeningResult[]): ScreeningResult[] {
  const ranked = [...seated].sort((a, b) => b.score - a.score);
  const slots: ScreeningResult[] = [];
  const order = [2, 1, 3, 0, 4]; // centre-out
  ranked.forEach((r, i) => {
    const slot = order[i] ?? i;
    slots[slot] = r;
  });
  return slots;
}

/** A placeholder evaluation used when the model's output can't be trusted. */
export function erroredEvaluation(
  priorityLabels: string[],
  niceLabels: string[],
  message: string,
): Evaluation {
  return {
    score: 0,
    summary: `Screening could not be completed: ${message}`,
    strengths: [],
    concerns: ["Screening did not complete — this record is flagged for manual review."],
    priorityResults: priorityLabels.map((label) => ({
      label,
      met: false,
      reason: "Not evaluated — screening failed.",
    })),
    niceToHaveResults: niceLabels.map((label) => ({ label, met: false })),
  };
}
