import type { CompetencyOutcome, Confidence } from "../types";

/**
 * The interview, as this app runs it.
 *
 * Adapted from jaewoo001/hirescope's engine with one structural change: there,
 * the candidate types their own answers into the app. Here the interview happens
 * in the room — HR asks the question the model proposes, the candidate answers
 * out loud, and HR types down what they said. The model is a second pair of ears
 * that never gets to decide anything, which is why nothing candidate-facing
 * (consent flows, abandonment, integrity signals) comes across with it.
 *
 * The consequence worth naming: the transcript is HR's paraphrase, not the
 * candidate's own words. Evidence quotes are quotes of what HR wrote down.
 */

export type InterviewTurn = {
  role: "interviewer" | "candidate";
  text: string;
  /** Which competency the question targeted. Carried on both halves of a pair. */
  competencyKey: string;
  at: string;
};

export type TurnAppraisal = {
  competencyKey: string;
  /** 0-4 for a single answer — a coarser scale than the final 0-10, on purpose. */
  score: number;
  depth: "none" | "surface" | "specific" | "deep";
  evidence: string;
  concern: string;
  evasionNoted: boolean;
};

export type Interview = {
  candidateId: string;
  candidateName: string;
  departmentId: string;
  /** The run whose seating this interview may change. */
  runId: string;
  startedAt: string;
  finishedAt?: string;
  status: "in_progress" | "finished";
  /** How many questions this interview is budgeted for. */
  budget: number;
  turns: InterviewTurn[];
  appraisals: TurnAppraisal[];
  /** Set once finished: the competencies the interview rescored. */
  outcome?: {
    competencyResults: CompetencyOutcome[];
    summary: string;
    strengths: string[];
    concerns: string[];
  };
};

export type CoverageRow = {
  key: string;
  label: string;
  priority: string;
  /** How many questions this competency should get, from its priority. */
  target: number;
  asked: number;
  /** What the resume screening made of it, so the interview can chase the gaps. */
  screenedScore: number | null;
  screenedConfidence: Confidence | null;
  screenedReached: boolean;
};

export type TurnRequestBody = {
  candidateName: string;
  resumeText: string;
  /** The department's competencies, with their definitions. */
  competencies: Array<{
    key: string;
    label: string;
    priority: string;
    description: string;
    strongAnswer: string;
    weakAnswer: string;
  }>;
  /** What the resume screening concluded — this interview's brief. */
  screening: {
    summary: string;
    concerns: string[];
    competencyResults: CompetencyOutcome[];
  };
  turns: InterviewTurn[];
  coverage: CoverageRow[];
  budget: number;
};

export type TurnResponseBody =
  | {
      ok: true;
      appraisal: TurnAppraisal | null;
      decision: { action: string; reason: string };
      question: { text: string; competencyKey: string; probeDepth: number };
      closing: boolean;
    }
  | { ok: false; error: string };

export type FinishRequestBody = Omit<TurnRequestBody, "coverage" | "budget"> & {
  coverage: CoverageRow[];
  appraisals: TurnAppraisal[];
};

export type FinishResponseBody =
  | {
      ok: true;
      competencyResults: CompetencyOutcome[];
      summary: string;
      strengths: string[];
      concerns: string[];
    }
  | { ok: false; error: string };
