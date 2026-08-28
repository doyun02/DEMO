"use client";

import { useState } from "react";
import { EmptyState, PixelButton, PixelPanel } from "./PixelUI";
import { useActiveDepartment, useApp } from "@/lib/store";

/**
 * Requirements: the hard gate. Pass/fail, and one miss disqualifies whatever the
 * score says — so this panel deliberately stays a plain list. A requirement that
 * needed a paragraph to explain is a competency, not a gate.
 */
export function RequirementsEditor() {
  const dept = useActiveDepartment();
  const addRequirement = useApp((s) => s.addRequirement);
  const updateRequirement = useApp((s) => s.updateRequirement);
  const removeRequirement = useApp((s) => s.removeRequirement);
  const [draft, setDraft] = useState("");

  if (!dept) {
    return (
      <PixelPanel title="Requirements">
        <EmptyState>No department selected. Pick one in the ☰ menu.</EmptyState>
      </PixelPanel>
    );
  }

  return (
    <PixelPanel
      title={`Requirements — ${dept.name}`}
      subtitle="Hard gates. Every one must be met for a candidate to be seatable, however well they score."
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!draft.trim()) return;
          addRequirement(dept.id, draft);
          setDraft("");
        }}
        className="mb-6 flex flex-wrap gap-3"
      >
        <label htmlFor="new-requirement" className="sr-only">
          New requirement
        </label>
        <input
          id="new-requirement"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="e.g. 3+ years of production backend experience"
          className="pixel-input min-w-0 flex-1 px-3 py-3"
        />
        <PixelButton type="submit" variant="primary">
          Add
        </PixelButton>
      </form>

      {dept.requirements.length === 0 ? (
        <EmptyState>
          No requirements. Every candidate is eligible, and the competency score alone decides
          the room.
        </EmptyState>
      ) : (
        <ul className="space-y-3">
          {dept.requirements.map((r, i) => (
            <li key={r.id} className="flex flex-wrap items-center gap-3 border-2 border-ink-600 p-3">
              <span aria-hidden className="font-pixel text-[9px] text-brass-500">
                {String(i + 1).padStart(2, "0")}
              </span>
              <label htmlFor={`req-${r.id}`} className="sr-only">
                Requirement {i + 1}
              </label>
              <input
                id={`req-${r.id}`}
                value={r.label}
                onChange={(e) => updateRequirement(dept.id, r.id, e.target.value)}
                className="pixel-input min-w-0 flex-1 px-3 py-2"
              />
              <PixelButton
                variant="danger"
                onClick={() => removeRequirement(dept.id, r.id)}
                ariaLabel={`Delete requirement: ${r.label}`}
              >
                Del
              </PixelButton>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-6 border-t-2 border-ink-600 pt-4 text-slate-400">
        Failing one of these is enough to keep a seat empty — but the record still says which
        one, why, and whether the resume argued against it or simply never mentioned it.
      </p>
    </PixelPanel>
  );
}
