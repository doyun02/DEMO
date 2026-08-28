"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { newId } from "./id";
import { mergeInterviewScores, questionBudget } from "./interview/coverage";
import type { Interview, InterviewTurn, TurnAppraisal } from "./interview/types";
import { ROLE_LIBRARY } from "./sample/roleLibrary";
import { clampWeight, computeOverall } from "./scoring";
import { seatCandidates } from "./screening";
import { SAMPLE_CANDIDATES, SAMPLE_DEPARTMENTS, SAMPLE_RUNS } from "./sampleData";
import type {
  Candidate,
  Competency,
  Department,
  Priority,
  Requirement,
  PriorityWeights,
  RoleTemplate,
  ScreeningRun,
} from "./types";

type AppState = {
  departments: Department[];
  activeDepartmentId: string;
  candidates: Candidate[];
  runs: ScreeningRun[];
  /** In-room interviews, keyed by candidate. One per candidate at a time. */
  interviews: Record<string, Interview>;
  /**
   * Who this browser is, on the applicant side. Set when a resume is submitted.
   * HR and applicant are separate people on separate devices in real use; with
   * no server between them this is the demo's stand-in for that — one browser
   * holds both sides, and the applicant view reads the same store the HR view
   * writes to.
   */
  applicantId: string | null;
  /**
   * The interview handshake. HR invites, the applicant consents, and only then
   * does either side see a question. Consent is recorded with a timestamp
   * because "they agreed" is a claim somebody may have to stand behind later.
   */
  invites: Record<
    string,
    { invitedAt: string; consentedAt?: string; declinedAt?: string }
  >;
  selectedCandidateId: string | null;
  screening: { running: boolean; done: number; total: number; error?: string };

  setActiveDepartment: (id: string) => void;
  addDepartment: (name: string) => void;
  addDepartmentFromTemplate: (slug: string) => void;
  renameDepartment: (id: string, name: string) => void;
  removeDepartment: (id: string) => void;

  addRequirement: (departmentId: string, label: string) => void;
  updateRequirement: (departmentId: string, id: string, label: string) => void;
  removeRequirement: (departmentId: string, id: string) => void;

  addCompetency: (departmentId: string, label: string) => void;
  updateCompetency: (departmentId: string, id: string, patch: Partial<Competency>) => void;
  removeCompetency: (departmentId: string, id: string) => void;
  setWeights: (departmentId: string, weights: PriorityWeights) => void;

  addCandidate: (input: {
    name: string;
    departmentId: string;
    resumeText: string;
    sourceFileName?: string;
  }) => void;
  removeCandidate: (id: string) => void;

  selectCandidate: (id: string | null) => void;
  setScreening: (patch: Partial<AppState["screening"]>) => void;
  addRun: (run: ScreeningRun) => void;
  clearRuns: () => void;

  startInterview: (candidateId: string) => void;
  appendInterviewTurn: (candidateId: string, turn: InterviewTurn) => void;
  recordAppraisal: (candidateId: string, appraisal: TurnAppraisal) => void;
  /** Fold a finished interview into a new run, re-seating the room. */
  applyInterview: (candidateId: string, outcome: NonNullable<Interview["outcome"]>) => void;
  abandonInterview: (candidateId: string) => void;

  registerApplicant: (input: {
    name: string;
    email?: string;
    departmentId: string;
    resumeText: string;
  }) => string;
  signOutApplicant: () => void;
  inviteToInterview: (candidateId: string) => void;
  withdrawInvite: (candidateId: string) => void;
  respondToInvite: (candidateId: string, consented: boolean) => void;

  resetAll: () => void;
};

const initial = {
  departments: SAMPLE_DEPARTMENTS,
  activeDepartmentId: SAMPLE_DEPARTMENTS[0].id,
  candidates: SAMPLE_CANDIDATES,
  runs: SAMPLE_RUNS as ScreeningRun[],
  interviews: {} as Record<string, Interview>,
  applicantId: null as string | null,
  invites: {} as Record<string, { invitedAt: string; consentedAt?: string; declinedAt?: string }>,
  selectedCandidateId: null as string | null,
  screening: { running: false, done: 0, total: 0 },
};

/** A competency key derived from a label, so a hand-added one still has one. */
function keyFromLabel(label: string): string {
  const base = label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return base || `competency_${Math.random().toString(36).slice(2, 7)}`;
}

function templateToDepartment(template: RoleTemplate): Department {
  return {
    id: newId("dept"),
    name: template.title,
    // A template supplies the competencies, which are the hard part to write.
    // Requirements stay empty: a hard gate is company policy, not role theory,
    // and inventing one here would put words in the hiring team's mouth.
    requirements: [],
    competencies: template.competencies.map((c) => ({ ...c, id: newId("comp") })),
  };
}

export const useApp = create<AppState>()(
  persist(
    (set) => ({
      ...initial,

      setActiveDepartment: (id) => set({ activeDepartmentId: id, selectedCandidateId: null }),

      addDepartment: (name) => {
        const dept: Department = {
          id: newId("dept"),
          name: name.trim() || "Untitled department",
          requirements: [],
          competencies: [],
        };
        set((s) => ({ departments: [...s.departments, dept], activeDepartmentId: dept.id }));
      },

      addDepartmentFromTemplate: (slug) => {
        const template = ROLE_LIBRARY.find((r) => r.slug === slug);
        if (!template) return;
        const dept = templateToDepartment(template);
        set((s) => ({ departments: [...s.departments, dept], activeDepartmentId: dept.id }));
      },

      renameDepartment: (id, name) =>
        set((s) => ({
          departments: s.departments.map((d) => (d.id === id ? { ...d, name } : d)),
        })),

      removeDepartment: (id) =>
        set((s) => {
          const departments = s.departments.filter((d) => d.id !== id);
          return {
            departments,
            activeDepartmentId:
              s.activeDepartmentId === id ? (departments[0]?.id ?? "") : s.activeDepartmentId,
            candidates: s.candidates.filter((c) => c.departmentId !== id),
          };
        }),

      addRequirement: (departmentId, label) =>
        set((s) => ({
          departments: s.departments.map((d) =>
            d.id === departmentId
              ? { ...d, requirements: [...d.requirements, { id: newId("req"), label: label.trim() }] }
              : d,
          ),
        })),

      updateRequirement: (departmentId, id, label) =>
        set((s) => ({
          departments: s.departments.map((d) =>
            d.id === departmentId
              ? {
                  ...d,
                  requirements: d.requirements.map((r: Requirement) =>
                    r.id === id ? { ...r, label } : r,
                  ),
                }
              : d,
          ),
        })),

      removeRequirement: (departmentId, id) =>
        set((s) => ({
          departments: s.departments.map((d) =>
            d.id === departmentId
              ? { ...d, requirements: d.requirements.filter((r: Requirement) => r.id !== id) }
              : d,
          ),
        })),

      addCompetency: (departmentId, label) =>
        set((s) => ({
          departments: s.departments.map((d) =>
            d.id === departmentId
              ? {
                  ...d,
                  competencies: [
                    ...d.competencies,
                    {
                      id: newId("comp"),
                      key: keyFromLabel(label),
                      label: label.trim(),
                      priority: "medium" as Priority,
                      description: "",
                      strongAnswer: "",
                      weakAnswer: "",
                    },
                  ],
                }
              : d,
          ),
        })),

      updateCompetency: (departmentId, id, patch) =>
        set((s) => ({
          departments: s.departments.map((d) =>
            d.id === departmentId
              ? {
                  ...d,
                  competencies: d.competencies.map((c: Competency) =>
                    c.id === id ? { ...c, ...patch } : c,
                  ),
                }
              : d,
          ),
        })),

      removeCompetency: (departmentId, id) =>
        set((s) => ({
          departments: s.departments.map((d) =>
            d.id === departmentId
              ? { ...d, competencies: d.competencies.filter((c: Competency) => c.id !== id) }
              : d,
          ),
        })),

      setWeights: (departmentId, weights) =>
        set((s) => ({
          departments: s.departments.map((d) =>
            d.id === departmentId
              ? {
                  ...d,
                  weights: {
                    high: clampWeight(weights.high),
                    medium: clampWeight(weights.medium),
                    low: clampWeight(weights.low),
                  },
                }
              : d,
          ),
        })),

      addCandidate: (input) => {
        const candidate: Candidate = {
          id: newId("cand"),
          name: input.name.trim() || "Unnamed candidate",
          departmentId: input.departmentId,
          resumeText: input.resumeText,
          submittedAt: new Date().toISOString(),
          sourceFileName: input.sourceFileName,
        };
        set((s) => ({ candidates: [...s.candidates, candidate] }));
      },

      removeCandidate: (id) =>
        set((s) => ({
          candidates: s.candidates.filter((c) => c.id !== id),
          selectedCandidateId: s.selectedCandidateId === id ? null : s.selectedCandidateId,
        })),

      selectCandidate: (id) => set({ selectedCandidateId: id }),

      setScreening: (patch) => set((s) => ({ screening: { ...s.screening, ...patch } })),

      addRun: (run) => set((s) => ({ runs: [run, ...s.runs] })),

      clearRuns: () => set({ runs: [], interviews: {}, selectedCandidateId: null }),

      startInterview: (candidateId) =>
        set((s) => {
          const run = s.runs.find((r) => r.results.some((x) => x.candidateId === candidateId));
          const result = run?.results.find((x) => x.candidateId === candidateId);
          const dept = s.departments.find((d) => d.id === result?.departmentId);
          if (!run || !result || !dept) return {};
          return {
            interviews: {
              ...s.interviews,
              [candidateId]: {
                candidateId,
                candidateName: result.candidateName,
                departmentId: dept.id,
                runId: run.id,
                startedAt: new Date().toISOString(),
                status: "in_progress",
                budget: questionBudget(dept.competencies),
                turns: [],
                appraisals: [],
              },
            },
          };
        }),

      appendInterviewTurn: (candidateId, turn) =>
        set((s) => {
          const interview = s.interviews[candidateId];
          if (!interview) return {};
          return {
            interviews: {
              ...s.interviews,
              [candidateId]: { ...interview, turns: [...interview.turns, turn] },
            },
          };
        }),

      recordAppraisal: (candidateId, appraisal) =>
        set((s) => {
          const interview = s.interviews[candidateId];
          if (!interview) return {};
          return {
            interviews: {
              ...s.interviews,
              [candidateId]: {
                ...interview,
                appraisals: [...interview.appraisals, appraisal],
              },
            },
          };
        }),

      /**
       * Finishing an interview does not edit the run it came from. It appends a
       * new one, with this candidate's competencies rescored from the interview
       * and the whole room re-seated — so the ranking can change, the record of
       * how it changed survives, and the room animates the difference.
       */
      applyInterview: (candidateId, outcome) =>
        set((s) => {
          const interview = s.interviews[candidateId];
          const source = s.runs.find((r) => r.id === interview?.runId);
          if (!interview || !source) return {};

          const rescored = source.results.map((result) => {
            if (result.candidateId !== candidateId) return result;
            const competencyResults = mergeInterviewScores(
              result.competencyResults,
              outcome.competencyResults,
            );
            return {
              ...result,
              competencyResults,
              score: computeOverall(competencyResults, source.appliedStandard.weights),
              summary: outcome.summary,
              strengths: outcome.strengths,
              concerns: outcome.concerns,
            };
          });

          const run: ScreeningRun = {
            id: newId("run"),
            departmentId: source.departmentId,
            departmentName: source.departmentName,
            ranAt: new Date().toISOString(),
            results: seatCandidates(rescored),
            appliedStandard: source.appliedStandard,
            interviewOf: { candidateId, candidateName: interview.candidateName },
          };

          return {
            runs: [run, ...s.runs],
            interviews: {
              ...s.interviews,
              [candidateId]: {
                ...interview,
                status: "finished",
                finishedAt: new Date().toISOString(),
                outcome,
              },
            },
          };
        }),

      /** Create the candidate this browser is applying as, and return their id. */
      registerApplicant: (input) => {
        const candidate: Candidate = {
          id: newId("cand"),
          name: input.name.trim() || "Unnamed applicant",
          email: input.email?.trim() || undefined,
          departmentId: input.departmentId,
          resumeText: input.resumeText,
          submittedAt: new Date().toISOString(),
        };
        set((s) => ({
          candidates: [...s.candidates, candidate],
          applicantId: candidate.id,
        }));
        return candidate.id;
      },

      signOutApplicant: () => set({ applicantId: null }),

      inviteToInterview: (candidateId) =>
        set((s) => ({
          invites: {
            ...s.invites,
            [candidateId]: { invitedAt: new Date().toISOString() },
          },
        })),

      withdrawInvite: (candidateId) =>
        set((s) => {
          const next = { ...s.invites };
          delete next[candidateId];
          return { invites: next };
        }),

      respondToInvite: (candidateId, consented) =>
        set((s) => {
          const invite = s.invites[candidateId];
          if (!invite) return {};
          const at = new Date().toISOString();
          return {
            invites: {
              ...s.invites,
              [candidateId]: consented
                ? { ...invite, consentedAt: at, declinedAt: undefined }
                : { ...invite, declinedAt: at, consentedAt: undefined },
            },
          };
        }),

      abandonInterview: (candidateId) =>
        set((s) => {
          const next = { ...s.interviews };
          delete next[candidateId];
          return { interviews: next };
        }),

      resetAll: () => set({ ...initial }),
    }),
    {
      name: "hirescope:v1",
      version: 3,
      storage: createJSONStorage(() => localStorage),
      // v3 reseeds: criteria went from a flat pass/fail list to requirements plus
      // scored competencies, so a v2 department cannot be migrated field by field
      // into the new shape — its criteria carry no definitions to score against.
      migrate: () => ({ ...initial }),
      partialize: (s) => ({
        departments: s.departments,
        activeDepartmentId: s.activeDepartmentId,
        candidates: s.candidates,
        runs: s.runs,
        interviews: s.interviews,
        applicantId: s.applicantId,
        invites: s.invites,
      }),
    },
  ),
);

/**
 * Cross-tab sync.
 *
 * HR and applicant are two people on two devices in real use. With no server
 * between them, the closest this demo can get is two tabs of one browser — which
 * only works if a write in one tab reaches the other. localStorage fires
 * `storage` in every *other* tab, so rehydrating there keeps the two views on
 * the same state. It is not a substitute for a backend: nothing here crosses
 * machines, and two tabs writing at once still race.
 */
if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.key === "hirescope:v1") void useApp.persist.rehydrate();
  });
}

/** Convenience selectors. */
export function useActiveDepartment(): Department | undefined {
  return useApp((s) => s.departments.find((d) => d.id === s.activeDepartmentId));
}
