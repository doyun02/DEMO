import type { CandidatePalette } from "./palette";

export type Ctx = CanvasRenderingContext2D;

/** Integer-aligned fill — the only drawing primitive the sprites use, so
 *  nothing ever lands on a half-pixel and softens the art. */
export function px(ctx: Ctx, x: number, y: number, w: number, h: number, color: string) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}

export type SpriteState = {
  /** 0 or 1 — the idle breathing loop. */
  breath: number;
  /** true for the few frames of a blink. */
  blinking: boolean;
  /** true while this candidate is spotlighted. */
  selected: boolean;
};

/**
 * Candidate sprite, 32x32, seated and facing the viewer (i.e. facing the HR desk).
 * Shared rig across every candidate — only palette, hair silhouette, collar and
 * glasses change, so the row reads as one panel of people rather than a zoo.
 */
export function drawCandidate(
  ctx: Ctx,
  ox: number,
  oy: number,
  p: CandidatePalette,
  s: SpriteState,
) {
  const b = s.breath; // 0 or 1 px of vertical give in the torso
  const X = (n: number) => ox + n;
  const Y = (n: number) => oy + n;

  // ── body / shoulders ───────────────────────────────────────────────
  px(ctx, X(5), Y(19 + b), 22, 13, p.outfitShade); // torso block
  px(ctx, X(6), Y(20 + b), 20, 12, p.outfit);
  px(ctx, X(4), Y(21 + b), 3, 11, p.outfitShade); // left arm
  px(ctx, X(25), Y(21 + b), 3, 11, p.outfitShade); // right arm
  px(ctx, X(5), Y(28 + b), 2, 4, p.skinShade); // left hand on the desk
  px(ctx, X(25), Y(28 + b), 2, 4, p.skinShade); // right hand

  // ── collar / neckline: three variants, same footprint ──────────────
  if (p.collar === 0) {
    px(ctx, X(13), Y(19 + b), 6, 5, "#e6e6ee"); // open shirt
    px(ctx, X(15), Y(20 + b), 2, 8, p.accent); // tie
    px(ctx, X(14), Y(28 + b), 4, 2, p.accent);
  } else if (p.collar === 1) {
    px(ctx, X(12), Y(19 + b), 8, 3, "#dfe3ee"); // round collar
    px(ctx, X(13), Y(22 + b), 6, 2, p.outfitShade);
  } else {
    px(ctx, X(12), Y(19 + b), 8, 2, p.accent); // scarf / crew neck
    px(ctx, X(11), Y(21 + b), 10, 1, p.outfitShade);
  }

  // ── neck ───────────────────────────────────────────────────────────
  px(ctx, X(14), Y(16), 4, 4, p.skinShade);

  // ── head ───────────────────────────────────────────────────────────
  px(ctx, X(10), Y(4), 12, 13, p.skin);
  px(ctx, X(10), Y(4), 12, 2, p.skinShade); // brow shading
  px(ctx, X(9), Y(8), 1, 4, p.skinShade); // left ear
  px(ctx, X(22), Y(8), 1, 4, p.skinShade); // right ear
  px(ctx, X(10), Y(15), 12, 2, p.skinShade); // jaw shadow

  // ── hair: four silhouettes over the same skull ─────────────────────
  px(ctx, X(9), Y(2), 14, 4, p.hair);
  px(ctx, X(10), Y(1), 12, 1, p.hairShade);
  if (p.hairStyle === 0) {
    px(ctx, X(9), Y(5), 2, 4, p.hair); // short, tight sides
    px(ctx, X(21), Y(5), 2, 4, p.hair);
    px(ctx, X(10), Y(5), 12, 1, p.hairShade);
  } else if (p.hairStyle === 1) {
    px(ctx, X(8), Y(4), 3, 10, p.hair); // chin-length bob
    px(ctx, X(21), Y(4), 3, 10, p.hair);
    px(ctx, X(8), Y(13), 3, 1, p.hairShade);
    px(ctx, X(21), Y(13), 3, 1, p.hairShade);
  } else if (p.hairStyle === 2) {
    px(ctx, X(8), Y(3), 16, 3, p.hair); // long, past the shoulder
    px(ctx, X(7), Y(5), 3, 15, p.hair);
    px(ctx, X(22), Y(5), 3, 15, p.hair);
    px(ctx, X(7), Y(19), 3, 1, p.hairShade);
    px(ctx, X(22), Y(19), 3, 1, p.hairShade);
  } else {
    px(ctx, X(9), Y(1), 14, 3, p.hair); // pulled back with a bun
    px(ctx, X(14), Y(0), 5, 2, p.hairShade);
    px(ctx, X(9), Y(4), 2, 3, p.hair);
    px(ctx, X(21), Y(4), 2, 3, p.hair);
  }

  // ── face ───────────────────────────────────────────────────────────
  if (s.blinking) {
    px(ctx, X(12), Y(10), 3, 1, p.skinShade);
    px(ctx, X(17), Y(10), 3, 1, p.skinShade);
  } else {
    px(ctx, X(12), Y(9), 3, 2, "#f4f6fb");
    px(ctx, X(17), Y(9), 3, 2, "#f4f6fb");
    px(ctx, X(13), Y(9), 1, 2, "#1a1f2e"); // pupils, angled toward the HR desk
    px(ctx, X(18), Y(9), 1, 2, "#1a1f2e");
  }
  px(ctx, X(15), Y(11), 2, 2, p.skinShade); // nose
  px(ctx, X(14), Y(14), 4, 1, p.skinShade); // mouth

  if (p.glasses) {
    // thin rims only — a filled block reads as sunglasses at this scale
    const rim = "#39405c";
    px(ctx, X(11), Y(8), 5, 1, rim);
    px(ctx, X(11), Y(11), 5, 1, rim);
    px(ctx, X(11), Y(8), 1, 4, rim);
    px(ctx, X(15), Y(8), 1, 4, rim);
    px(ctx, X(16), Y(8), 5, 1, rim);
    px(ctx, X(16), Y(11), 5, 1, rim);
    px(ctx, X(16), Y(8), 1, 4, rim);
    px(ctx, X(20), Y(8), 1, 4, rim);
    px(ctx, X(9), Y(9), 2, 1, rim); // temples
    px(ctx, X(21), Y(9), 2, 1, rim);
  }

  // ── selected: a hard rim-light down the spotlit side ────────────────
  if (s.selected) {
    px(ctx, X(9), Y(4), 1, 12, "#ffe9b8");
    px(ctx, X(8), Y(3), 1, 3, "#ffe9b8");
    px(ctx, X(4), Y(21 + b), 1, 11, "#f2b544");
  }
}

/** Empty chair behind a vacant seat — pushed back from the desk, unused. */
export function drawEmptyChair(ctx: Ctx, cx: number, baseY: number) {
  // backrest
  px(ctx, cx - 10, baseY - 26, 20, 15, "#1b2038");
  px(ctx, cx - 10, baseY - 26, 20, 2, "#2e3757");
  px(ctx, cx - 10, baseY - 13, 20, 2, "#10142a");
  px(ctx, cx - 8, baseY - 23, 16, 10, "#161b30"); // cushion inset
  px(ctx, cx - 8, baseY - 23, 16, 1, "#242c4a");
  // stem and seat
  px(ctx, cx - 2, baseY - 11, 4, 5, "#12162a");
  px(ctx, cx - 11, baseY - 7, 22, 3, "#1b2038");
  px(ctx, cx - 11, baseY - 7, 22, 1, "#2e3757");
  // castors
  px(ctx, cx - 10, baseY - 4, 3, 3, "#10142a");
  px(ctx, cx + 7, baseY - 4, 3, 3, "#10142a");
}

/**
 * A 3x5 pixel font — just enough letters for the VACANT plate. Anything
 * longer belongs in the DOM, not the canvas.
 */
const GLYPHS: Record<string, string[]> = {
  V: ["101", "101", "101", "101", "010"],
  A: ["010", "101", "111", "101", "101"],
  C: ["011", "100", "100", "100", "011"],
  N: ["101", "111", "111", "111", "101"],
  T: ["111", "010", "010", "010", "010"],
};

/** Draw uppercase text in the 3x5 font. Unknown characters render as a gap. */
export function drawTinyText(ctx: Ctx, text: string, x: number, y: number, color: string) {
  let cx = x;
  for (const ch of text.toUpperCase()) {
    const glyph = GLYPHS[ch];
    if (glyph) {
      glyph.forEach((row, ry) => {
        [...row].forEach((bit, rx) => {
          if (bit === "1") px(ctx, cx + rx, y + ry, 1, 1, color);
        });
      });
    }
    cx += 4;
  }
}

/** Width in pixels the 3x5 font needs for a string. */
export function tinyTextWidth(text: string): number {
  return Math.max(0, text.length * 4 - 1);
}

/** Silhouette profile: [y offset from the frame bottom, half-width]. */
const HR_PROFILE: Array<[number, number]> = [
  [-90, 15],
  [-87, 21],
  [-84, 25],
  [-81, 27],
  [-69, 28],
  [-63, 27],
  [-60, 24],
  [-57, 20],
  [-54, 16],
  [-48, 15],
  [-45, 27],
  [-42, 36],
  [-39, 45],
  [-36, 53],
  [-33, 60],
  [-27, 68],
  [-18, 77],
  [-9, 84],
  [0, 90],
];

/** Everything about the figure snaps to this grid, so the contour staircases
 *  like pixel art instead of drifting into a smooth curve. */
const HR_STEP = 3;

/** One knob for the judge's presence in frame. HR_PROFILE is authored at 1.0;
 *  this scales the whole figure — silhouette, rim light and details together. */
const HR_SCALE = 0.66;

/** Scale a profile-space length and snap it to the pixel grid. */
const hs = (n: number) => Math.round(n * HR_SCALE);
/** Same, but snapped to the contour's step grid so edges stay aligned. */
const hsStep = (n: number) => Math.round((n * HR_SCALE) / HR_STEP) * HR_STEP;

const HR_TOP = hsStep(HR_PROFILE[0][0]);

/** Half-width of the figure at a scene-space y offset. */
function hrHalfWidth(yOff: number): number {
  const p = yOff / HR_SCALE; // back into profile space
  // Clamp: above the crown the figure has no width yet, below the last entry it
  // keeps the shoulder width. Without this, the crown row falls through to the
  // widest value and draws a bar across the desk.
  if (p <= HR_PROFILE[0][0]) return hsStep(HR_PROFILE[0][1]);
  let raw = HR_PROFILE[HR_PROFILE.length - 1][1];
  for (let i = 0; i < HR_PROFILE.length - 1; i++) {
    const [y0, w0] = HR_PROFILE[i];
    const [y1, w1] = HR_PROFILE[i + 1];
    if (p >= y0 && p <= y1) {
      const t = y1 === y0 ? 0 : (p - y0) / (y1 - y0);
      raw = w0 + (w1 - w0) * t;
      break;
    }
  }
  return hsStep(raw);
}

/**
 * HR interviewer, seen from behind at the foreground desk — a near-black
 * silhouette with a hard rim light, which is what makes an over-the-shoulder
 * shot read at this scale. Warm rim from the desk lamp on the right, cool fill
 * from the candidate row on the left.
 *
 * The head stays below the candidate sprites, so the judge never hides a seat.
 */
export function drawHRBack(ctx: Ctx, cx: number, baseY: number, breath: number) {
  const b = breath;
  const body = "#080b14";
  const bodyLift = "#0e1220";

  // profile-space landmarks, scaled once
  const neckTop = hs(-48);
  const headBase = hs(-54);
  const crown = hs(-84);

  // ── solid silhouette, in stepped bands ────────────────────────────
  for (let yOff = HR_TOP; yOff <= 0; yOff += HR_STEP) {
    const hw = hrHalfWidth(yOff);
    const y = baseY + yOff + (yOff < neckTop ? b : 0);
    const fill = yOff > hs(-48) && yOff < hs(-36) ? bodyLift : body;
    px(ctx, cx - hw, y, hw * 2, HR_STEP, fill);
  }

  // chair, reading just past the shoulders
  const shoulder = hrHalfWidth(0);
  px(ctx, cx - shoulder - hs(12), baseY - hs(21), hs(12), hs(21), "#0c1019");
  px(ctx, cx + shoulder, baseY - hs(21), hs(12), hs(21), "#0c1019");
  px(ctx, cx - shoulder - hs(12), baseY - hs(21), hs(12), 2, "#222a44");
  px(ctx, cx + shoulder, baseY - hs(21), hs(12), 2, "#4a3512");

  // ── rim light along the contour ────────────────────────────────────
  for (let yOff = HR_TOP; yOff <= -3; yOff += HR_STEP) {
    const hw = hrHalfWidth(yOff);
    const y = baseY + yOff + (yOff < neckTop ? b : 0);
    const onHead = yOff > hs(-87) && yOff < headBase;
    px(ctx, cx + hw - 2, y, 2, HR_STEP, onHead ? "#e0a63a" : yOff < hs(-87) ? "#c98a25" : "#8a5c17");
    px(ctx, cx - hw, y, 2, HR_STEP, onHead ? "#3c4a72" : "#26314f");
  }

  // top cap, so the crown is outlined too
  for (let yOff = HR_TOP; yOff <= crown; yOff += HR_STEP) {
    const hw = hrHalfWidth(yOff);
    const y = baseY + yOff + b;
    px(ctx, cx - hw, y, hw * 2, HR_STEP, yOff < hs(-87) ? "#3a2f1c" : "#211b2a");
    px(ctx, cx + hw - 2, y, 2, HR_STEP, "#c98a25");
    px(ctx, cx - hw, y, 2, HR_STEP, "#2c3a5e");
  }

  // ── a few readable details inside the silhouette ───────────────────
  px(ctx, cx - hs(26), baseY + hs(-53) + b, hs(52), 2, "#161a2c"); // hairline
  px(ctx, cx - hs(20), baseY + hs(-45) + b, hs(40), 2, "#232b46"); // collar
  px(ctx, cx - hs(13), baseY + hs(-51) + b, hs(26), hs(6), "#191d30"); // neck
  px(ctx, cx + hs(4), baseY + hs(-40) + b, hs(26), 2, "#1a2036"); // shoulder seam
  px(ctx, cx - hs(30), baseY + hs(-40) + b, hs(26), 2, "#141827");
}
