import { newId } from "../id";
import { seatCandidates } from "../screening";
import type { Candidate, Criterion, Department, PendingResult, ScreeningRun } from "../types";

/**
 * A compact row per sample candidate. Keeping the shape flat means the sample
 * set reads as a table you can scan and edit, rather than thirty hand-built
 * result objects.
 */
export type CandidateSpec = {
  name: string;
  resume: string;
  score: number;
  summary: string;
  strengths: string[];
  concerns: string[];
  /** One [met, reason] per priority criterion, in the order they are declared. */
  priority: Array<[boolean, string]>;
  /** One flag per nice-to-have, in order. */
  nice: boolean[];
};

export type DepartmentSpec = {
  id: string;
  name: string;
  priority: string[];
  nice: string[];
  candidates: CandidateSpec[];
};

function criteria(prefix: string, labels: string[]): Criterion[] {
  return labels.map((label, i) => ({ id: `${prefix}_${i + 1}`, label }));
}

export type BuiltSample = {
  departments: Department[];
  candidates: Candidate[];
  runs: ScreeningRun[];
};

/**
 * Turn the specs into the same shapes a real screening run produces. Seating is
 * not hand-written: it comes out of seatCandidates(), the same function the live
 * run uses, so the sample can never disagree with the rule it is demonstrating.
 */
export function buildSample(specs: DepartmentSpec[], screenedAt: string): BuiltSample {
  const departments: Department[] = [];
  const candidates: Candidate[] = [];
  const runs: ScreeningRun[] = [];

  for (const spec of specs) {
    const priorityCriteria = criteria(`${spec.id}_p`, spec.priority);
    const niceToHave = criteria(`${spec.id}_n`, spec.nice);
    departments.push({ id: spec.id, name: spec.name, priorityCriteria, niceToHave });

    const pending: PendingResult[] = [];

    spec.candidates.forEach((c, i) => {
      const candidateId = `${spec.id}_c${i + 1}`;
      candidates.push({
        id: candidateId,
        name: c.name,
        departmentId: spec.id,
        resumeText: c.resume.trim(),
        submittedAt: screenedAt,
      });

      pending.push({
        candidateId,
        candidateName: c.name,
        departmentId: spec.id,
        score: c.score,
        summary: c.summary,
        strengths: c.strengths,
        concerns: c.concerns,
        priorityResults: priorityCriteria.map((crit, k) => ({
          label: crit.label,
          met: c.priority[k][0],
          reason: c.priority[k][1],
        })),
        niceToHaveResults: niceToHave.map((crit, k) => ({
          label: crit.label,
          met: c.nice[k] ?? false,
        })),
        screenedAt,
      });
    });

    runs.push({
      id: `run_sample_${spec.id}`,
      departmentId: spec.id,
      departmentName: spec.name,
      ranAt: screenedAt,
      results: seatCandidates(pending),
      sample: true,
    });
  }

  return { departments, candidates, runs };
}

/** Used when the app needs a fresh id outside the sample set. */
export const freshRunId = () => newId("run");
