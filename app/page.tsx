"use client";

import { useState } from "react";
import { CaseFile } from "@/components/CaseFile";
import { InterviewRoom } from "@/components/InterviewRoom";
import { useApp } from "@/lib/store";
import type { ScreeningResult } from "@/lib/types";

export default function InterviewRoomPage() {
  const [open, setOpen] = useState<ScreeningResult | null>(null);
  const selectCandidate = useApp((s) => s.selectCandidate);

  return (
    <>
      <InterviewRoom onOpenCaseFile={setOpen} />
      <CaseFile
        result={open}
        onClose={() => {
          setOpen(null);
          selectCandidate(null);
        }}
      />
    </>
  );
}
