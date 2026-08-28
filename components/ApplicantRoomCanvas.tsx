"use client";

import { useEffect, useRef, useState } from "react";
import { drawApplicantScene } from "@/lib/scene/applicantRoom";
import { SCENE_H, SCENE_W } from "@/lib/scene/palette";

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

/** The view from the applicant's chair. */
export function ApplicantRoomCanvas({
  applicantName,
  invited,
  speaking,
  label,
}: {
  applicantName: string;
  invited: boolean;
  speaking: boolean;
  label: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;

    let raf = 0;
    const paint = (t: number) => {
      drawApplicantScene(ctx, {
        timeMs: t,
        reducedMotion,
        invited,
        speaking,
        applicantName,
      });
      if (!reducedMotion) raf = requestAnimationFrame(paint);
    };
    if (reducedMotion) paint(0);
    else raf = requestAnimationFrame(paint);
    return () => cancelAnimationFrame(raf);
  }, [applicantName, invited, speaking, reducedMotion]);

  return (
    <div className="scanlines pixel-frame relative">
      <canvas
        ref={ref}
        width={SCENE_W}
        height={SCENE_H}
        className="pixel block w-full"
        role="img"
        aria-label={label}
      />
    </div>
  );
}
