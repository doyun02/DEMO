import { computeOverall } from "./scoring";
import type {
  Competency,
  CompetencyOutcome,
  Evaluation,
  PendingResult,
  Requirement,
  ScreeningResult,
} from "./types";
import { SEAT_COUNT } from "./types";

/**
 * The core promise of the product: nothing is silently discarded.
 * Every candidate that goes through screening comes back with a verdict
 * and — when they aren't seated — an explicit reason why.
 *
 * Two stages, deliberately separate:
 *   1. The requirement gate decides who is *eligible*. Every requirement must be
 *      met; one miss is out, whatever the score says.
 *   2. Among the eligible, the weighted competency score decides who *ranks*,
 *      and the top five sit down.
 */
export function seatCandidates(results: PendingResult[]): ScreeningResult[] {
  const withPass = results.map((r) => ({
    ...r,
    meetsAll: r.requirementResults.length > 0 && r.requirementResults.every((p) => p.met),
  }));

  const passing = withPass
    .filter((r) => r.meetsAll && !r.errored)
    .sort(
      (a, b) =>
        b.score.overall - a.score.overall || a.candidateName.localeCompare(b.candidateName),
    );

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
  const ranked = [...seated].sort((a, b) => b.score.overall - a.score.overall);
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
  requirements: Requirement[],
  competencies: Competency[],
  message: string,
): Evaluation {
  return {
    summary: `Screening could not be completed: ${message}`,
    strengths: [],
    concerns: ["Screening did not complete — this record is flagged for manual review."],
    requirementResults: requirements.map((r) => ({
      label: r.label,
      met: false,
      evidenced: false,
      evidence: "",
      reason: "Not evaluated — screening failed.",
    })),
    // Unreached, not zero: a failed run must not look like a candidate who
    // scored nothing.
    competencyResults: competencies.map((c) => ({
      key: c.key,
      label: c.label,
      priority: c.priority,
      reached: false,
      score: 0,
      confidence: "low" as const,
      evidence: "",
      note: "Not evaluated — screening failed.",
    })),
    tags: [],
  };
}

/** Attach the computed score to an evaluation. The model never supplies it. */
export function scoreEvaluation(outcomes: CompetencyOutcome[]) {
  return computeOverall(outcomes);
}
