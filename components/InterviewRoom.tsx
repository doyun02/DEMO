"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SCENE_H, SCENE_W, candidatePalette } from "@/lib/scene/palette";
import {
  DOOR_X,
  SEAT_XS,
  drawScene,
  seatRect,
  type SceneActor,
  type SeatOccupant,
} from "@/lib/scene/room";
import { planChoreography, poseAt, type Choreography } from "@/lib/scene/choreography";
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
              score: r.score.overall,
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

  // ── choreography ──────────────────────────────────────────────────
  // Everyone on screen during a transition, including candidates on their way
  // out who are no longer in `occupants` at all.
  const castRef = useRef(new Map<string, SeatOccupant & object>());
  const prevSeatingRef = useRef<Array<string | null> | null>(null);
  const [choreo, setChoreo] = useState<{ plan: Choreography; startedAt: number } | null>(null);

  useEffect(() => {
    for (const occ of occupants) if (occ) castRef.current.set(occ.candidateId, occ);
  }, [occupants]);

  useEffect(() => {
    const next = seated.map((r) => r?.candidateId ?? null);
    const prev = prevSeatingRef.current;

    // First paint of a populated room: let the panel file in through the door.
    const from = prev ?? next.map(() => null);
    prevSeatingRef.current = next;

    if (reducedMotion) {
      setChoreo(null);
      return;
    }
    if (prev !== null && prev.join("|") === next.join("|")) return;

    const plan = planChoreography(from, next, SEAT_XS, DOOR_X);
    if (plan.duration === 0) {
      setChoreo(null);
      return;
    }
    setChoreo({ plan, startedAt: performance.now() });
  }, [seated, reducedMotion]);

  /** Sample the room at wall-clock time `now`. */
  const sampleActors = useCallback(
    (now: number): { actors: SceneActor[]; doorOpenness: number; done: boolean } => {
      const settled = (): SceneActor[] =>
        occupants.flatMap((occ, i) =>
          occ
            ? [
                {
                  key: occ.candidateId,
                  palette: occ.palette,
                  x: SEAT_XS[i],
                  lift: 0,
                  walking: false,
                  selected: selectedIndex === i,
                },
              ]
            : [],
        );

      if (!choreo) return { actors: settled(), doorOpenness: 0, done: true };

      const t = now - choreo.startedAt;
      if (t >= choreo.plan.duration) return { actors: settled(), doorOpenness: 0, done: true };

      const actors: SceneActor[] = [];
      let nearestToDoor = Infinity;

      for (const move of choreo.plan.moves) {
        const cast = castRef.current.get(move.candidateId);
        if (!cast) continue;
        const pose = poseAt(move, t, SEAT_XS, DOOR_X);
        if (!pose.visible) {
          // Off screen: either about to come in, or just gone out. Both hold the
          // door open — but only briefly, or it never shuts again.
          if (move.kind === "enter" && t > move.delay - 400) nearestToDoor = 0;
          if (move.kind === "leave" && poseAt(move, t - 450, SEAT_XS, DOOR_X).visible) {
            nearestToDoor = 0;
          }
          continue;
        }
        // Only somebody actually crossing the room holds the door; a candidate
        // sitting in the nearest chair is not standing in the doorway.
        if (pose.walking) nearestToDoor = Math.min(nearestToDoor, Math.abs(pose.x - DOOR_X));
        actors.push({
          key: cast.candidateId,
          palette: cast.palette,
          x: pose.x,
          lift: pose.lift,
          walking: pose.walking,
          selected: cast.candidateId === selectedCandidateId,
        });
      }

      // The door swings as somebody nears it and closes once the lane is clear.
      const openness = nearestToDoor > 90 ? 0 : 1 - nearestToDoor / 90;
      return { actors, doorOpenness: Math.max(0, Math.min(1, openness)), done: false };
    },
    [choreo, occupants, selectedIndex, selectedCandidateId],
  );

  // ── render loop ───────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;

    let raf = 0;
    const paint = (t: number) => {
      const { actors, doorOpenness } = sampleActors(performance.now());
      drawScene(ctx, {
        seats: occupants,
        actors,
        selectedIndex,
        hoverIndex,
        timeMs: t,
        reducedMotion,
        aiBusy: running,
        doorOpenness,
      });
      if (!reducedMotion) raf = requestAnimationFrame(paint);
    };

    // Reduced motion: one static frame, redrawn only when state changes.
    if (reducedMotion) paint(0);
    else raf = requestAnimationFrame(paint);

    return () => cancelAnimationFrame(raf);
  }, [occupants, selectedIndex, hoverIndex, reducedMotion, running, sampleActors]);

  const filled = seated.filter(Boolean).length;
  const statusLine = latestRun
    ? `${filled}/${SEAT_COUNT} seated · ${latestRun.departmentName} · ${
        latestRun.sample ? "sample screening" : "screened"
      } ${new Date(latestRun.ranAt).toLocaleString()}`
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
          aria-label={`Interview room. ${filled} of ${SEAT_COUNT} seats filled.`}
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
                    ? `Seat ${i + 1}: ${occ.name}, scored ${occ.score} out of 100. Open case file.`
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
            {occ ? `Seat ${i + 1}: ${occ.name}, ${occ.score} out of 100` : `Seat ${i + 1}: vacant`}
          </li>
        ))}
      </ul>
    </div>
  );
}
