import { weightFor } from "../scoring";
import type { Competency, CompetencyOutcome, ScreeningResult } from "../types";
import type { CoverageRow, Interview, InterviewTurn } from "./types";

/**
 * Coverage accounting, done here rather than by the model.
 *
 * The model is told how many questions it has asked and how many each competency
 * still needs; it is not asked to remember. Counting is the kind of thing code
 * does perfectly and a language model does approximately, and an interview that
 * miscounts its own coverage produces a score resting on a claim about itself
 * that is not true.
 */

/** Questions each competency is targeted for, by priority. */
const QUESTIONS_BY_PRIORITY: Record<string, number> = { high: 2, medium: 1, low: 1 };

/**
 * Total questions. Scaled to the standard rather than to seniority — this app
 * does not ask for a seniority, and a department with twelve competencies needs
 * a longer conversation than one with four.
 */
export function questionBudget(competencies: Competency[]): number {
  const target = competencies.reduce(
    (sum, c) => sum + (QUESTIONS_BY_PRIORITY[c.priority] ?? 1),
    0,
  );
  return Math.max(6, Math.min(14, target));
}

export function computeCoverage(
  competencies: Competency[],
  screening: ScreeningResult,
  turns: InterviewTurn[],
): CoverageRow[] {
  const screened = new Map(screening.competencyResults.map((c) => [c.key, c]));

  return competencies.map((c) => {
    const s = screened.get(c.key);
    return {
      key: c.key,
      label: c.label,
      priority: c.priority,
      target: QUESTIONS_BY_PRIORITY[c.priority] ?? 1,
      asked: turns.filter((t) => t.role === "interviewer" && t.competencyKey === c.key).length,
      screenedScore: s?.reached ? s.score : null,
      screenedConfidence: s?.reached ? s.confidence : null,
      screenedReached: Boolean(s?.reached),
    };
  });
}

/**
 * Which competencies this interview most needs to reach.
 *
 * The resume screening already ran, so the interview does not start blind: it
 * starts with a list of what the resume could not settle. Unevidenced first,
 * then low-confidence scores, then everything else by weight.
 */
export function interviewPriorities(coverage: CoverageRow[]): CoverageRow[] {
  const rank = (row: CoverageRow) => {
    if (!row.screenedReached) return 0;
    if (row.screenedConfidence === "low") return 1;
    if (row.screenedConfidence === "medium") return 2;
    return 3;
  };
  return [...coverage].sort(
    (a, b) => rank(a) - rank(b) || weightFor(b.priority) - weightFor(a.priority),
  );
}

export function questionsAsked(turns: InterviewTurn[]): number {
  return turns.filter((t) => t.role === "interviewer").length;
}

/** An interview is answerable when its last turn is a question. */
export function awaitingAnswer(interview: Interview): boolean {
  return interview.turns.at(-1)?.role === "interviewer";
}

/**
 * Merge the interview's competency scores over the resume's.
 *
 * Where the interview reached a competency, its score replaces the resume's
 * rather than averaging with it. A resume is an assertion and an interview is
 * direct evidence; averaging the two would let a well-written resume hold up a
 * weak interview, which is the failure this whole app is pointed at. Where the
 * interview did not reach a competency, the resume's score stands — it is still
 * the best evidence anyone has.
 */
export function mergeInterviewScores(
  fromResume: CompetencyOutcome[],
  fromInterview: CompetencyOutcome[],
): CompetencyOutcome[] {
  const interview = new Map(fromInterview.map((c) => [c.key, c]));
  return fromResume.map((resume) => {
    const live = interview.get(resume.key);
    if (!live || !live.reached) return resume;
    return {
      ...live,
      note: `${live.note} (Interview evidence; the resume screen ${
        resume.reached ? `had this at ${resume.score}/10` : "did not reach this"
      }.)`,
    };
  });
}
