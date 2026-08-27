"use client";

import { useEffect, useRef } from "react";
import { ScoreBar, Tag } from "./PixelUI";
import type { ScreeningResult } from "@/lib/types";

/**
 * The RPG quest-window: a candidate's full record, in the same chunky pixel
 * frame as the rest of the app. Opens as a centred modal over the room.
 */
export function CaseFile({
  result,
  onClose,
}: {
  result: ScreeningResult | null;
  onClose: () => void;
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80" onClick={onClose} aria-hidden />

      <div
        ref={ref}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="case-file-name"
        className="pixel-frame--warm pixel-frame relative max-h-[85vh] w-full max-w-2xl overflow-y-auto p-6"
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

        <div className="mb-5 flex flex-wrap items-center gap-4">
          <ScoreBar score={result.score} seated={result.seated} />
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

        <section className="mb-5">
          <h3 className="mb-2 font-pixel text-[9px] uppercase tracking-wider text-slate-200">
            Summary
          </h3>
          <p className="leading-relaxed text-slate-300">{result.summary}</p>
        </section>

        <section className="mb-5">
          <h3 className="mb-3 font-pixel text-[9px] uppercase tracking-wider text-slate-200">
            Required criteria
          </h3>
          <ul className="space-y-2">
            {result.priorityResults.map((p, i) => (
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
                  <div>
                    <p className="text-slate-200">
                      <span className="sr-only">{p.met ? "Met: " : "Not met: "}</span>
                      {p.label}
                    </p>
                    <p className="mt-1 text-slate-400">{p.reason}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {result.niceToHaveResults.length > 0 && (
          <section className="mb-5">
            <h3 className="mb-3 font-pixel text-[9px] uppercase tracking-wider text-slate-200">
              Nice to have
            </h3>
            <div className="flex flex-wrap gap-2">
              {result.niceToHaveResults.map((n, i) => (
                <Tag key={i} tone={n.met ? "pass" : "neutral"}>
                  {n.met ? "+ " : "– "}
                  {n.label}
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
