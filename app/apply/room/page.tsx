"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ApplicantRoomCanvas } from "@/components/ApplicantRoomCanvas";
import { ApplicantInterview } from "@/components/ApplicantInterview";
import { PixelButton, ScoreBar, Tag } from "@/components/PixelUI";
import { explainOverall } from "@/lib/scoring";
import { useApp } from "@/lib/store";
import { SEAT_COUNT } from "@/lib/types";

/**
 * The applicant's room.
 *
 * They submitted a resume and are now sitting across from the interviewer. The
 * screening result is theirs to see — a system that scores people and shows them
 * nothing is the thing this app is arguing against.
 */
export default function ApplicantRoomPage() {
  const router = useRouter();
  const applicantId = useApp((s) => s.applicantId);
  const candidates = useApp((s) => s.candidates);
  const runs = useApp((s) => s.runs);
  const invites = useApp((s) => s.invites);
  const interviews = useApp((s) => s.interviews);
  const respondToInvite = useApp((s) => s.respondToInvite);
  const signOutApplicant = useApp((s) => s.signOutApplicant);

  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    if (hydrated && !applicantId) router.replace("/apply");
  }, [hydrated, applicantId, router]);

  const me = candidates.find((c) => c.id === applicantId);
  const result = useMemo(() => {
    for (const run of runs) {
      const hit = run.results.find((r) => r.candidateId === applicantId);
      if (hit) return hit;
    }
    return null;
  }, [runs, applicantId]);

  const invite = applicantId ? invites[applicantId] : undefined;
  const interview = applicantId ? interviews[applicantId] : undefined;
  const consented = Boolean(invite?.consentedAt);
  const inInterview = consented && interview?.status === "in_progress";

  if (!hydrated || !me) {
    return (
      <main className="mx-auto w-full max-w-3xl px-4 py-12">
        <p className="text-slate-400">Loading…</p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-8">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link href="/" className="font-pixel text-[10px] tracking-wider text-brass-500">
          HIRESCOPE
        </Link>
        <button
          onClick={() => {
            if (confirm("Leave? This browser will forget that you applied.")) {
              signOutApplicant();
              router.push("/");
            }
          }}
          className="pixel-btn px-3 py-2 font-pixel text-[8px] uppercase tracking-wider"
        >
          Leave
        </button>
      </header>

      <ApplicantRoomCanvas
        applicantName={me.name}
        invited={Boolean(invite)}
        speaking={inInterview}
        label={
          inInterview
            ? "The interviewer is asking you a question."
            : invite
              ? "The interviewer has looked up and is waiting for your answer about interviewing."
              : "You are sitting across the desk from the interviewer, who is reading your file."
        }
      />

      {/* The interview itself takes over once both sides have agreed. */}
      {inInterview && applicantId && <ApplicantInterview candidateId={applicantId} />}

      {!inInterview && invite && !invite.declinedAt && (
        <section className="pixel-frame--warm pixel-frame mt-6 p-5">
          <h2 className="font-pixel text-[11px] text-brass-100">
            The panel would like to interview you
          </h2>
          <p className="mt-3 leading-relaxed text-slate-300">
            An AI proposes each question; the interviewer asks it and writes down what you say.
            Those notes, and the scores drawn from them, become part of your record.
          </p>
          <ul className="mt-4 space-y-2 text-slate-400">
            <li>▸ You can stop at any point, and stopping is not held against you.</li>
            <li>▸ Nothing is recorded until the interview is finished.</li>
            <li>▸ No camera, no microphone, no screen monitoring. Nothing watches you.</li>
          </ul>
          <div className="mt-5 flex flex-wrap gap-3">
            <PixelButton
              variant="primary"
              onClick={() => applicantId && respondToInvite(applicantId, true)}
            >
              I agree — start
            </PixelButton>
            <PixelButton
              onClick={() => applicantId && respondToInvite(applicantId, false)}
            >
              Not now
            </PixelButton>
          </div>
        </section>
      )}

      {invite?.declinedAt && !inInterview && (
        <section className="pixel-frame mt-6 p-5">
          <p className="text-slate-300">
            You declined the interview. Your resume assessment stands on its own — declining is
            recorded as a choice, not as a mark against you.
          </p>
        </section>
      )}

      {!invite && (
        <section className="pixel-frame mt-6 p-5">
          <p className="text-slate-300">
            Your resume has been read. The interviewer has your file — if the panel wants to
            talk, a request will appear here and nothing starts until you agree.
          </p>
        </section>
      )}

      {/* What the screen made of them. */}
      {result && (
        <section className="pixel-frame mt-6 p-5">
          <h2 className="font-pixel text-[11px] text-brass-100">How your resume was read</h2>

          <div className="mt-4 flex flex-wrap items-center gap-4">
            <ScoreBar score={result.score.overall} seated={result.seated} />
            {result.seated ? (
              <Tag tone="seated">In the top {SEAT_COUNT}</Tag>
            ) : (
              <Tag tone={result.notSeatedReason === "rank" ? "hold" : "fail"}>
                {result.notSeatedReason === "rank"
                  ? `Met every requirement, ranked below the top ${SEAT_COUNT}`
                  : "A requirement was not met"}
              </Tag>
            )}
          </div>
          <p className="mt-3 text-slate-400">{explainOverall(result.score)}</p>
          <p className="mt-4 leading-relaxed text-slate-300">{result.summary}</p>

          <h3 className="mt-5 font-pixel text-[9px] uppercase tracking-wider text-slate-200">
            Requirements
          </h3>
          <ul className="mt-3 space-y-2">
            {result.requirementResults.map((r, i) => (
              <li key={i} className="border-2 border-ink-600 p-3">
                <div className="flex items-start gap-3">
                  <span
                    aria-hidden
                    className={`font-pixel text-[11px] ${
                      r.met ? "text-verdict-pass" : "text-verdict-fail"
                    }`}
                  >
                    {r.met ? "✔" : "✘"}
                  </span>
                  <div>
                    <p className="text-slate-200">{r.label}</p>
                    <p className="mt-1 text-slate-400">{r.reason}</p>
                    {!r.evidenced && (
                      <p className="mt-1 text-verdict-hold">
                        Your resume did not mention this either way.
                      </p>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <p className="mt-5 border-t-2 border-ink-600 pt-4 text-slate-400">
            If something here is wrong, it is wrong about a document — say so to the interviewer.
            The score is a reading of what your resume said, not a verdict on you.
          </p>
        </section>
      )}
    </main>
  );
}
