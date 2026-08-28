"use client";

import { useState } from "react";
import { PixelButton, PixelPanel, Tag } from "@/components/PixelUI";
import { RequirementsEditor } from "@/components/RequirementsEditor";
import { ROLE_LIBRARY } from "@/lib/sample/roleLibrary";
import { useApp } from "@/lib/store";

export default function RequirementsPage() {
  const departments = useApp((s) => s.departments);
  const activeId = useApp((s) => s.activeDepartmentId);
  const addDepartment = useApp((s) => s.addDepartment);
  const addDepartmentFromTemplate = useApp((s) => s.addDepartmentFromTemplate);
  const renameDepartment = useApp((s) => s.renameDepartment);
  const removeDepartment = useApp((s) => s.removeDepartment);
  const [draft, setDraft] = useState("");
  const [templateSlug, setTemplateSlug] = useState(ROLE_LIBRARY[0]?.slug ?? "");

  const active = departments.find((d) => d.id === activeId);
  const template = ROLE_LIBRARY.find((r) => r.slug === templateSlug);

  return (
    <div className="space-y-8">
      <RequirementsEditor />

      <PixelPanel
        title="New department from a role"
        subtitle="The role library carries a written standard per role — what each competency means, what a strong answer looks like, what a weak one looks like."
      >
        <div className="flex flex-wrap gap-3">
          <label htmlFor="role-template" className="sr-only">
            Role
          </label>
          <select
            id="role-template"
            value={templateSlug}
            onChange={(e) => setTemplateSlug(e.target.value)}
            className="pixel-input min-w-0 flex-1 px-3 py-3"
          >
            {ROLE_LIBRARY.map((r) => (
              <option key={r.slug} value={r.slug}>
                {r.title} · {r.sector}
              </option>
            ))}
          </select>
          <PixelButton variant="primary" onClick={() => addDepartmentFromTemplate(templateSlug)}>
            Create
          </PixelButton>
        </div>

        {template && (
          <div className="mt-5">
            <p className="mb-3 text-slate-400">
              {template.competencies.length} competencies, ready to edit once created. Requirements
              stay empty — a hard gate is your policy, not the role&apos;s.
            </p>
            <ul className="space-y-2">
              {template.competencies.map((c) => (
                <li key={c.key} className="border-2 border-ink-600 p-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-slate-200">{c.label}</span>
                    <Tag tone={c.priority === "high" ? "seated" : "neutral"}>{c.priority}</Tag>
                  </div>
                  <p className="mt-2 text-slate-400">{c.description}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </PixelPanel>

      <PixelPanel title="Departments" subtitle="Each department carries its own standard and queue.">
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
            placeholder="Or start blank — e.g. Product Designer"
            className="pixel-input min-w-0 flex-1 px-3 py-3"
          />
          <PixelButton type="submit">Add blank</PixelButton>
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
              <span className="text-slate-400">
                {d.requirements.length}R · {d.competencies.length}C
              </span>
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
