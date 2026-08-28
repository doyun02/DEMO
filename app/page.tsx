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
  const candidates = useApp((s) => s.candidates);
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

  return (
    <>
      <InterviewRoom onOpenCaseFile={setOpenFile} />

      <CaseFile
        result={openFile}
        interviewed={openFile ? interviews[openFile.candidateId]?.status === "finished" : false}
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
