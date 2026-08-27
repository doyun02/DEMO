"use client";

import { useState } from "react";
import { CriteriaEditor } from "@/components/CriteriaEditor";
import { PixelButton, PixelPanel } from "@/components/PixelUI";
import { useApp } from "@/lib/store";

export default function PriorityCriteriaPage() {
  const departments = useApp((s) => s.departments);
  const activeId = useApp((s) => s.activeDepartmentId);
  const addDepartment = useApp((s) => s.addDepartment);
  const renameDepartment = useApp((s) => s.renameDepartment);
  const removeDepartment = useApp((s) => s.removeDepartment);
  const [draft, setDraft] = useState("");

  const active = departments.find((d) => d.id === activeId);

  return (
    <div className="space-y-8">
      <CriteriaEditor
        kind="priorityCriteria"
        title="Priority criteria"
        subtitle="Hard requirements. Every one must be met for a candidate to be seatable."
        placeholder="e.g. 3+ years of production backend experience"
      />

      <PixelPanel title="Departments" subtitle="Each department carries its own criteria and queue.">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!draft.trim()) return;
            addDepartment(draft);
            setDraft("");
          }}
          className="mb-5 flex flex-wrap gap-3"
        >
          <label htmlFor="new-dept" className="sr-only">
            New department name
          </label>
          <input
            id="new-dept"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="e.g. Product Designer"
            className="pixel-input min-w-0 flex-1 px-3 py-3"
          />
          <PixelButton type="submit">Add department</PixelButton>
        </form>

        <ul className="space-y-3">
          {departments.map((d) => (
            <li key={d.id} className="flex flex-wrap items-center gap-3 border-2 border-ink-600 p-3">
              <label htmlFor={`dept-${d.id}`} className="sr-only">
                Department name
              </label>
              <input
                id={`dept-${d.id}`}
                value={d.name}
                onChange={(e) => renameDepartment(d.id, e.target.value)}
                className="pixel-input min-w-0 flex-1 px-3 py-2"
              />
              {d.id === active?.id && (
                <span className="font-pixel text-[8px] uppercase text-brass-500">active</span>
              )}
              <PixelButton
                variant="danger"
                ariaLabel={`Delete department ${d.name}`}
                onClick={() => {
                  if (confirm(`Delete "${d.name}" and its queued candidates?`)) removeDepartment(d.id);
                }}
              >
                Del
              </PixelButton>
            </li>
          ))}
        </ul>
      </PixelPanel>
    </div>
  );
}
