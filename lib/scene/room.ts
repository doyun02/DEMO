import { ROOM, SCENE_H, SCENE_W, WOOD, type CandidatePalette } from "./palette";
import {
  drawCandidate,
  drawEmptyChair,
  drawHRBack,
  drawTinyText,
  px,
  tinyTextWidth,
  type Ctx,
} from "./sprites";

export type SeatOccupant = {
  candidateId: string;
  name: string;
  score: number;
  palette: CandidatePalette;
} | null;

export type SceneState = {
  seats: SeatOccupant[];
  selectedIndex: number | null;
  hoverIndex: number | null;
  timeMs: number;
  reducedMotion: boolean;
  /** true while a screening run is in flight — the AI terminal works visibly. */
  aiBusy: boolean;
};

/** Seat centres, evenly spread along the candidate panel desk. */
export const SEAT_XS = [54, 123, 192, 261, 330];
/** y of the candidate desk's top edge — sprites sit just above it. */
export const ROW_DESK_Y = 118;
const SPRITE_TOP = ROW_DESK_Y - 32;

/** Clickable region for a seat, in scene coordinates. */
export function seatRect(i: number) {
  return { x: SEAT_XS[i] - 22, y: SPRITE_TOP - 6, w: 44, h: 52 };
}

// ── deterministic noise, so the room never shimmers between renders ──
function rnd(seed: number): number {
  const x = Math.sin(seed * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

/* ────────────────────────────── room shell ───────────────────────── */

function drawWalls(ctx: Ctx) {
  px(ctx, 0, 0, SCENE_W, ROW_DESK_Y + 24, ROOM.wall);

  // vertical wall panelling, slightly lighter behind the candidate row
  for (let x = 0; x < SCENE_W; x += 32) {
    px(ctx, x, 14, 1, 128, ROOM.wallDark);
    px(ctx, x + 1, 14, 1, 128, ROOM.wallLight);
  }
  px(ctx, 0, 100, SCENE_W, 2, ROOM.wallTrim); // chair rail
  px(ctx, 0, 102, SCENE_W, 40, ROOM.wallDark);

  // ceiling
  px(ctx, 0, 0, SCENE_W, 14, ROOM.ceiling);
  px(ctx, 0, 13, SCENE_W, 1, ROOM.wallTrim);
}

function drawFloor(ctx: Ctx) {
  px(ctx, 0, 142, SCENE_W, SCENE_H - 142, ROOM.floor);
  px(ctx, 0, 142, SCENE_W, 2, ROOM.floorDark);
  // floorboards receding toward the camera
  for (let y = 146; y < SCENE_H; y += 8) {
    px(ctx, 0, y, SCENE_W, 1, ROOM.floorDark);
  }
}

function drawCeilingFixtures(ctx: Ctx, t: number, reduced: boolean) {
  for (const x of [96, 288]) {
    px(ctx, x - 14, 6, 28, 4, "#2a3454");
    px(ctx, x - 10, 10, 20, 3, "#cfd8ee");
    px(ctx, x - 8, 13, 16, 1, "#8fa2cc");

    // soft cone, cool
    const flick = reduced ? 1 : 0.94 + 0.06 * Math.sin(t / 700 + x);
    const g = ctx.createLinearGradient(0, 13, 0, 120);
    g.addColorStop(0, `rgba(180,200,245,${0.13 * flick})`);
    g.addColorStop(1, "rgba(180,200,245,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(x - 10, 13);
    ctx.lineTo(x + 10, 13);
    ctx.lineTo(x + 40, 120);
    ctx.lineTo(x - 40, 120);
    ctx.closePath();
    ctx.fill();
  }
}

function drawWindow(ctx: Ctx, t: number) {
  const x = 300;
  const y = 26;
  const w = 72;
  const h = 52;
  px(ctx, x - 3, y - 3, w + 6, h + 6, "#2a2036"); // frame
  px(ctx, x - 2, y - 2, w + 4, h + 4, "#3a2c48");

  // dusk gradient outside
  const g = ctx.createLinearGradient(0, y, 0, y + h);
  g.addColorStop(0, "#1a2450");
  g.addColorStop(0.45, "#4a3560");
  g.addColorStop(0.75, "#8a4a52");
  g.addColorStop(1, "#c9793f");
  ctx.fillStyle = g;
  ctx.fillRect(x, y, w, h);

  // a few stars in the upper band, and a skyline at the bottom
  for (let i = 0; i < 9; i++) {
    const sx = x + 4 + Math.floor(rnd(i * 3.1) * (w - 8));
    const sy = y + 3 + Math.floor(rnd(i * 7.7) * 16);
    const tw = 0.6 + 0.4 * Math.sin(t / 900 + i);
    px(ctx, sx, sy, 1, 1, `rgba(255,240,210,${tw.toFixed(2)})`);
  }
  for (let i = 0; i < 7; i++) {
    const bw = 6 + Math.floor(rnd(i * 11.3) * 10);
    const bh = 6 + Math.floor(rnd(i * 5.9) * 14);
    const bx = x + i * 10;
    px(ctx, bx, y + h - bh, bw, bh, "#241a30");
    if (rnd(i * 2.7) > 0.5) px(ctx, bx + 2, y + h - bh + 2, 1, 1, "#f2b544");
  }

  // mullions
  px(ctx, x + w / 2 - 1, y, 2, h, "#3a2c48");
  px(ctx, x, y + h / 2 - 1, w, 2, "#3a2c48");
}

/**
 * The corkboard. This is the thematic signature of the app: the visible,
 * permanent record — candidate cards pinned and strung to the criteria they
 * were judged against.
 */
function drawEvidenceBoard(ctx: Ctx, seats: SeatOccupant[]) {
  const x = 10;
  const y = 30;
  const w = 84;
  const h = 66;

  px(ctx, x - 2, y - 2, w + 4, h + 4, "#5a3f2a"); // frame
  px(ctx, x, y, w, h, "#7a5a3a"); // cork
  for (let i = 0; i < 60; i++) {
    px(ctx, x + Math.floor(rnd(i) * w), y + Math.floor(rnd(i * 3.3) * h), 1, 1, "#6b4d31");
  }

  // criteria strip along the top
  px(ctx, x + 6, y + 5, 30, 10, "#e8e2d2");
  px(ctx, x + 8, y + 7, 26, 1, "#8a8272");
  px(ctx, x + 8, y + 10, 20, 1, "#8a8272");
  px(ctx, x + 48, y + 5, 30, 10, "#e8e2d2");
  px(ctx, x + 50, y + 7, 26, 1, "#8a8272");
  px(ctx, x + 50, y + 10, 22, 1, "#8a8272");

  // candidate cards, one per occupied seat
  const cards: Array<[number, number]> = [
    [x + 8, y + 28],
    [x + 34, y + 24],
    [x + 60, y + 30],
    [x + 20, y + 47],
    [x + 50, y + 47],
  ];
  cards.forEach(([cx, cy], i) => {
    const occupied = Boolean(seats[i]);
    px(ctx, cx, cy, 16, 14, occupied ? "#e8e2d2" : "#9a8b74");
    px(ctx, cx + 3, cy + 2, 10, 6, occupied ? (seats[i] as NonNullable<SeatOccupant>).palette.hair : "#6b6152");
    px(ctx, cx + 2, cy + 10, 12, 1, "#8a8272");
    px(ctx, cx + 7, cy - 1, 2, 2, occupied ? "#c25e5e" : "#5c5548"); // pin
  });

  // red string from the criteria strips down to each pinned card
  ctx.strokeStyle = "rgba(180,60,60,0.75)";
  ctx.lineWidth = 1;
  cards.forEach(([cx, cy], i) => {
    if (!seats[i]) return;
    ctx.beginPath();
    ctx.moveTo(x + (i % 2 === 0 ? 21 : 63), y + 15);
    ctx.lineTo(cx + 8, cy);
    ctx.stroke();
  });
}

function drawFilingCabinets(ctx: Ctx) {
  const draw = (x: number, w: number) => {
    px(ctx, x, 100, w, 42, "#2a3150");
    px(ctx, x, 100, w, 2, "#3a4368");
    px(ctx, x + w - 2, 102, 2, 40, "#1b2038");
    for (let i = 0; i < 3; i++) {
      const dy = 104 + i * 13;
      px(ctx, x + 3, dy, w - 8, 11, "#232a45");
      px(ctx, x + 3, dy, w - 8, 1, "#3a4368");
      px(ctx, x + w / 2 - 4, dy + 4, 8, 2, "#7f95c4"); // handle
    }
  };
  draw(4, 34);
  draw(346, 34);
  // a stack of paper on the left cabinet
  px(ctx, 10, 94, 20, 6, "#d9d2c2");
  px(ctx, 10, 94, 20, 1, "#f0ebdd");
  px(ctx, 12, 92, 16, 2, "#c9c1ae");
}

/** Wall-mounted AI terminal — the scorer, present as a machine, not a person. */
function drawAITerminal(ctx: Ctx, t: number, busy: boolean, reduced: boolean) {
  const x = 160;
  const y = 22;
  const w = 64;
  const h = 34;

  // mount arm
  px(ctx, x + w / 2 - 3, 14, 6, 8, "#2a3454");
  px(ctx, x - 4, y - 4, w + 8, h + 8, "#1b2038"); // bezel
  px(ctx, x - 4, y - 4, w + 8, 2, "#2f3a5e");
  px(ctx, x - 2, y - 2, w + 4, h + 4, "#0a0d18");

  // screen
  px(ctx, x, y, w, h, "#2a1c08");
  const pulse = reduced ? 1 : 0.85 + 0.15 * Math.sin(t / (busy ? 180 : 1400));
  ctx.fillStyle = `rgba(242,181,68,${(0.16 * pulse).toFixed(3)})`;
  ctx.fillRect(x, y, w, h);

  // readout lines — they scroll while a screening run is in flight
  const rows = 6;
  for (let i = 0; i < rows; i++) {
    const seed = busy && !reduced ? i + Math.floor(t / 140) : i;
    const lw = 8 + Math.floor(rnd(seed * 4.7) * (w - 16));
    px(ctx, x + 4, y + 4 + i * 5, lw, 2, i === rows - 1 ? "#ffe9b8" : "#c98a25");
  }
  // cursor
  const on = reduced ? true : Math.floor(t / 420) % 2 === 0;
  if (on) px(ctx, x + 4, y + h - 6, 4, 3, "#ffe9b8");

  // screen glow spilling onto the wall
  const g = ctx.createRadialGradient(x + w / 2, y + h / 2, 4, x + w / 2, y + h / 2, 74);
  g.addColorStop(0, `rgba(242,181,68,${(0.20 * pulse).toFixed(3)})`);
  g.addColorStop(1, "rgba(242,181,68,0)");
  ctx.fillStyle = g;
  ctx.fillRect(x - 74, y - 40, w + 148, h + 96);

  // label plate
  px(ctx, x + w / 2 - 20, y + h + 6, 40, 6, "#2a3454");
  px(ctx, x + w / 2 - 17, y + h + 8, 34, 2, "#7f95c4");
}

/* ─────────────────────────── candidate row ───────────────────────── */

function drawCandidateRow(ctx: Ctx, s: SceneState) {
  // chairs and occupants sit behind the panel desk
  s.seats.forEach((occ, i) => {
    const cx = SEAT_XS[i];
    if (!occ) {
      drawEmptyChair(ctx, cx, ROW_DESK_Y);
      return;
    }
    px(ctx, cx - 11, ROW_DESK_Y - 26, 22, 22, "#161b30"); // chair back
    const breath =
      s.reducedMotion ? 0 : Math.floor((s.timeMs / 900 + i * 0.37) % 2) === 0 ? 0 : 1;
    const blinkPhase = (s.timeMs / 1000 + i * 1.7) % 5.2;
    drawCandidate(ctx, cx - 16, SPRITE_TOP, occ.palette, {
      breath,
      blinking: !s.reducedMotion && blinkPhase < 0.14,
      selected: s.selectedIndex === i,
    });
  });

  // the long panel desk in front of the row
  px(ctx, 16, ROW_DESK_Y, 352, 4, WOOD.topLight);
  px(ctx, 16, ROW_DESK_Y + 4, 352, 18, WOOD.face);
  px(ctx, 16, ROW_DESK_Y + 22, 352, 2, WOOD.edge);
  for (const x of [16, 118, 220, 322]) px(ctx, x, ROW_DESK_Y + 4, 2, 18, WOOD.edge);

  // nameplates
  s.seats.forEach((occ, i) => {
    const cx = SEAT_XS[i];
    const plateY = ROW_DESK_Y + 8;
    px(ctx, cx - 15, plateY, 30, 10, occ ? "#1b2038" : "#161a2c");
    px(ctx, cx - 15, plateY, 30, 1, occ ? "#3a4368" : "#22283f");
    if (occ) {
      px(ctx, cx - 12, plateY + 3, 24, 2, occ.palette.accent);
      px(ctx, cx - 12, plateY + 6, 16, 1, "#7f95c4");
    } else {
      // VACANT — spelled out, so an empty seat is a statement, not an absence
      const label = "VACANT";
      drawTinyText(ctx, label, cx - Math.floor(tinyTextWidth(label) / 2), plateY + 3, "#586492");
    }
  });

  // hover affordance
  if (s.hoverIndex !== null && s.seats[s.hoverIndex]) {
    const r = seatRect(s.hoverIndex);
    ctx.strokeStyle = "rgba(242,181,68,0.55)";
    ctx.lineWidth = 1;
    ctx.strokeRect(r.x + 0.5, r.y + 0.5, r.w - 1, r.h - 1);
  }
}

/* ───────────────────────────── HR desk ───────────────────────────── */

function drawHRDesk(ctx: Ctx, t: number, reduced: boolean) {
  // rug
  px(ctx, 30, 168, 324, SCENE_H - 168, ROOM.rug);
  px(ctx, 30, 168, 324, 2, ROOM.rugTrim);
  px(ctx, 34, 174, 316, 1, "#40284a");

  // desk top, seen at a shallow angle from behind
  px(ctx, 44, 164, 296, 36, WOOD.top);
  px(ctx, 44, 164, 296, 3, WOOD.topLight);
  px(ctx, 44, 200, 296, 6, WOOD.face);
  px(ctx, 44, 206, 296, 2, WOOD.edge);

  // laptop, lid away from us
  px(ctx, 74, 140, 56, 26, "#1b2038");
  px(ctx, 74, 140, 56, 2, "#2f3a5e");
  px(ctx, 78, 144, 48, 18, "#141a2c");
  px(ctx, 94, 150, 16, 8, "#2a3454"); // logo plate
  px(ctx, 70, 164, 64, 4, "#232a45"); // keyboard deck
  const lg = ctx.createRadialGradient(102, 164, 4, 102, 164, 46);
  lg.addColorStop(0, "rgba(127,149,196,0.30)");
  lg.addColorStop(1, "rgba(127,149,196,0)");
  ctx.fillStyle = lg;
  ctx.fillRect(56, 130, 92, 66);

  // papers
  px(ctx, 280, 176, 34, 22, "#d9d2c2");
  px(ctx, 283, 173, 34, 22, "#e8e2d2");
  for (let i = 0; i < 5; i++) px(ctx, 287, 178 + i * 3, 26 - (i % 2) * 6, 1, "#9a927f");
  px(ctx, 284, 174, 8, 4, "#c25e5e"); // a red stamp

  // coffee cup
  px(ctx, 286, 156, 14, 14, "#cfd8ee");
  px(ctx, 286, 156, 14, 3, "#eef2fb");
  px(ctx, 288, 159, 10, 8, "#3a2418");
  px(ctx, 300, 160, 3, 6, "#cfd8ee"); // handle
  if (!reduced) {
    const s = Math.sin(t / 600);
    px(ctx, 292 + Math.round(s), 150, 1, 4, "rgba(220,230,250,0.35)");
    px(ctx, 294 - Math.round(s), 146, 1, 4, "rgba(220,230,250,0.22)");
  }

  // nameplate, back of
  px(ctx, 44, 178, 34, 12, "#2a3454");
  px(ctx, 44, 178, 34, 2, "#3f4c78");
  px(ctx, 46, 188, 30, 2, "#1b2038");

  // desk lamp, right — the single warm source in the room
  px(ctx, 322, 178, 14, 4, "#2a3454"); // base
  px(ctx, 327, 156, 3, 24, "#3a4368"); // stem
  px(ctx, 314, 146, 22, 10, "#8a5c17"); // shade
  px(ctx, 314, 146, 22, 2, "#c98a25");
  px(ctx, 317, 156, 16, 2, "#ffe9b8"); // bulb
}

/** Warm pool from the desk lamp, laid over the foreground. */
function drawLampLight(ctx: Ctx, t: number, reduced: boolean) {
  const flick = reduced ? 1 : 0.96 + 0.04 * Math.sin(t / 320) + 0.02 * Math.sin(t / 91);
  const g = ctx.createRadialGradient(322, 154, 6, 322, 154, 190);
  g.addColorStop(0, `rgba(255,222,150,${(0.46 * flick).toFixed(3)})`);
  g.addColorStop(0.35, `rgba(250,196,96,${(0.22 * flick).toFixed(3)})`);
  g.addColorStop(0.7, `rgba(242,181,68,${(0.09 * flick).toFixed(3)})`);
  g.addColorStop(1, "rgba(242,181,68,0)");
  ctx.fillStyle = g;
  ctx.fillRect(110, 92, 274, SCENE_H - 92);

  // the beam itself — wide and soft, so it never reads as a drawn line
  ctx.save();
  const bg = ctx.createLinearGradient(325, 152, 250, 216);
  bg.addColorStop(0, `rgba(255,226,166,${(0.20 * flick).toFixed(3)})`);
  bg.addColorStop(0.6, `rgba(255,214,130,${(0.07 * flick).toFixed(3)})`);
  bg.addColorStop(1, "rgba(255,214,130,0)");
  ctx.fillStyle = bg;
  ctx.beginPath();
  ctx.moveTo(312, 154);
  ctx.lineTo(338, 154);
  ctx.lineTo(344, SCENE_H);
  ctx.lineTo(150, SCENE_H);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

/* ─────────────────────────── atmosphere ──────────────────────────── */

function drawDust(ctx: Ctx, t: number) {
  // motes only live inside the light — the warm pool and the two cool cones
  const zones: Array<[number, number, number, number, string]> = [
    [210, 120, 160, 96, "rgba(255,226,170,"],
    [60, 30, 90, 100, "rgba(200,216,250,"],
    [252, 30, 90, 100, "rgba(200,216,250,"],
  ];
  zones.forEach(([zx, zy, zw, zh, rgb], z) => {
    for (let i = 0; i < 16; i++) {
      const seed = z * 100 + i;
      const speed = 4 + rnd(seed) * 9;
      const y = zy + ((rnd(seed * 1.7) * zh + t / (900 / speed)) % zh);
      const drift = Math.sin(t / 1600 + seed) * 5;
      const x = zx + rnd(seed * 3.3) * zw + drift;
      const a = (0.18 + 0.3 * rnd(seed * 5.1)) * (1 - (y - zy) / zh);
      px(ctx, x, y, 1, 1, `${rgb}${Math.max(0, a).toFixed(2)})`);
    }
  });
}

/** Dim everything but the chosen seat. */
function drawSpotlight(ctx: Ctx, index: number) {
  const cx = SEAT_XS[index];
  const cy = SPRITE_TOP + 18;

  ctx.save();
  const g = ctx.createRadialGradient(cx, cy, 18, cx, cy, 150);
  g.addColorStop(0, "rgba(4,6,12,0)");
  g.addColorStop(0.35, "rgba(4,6,12,0.42)");
  g.addColorStop(1, "rgba(4,6,12,0.72)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, SCENE_W, SCENE_H);

  // their own light cone, brightened
  const bg = ctx.createLinearGradient(cx, 14, cx, ROW_DESK_Y + 20);
  bg.addColorStop(0, "rgba(255,235,190,0.22)");
  bg.addColorStop(1, "rgba(255,235,190,0)");
  ctx.fillStyle = bg;
  ctx.beginPath();
  ctx.moveTo(cx - 8, 14);
  ctx.lineTo(cx + 8, 14);
  ctx.lineTo(cx + 30, ROW_DESK_Y + 20);
  ctx.lineTo(cx - 30, ROW_DESK_Y + 20);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawVignette(ctx: Ctx) {
  const g = ctx.createRadialGradient(SCENE_W / 2, SCENE_H / 2, 80, SCENE_W / 2, SCENE_H / 2, 260);
  g.addColorStop(0, "rgba(4,5,10,0)");
  g.addColorStop(0.7, "rgba(4,5,10,0.28)");
  g.addColorStop(1, "rgba(4,5,10,0.68)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, SCENE_W, SCENE_H);
  // hard pixel border
  px(ctx, 0, 0, SCENE_W, 1, ROOM.shadow);
  px(ctx, 0, SCENE_H - 1, SCENE_W, 1, ROOM.shadow);
  px(ctx, 0, 0, 1, SCENE_H, ROOM.shadow);
  px(ctx, SCENE_W - 1, 0, 1, SCENE_H, ROOM.shadow);
}

/* ──────────────────────────── entry point ────────────────────────── */

export function drawScene(ctx: Ctx, s: SceneState) {
  const t = s.reducedMotion ? 0 : s.timeMs;

  ctx.clearRect(0, 0, SCENE_W, SCENE_H);
  drawWalls(ctx);
  drawFloor(ctx);
  drawCeilingFixtures(ctx, t, s.reducedMotion);
  drawWindow(ctx, t);
  drawEvidenceBoard(ctx, s.seats);
  drawFilingCabinets(ctx);
  drawAITerminal(ctx, t, s.aiBusy, s.reducedMotion);
  drawCandidateRow(ctx, s);
  drawHRDesk(ctx, t, s.reducedMotion);
  drawHRBack(ctx, 192, SCENE_H, s.reducedMotion ? 0 : Math.floor((t / 1300) % 2));
  drawLampLight(ctx, t, s.reducedMotion);
  if (!s.reducedMotion) drawDust(ctx, t);
  if (s.selectedIndex !== null && s.seats[s.selectedIndex]) drawSpotlight(ctx, s.selectedIndex);
  drawVignette(ctx);
}
