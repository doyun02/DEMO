"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { EmptyState, PixelButton, PixelPanel, Tag } from "./PixelUI";
import { newId } from "@/lib/id";
import { seatCandidates } from "@/lib/screening";
import { useActiveDepartment, useApp } from "@/lib/store";
import type {
  AnalyzeRequestBody,
  AnalyzeResponseBody,
  Candidate,
  PendingResult,
  ScreeningRun,
} from "@/lib/types";

export function CandidatesPanel() {
  const router = useRouter();
  const dept = useActiveDepartment();
  const candidates = useApp((s) => s.candidates);
  const addCandidate = useApp((s) => s.addCandidate);
  const removeCandidate = useApp((s) => s.removeCandidate);
  const addRun = useApp((s) => s.addRun);
  const screening = useApp((s) => s.screening);
  const setScreening = useApp((s) => s.setScreening);

  const [name, setName] = useState("");
  const [resume, setResume] = useState("");

  if (!dept) {
    return (
      <PixelPanel title="Candidates">
        <EmptyState>No department selected. Pick one in the ☰ menu.</EmptyState>
      </PixelPanel>
    );
  }

  const queue = candidates.filter((c) => c.departmentId === dept.id);

  async function screenOne(candidate: Candidate): Promise<PendingResult> {
    const body: AnalyzeRequestBody = {
      candidate: { id: candidate.id, name: candidate.name, resumeText: candidate.resumeText },
      priorityCriteria: dept!.priorityCriteria,
      niceToHave: dept!.niceToHave,
    };

    const base = {
      candidateId: candidate.id,
      candidateName: candidate.name,
      departmentId: dept!.id,
      screenedAt: new Date().toISOString(),
    };

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await res.json()) as AnalyzeResponseBody;
      // A failed screening still produces a record — nothing is silently dropped.
      return data.ok
        ? { ...base, ...data.evaluation }
        : { ...base, ...data.evaluation, errored: true, errorMessage: data.error };
    } catch (e) {
      const message = e instanceof Error ? e.message : "network failure";
      return {
        ...base,
        score: 0,
        summary: `Screening could not be completed: ${message}`,
        strengths: [],
        concerns: ["The screening request never reached the server."],
        priorityResults: dept!.priorityCriteria.map((c) => ({
          label: c.label,
          met: false,
          reason: "Not evaluated — the request failed.",
        })),
        niceToHaveResults: dept!.niceToHave.map((c) => ({ label: c.label, met: false })),
        errored: true,
        errorMessage: message,
      };
    }
  }

  async function runScreening() {
    if (!dept || queue.length === 0 || screening.running) return;
    setScreening({ running: true, done: 0, total: queue.length, error: undefined });

    const raw: PendingResult[] = [];
    for (const candidate of queue) {
      // Sequential on purpose: rate limits, and a visible per-candidate progress count.
      const result = await screenOne(candidate);
      raw.push(result);
      setScreening({ done: raw.length });
    }

    const run: ScreeningRun = {
      id: newId("run"),
      departmentId: dept.id,
      departmentName: dept.name,
      ranAt: new Date().toISOString(),
      results: seatCandidates(raw),
    };
    addRun(run);
    setScreening({ running: false });
    router.push("/");
  }

  const missingCriteria = dept.priorityCriteria.length === 0;

  return (
    <div className="space-y-8">
      <PixelPanel
        title={`Resume intake — ${dept.name}`}
        subtitle="Paste the resume text. File upload and PDF parsing hook in at the same point later."
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!name.trim() || !resume.trim()) return;
            addCandidate({ name, departmentId: dept.id, resumeText: resume });
            setName("");
            setResume("");
          }}
          className="space-y-4"
        >
          <div>
            <label htmlFor="cand-name" className="mb-2 block font-pixel text-[8px] uppercase tracking-wider text-slate-400">
              Candidate name
            </label>
            <input
              id="cand-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="pixel-input w-full px-3 py-3"
              placeholder="e.g. Han Jiwoo"
            />
          </div>
          <div>
            <label htmlFor="cand-resume" className="mb-2 block font-pixel text-[8px] uppercase tracking-wider text-slate-400">
              Resume text
            </label>
            <textarea
              id="cand-resume"
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              rows={9}
              className="pixel-input w-full px-3 py-3 leading-relaxed"
              placeholder="Paste the resume here…"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <PixelButton type="submit" variant="primary">
              Add to queue
            </PixelButton>
            {/* Extension point: a file input lands here and fills resumeText after parsing. */}
            <span className="text-slate-400">PDF upload: not yet — paste for now.</span>
          </div>
        </form>
      </PixelPanel>

      <PixelPanel
        title={`Queue — ${queue.length} candidate${queue.length === 1 ? "" : "s"}`}
        subtitle="Everyone here gets screened, scored, and recorded. Only the top 5 who clear every requirement get seated."
        actions={
          <PixelButton
            variant="primary"
            onClick={runScreening}
            disabled={screening.running || queue.length === 0 || missingCriteria}
          >
            {screening.running ? `Screening ${screening.done}/${screening.total}…` : "Run AI screening"}
          </PixelButton>
        }
      >
        {missingCriteria && (
          <p className="mb-4 border-2 border-verdict-fail p-3 text-verdict-fail">
            This department has no required criteria. Add at least one before screening.
          </p>
        )}

        {queue.length === 0 ? (
          <EmptyState>Nobody queued for {dept.name} yet.</EmptyState>
        ) : (
          <ul className="space-y-3">
            {queue.map((c) => (
              <li key={c.id} className="border-2 border-ink-600 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-pixel text-[10px] text-brass-100">{c.name}</p>
                    <p className="mt-2 line-clamp-2 text-slate-400">
                      {c.resumeText.slice(0, 160).replace(/\s+/g, " ")}…
                    </p>
                    <p className="mt-2 text-slate-400">
                      Submitted {new Date(c.submittedAt).toLocaleDateString()}
                      {c.sourceFileName ? ` · ${c.sourceFileName}` : ""}
                    </p>
                  </div>
                  <PixelButton
                    variant="danger"
                    onClick={() => removeCandidate(c.id)}
                    ariaLabel={`Remove ${c.name} from the queue`}
                  >
                    Remove
                  </PixelButton>
                </div>
              </li>
            ))}
          </ul>
        )}

        {screening.running && (
          <p className="mt-5 border-2 border-brass-700 p-3 text-brass-100" role="status" aria-live="polite">
            Screening {screening.done} of {screening.total}… each verdict is written to Records as it
            lands.
          </p>
        )}
      </PixelPanel>

      <PixelPanel title="Department">
        <div className="flex flex-wrap items-center gap-3">
          <Tag tone="seated">{dept.name}</Tag>
          <Tag>{dept.priorityCriteria.length} required</Tag>
          <Tag>{dept.niceToHave.length} nice-to-have</Tag>
        </div>
      </PixelPanel>
    </div>
  );
}
