"use client";

import { useEffect, useRef, useState } from "react";
import { PixelButton, Tag } from "./PixelUI";
import { computeCoverage, questionsAsked } from "@/lib/interview/coverage";
import type {
  FinishRequestBody,
  FinishResponseBody,
  TurnRequestBody,
  TurnResponseBody,
} from "@/lib/interview/types";
import { useApp } from "@/lib/store";
import type { Candidate, Department, ScreeningResult } from "@/lib/types";

/**
 * The interview, run from the interviewer's side of the desk.
 *
 * The AI does not talk to the candidate. It hands over the next question; the
 * interviewer asks it out loud and types back what the candidate said. So the
 * text in this panel is the interviewer's notes, and everything downstream says
 * so — a quote from an interview here is a quote of what someone wrote down.
 */
export function InterviewPanel({
  candidate,
  department,
  screening,
  onClose,
}: {
  candidate: Candidate;
  department: Department;
  screening: ScreeningResult;
  onClose: () => void;
}) {
  const interview = useApp((s) => s.interviews[candidate.id]);
  const startInterview = useApp((s) => s.startInterview);
  const appendTurn = useApp((s) => s.appendInterviewTurn);
  const recordAppraisal = useApp((s) => s.recordAppraisal);
  const applyInterview = useApp((s) => s.applyInterview);
  const abandonInterview = useApp((s) => s.abandonInterview);

  const [answer, setAnswer] = useState("");
  const [busy, setBusy] = useState<"question" | "finish" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [closing, setClosing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const askedFirst = useRef(false);

  const turns = interview?.turns ?? [];
  const asked = questionsAsked(turns);
  const budget = interview?.budget ?? 0;
  const lastTurn = turns.at(-1);
  const awaitingAnswer = lastTurn?.role === "interviewer";
  const lastAppraisal = interview?.appraisals.at(-1);

  useEffect(() => {
    if (!interview) startInterview(candidate.id);
  }, [interview, candidate.id, startInterview]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [turns.length, busy]);

  function requestBody(): TurnRequestBody {
    return {
      candidateName: candidate.name,
      resumeText: candidate.resumeText,
      competencies: department.competencies.map((c) => ({
        key: c.key,
        label: c.label,
        priority: c.priority,
        description: c.description,
        strongAnswer: c.strongAnswer,
        weakAnswer: c.weakAnswer,
      })),
      screening: {
        summary: screening.summary,
        concerns: screening.concerns,
        competencyResults: screening.competencyResults,
      },
      turns,
      coverage: computeCoverage(department.competencies, screening, turns),
      budget: interview?.budget ?? 0,
    };
  }

  async function nextQuestion(answerText?: string) {
    setBusy("question");
    setError(null);
    try {
      const body = requestBody();
      if (answerText) {
        // Send the answer along with the turns it belongs after — the store
        // update has not landed in this closure yet.
        body.turns = [
          ...turns,
          {
            role: "candidate" as const,
            text: answerText,
            competencyKey: lastTurn?.competencyKey ?? "",
            at: new Date().toISOString(),
          },
        ];
        body.coverage = computeCoverage(department.competencies, screening, body.turns);
      }

      const res = await fetch("/api/interview/turn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await res.json()) as TurnResponseBody;
      if (!data.ok) {
        setError(data.error);
        return;
      }

      if (data.appraisal) recordAppraisal(candidate.id, data.appraisal);
      appendTurn(candidate.id, {
        role: "interviewer",
        text: data.question.text,
        competencyKey: data.question.competencyKey,
        at: new Date().toISOString(),
      });
      setClosing(data.closing);
    } catch (e) {
      setError(e instanceof Error ? e.message : "The request never reached the server.");
    } finally {
      setBusy(null);
    }
  }

  // Open with the first question once the interview record exists.
  useEffect(() => {
    if (!interview || askedFirst.current) return;
    if (interview.turns.length > 0 || interview.status === "finished") {
      askedFirst.current = true;
      return;
    }
    askedFirst.current = true;
    void nextQuestion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interview]);

  async function submitAnswer() {
    const text = answer.trim();
    if (!text || busy) return;
    appendTurn(candidate.id, {
      role: "candidate",
      text,
      competencyKey: lastTurn?.competencyKey ?? "",
      at: new Date().toISOString(),
    });
    setAnswer("");
    await nextQuestion(text);
  }

  async function finish() {
    if (!interview || busy) return;
    setBusy("finish");
    setError(null);
    try {
      const body: FinishRequestBody = {
        ...requestBody(),
        appraisals: interview.appraisals,
      };
      const res = await fetch("/api/interview/finish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await res.json()) as FinishResponseBody;
      if (!data.ok) {
        setError(data.error);
        return;
      }
      applyInterview(candidate.id, {
        competencyResults: data.competencyResults,
        summary: data.summary,
        strengths: data.strengths,
        concerns: data.concerns,
      });
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "The request never reached the server.");
    } finally {
      setBusy(null);
    }
  }

  const answered = turns.filter((t) => t.role === "candidate").length;
  const canFinish = answered >= 2 && !busy;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80" aria-hidden />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Interview with ${candidate.name}`}
        className="pixel-frame--warm pixel-frame relative flex max-h-[86vh] w-full max-w-3xl flex-col p-6"
      >
        <header className="mb-4 flex items-start justify-between gap-4 border-b-2 border-ink-600 pb-4">
          <div>
            <p className="font-pixel text-[8px] uppercase tracking-widest text-slate-400">
              Interview in the room
            </p>
            <h2 className="mt-2 font-pixel text-[13px] text-brass-100">{candidate.name}</h2>
            <p className="mt-2 text-slate-400">
              Question {Math.min(asked, budget)} of {budget} · {department.name}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <button
              onClick={() => {
                if (
                  turns.length === 0 ||
                  confirm("Leave this interview? Nothing is recorded until you finish it.")
                ) {
                  if (turns.length > 0) abandonInterview(candidate.id);
                  onClose();
                }
              }}
              aria-label="Close interview"
              className="pixel-btn px-3 py-2 font-pixel text-[10px]"
            >
              ✕
            </button>
            {closing && <Tag tone="hold">Final question</Tag>}
          </div>
        </header>

        <p className="mb-4 border-2 border-ink-600 bg-ink-900 p-3 text-slate-400">
          Read the question out to the candidate, then type what they said. The notes are yours,
          not a recording — write down the substance, not the wording.
        </p>

        <div ref={scrollRef} className="mb-4 min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
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
                {t.role === "interviewer" ? "Ask" : "They said"}
                {t.competencyKey && <span className="ml-2 normal-case">{t.competencyKey}</span>}
              </p>
              <p className="leading-relaxed text-slate-200">{t.text}</p>
            </div>
          ))}

          {busy === "question" && (
            <p className="animate-flicker p-3 font-pixel text-[9px] uppercase tracking-wider text-brass-500">
              Thinking about the next question…
            </p>
          )}
          {turns.length === 0 && !busy && !error && (
            <p className="p-3 text-slate-400">Preparing the opening question…</p>
          )}
        </div>

        {lastAppraisal && (
          <div className="mb-4 border-2 border-ink-600 p-3">
            <p className="font-pixel text-[8px] uppercase tracking-wider text-slate-400">
              Last answer
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <Tag tone={lastAppraisal.score >= 3 ? "pass" : lastAppraisal.score >= 2 ? "neutral" : "fail"}>
                {lastAppraisal.score}/4
              </Tag>
              <Tag>{lastAppraisal.depth}</Tag>
              {lastAppraisal.evasionNoted && <Tag tone="hold">evaded</Tag>}
            </div>
            {lastAppraisal.concern && (
              <p className="mt-2 text-slate-400">{lastAppraisal.concern}</p>
            )}
          </div>
        )}

        {error && (
          <div className="mb-4 border-2 border-verdict-fail p-3" role="alert">
            <p className="text-verdict-fail">{error}</p>
            {/* A failed turn must not be a dead end: nothing has been recorded
                yet, so retrying costs only the call it already lost. */}
            <PixelButton
              className="mt-3"
              onClick={() => void nextQuestion()}
              disabled={busy !== null || awaitingAnswer}
            >
              Try that question again
            </PixelButton>
          </div>
        )}

        <div className="border-t-2 border-ink-600 pt-4">
          <label htmlFor="answer" className="sr-only">
            What the candidate said
          </label>
          <textarea
            id="answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) void submitAnswer();
            }}
            rows={4}
            disabled={!awaitingAnswer || busy !== null}
            placeholder={
              awaitingAnswer
                ? "Type what they said. Specifics matter — the decision, the number, the thing that broke."
                : "Waiting for the next question…"
            }
            className="pixel-input w-full px-3 py-3 leading-relaxed disabled:opacity-50"
          />
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <PixelButton
              variant="primary"
              onClick={() => void submitAnswer()}
              disabled={!answer.trim() || !awaitingAnswer || busy !== null}
            >
              {busy === "question" ? "Working…" : "Record answer"}
            </PixelButton>
            <PixelButton onClick={() => void finish()} disabled={!canFinish}>
              {busy === "finish" ? "Assessing…" : "Finish and rescore"}
            </PixelButton>
            <span className="text-slate-400">
              {answered < 2
                ? "Two answers minimum before an assessment means anything."
                : "Finishing rescores this candidate and re-seats the room."}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
