"use client";

import { useMemo, useState } from "react";
import { CaseFile } from "./CaseFile";
import { EmptyState, PixelButton, PixelPanel, ScoreBar, Tag } from "./PixelUI";
import { useApp } from "@/lib/store";
import type { ScreeningResult } from "@/lib/types";

type Filter = "all" | "seated" | "rank" | "requirement" | "errored";

const FILTERS: Array<{ id: Filter; label: string }> = [
  { id: "all", label: "All" },
  { id: "seated", label: "Seated" },
  { id: "rank", label: "Below top 5" },
  { id: "requirement", label: "Missed a requirement" },
  { id: "errored", label: "Flagged" },
];

export function RecordsPanel() {
  const runs = useApp((s) => s.runs);
  const clearRuns = useApp((s) => s.clearRuns);
  const [filter, setFilter] = useState<Filter>("all");
  const [open, setOpen] = useState<ScreeningResult | null>(null);

  const rows = useMemo(
    () =>
      runs.flatMap((run) =>
        run.results.map((r) => ({ run, result: r })).filter(({ result }) => {
          if (filter === "all") return true;
          if (filter === "seated") return result.seated;
          if (filter === "errored") return Boolean(result.errored);
          return !result.seated && result.notSeatedReason === filter;
        }),
      ),
    [runs, filter],
  );

  function exportJSON() {
    const blob = new Blob([JSON.stringify({ exportedAt: new Date().toISOString(), runs }, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hirescope-records-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <PixelPanel
        title="Records"
        subtitle="Every candidate ever screened, with the score, the reasoning, and why they were or weren't seated. Nothing here is deleted by a screening run."
        actions={
          <div className="flex flex-wrap gap-2">
            <PixelButton onClick={exportJSON} disabled={runs.length === 0}>
              Export JSON
            </PixelButton>
            <PixelButton
              variant="danger"
              onClick={() => {
                if (confirm("Delete every stored record? This cannot be undone.")) clearRuns();
              }}
              disabled={runs.length === 0}
            >
              Clear
            </PixelButton>
          </div>
        }
      >
        <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label="Filter records">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              aria-pressed={filter === f.id}
              className={`border-2 px-3 py-2 text-[14px] uppercase tracking-wide ${
                filter === f.id
                  ? "border-brass-500 text-brass-100"
                  : "border-ink-600 text-slate-400 hover:border-ink-500"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {rows.length === 0 ? (
          <EmptyState>
            {runs.length === 0
              ? "No screening has been run yet. The record starts the moment one is."
              : "No records match this filter."}
          </EmptyState>
        ) : (
          <ul className="space-y-3">
            {rows.map(({ run, result }, i) => (
              <li key={`${run.id}-${result.candidateId}-${i}`}>
                <button
                  onClick={() => setOpen(result)}
                  className="w-full border-2 border-ink-600 p-4 text-left hover:border-ink-500 hover:bg-ink-700"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-pixel text-[10px] text-brass-100">{result.candidateName}</p>
                      <p className="mt-2 text-slate-400">
                        {run.departmentName} · {new Date(result.screenedAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <ScoreBar score={result.score} seated={result.seated} />
                      {run.sample && <Tag>Sample</Tag>}
                      {result.errored ? (
                        <Tag tone="fail">Flagged</Tag>
                      ) : result.seated ? (
                        <Tag tone="seated">Seated</Tag>
                      ) : (
                        <Tag tone={result.notSeatedReason === "rank" ? "hold" : "fail"}>
                          {result.notSeatedReason === "rank" ? "Below top 5" : "Missed requirement"}
                        </Tag>
                      )}
                    </div>
                  </div>
                  <p className="mt-3 line-clamp-2 text-slate-300">{result.summary}</p>
                </button>
              </li>
            ))}
          </ul>
        )}

        <p className="mt-6 border-t-2 border-ink-600 pt-4 text-slate-400">
          {rows.length} record{rows.length === 1 ? "" : "s"} shown · {runs.length} screening run
          {runs.length === 1 ? "" : "s"} kept · stored in this browser
          {runs.some((r) => r.sample) &&
            " · runs tagged Sample ship with the app as examples; they are not judgments the AI made"}
        </p>
      </PixelPanel>

      <CaseFile result={open} onClose={() => setOpen(null)} />
    </>
  );
}
