import { hashString } from "../id";
import { computeOverall, standardHash } from "../scoring";
import { seatCandidates } from "../screening";
import type {
  Candidate,
  Competency,
  CompetencyOutcome,
  Confidence,
  Department,
  PendingResult,
  Requirement,
  ScreeningRun,
  SkillTag,
} from "../types";
import { ROLE_LIBRARY } from "./roleLibrary";

/**
 * A compact row per sample candidate. Keeping the shape flat means the sample
 * set reads as a table you can scan and edit, rather than thirty hand-built
 * result objects.
 */
export type CandidateSpec = {
  name: string;
  resume: string;
  /** Overall standing, 0-10. Drives the derived competency profile — see below. */
  score: number;
  summary: string;
  strengths: string[];
  concerns: string[];
  /** One [met, reason] per requirement, in the order they are declared. */
  requirements: Array<[boolean, string]>;
  tags: SkillTag[];
};

export type DepartmentSpec = {
  id: string;
  name: string;
  requirements: string[];
  /** Which role in the imported library supplies this department's competencies. */
  roleSlug: string;
  candidates: CandidateSpec[];
};

function buildRequirements(prefix: string, labels: string[]): Requirement[] {
  return labels.map((label, i) => ({ id: `${prefix}_r${i + 1}`, label }));
}

function competenciesFor(prefix: string, roleSlug: string): Competency[] {
  const role = ROLE_LIBRARY.find((r) => r.slug === roleSlug);
  if (!role) throw new Error(`Sample data names role "${roleSlug}", which the library has no file for.`);
  return role.competencies.map((c, i) => ({ ...c, id: `${prefix}_c${i + 1}` }));
}

/**
 * Pick the sentence from a resume that best supports a given claim.
 *
 * Sample evidence has to be a real quote from the resume it belongs to, or the
 * case file teaches the wrong thing about what evidence looks like. This is a
 * plain word-overlap match — crude, but it always returns text the candidate's
 * own resume actually contains, which is the property that matters.
 */
function pickQuote(resume: string, claim: string): string {
  const sentences = resume
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 25);
  if (sentences.length === 0) return "";

  const claimWords = new Set(
    claim
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 3),
  );

  let best = sentences[0];
  let bestScore = -1;
  for (const sentence of sentences) {
    const words = sentence.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/);
    const overlap = words.filter((w) => claimWords.has(w)).length;
    if (overlap > bestScore) {
      bestScore = overlap;
      best = sentence;
    }
  }
  return best;
}

/**
 * Derive a competency profile from a candidate's overall standing.
 *
 * The sample resumes are invented, so their competency scores are invented too.
 * Rather than hand-writing 240 numbers, each competency is spread around the
 * candidate's overall standing by a value seeded from (candidate, competency),
 * and the two competencies furthest from the resume's subject matter are marked
 * unreached — which is the common, honest outcome for a resume-only screen and
 * exercises the "excluded, not zeroed" path the scorer is built around.
 *
 * These runs are tagged `sample` and labelled as such wherever they are shown.
 */
function deriveCompetencies(
  spec: CandidateSpec,
  competencies: Competency[],
  candidateId: string,
): CompetencyOutcome[] {
  return competencies.map((c, i) => {
    const seed = hashString(`${candidateId}:${c.key}`);
    // -1..+1 around the candidate's standing. Wider than this and the noise
    // swamps the signal: excluded unreached competencies already shift the mean,
    // and a +2 run of luck was enough to seat a weaker candidate above a
    // stronger one, which is exactly the failure the sample is meant to rule out.
    const spread = ((seed >>> 7) % 3) - 1;
    const score = Math.max(0, Math.min(10, spec.score + spread));

    // Two competencies per candidate go unevidenced, chosen by the same seed so
    // the choice is stable but differs between candidates.
    const reached = (seed >>> 13) % competencies.length >= 2 || i < 2;

    const confidence: Confidence =
      !reached ? "low" : spread === 0 ? "high" : "medium";

    return {
      key: c.key,
      label: c.label,
      priority: c.priority,
      reached,
      score,
      confidence,
      evidence: reached ? pickQuote(spec.resume, `${c.label} ${c.description}`) : "",
      note: reached
        ? `${c.label}: ${score >= 8 ? "clearly above the bar" : score >= 5 ? "solidly at the bar" : "below the bar"} on the evidence in the resume.`
        : "The resume gives nothing to judge this on.",
    };
  });
}

export type BuiltSample = {
  departments: Department[];
  candidates: Candidate[];
  runs: ScreeningRun[];
};

/**
 * Turn the specs into the same shapes a real screening run produces. Neither the
 * seating nor the overall score is hand-written: both come out of the same
 * functions the live run uses, so the sample can never disagree with the rules
 * it is demonstrating.
 */
export function buildSample(specs: DepartmentSpec[], screenedAt: string): BuiltSample {
  const departments: Department[] = [];
  const candidates: Candidate[] = [];
  const runs: ScreeningRun[] = [];

  for (const spec of specs) {
    const requirements = buildRequirements(spec.id, spec.requirements);
    const competencies = competenciesFor(spec.id, spec.roleSlug);
    departments.push({ id: spec.id, name: spec.name, requirements, competencies });

    const pending: PendingResult[] = [];

    spec.candidates.forEach((c, i) => {
      const candidateId = `${spec.id}_p${i + 1}`;
      const resume = c.resume.trim();

      candidates.push({
        id: candidateId,
        name: c.name,
        departmentId: spec.id,
        resumeText: resume,
        submittedAt: screenedAt,
      });

      const competencyResults = deriveCompetencies(
        { ...c, resume },
        competencies,
        candidateId,
      );

      pending.push({
        candidateId,
        candidateName: c.name,
        departmentId: spec.id,
        summary: c.summary,
        strengths: c.strengths,
        concerns: c.concerns,
        requirementResults: requirements.map((req, k) => {
          const [met, reason] = c.requirements[k];
          return {
            label: req.label,
            met,
            // The sample reasons are all written from something the resume says,
            // including the ones that fail, so every row is evidenced.
            evidenced: true,
            evidence: pickQuote(resume, `${req.label} ${reason}`),
            reason,
          };
        }),
        competencyResults,
        tags: c.tags,
        score: computeOverall(competencyResults),
        screenedAt,
      });
    });

    runs.push({
      id: `run_sample_${spec.id}`,
      departmentId: spec.id,
      departmentName: spec.name,
      ranAt: screenedAt,
      results: seatCandidates(pending),
      appliedStandard: {
        requirements,
        competencies,
        hash: standardHash(requirements, competencies),
      },
      sample: true,
    });
  }

  return { departments, candidates, runs };
}
