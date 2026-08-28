"use client";

import { useEffect, useRef } from "react";
import { CompetencyBar, PixelButton, ScoreBar, Tag } from "./PixelUI";
import { SkillRadar } from "./SkillRadar";
import { explainOverall, weightFor } from "@/lib/scoring";
import type { ScreeningResult } from "@/lib/types";

/**
 * The RPG quest-window: a candidate's full record, in the same chunky pixel
 * frame as the rest of the app. Opens as a centred modal over the room.
 */
export function CaseFile({
  result,
  onClose,
  onStartInterview,
  interviewed,
}: {
  result: ScreeningResult | null;
  onClose: () => void;
  /** Omitted where an interview makes no sense — a Records row, say. */
  onStartInterview?: (result: ScreeningResult) => void;
  interviewed?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!result) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    ref.current?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [result, onClose]);

  if (!result) return null;

  const failed = result.requirementResults.filter((r) => !r.met);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80" onClick={onClose} aria-hidden />

      <div
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="case-file-name"
        className="pixel-frame--warm pixel-frame relative max-h-[85vh] w-full max-w-3xl overflow-y-auto p-6"
      >
        <div className="mb-5 flex items-start justify-between gap-4 border-b-2 border-ink-600 pb-4">
          <div>
            <p className="font-pixel text-[8px] uppercase tracking-widest text-slate-400">
              Case file
            </p>
            <h2 id="case-file-name" className="mt-2 font-pixel text-[13px] text-brass-100">
              {result.candidateName}
            </h2>
            <p className="mt-2 text-slate-400">
              Screened {new Date(result.screenedAt).toLocaleString()}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close case file"
            className="pixel-btn px-3 py-2 font-pixel text-[10px]"
          >
            ✕
          </button>
        </div>

        {onStartInterview && (
          <div className="mb-5 flex flex-wrap items-center gap-3 border-2 border-brass-700 p-3">
            <PixelButton variant="primary" onClick={() => onStartInterview(result)}>
              {interviewed ? "Interview again" : "Interview in the room"}
            </PixelButton>
            <p className="min-w-0 flex-1 text-slate-400">
              {interviewed
                ? "This candidate has already been interviewed. Their scores below carry that evidence."
                : "The AI proposes each question; you ask it and type back what they said. Finishing rescores them and re-seats the room."}
            </p>
          </div>
        )}

        {/* Score and verdict, with the arithmetic stated rather than implied. */}
        <div className="mb-6 grid gap-5 sm:grid-cols-[1fr_220px]">
          <div>
            <div className="flex flex-wrap items-center gap-4">
              <ScoreBar score={result.score.overall} seated={result.seated} />
              {result.seated ? (
                <Tag tone="seated">Seated</Tag>
              ) : (
                <Tag tone={result.notSeatedReason === "rank" ? "hold" : "fail"}>
                  {result.notSeatedReason === "rank"
                    ? "Passed — ranked below top 5"
                    : "Missed a requirement"}
                </Tag>
              )}
              {result.errored && <Tag tone="fail">Flagged — screening error</Tag>}
            </div>
            <p className="mt-3 max-w-prose text-slate-400">{explainOverall(result.score)}</p>
            {failed.length > 0 && (
              <p className="mt-2 max-w-prose text-verdict-fail">
                The score did not decide this one. {failed.length} requirement
                {failed.length === 1 ? "" : "s"} went unmet, and a requirement is a gate.
              </p>
            )}
          </div>
          <SkillRadar competencies={result.competencyResults} seated={result.seated} />
        </div>

        <section className="mb-6">
          <h3 className="mb-2 font-pixel text-[9px] uppercase tracking-wider text-slate-200">
            Summary
          </h3>
          <p className="leading-relaxed text-slate-300">{result.summary}</p>
        </section>

        <section className="mb-6">
          <h3 className="mb-3 font-pixel text-[9px] uppercase tracking-wider text-slate-200">
            Requirements — all must pass
          </h3>
          <ul className="space-y-2">
            {result.requirementResults.map((p, i) => (
              <li key={i} className="border-2 border-ink-600 bg-ink-900 p-3">
                <div className="flex items-start gap-3">
                  <span
                    aria-hidden
                    className={`mt-[2px] font-pixel text-[11px] ${
                      p.met ? "text-verdict-pass" : "text-verdict-fail"
                    }`}
                  >
                    {p.met ? "✔" : "✘"}
                  </span>
                  <div className="min-w-0">
                    <p className="text-slate-200">
                      <span className="sr-only">{p.met ? "Met: " : "Not met: "}</span>
                      {p.label}
                    </p>
                    <p className="mt-1 text-slate-400">{p.reason}</p>
                    {p.evidence ? (
                      <blockquote className="mt-2 border-l-2 border-ink-500 pl-3 text-slate-300">
                        “{p.evidence}”
                      </blockquote>
                    ) : (
                      <p className="mt-2 text-verdict-hold">
                        The resume is silent on this — it did not say no, it said nothing.
                      </p>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-6">
          <h3 className="mb-1 font-pixel text-[9px] uppercase tracking-wider text-slate-200">
            Competencies — scored 0-10
          </h3>
          <p className="mb-3 text-slate-400">
            Weight follows priority: high 3, medium 2, low 1.
          </p>
          <ul className="space-y-2">
            {result.competencyResults.map((c) => (
              <li
                key={c.key}
                className={`border-2 p-3 ${
                  c.reached ? "border-ink-600 bg-ink-900" : "border-dashed border-ink-600"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-slate-200">{c.label}</span>
                    <span className="text-slate-400">
                      ×{weightFor(c.priority)} {c.priority}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CompetencyBar score={c.score} reached={c.reached} />
                    <span className="w-16 text-right font-pixel text-[9px] text-brass-100">
                      {c.reached ? `${c.score}/10` : "—"}
                    </span>
                  </div>
                </div>
                <p className="mt-2 text-slate-400">
                  {c.note}
                  {c.reached && <span className="ml-2 text-slate-500">confidence: {c.confidence}</span>}
                </p>
                {c.reached && c.evidence && (
                  <blockquote className="mt-2 border-l-2 border-ink-500 pl-3 text-slate-300">
                    “{c.evidence}”
                  </blockquote>
                )}
              </li>
            ))}
          </ul>
        </section>

        {result.tags.length > 0 && (
          <section className="mb-6">
            <h3 className="mb-1 font-pixel text-[9px] uppercase tracking-wider text-slate-200">
              Skills
            </h3>
            <p className="mb-3 text-slate-400">
              What the resume shows, as opposed to what it asserts.
            </p>
            <div className="flex flex-wrap gap-2">
              {result.tags.map((t, i) => (
                <Tag
                  key={i}
                  tone={
                    t.status === "demonstrated"
                      ? "pass"
                      : t.status === "contradicted"
                        ? "fail"
                        : "neutral"
                  }
                >
                  {t.status === "demonstrated" ? "✔ " : t.status === "contradicted" ? "✘ " : "· "}
                  {t.label}
                </Tag>
              ))}
            </div>
          </section>
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          <section>
            <h3 className="mb-2 font-pixel text-[9px] uppercase tracking-wider text-verdict-pass">
              Strengths
            </h3>
            <ul className="space-y-1 text-slate-300">
              {result.strengths.length ? (
                result.strengths.map((s, i) => <li key={i}>▸ {s}</li>)
              ) : (
                <li className="text-slate-400">None recorded.</li>
              )}
            </ul>
          </section>
          <section>
            <h3 className="mb-2 font-pixel text-[9px] uppercase tracking-wider text-verdict-fail">
              Concerns
            </h3>
            <ul className="space-y-1 text-slate-300">
              {result.concerns.length ? (
                result.concerns.map((c, i) => <li key={i}>▸ {c}</li>)
              ) : (
                <li className="text-slate-400">None recorded.</li>
              )}
            </ul>
          </section>
        </div>

        <p className="mt-6 border-t-2 border-ink-600 pt-4 text-slate-400">
          The AI scored and reasoned. The call is yours — and this record stays either way.
        </p>
      </div>
    </div>
  );
}
