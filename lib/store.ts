"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { newId } from "./id";
import { ROLE_LIBRARY } from "./sample/roleLibrary";
import { SAMPLE_CANDIDATES, SAMPLE_DEPARTMENTS, SAMPLE_RUNS } from "./sampleData";
import type {
  Candidate,
  Competency,
  Department,
  Priority,
  Requirement,
  RoleTemplate,
  ScreeningRun,
} from "./types";

type AppState = {
  departments: Department[];
  activeDepartmentId: string;
  candidates: Candidate[];
  runs: ScreeningRun[];
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

  resetAll: () => void;
};

const initial = {
  departments: SAMPLE_DEPARTMENTS,
  activeDepartmentId: SAMPLE_DEPARTMENTS[0].id,
  candidates: SAMPLE_CANDIDATES,
  runs: SAMPLE_RUNS as ScreeningRun[],
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

      clearRuns: () => set({ runs: [], selectedCandidateId: null }),

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
      }),
    },
  ),
);

/** Convenience selectors. */
export function useActiveDepartment(): Department | undefined {
  return useApp((s) => s.departments.find((d) => d.id === s.activeDepartmentId));
}
