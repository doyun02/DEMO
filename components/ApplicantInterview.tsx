"use client";

import { useEffect, useRef } from "react";
import { Tag } from "./PixelUI";
import { useApp } from "@/lib/store";

/**
 * The applicant's side of a live interview.
 *
 * Read-only by design: the interviewer types the notes, so this shows the
 * questions as they are asked and what was written down. An applicant who cannot
 * see what was recorded about them has no way to correct it, and correcting it
 * on the spot is worth more than any appeal afterwards.
 */
export function ApplicantInterview({ candidateId }: { candidateId: string }) {
  const interview = useApp((s) => s.interviews[candidateId]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [interview?.turns.length]);

  if (!interview) return null;

  const turns = interview.turns;
  const asked = turns.filter((t) => t.role === "interviewer").length;
  const current = turns.at(-1);
  const waitingOnNotes = current?.role === "interviewer";

  return (
    <section className="pixel-frame--warm pixel-frame mt-6 p-5">
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b-2 border-ink-600 pb-3">
        <h2 className="font-pixel text-[11px] text-brass-100">Interview under way</h2>
        <Tag>
          question {Math.min(asked, interview.budget)} of {interview.budget}
        </Tag>
      </header>

      {turns.length === 0 ? (
        <p className="text-slate-400">The interviewer is choosing where to start…</p>
      ) : (
        <div ref={scrollRef} className="max-h-80 space-y-3 overflow-y-auto pr-1">
          {turns.map((t, i) => (
            <div
              key={i}
              className={
                t.role === "interviewer"
                  ? "border-l-4 border-brass-600 bg-ink-800 p-3"
                  : "border-l-4 border-ink-500 bg-ink-900 p-3"
              }
            >
              <p className="mb-1 font-pixel text-[8px] uppercase tracking-wider text-slate-400">
                {t.role === "interviewer" ? "Asked" : "Written down as your answer"}
              </p>
              <p className="leading-relaxed text-slate-200">{t.text}</p>
            </div>
          ))}
        </div>
      )}

      <p className="mt-4 border-t-2 border-ink-600 pt-4 text-slate-400">
        {waitingOnNotes
          ? "Answer out loud. The interviewer is writing down what you say — if a note does not match what you meant, say so now."
          : "Waiting for the next question."}
      </p>
    </section>
  );
}
