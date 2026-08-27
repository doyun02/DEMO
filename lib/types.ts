export type Criterion = {
  id: string;
  label: string;
};

export type Department = {
  id: string;
  name: string;
  priorityCriteria: Criterion[];
  niceToHave: Criterion[];
};

export type Candidate = {
  id: string;
  name: string;
  departmentId: string;
  resumeText: string;
  submittedAt: string;
  /** Extension point: set when the resume came from a parsed file rather than pasted text. */
  sourceFileName?: string;
};

export type CriterionOutcome = {
  label: string;
  met: boolean;
  reason: string;
};

export type NiceToHaveOutcome = {
  label: string;
  met: boolean;
};

export type NotSeatedReason = "requirement" | "rank";

/** The evaluation half — exactly what the model is asked to return. */
export type Evaluation = {
  score: number; // 0-10
  summary: string;
  strengths: string[];
  concerns: string[];
  priorityResults: CriterionOutcome[];
  niceToHaveResults: NiceToHaveOutcome[];
};

/** The full record — evaluation plus the seating verdict this app computes. */
export type ScreeningResult = Evaluation & {
  candidateId: string;
  candidateName: string;
  departmentId: string;
  meetsAll: boolean;
  seated: boolean;
  notSeatedReason?: NotSeatedReason;
  screenedAt: string;
  /** True when the model's output could not be parsed — the record survives anyway. */
  errored?: boolean;
  errorMessage?: string;
};

/** A screening result before this app has decided who sits down. */
export type PendingResult = Omit<ScreeningResult, "meetsAll" | "seated" | "notSeatedReason">;

export type AnalyzeRequestBody = {
  candidate: Pick<Candidate, "id" | "name" | "resumeText">;
  priorityCriteria: Criterion[];
  niceToHave: Criterion[];
};

export type AnalyzeResponseBody =
  | { ok: true; evaluation: Evaluation }
  | { ok: false; error: string; evaluation: Evaluation };

export const SEAT_COUNT = 5;

/**
 * One screening pass over a department's queue. Runs are append-only —
 * the audit trail is the list of runs, never a mutated "current" state.
 */
export type ScreeningRun = {
  id: string;
  departmentId: string;
  departmentName: string;
  ranAt: string;
  results: ScreeningResult[];
};
