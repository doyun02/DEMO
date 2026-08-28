"use client";

import { useState } from "react";
import { EmptyState, PixelButton, PixelPanel, Tag } from "./PixelUI";
import { weightFor } from "@/lib/scoring";
import { useActiveDepartment, useApp } from "@/lib/store";
import { DEFAULT_WEIGHTS, PRIORITIES, type Priority } from "@/lib/types";

/**
 * Competencies: what gets scored, and what the score is scored *against*.
 *
 * The description / strong / weak triple is the standard itself — it is what the
 * model is given instead of a bare label, and it is the difference between
 * "score them on communication" and something a person can argue with. A
 * competency with all three blank still scores, but it scores against the
 * model's own idea of the word, which is exactly what this app exists to avoid.
 */
export function CompetencyEditor() {
  const dept = useActiveDepartment();
  const addCompetency = useApp((s) => s.addCompetency);
  const updateCompetency = useApp((s) => s.updateCompetency);
  const removeCompetency = useApp((s) => s.removeCompetency);
  const setWeights = useApp((s) => s.setWeights);
  const [draft, setDraft] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  if (!dept) {
    return (
      <PixelPanel title="Competencies">
        <EmptyState>No department selected. Pick one in the ☰ menu.</EmptyState>
      </PixelPanel>
    );
  }

  const blank = dept.competencies.filter((c) => !c.description.trim()).length;
  const weights = dept.weights ?? DEFAULT_WEIGHTS;


  return (
    <PixelPanel
      title={`Competencies — ${dept.name}`}
      subtitle={`Scored 0-10 each. Priority sets the weight, currently ${weights.high} / ${weights.medium} / ${weights.low}. Nobody is disqualified by a competency — they rank lower.`}
    >
      {/* Weights first: they change what every score below is worth. */}
      <div className="mb-6 border-2 border-ink-600 p-4">
        <p className="font-pixel text-[9px] uppercase tracking-wider text-slate-200">
          What each priority is worth here
        </p>
        <p className="mt-2 text-slate-400">
          Departments do not agree on this. A steep curve says one competency carries the role;
          a flat one says you are hiring for all-round strength.
        </p>
        <div className="mt-4 flex flex-wrap items-end gap-4">
          {PRIORITIES.map((p) => (
            <div key={p}>
              <label
                htmlFor={`weight-${p}`}
                className="mb-1 block font-pixel text-[8px] uppercase tracking-wider text-slate-400"
              >
                {p}
              </label>
              <input
                id={`weight-${p}`}
                type="number"
                min={0}
                max={10}
                value={weights[p]}
                onChange={(e) =>
                  setWeights(dept.id, { ...weights, [p]: Number(e.target.value) })
                }
                className="pixel-input w-20 px-3 py-2"
              />
            </div>
          ))}
          <button
            onClick={() => setWeights(dept.id, DEFAULT_WEIGHTS)}
            className="pixel-btn px-3 py-2 font-pixel text-[9px] uppercase tracking-wider"
          >
            Reset to 3 / 2 / 1
          </button>
        </div>
        <p className="mt-3 text-slate-400">
          A weight of 0 keeps a competency in the report and out of the score. Changing these
          does not touch scores already recorded — each run keeps the weights it was scored
          under.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!draft.trim()) return;
          addCompetency(dept.id, draft);
          setDraft("");
        }}
        className="mb-6 flex flex-wrap gap-3"
      >
        <label htmlFor="new-competency" className="sr-only">
          New competency
        </label>
        <input
          id="new-competency"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="e.g. System design"
          className="pixel-input min-w-0 flex-1 px-3 py-3"
        />
        <PixelButton type="submit" variant="primary">
          Add
        </PixelButton>
      </form>

      {blank > 0 && (
        <p className="mb-4 border-2 border-verdict-hold p-3 text-verdict-hold">
          {blank} competenc{blank === 1 ? "y has" : "ies have"} no definition. They will still be
          scored — against the model&apos;s idea of the word rather than yours.
        </p>
      )}

      {dept.competencies.length === 0 ? (
        <EmptyState>
          No competencies. Every eligible candidate scores zero and the room fills by name order.
        </EmptyState>
      ) : (
        <ul className="space-y-3">
          {dept.competencies.map((c) => {
            const open = openId === c.id;
            return (
              <li key={c.id} className="border-2 border-ink-600">
                <div className="flex flex-wrap items-center gap-3 p-3">
                  <button
                    onClick={() => setOpenId(open ? null : c.id)}
                    aria-expanded={open}
                    className="pixel-btn px-3 py-2 font-pixel text-[9px]"
                  >
                    {open ? "−" : "+"}
                  </button>
                  <label htmlFor={`comp-${c.id}`} className="sr-only">
                    Competency name
                  </label>
                  <input
                    id={`comp-${c.id}`}
                    value={c.label}
                    onChange={(e) => updateCompetency(dept.id, c.id, { label: e.target.value })}
                    className="pixel-input min-w-0 flex-1 px-3 py-2"
                  />
                  <label htmlFor={`prio-${c.id}`} className="sr-only">
                    Priority
                  </label>
                  <select
                    id={`prio-${c.id}`}
                    value={c.priority}
                    onChange={(e) =>
                      updateCompetency(dept.id, c.id, { priority: e.target.value as Priority })
                    }
                    className="pixel-input px-3 py-2"
                  >
                    {PRIORITIES.map((p) => (
                      <option key={p} value={p}>
                        {p} (×{weightFor(p, weights)})
                      </option>
                    ))}
                  </select>
                  <PixelButton
                    variant="danger"
                    onClick={() => removeCompetency(dept.id, c.id)}
                    ariaLabel={`Delete competency: ${c.label}`}
                  >
                    Del
                  </PixelButton>
                </div>

                {open && (
                  <div className="space-y-4 border-t-2 border-ink-600 p-4">
                    <Field
                      id={`desc-${c.id}`}
                      label="What it means"
                      hint="One or two sentences on what this covers for this role specifically."
                      value={c.description}
                      onChange={(v) => updateCompetency(dept.id, c.id, { description: v })}
                    />
                    <Field
                      id={`strong-${c.id}`}
                      label="A strong answer"
                      hint="Concrete behaviours. Name what they do, not what they are."
                      value={c.strongAnswer}
                      onChange={(v) => updateCompetency(dept.id, c.id, { strongAnswer: v })}
                    />
                    <Field
                      id={`weak-${c.id}`}
                      label="A weak answer"
                      hint="This half matters as much as the one above — without it, scoring drifts toward flattery."
                      value={c.weakAnswer}
                      onChange={(v) => updateCompetency(dept.id, c.id, { weakAnswer: v })}
                    />
                    <p className="text-slate-400">
                      key: <span className="text-slate-300">{c.key}</span> — scores are traced to
                      this, so it stays put when you rename the label.
                    </p>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-2 border-t-2 border-ink-600 pt-4">
        <Tag>{dept.competencies.length} competencies</Tag>
        <Tag>
          total weight {dept.competencies.reduce((sum, c) => sum + weightFor(c.priority, weights), 0)}
        </Tag>
      </div>
    </PixelPanel>
  );
}

function Field({
  id,
  label,
  hint,
  value,
  onChange,
}: {
  id: string;
  label: string;
  hint: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1 block font-pixel text-[8px] uppercase tracking-wider text-slate-400"
      >
        {label}
      </label>
      <p className="mb-2 text-slate-400">{hint}</p>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="pixel-input w-full px-3 py-2 leading-relaxed"
      />
    </div>
  );
}
