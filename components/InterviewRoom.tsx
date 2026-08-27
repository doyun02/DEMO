"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { SCENE_H, SCENE_W, candidatePalette } from "@/lib/scene/palette";
import { SEAT_XS, drawScene, seatRect, type SeatOccupant } from "@/lib/scene/room";
import { seatOrder } from "@/lib/screening";
import { useApp } from "@/lib/store";
import type { ScreeningResult } from "@/lib/types";
import { SEAT_COUNT } from "@/lib/types";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

export function InterviewRoom({
  onOpenCaseFile,
}: {
  onOpenCaseFile: (result: ScreeningResult) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  const runs = useApp((s) => s.runs);
  const activeDepartmentId = useApp((s) => s.activeDepartmentId);
  const running = useApp((s) => s.screening.running);
  const selectedCandidateId = useApp((s) => s.selectedCandidateId);
  const selectCandidate = useApp((s) => s.selectCandidate);

  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const latestRun = useMemo(
    () => runs.find((r) => r.departmentId === activeDepartmentId),
    [runs, activeDepartmentId],
  );

  /** The five chairs, centre seat to the highest score outward. */
  const seated = useMemo(() => {
    const list = latestRun?.results.filter((r) => r.seated) ?? [];
    const ordered = seatOrder(list);
    return Array.from({ length: SEAT_COUNT }, (_, i) => ordered[i] ?? null);
  }, [latestRun]);

  const occupants: SeatOccupant[] = useMemo(
    () =>
      seated.map((r) =>
        r
          ? {
              candidateId: r.candidateId,
              name: r.candidateName,
              score: r.score,
              palette: candidatePalette(r.candidateName + r.candidateId),
            }
          : null,
      ),
    [seated],
  );

  const selectedIndex = useMemo(() => {
    const i = seated.findIndex((r) => r?.candidateId === selectedCandidateId);
    return i === -1 ? null : i;
  }, [seated, selectedCandidateId]);

  // ── render loop ───────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;

    let raf = 0;
    const paint = (t: number) => {
      drawScene(ctx, {
        seats: occupants,
        selectedIndex,
        hoverIndex,
        timeMs: t,
        reducedMotion,
        aiBusy: running,
      });
      if (!reducedMotion) raf = requestAnimationFrame(paint);
    };

    // Reduced motion: one static frame, redrawn only when state changes.
    if (reducedMotion) paint(0);
    else raf = requestAnimationFrame(paint);

    return () => cancelAnimationFrame(raf);
  }, [occupants, selectedIndex, hoverIndex, reducedMotion, running]);

  const statusLine = latestRun
    ? `${seated.filter(Boolean).length}/${SEAT_COUNT} seated · ${latestRun.departmentName} · screened ${new Date(
        latestRun.ranAt,
      ).toLocaleString()}`
    : "0/5 seated · no screening run yet — open ☰ → Candidates to run one";

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6">
      <div className="scanlines pixel-frame relative">
        <canvas
          ref={canvasRef}
          width={SCENE_W}
          height={SCENE_H}
          className="pixel block w-full"
          role="img"
          aria-label={`Interview room. ${seated.filter(Boolean).length} of ${SEAT_COUNT} seats filled.`}
        />

        {/* One focusable hit area per seat — keyboard reaches the room, not just the mouse. */}
        <div className="absolute inset-0">
          {occupants.map((occ, i) => {
            const r = seatRect(i);
            const result = seated[i];
            return (
              <button
                key={i}
                disabled={!occ || !result}
                onClick={() => {
                  if (!result) return;
                  selectCandidate(result.candidateId);
                  onOpenCaseFile(result);
                }}
                onMouseEnter={() => setHoverIndex(i)}
                onMouseLeave={() => setHoverIndex((h) => (h === i ? null : h))}
                onFocus={() => setHoverIndex(i)}
                onBlur={() => setHoverIndex((h) => (h === i ? null : h))}
                aria-label={
                  occ
                    ? `Seat ${i + 1}: ${occ.name}, scored ${occ.score} out of 10. Open case file.`
                    : `Seat ${i + 1}: vacant`
                }
                className="absolute disabled:cursor-default"
                style={{
                  left: `${(r.x / SCENE_W) * 100}%`,
                  top: `${(r.y / SCENE_H) * 100}%`,
                  width: `${(r.w / SCENE_W) * 100}%`,
                  height: `${(r.h / SCENE_H) * 100}%`,
                }}
              />
            );
          })}
        </div>
      </div>

      {/* minimal status strip — everything else lives in the drawer */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-2 border-ink-600 bg-ink-800 px-4 py-3">
        <p className="text-slate-300">
          <span className="text-brass-500">▮</span> {statusLine}
        </p>
        {running && (
          <p className="animate-flicker font-pixel text-[8px] uppercase tracking-wider text-brass-500">
            AI screening in progress…
          </p>
        )}
      </div>

      <p className="mt-3 text-center text-slate-400">
        {occupants.some(Boolean)
          ? "Select a seated candidate to open their case file."
          : "Empty seats stay empty. Nothing is seated without a record."}
      </p>

      <noscript>
        <p className="mt-3 text-center text-slate-400">
          The interview room is drawn in canvas and needs JavaScript. The Records panel still lists
          every judgment.
        </p>
      </noscript>

      {/* hidden helper so screen readers can enumerate the row without the canvas */}
      <ul className="sr-only">
        {occupants.map((occ, i) => (
          <li key={i}>
            {occ ? `Seat ${i + 1}: ${occ.name}, ${occ.score} out of 10` : `Seat ${i + 1}: vacant`}
          </li>
        ))}
      </ul>
      <span className="sr-only">{SEAT_XS.length} seats total.</span>
    </div>
  );
}
