"use client";

import { useMemo, useState } from "react";
import { CaseFile } from "@/components/CaseFile";
import { InterviewPanel } from "@/components/InterviewPanel";
import { InterviewRoom } from "@/components/InterviewRoom";
import { useApp } from "@/lib/store";
import type { ScreeningResult } from "@/lib/types";

export default function InterviewRoomPage() {
  const [openFile, setOpenFile] = useState<ScreeningResult | null>(null);
  const [interviewing, setInterviewing] = useState<ScreeningResult | null>(null);

  const selectCandidate = useApp((s) => s.selectCandidate);
  const invites = useApp((s) => s.invites);
  const inviteToInterview = useApp((s) => s.inviteToInterview);
  const withdrawInvite = useApp((s) => s.withdrawInvite);
  const candidates = useApp((s) => s.candidates);
  const runs = useApp((s) => s.runs);
  const departments = useApp((s) => s.departments);
  const interviews = useApp((s) => s.interviews);

  // The interview needs the resume and the standard, neither of which lives on
  // the result — it only carries what the screening concluded.
  const context = useMemo(() => {
    if (!interviewing) return null;
    const candidate = candidates.find((c) => c.id === interviewing.candidateId);
    const department = departments.find((d) => d.id === interviewing.departmentId);
    return candidate && department ? { candidate, department } : null;
  }, [interviewing, candidates, departments]);

  // Anyone who has agreed and is waiting. A candidate outside the top five can
  // still be interviewed — the seating is a ranking, not a rule about who you
  // are allowed to talk to — so this cannot key off the chairs.
  const waiting = useMemo(() => {
    const consented = Object.entries(invites).filter(
      ([id, invite]) => invite.consentedAt && interviews[id]?.status !== "finished",
    );
    return consented.flatMap(([id]) => {
      for (const run of runs) {
        const hit = run.results.find((r) => r.candidateId === id);
        if (hit) return [hit];
      }
      return [];
    });
  }, [invites, interviews, runs]);

  return (
    <>
      <InterviewRoom onOpenCaseFile={setOpenFile} />

      {waiting.length > 0 && (
        <div className="mx-auto w-full max-w-5xl px-4 pb-6">
          <div className="pixel-frame--warm pixel-frame p-4">
            <p className="font-pixel text-[9px] uppercase tracking-wider text-brass-100">
              Waiting to be interviewed
            </p>
            <ul className="mt-3 space-y-2">
              {waiting.map((r) => (
                <li key={r.candidateId} className="flex flex-wrap items-center gap-3">
                  <span className="text-slate-200">{r.candidateName}</span>
                  <span className="text-slate-400">agreed · {r.score.overall}/100</span>
                  <button
                    onClick={() => setInterviewing(r)}
                    className="pixel-btn pixel-btn--primary px-3 py-2 font-pixel text-[8px] uppercase tracking-wider"
                  >
                    Open the interview
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <CaseFile
        result={openFile}
        interviewed={openFile ? interviews[openFile.candidateId]?.status === "finished" : false}
        invite={openFile ? invites[openFile.candidateId] : undefined}
        onInvite={(result) => inviteToInterview(result.candidateId)}
        onWithdrawInvite={(result) => withdrawInvite(result.candidateId)}
        onStartInterview={(result) => {
          setOpenFile(null);
          setInterviewing(result);
        }}
        onClose={() => {
          setOpenFile(null);
          selectCandidate(null);
        }}
      />

      {interviewing && context && (
        <InterviewPanel
          candidate={context.candidate}
          department={context.department}
          screening={interviewing}
          onClose={() => {
            setInterviewing(null);
            selectCandidate(null);
          }}
        />
      )}

      {interviewing && !context && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80" aria-hidden />
          <div className="pixel-frame relative max-w-lg p-6">
            <p className="text-slate-300">
              This candidate&apos;s resume or department is no longer in the store, so there is
              nothing to interview against. The record in the case file still stands.
            </p>
            <button
              onClick={() => setInterviewing(null)}
              className="pixel-btn mt-4 px-4 py-2 font-pixel text-[9px] uppercase tracking-wider"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
