export const PRIORITIES = ["high", "medium", "low"] as const;
export type Priority = (typeof PRIORITIES)[number];

export type Confidence = "low" | "medium" | "high";

/**
 * A hard requirement. Pass/fail, and every one must pass for a candidate to be
 * seatable — this is the gate, and it is the one thing a score cannot override.
 */
export type Requirement = {
  id: string;
  label: string;
};

/**
 * A scored competency, in the shape the criteria files use: what it means, what
 * a strong answer looks like, what a weak one looks like, and a priority that
 * sets its weight in the overall score.
 *
 * The description/strong/weak triple is not decoration — it is what the model is
 * given instead of the bare label, and it is the difference between "score them
 * on communication" and a standard someone can argue with.
 */
export type Competency = {
  id: string;
  /** Stable key, so a score can be traced to a competency across edits. */
  key: string;
  label: string;
  priority: Priority;
  description: string;
  strongAnswer: string;
  weakAnswer: string;
};

export type Department = {
  id: string;
  name: string;
  requirements: Requirement[];
  competencies: Competency[];
};

/** A role from the imported library, used as the starting point for a department. */
export type RoleTemplate = {
  slug: string;
  title: string;
  sector: string;
  competencies: Array<Omit<Competency, "id">>;
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

export type RequirementOutcome = {
  label: string;
  met: boolean;
  /**
   * False when the resume says nothing either way. A requirement still fails
   * without evidence — that is what a hard requirement means — but the record
   * has to distinguish "the resume says no" from "the resume is silent", or a
   * rejection cannot be explained to the person it happened to.
   */
  evidenced: boolean;
  /** A quote from the resume. Empty when nothing in it spoke to this. */
  evidence: string;
  reason: string;
};

export type CompetencyOutcome = {
  key: string;
  label: string;
  priority: Priority;
  /** False when the resume gave nothing to judge this on. Excluded from the mean. */
  reached: boolean;
  /** 0-10. Ignored when `reached` is false. */
  score: number;
  confidence: Confidence;
  /** A quote from the resume. A score with no quotable basis is not a score. */
  evidence: string;
  note: string;
};

/** What the resume shows about a skill, as opposed to what it asserts. */
export type SkillTag = {
  label: string;
  status: "demonstrated" | "claimed" | "contradicted";
};

export type NotSeatedReason = "requirement" | "rank";

/** The evaluation half — exactly what the model is asked to return. */
export type Evaluation = {
  summary: string;
  strengths: string[];
  concerns: string[];
  requirementResults: RequirementOutcome[];
  competencyResults: CompetencyOutcome[];
  tags: SkillTag[];
};

/** How the overall score was reached. Computed here, never by the model. */
export type OverallScore = {
  /** 0-100, rounded. */
  overall: number;
  /** How many competencies the number actually rests on. */
  counted: number;
  /** How many the department defines. */
  total: number;
  /** Sum of weights that went into the mean, for anyone checking by hand. */
  weightSum: number;
  /** Competency keys excluded from the mean, so the UI can name them. */
  unreached: string[];
};

/** The full record — evaluation, computed score, and the seating verdict. */
export type ScreeningResult = Evaluation & {
  candidateId: string;
  candidateName: string;
  departmentId: string;
  score: OverallScore;
  meetsAll: boolean;
  seated: boolean;
  notSeatedReason?: NotSeatedReason;
  screenedAt: string;
  /** True when the model's output could not be trusted — the record survives anyway. */
  errored?: boolean;
  errorMessage?: string;
};

/** A screening result before this app has decided who sits down. */
export type PendingResult = Omit<ScreeningResult, "meetsAll" | "seated" | "notSeatedReason">;

export type AnalyzeRequestBody = {
  candidate: Pick<Candidate, "id" | "name" | "resumeText">;
  requirements: Requirement[];
  competencies: Competency[];
};

export type AnalyzeResponseBody =
  | { ok: true; evaluation: Evaluation }
  | { ok: false; error: string; evaluation: Evaluation };

export const SEAT_COUNT = 5;

/**
 * One screening pass over a department's queue. Runs are append-only —
 * the audit trail is the list of runs, never a mutated "current" state.
 *
 * The run carries a frozen copy of the standard it applied, so editing a
 * department afterwards cannot change what a past candidate was held to.
 */
export type ScreeningRun = {
  id: string;
  departmentId: string;
  departmentName: string;
  ranAt: string;
  results: ScreeningResult[];
  /** The requirements and competencies in force when this run started. */
  appliedStandard: {
    requirements: Requirement[];
    competencies: Competency[];
    /** Content hash of the above. Two runs with the same hash applied the same standard. */
    hash: string;
  };
  /** True for the seeded demo runs that ship with the app, so a reader can
   *  always tell an example apart from a judgment the AI made. */
  sample?: boolean;
};
