"use client";

import { useState } from "react";
import { EmptyState, PixelButton, PixelPanel } from "./PixelUI";
import { useActiveDepartment, useApp } from "@/lib/store";

export function CriteriaEditor({
  kind,
  title,
  subtitle,
  placeholder,
}: {
  kind: "priorityCriteria" | "niceToHave";
  title: string;
  subtitle: string;
  placeholder: string;
}) {
  const dept = useActiveDepartment();
  const addCriterion = useApp((s) => s.addCriterion);
  const updateCriterion = useApp((s) => s.updateCriterion);
  const removeCriterion = useApp((s) => s.removeCriterion);
  const [draft, setDraft] = useState("");

  if (!dept) {
    return (
      <PixelPanel title={title}>
        <EmptyState>No department selected. Pick one in the ☰ menu.</EmptyState>
      </PixelPanel>
    );
  }

  const list = dept[kind];

  return (
    <PixelPanel title={`${title} — ${dept.name}`} subtitle={subtitle}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!draft.trim()) return;
          addCriterion(dept.id, kind, draft);
          setDraft("");
        }}
        className="mb-6 flex flex-wrap gap-3"
      >
        <label htmlFor={`new-${kind}`} className="sr-only">
          New criterion
        </label>
        <input
          id={`new-${kind}`}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={placeholder}
          className="pixel-input min-w-0 flex-1 px-3 py-3"
        />
        <PixelButton type="submit" variant="primary">
          Add
        </PixelButton>
      </form>

      {list.length === 0 ? (
        <EmptyState>
          {kind === "priorityCriteria"
            ? "No required criteria yet. Screening needs at least one."
            : "No nice-to-haves yet. These add colour to a case file but never disqualify."}
        </EmptyState>
      ) : (
        <ul className="space-y-3">
          {list.map((c, i) => (
            <li key={c.id} className="flex flex-wrap items-center gap-3 border-2 border-ink-600 p-3">
              <span
                aria-hidden
                className="font-pixel text-[9px] text-brass-500"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <label htmlFor={`crit-${c.id}`} className="sr-only">
                Criterion {i + 1}
              </label>
              <input
                id={`crit-${c.id}`}
                value={c.label}
                onChange={(e) => updateCriterion(dept.id, kind, c.id, e.target.value)}
                className="pixel-input min-w-0 flex-1 px-3 py-2"
              />
              <PixelButton
                variant="danger"
                onClick={() => removeCriterion(dept.id, kind, c.id)}
                ariaLabel={`Delete criterion: ${c.label}`}
              >
                Del
              </PixelButton>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-6 border-t-2 border-ink-600 pt-4 text-slate-400">
        {kind === "priorityCriteria"
          ? "A candidate passes only if every one of these is met. Failing one is enough to keep a seat empty — but the record still says which one, and why."
          : "These never keep anyone out. They break ties in the case file and show up as tags."}
      </p>
    </PixelPanel>
  );
}
