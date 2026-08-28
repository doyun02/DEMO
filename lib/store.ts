"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { newId } from "./id";
import { SAMPLE_CANDIDATES, SAMPLE_DEPARTMENTS, SAMPLE_RUNS } from "./sampleData";
import type {
  Candidate,
  Criterion,
  Department,
  ScreeningRun,
} from "./types";

type CriteriaKind = "priorityCriteria" | "niceToHave";

type AppState = {
  departments: Department[];
  activeDepartmentId: string;
  candidates: Candidate[];
  runs: ScreeningRun[];
  selectedCandidateId: string | null;
  screening: { running: boolean; done: number; total: number; error?: string };

  setActiveDepartment: (id: string) => void;
  addDepartment: (name: string) => void;
  renameDepartment: (id: string, name: string) => void;
  removeDepartment: (id: string) => void;

  addCriterion: (departmentId: string, kind: CriteriaKind, label: string) => void;
  updateCriterion: (departmentId: string, kind: CriteriaKind, id: string, label: string) => void;
  removeCriterion: (departmentId: string, kind: CriteriaKind, id: string) => void;

  addCandidate: (input: { name: string; departmentId: string; resumeText: string; sourceFileName?: string }) => void;
  removeCandidate: (id: string) => void;

  selectCandidate: (id: string | null) => void;
  setScreening: (patch: Partial<AppState["screening"]>) => void;
  addRun: (run: ScreeningRun) => void;
  clearRuns: () => void;

  loadSampleData: () => void;
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

export const useApp = create<AppState>()(
  persist(
    (set, get) => ({
      ...initial,

      setActiveDepartment: (id) => set({ activeDepartmentId: id, selectedCandidateId: null }),

      addDepartment: (name) => {
        const dept: Department = {
          id: newId("dept"),
          name: name.trim() || "Untitled department",
          priorityCriteria: [],
          niceToHave: [],
        };
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

      addCriterion: (departmentId, kind, label) =>
        set((s) => ({
          departments: s.departments.map((d) =>
            d.id === departmentId
              ? { ...d, [kind]: [...d[kind], { id: newId("crit"), label: label.trim() }] }
              : d,
          ),
        })),

      updateCriterion: (departmentId, kind, id, label) =>
        set((s) => ({
          departments: s.departments.map((d) =>
            d.id === departmentId
              ? {
                  ...d,
                  [kind]: d[kind].map((c: Criterion) => (c.id === id ? { ...c, label } : c)),
                }
              : d,
          ),
        })),

      removeCriterion: (departmentId, kind, id) =>
        set((s) => ({
          departments: s.departments.map((d) =>
            d.id === departmentId ? { ...d, [kind]: d[kind].filter((c: Criterion) => c.id !== id) } : d,
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

      loadSampleData: () => {
        const s = get();
        const haveIds = new Set(s.departments.map((d) => d.id));
        const departments = [
          ...s.departments,
          ...SAMPLE_DEPARTMENTS.filter((d) => !haveIds.has(d.id)),
        ];
        const haveCand = new Set(s.candidates.map((c) => c.id));
        set({
          departments,
          candidates: [...s.candidates, ...SAMPLE_CANDIDATES.filter((c) => !haveCand.has(c.id))],
          activeDepartmentId: s.activeDepartmentId || departments[0]?.id || "",
        });
      },

      resetAll: () => set({ ...initial }),
    }),
    {
      name: "judgment-track:v1",
      version: 2,
      storage: createJSONStorage(() => localStorage),
      // v2 reseeds: the sample set went from one department to three, with a
      // screened run each. Anything a visitor added under v1 is not worth
      // migrating field by field, and the seeded runs are examples, not records
      // of real judgments.
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

export function useLatestRun(): ScreeningRun | undefined {
  return useApp((s) => s.runs.find((r) => r.departmentId === s.activeDepartmentId));
}
