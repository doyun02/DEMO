"use client";

import { useEffect, useRef } from "react";
import type { CompetencyOutcome } from "@/lib/types";

const SIZE = 132; // scene pixels; upscaled with image-rendering: pixelated
const CX = SIZE / 2;
const CY = SIZE / 2;
const R = 52;

/** Integer-aligned fill, so the diagram stays on the same pixel grid as the room. */
function px(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, c: string) {
  ctx.fillStyle = c;
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}

/** Bresenham, so every spoke and edge is a hard one-pixel line. */
function line(
  ctx: CanvasRenderingContext2D,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  color: string,
  dashed = false,
) {
  let x = Math.round(x0);
  let y = Math.round(y0);
  const ex = Math.round(x1);
  const ey = Math.round(y1);
  const dx = Math.abs(ex - x);
  const dy = -Math.abs(ey - y);
  const sx = x < ex ? 1 : -1;
  const sy = y < ey ? 1 : -1;
  let err = dx + dy;
  let step = 0;

  for (;;) {
    if (!dashed || step % 4 < 2) px(ctx, x, y, 1, 1, color);
    if (x === ex && y === ey) break;
    const e2 = 2 * err;
    if (e2 >= dy) {
      err += dy;
      x += sx;
    }
    if (e2 <= dx) {
      err += dx;
      y += sy;
    }
    step++;
  }
}

/**
 * The skill diagram.
 *
 * One axis per competency, drawn from the department's own standard rather than
 * a fixed set. Competencies the resume did not evidence are drawn with a dashed
 * spoke and a hollow marker at the centre, so the shape shows which parts of
 * itself are supported — a filled polygon over an unevidenced axis would be a
 * confident-looking lie.
 */
export function SkillRadar({
  competencies,
  seated,
}: {
  competencies: CompetencyOutcome[];
  seated?: boolean;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx || competencies.length < 3) return;

    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, SIZE, SIZE);

    const n = competencies.length;
    const angle = (i: number) => (i / n) * Math.PI * 2 - Math.PI / 2;
    const at = (i: number, radius: number) => ({
      x: CX + Math.cos(angle(i)) * radius,
      y: CY + Math.sin(angle(i)) * radius,
    });

    // rings
    for (const frac of [0.33, 0.66, 1]) {
      for (let i = 0; i < n; i++) {
        const a = at(i, R * frac);
        const b = at((i + 1) % n, R * frac);
        line(ctx, a.x, a.y, b.x, b.y, frac === 1 ? "#2a3454" : "#1d2540");
      }
    }

    // spokes — dashed where the competency was never evidenced
    competencies.forEach((c, i) => {
      const tip = at(i, R);
      line(ctx, CX, CY, tip.x, tip.y, c.reached ? "#2a3454" : "#243052", !c.reached);
    });

    // the shape itself, over the reached axes only
    const points = competencies.map((c, i) =>
      at(i, c.reached ? Math.max(4, (Math.max(0, Math.min(10, c.score)) / 10) * R) : 0),
    );
    const stroke = seated ? "#f2b544" : "#7f95c4";
    const fill = seated ? "rgba(242,181,68,0.22)" : "rgba(127,149,196,0.20)";

    ctx.beginPath();
    points.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();

    points.forEach((p, i) => {
      const q = points[(i + 1) % n];
      line(ctx, p.x, p.y, q.x, q.y, stroke);
    });

    // markers: solid on a scored axis, hollow where nothing supported one
    competencies.forEach((c, i) => {
      const p = points[i];
      if (c.reached) {
        px(ctx, p.x - 1, p.y - 1, 3, 3, stroke);
        px(ctx, p.x, p.y, 1, 1, "#ffe9b8");
      } else {
        px(ctx, p.x - 2, p.y - 2, 5, 1, "#3c4a72");
        px(ctx, p.x - 2, p.y + 2, 5, 1, "#3c4a72");
        px(ctx, p.x - 2, p.y - 1, 1, 3, "#3c4a72");
        px(ctx, p.x + 2, p.y - 1, 1, 3, "#3c4a72");
      }
    });
  }, [competencies, seated]);

  if (competencies.length < 3) return null;

  const reached = competencies.filter((c) => c.reached).length;

  return (
    <figure className="m-0">
      <canvas
        ref={ref}
        width={SIZE}
        height={SIZE}
        className="pixel block w-full"
        role="img"
        aria-label={`Skill diagram across ${competencies.length} competencies, ${reached} of them evidenced.`}
      />
      <figcaption className="mt-2 text-slate-400">
        {reached} of {competencies.length} axes evidenced. Dashed spokes are competencies the
        resume did not speak to.
      </figcaption>
    </figure>
  );
}
