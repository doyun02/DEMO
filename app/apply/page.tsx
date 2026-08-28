"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PixelButton } from "@/components/PixelUI";
import { computeOverall, standardHash } from "@/lib/scoring";
import { erroredEvaluation, seatCandidates } from "@/lib/screening";
import { useApp } from "@/lib/store";
import { newId } from "@/lib/id";
import { DEFAULT_WEIGHTS } from "@/lib/types";
import type {
  AnalyzeRequestBody,
  AnalyzeResponseBody,
  PendingResult,
  ScreeningRun,
} from "@/lib/types";

/**
 * The applicant's side of the front door: a role, a name, and a resume.
 *
 * Submitting runs the screening immediately — the point of the product is that
 * a resume gets read rather than queued, and the applicant sees that happen.
 */
export default function ApplyPage() {
  const router = useRouter();
  const departments = useApp((s) => s.departments);
  const runs = useApp((s) => s.runs);
  const registerApplicant = useApp((s) => s.registerApplicant);
  const addRun = useApp((s) => s.addRun);
  const applicantId = useApp((s) => s.applicantId);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [resume, setResume] = useState("");
  const [consentScreening, setConsentScreening] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!departmentId && departments[0]) setDepartmentId(departments[0].id);
  }, [departments, departmentId]);

  // Already applied in this browser — go straight back to the room.
  useEffect(() => {
    if (applicantId) router.replace("/apply/room");
  }, [applicantId, router]);

  const dept = departments.find((d) => d.id === departmentId);
  const ready = name.trim() && resume.trim().length > 40 && dept && consentScreening;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!ready || !dept || busy) return;
    setBusy(true);
    setError(null);

    const candidateId = registerApplicant({
      name,
      email,
      departmentId: dept.id,
      resumeText: resume,
    });
    const weights = dept.weights ?? DEFAULT_WEIGHTS;
    const screenedAt = new Date().toISOString();

    const base = {
      candidateId,
      candidateName: name.trim(),
      departmentId: dept.id,
      screenedAt,
    };

    let pending: PendingResult;
    try {
      const body: AnalyzeRequestBody = {
        candidate: { id: candidateId, name: name.trim(), resumeText: resume },
        requirements: dept.requirements,
        competencies: dept.competencies,
      };
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await res.json()) as AnalyzeResponseBody;
      pending = {
        ...base,
        ...data.evaluation,
        score: computeOverall(data.evaluation.competencyResults, weights),
        ...(data.ok ? {} : { errored: true, errorMessage: data.error }),
      };
    } catch (err) {
      const message = err instanceof Error ? err.message : "network failure";
      const evaluation = erroredEvaluation(dept.requirements, dept.competencies, message);
      pending = {
        ...base,
        ...evaluation,
        score: computeOverall(evaluation.competencyResults, weights),
        errored: true,
        errorMessage: message,
      };
    }

    // Re-seat against everyone already screened for this role, so a new
    // applicant lands in the room rather than in a list of one.
    const previous = runs.find((r) => r.departmentId === dept.id);
    const others = (previous?.results ?? []).filter((r) => r.candidateId !== candidateId);
    const run: ScreeningRun = {
      id: newId("run"),
      departmentId: dept.id,
      departmentName: dept.name,
      ranAt: screenedAt,
      results: seatCandidates([...others, pending]),
      appliedStandard: {
        requirements: dept.requirements,
        competencies: dept.competencies,
        weights,
        hash: standardHash(dept.requirements, dept.competencies, weights),
      },
    };
    addRun(run);

    setBusy(false);
    router.push("/apply/room");
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-4 py-12">
      <header className="mb-8">
        <Link href="/" className="font-pixel text-[10px] tracking-wider text-brass-500">
          HIRESCOPE
        </Link>
        <h1 className="mt-6 font-pixel text-[15px] text-brass-100">Apply</h1>
        <p className="mt-4 leading-relaxed text-slate-300">
          Your resume is read against a written standard for the role — a list of requirements
          and a set of competencies, each with a definition you can be judged against. You will
          see the result.
        </p>
      </header>

      <form onSubmit={submit} className="pixel-frame space-y-5 p-6">
        <div>
          <label
            htmlFor="ap-name"
            className="mb-2 block font-pixel text-[8px] uppercase tracking-wider text-slate-400"
          >
            Your name
          </label>
          <input
            id="ap-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="pixel-input w-full px-3 py-3"
          />
        </div>

        <div>
          <label
            htmlFor="ap-email"
            className="mb-2 block font-pixel text-[8px] uppercase tracking-wider text-slate-400"
          >
            Email <span className="normal-case text-slate-500">— optional, for a reply</span>
          </label>
          <input
            id="ap-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pixel-input w-full px-3 py-3"
          />
        </div>

        <div>
          <label
            htmlFor="ap-role"
            className="mb-2 block font-pixel text-[8px] uppercase tracking-wider text-slate-400"
          >
            Role
          </label>
          <select
            id="ap-role"
            value={departmentId}
            onChange={(e) => setDepartmentId(e.target.value)}
            className="pixel-input w-full px-3 py-3"
          >
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
          {dept && (
            <p className="mt-2 text-slate-400">
              {dept.requirements.length} requirement
              {dept.requirements.length === 1 ? "" : "s"} · {dept.competencies.length} scored
              competencies
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="ap-resume"
            className="mb-2 block font-pixel text-[8px] uppercase tracking-wider text-slate-400"
          >
            Resume
          </label>
          <textarea
            id="ap-resume"
            value={resume}
            onChange={(e) => setResume(e.target.value)}
            rows={12}
            placeholder="Paste your resume here. Specifics carry the most weight — the decision you made, the number it moved, the thing that broke."
            className="pixel-input w-full px-3 py-3 leading-relaxed"
          />
        </div>

        <label className="flex items-start gap-3 border-2 border-ink-600 p-3">
          <input
            type="checkbox"
            checked={consentScreening}
            onChange={(e) => setConsentScreening(e.target.checked)}
            className="mt-1"
          />
          <span className="text-slate-300">
            I agree to this resume being read and scored by an AI against the role&apos;s
            standard, and to that assessment being kept as a record. A person makes the hiring
            decision, not the AI.
          </span>
        </label>

        {error && (
          <p className="border-2 border-verdict-fail p-3 text-verdict-fail" role="alert">
            {error}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <PixelButton type="submit" variant="primary" disabled={!ready || busy}>
            {busy ? "Reading your resume…" : "Submit"}
          </PixelButton>
          <span className="text-slate-400">
            {busy ? "This takes a moment — it is being read, not filed." : "Nothing is sent until you submit."}
          </span>
        </div>
      </form>
    </main>
  );
}
