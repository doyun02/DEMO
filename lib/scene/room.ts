import {
  ROOM,
  SCENE_H,
  SCENE_W,
  WOOD,
  candidatePalette,
  type CandidatePalette,
} from "./palette";
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

/**
 * A candidate as the renderer sees them right now — not "in seat 3", but "at
 * this x, this far out of their chair". The choreography module produces these;
 * a settled room is just every actor sitting at its own seat.
 */
export type SceneActor = {
  key: string;
  palette: CandidatePalette;
  /** Scene x of the sprite's centre. */
  x: number;
  /** 0 seated, up to STAND_LIFT standing. */
  lift: number;
  walking: boolean;
  selected: boolean;
};

export type SceneState = {
  /** Where the room settles: drives chairs, nameplates and the evidence board. */
  seats: SeatOccupant[];
  /** Who is actually on screen this frame, and where. */
  actors: SceneActor[];
  selectedIndex: number | null;
  hoverIndex: number | null;
  timeMs: number;
  reducedMotion: boolean;
  /** true while a screening run is in flight — the AI terminal works visibly. */
  aiBusy: boolean;
  /** 0 closed, 1 fully open — driven by whoever is near the doorway. */
  doorOpenness: number;
};

/**
 * The judge uses the candidates' own palette type and rig, but a fixed, muted
 * set rather than a seeded one: they sit closest to the lamp, so a bright
 * palette here pulls the eye off the row that actually matters.
 */
const HR_PALETTE: CandidatePalette = {
  ...candidatePalette("hr-interviewer"),
  hair: "#2a1c14",
  hairShade: "#170e0a",
  outfit: "#3a3f52",
  outfitShade: "#242838",
  accent: "#8a5c17",
  hairStyle: 0,
  collar: 0,
};

/** Seat centres, evenly spread along the candidate panel desk. */
export const SEAT_XS = [88, 140, 192, 244, 296];

/** Scene x candidates walk to and from. The door sits behind the bench's right
 *  end, so a walker's lower body is hidden the whole way across. */
export const DOOR_X = 352;
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
    // Weaker than at night: the room is not relying on these any more.
    const g = ctx.createLinearGradient(0, 13, 0, 120);
    g.addColorStop(0, `rgba(200,214,248,${0.07 * flick})`);
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
  const x = 244;
  const y = 20;
  const w = 68;
  const h = 48;

  px(ctx, x - 3, y - 3, w + 6, h + 6, "#4a4256"); // frame
  px(ctx, x - 2, y - 2, w + 4, h + 4, "#5e5368");

  // early morning: cool at the top of the sky, warm along the horizon
  const g = ctx.createLinearGradient(0, y, 0, y + h);
  g.addColorStop(0, "#6f9ad4");
  g.addColorStop(0.4, "#a8c4e8");
  g.addColorStop(0.72, "#f0d2a8");
  g.addColorStop(1, "#f6b878");
  ctx.fillStyle = g;
  ctx.fillRect(x, y, w, h);

  // the sun, low and hazy
  const sunX = x + w - 20;
  const sunY = y + h - 20;
  const halo = ctx.createRadialGradient(sunX, sunY, 2, sunX, sunY, 26);
  halo.addColorStop(0, "rgba(255,246,214,0.95)");
  halo.addColorStop(0.4, "rgba(255,228,168,0.45)");
  halo.addColorStop(1, "rgba(255,228,168,0)");
  ctx.fillStyle = halo;
  ctx.fillRect(x, y, w, h);
  px(ctx, sunX - 3, sunY - 3, 6, 6, "#fffaf0");
  px(ctx, sunX - 4, sunY - 2, 8, 4, "#fff4d8");
  px(ctx, sunX - 2, sunY - 4, 4, 8, "#fff4d8");

  // skyline, catching the light on its upper edges
  for (let i = 0; i < 7; i++) {
    const bw = 6 + Math.floor(rnd(i * 11.3) * 10);
    const bh = 5 + Math.floor(rnd(i * 5.9) * 13);
    const bx = x + i * 10;
    px(ctx, bx, y + h - bh, bw, bh, "#8f7a92");
    px(ctx, bx, y + h - bh, bw, 1, "#c4a89f");
  }

  // a bird or two, because a still sky reads as a painting
  const drift = (t / 90) % (w + 40);
  for (let i = 0; i < 2; i++) {
    const bx = x + w + 12 - drift + i * 14;
    const by = y + 10 + i * 5 + Math.round(Math.sin(t / 700 + i) * 2);
    if (bx > x + 2 && bx < x + w - 4) {
      px(ctx, bx, by, 2, 1, "#5a5570");
      px(ctx, bx + 2, by - 1, 2, 1, "#5a5570");
    }
  }

  // mullions
  px(ctx, x + w / 2 - 1, y, 2, h, "#5e5368");
  px(ctx, x, y + h / 2 - 1, w, 2, "#5e5368");
}

/**
 * The shaft of light the window throws across the room. This is what makes the
 * scene read as morning rather than as the night scene with a brighter window —
 * a lit window in a dark room is a lamp, not a time of day.
 */
function drawSunShaft(ctx: Ctx, t: number, reduced: boolean) {
  const drift = reduced ? 0 : Math.sin(t / 4200) * 3;

  ctx.save();
  const g = ctx.createLinearGradient(292, 30, 150, SCENE_H);
  g.addColorStop(0, "rgba(255,240,205,0.30)");
  g.addColorStop(0.45, "rgba(255,236,196,0.13)");
  g.addColorStop(1, "rgba(255,232,190,0)");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(246 + drift, 22);
  ctx.lineTo(312 + drift, 22);
  ctx.lineTo(214 + drift, SCENE_H);
  ctx.lineTo(38 + drift, SCENE_H);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // a bright patch where the shaft lands on the bench
  const pool = ctx.createRadialGradient(206, ROW_DESK_Y + 8, 6, 206, ROW_DESK_Y + 8, 96);
  pool.addColorStop(0, "rgba(255,238,198,0.24)");
  pool.addColorStop(1, "rgba(255,238,198,0)");
  ctx.fillStyle = pool;
  ctx.fillRect(90, ROW_DESK_Y - 30, 240, 90);
}

/**
 * The corkboard. This is the thematic signature of the app: the visible,
 * permanent record — candidate cards pinned and strung to the criteria they
 * were judged against.
 */
function drawEvidenceBoard(ctx: Ctx, seats: SeatOccupant[]) {
  const x = 8;
  const y = 22;
  const w = 80;
  const h = 62;

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

/**
 * The door candidates arrive through and leave by. Its base is behind the bench,
 * so the room never has to draw a walking pair of legs.
 */
function drawDoor(ctx: Ctx, openness: number) {
  const x = 330;
  const y = 48;
  const w = 44;
  const h = ROW_DESK_Y - y + 6;

  px(ctx, x - 4, y - 4, w + 8, h + 4, "#241c30"); // architrave
  px(ctx, x - 4, y - 4, w + 8, 2, "#3a2c48");
  px(ctx, x - 2, y - 2, w + 4, h + 2, "#181428");

  if (openness <= 0.02) {
    // closed: a panelled door
    px(ctx, x, y, w, h, "#3d2a1c");
    px(ctx, x, y, w, 2, "#5a3f2a");
    px(ctx, x + 4, y + 6, w - 8, 26, "#33241a");
    px(ctx, x + 4, y + 6, w - 8, 1, "#4a3423");
    px(ctx, x + 4, y + 38, w - 8, 24, "#33241a");
    px(ctx, x + 4, y + 38, w - 8, 1, "#4a3423");
    px(ctx, x + w - 9, y + 34, 4, 4, "#c98a25"); // handle
    return;
  }

  // open: the corridor beyond, and the leaf swung back against the wall
  const gap = Math.round(w * Math.min(1, openness));
  px(ctx, x, y, w, h, "#120d0a"); // the dark corridor
  px(ctx, x, y, gap, h, "#4a3a22"); // lit from beyond
  const g = ctx.createLinearGradient(x, y, x, y + h);
  g.addColorStop(0, "rgba(255,226,166,0.55)");
  g.addColorStop(0.6, "rgba(255,214,130,0.22)");
  g.addColorStop(1, "rgba(255,214,130,0.05)");
  ctx.fillStyle = g;
  ctx.fillRect(x, y, gap, h);
  px(ctx, x + gap - 2, y, 2, h, "#ffe9b8"); // the bright edge of the opening

  const leaf = Math.max(4, w - gap);
  px(ctx, x + w - leaf, y, leaf, h, "#33241a");
  px(ctx, x + w - leaf, y, leaf, 2, "#4a3423");
  px(ctx, x + w - leaf, y, 1, h, "#5a3f2a");

  // spill across the bench in front of the doorway
  const spill = ctx.createRadialGradient(x + gap / 2, ROW_DESK_Y, 4, x + gap / 2, ROW_DESK_Y, 70);
  spill.addColorStop(0, `rgba(255,220,150,${(0.20 * openness).toFixed(3)})`);
  spill.addColorStop(1, "rgba(255,220,150,0)");
  ctx.fillStyle = spill;
  ctx.fillRect(x - 70, y, 140 + w, h + 30);
}

function drawFilingCabinets(ctx: Ctx) {
  const draw = (x: number, w: number) => {
    px(ctx, x, 78, w, 40, "#2a3150");
    px(ctx, x, 78, w, 2, "#3a4368");
    px(ctx, x + w - 2, 80, 2, 38, "#1b2038");
    for (let i = 0; i < 3; i++) {
      const dy = 82 + i * 12;
      px(ctx, x + 3, dy, w - 8, 10, "#232a45");
      px(ctx, x + 3, dy, w - 8, 1, "#3a4368");
      px(ctx, x + w / 2 - 4, dy + 4, 8, 2, "#7f95c4"); // handle
    }
  };
  draw(4, 34);
  // a stack of paper on the cabinet
  px(ctx, 10, 72, 20, 6, "#d9d2c2");
  px(ctx, 10, 72, 20, 1, "#f0ebdd");
  px(ctx, 12, 70, 16, 2, "#c9c1ae");
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

/**
 * Idle behaviour. Every candidate runs the same small loop out of phase with
 * everyone else, so the row is never still and never synchronised: a slow
 * breath, an occasional blink, a glance sideways at a rival, a hand lifting off
 * the desk. When the AI terminal is working, they all look up at it.
 */
function idleState(seed: number, t: number, aiBusy: boolean, reduced: boolean) {
  if (reduced) return { breath: 0, blinking: false, glance: 0 as const, lookUp: false, fidget: 0 as const };

  const phase = (period: number, offset: number) => ((t / period + offset) % 1 + 1) % 1;
  const off = (seed % 97) / 97;

  const blink = phase(5200, off) < 0.028;
  const glanceP = phase(8600, off * 1.7);
  const glance: -1 | 0 | 1 = glanceP < 0.06 ? -1 : glanceP > 0.94 ? 1 : 0;
  const fidget: 0 | 1 = phase(6400, off * 2.3) < 0.09 ? 1 : 0;

  return {
    breath: Math.floor((t / 900 + off * 2) % 2) === 0 ? 0 : 1,
    blinking: blink,
    glance,
    lookUp: aiBusy,
    fidget,
  };
}

function hashKey(key: string): number {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return h;
}

function drawCandidateRow(ctx: Ctx, s: SceneState) {
  // Chairs first — every chair is drawn, and a seated sprite covers its own.
  for (let i = 0; i < SEAT_XS.length; i++) drawEmptyChair(ctx, SEAT_XS[i], ROW_DESK_Y);

  // Actors, back-to-front by x so overlaps during a crossing look right.
  const ordered = [...s.actors].sort((a, b) => a.x - b.x);
  for (const actor of ordered) {
    const seed = hashKey(actor.key);
    const idle = idleState(seed, s.timeMs, s.aiBusy, s.reducedMotion);
    const walkBob =
      actor.walking && !s.reducedMotion ? (Math.floor(s.timeMs / 130) % 2 as 0 | 1) : 0;

    // A candidate out of their chair leans forward slightly as they rise.
    const y = SPRITE_TOP - Math.round(actor.lift);

    if (actor.lift > 0.5) {
      // chair pushed back, so the empty chair still reads while they are up
      px(ctx, Math.round(actor.x) - 11, ROW_DESK_Y - 24, 22, 20, "#141930");
    }

    drawCandidate(ctx, Math.round(actor.x) - 16, y - walkBob, actor.palette, {
      ...idle,
      breath: actor.walking ? 0 : idle.breath,
      selected: actor.selected,
      bob: walkBob,
      fidget: actor.walking ? 0 : idle.fidget,
    });
  }

  // the long panel desk in front of the row
  px(ctx, 0, ROW_DESK_Y, SCENE_W, 4, WOOD.topLight);
  px(ctx, 0, ROW_DESK_Y + 4, SCENE_W, 18, WOOD.face);
  px(ctx, 0, ROW_DESK_Y + 22, SCENE_W, 2, WOOD.edge);
  for (const x of [62, 114, 166, 218, 270, 322]) px(ctx, x, ROW_DESK_Y + 4, 2, 18, WOOD.edge);

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
  g.addColorStop(0, `rgba(255,226,164,${(0.30 * flick).toFixed(3)})`);
  g.addColorStop(0.35, `rgba(250,204,120,${(0.13 * flick).toFixed(3)})`);
  g.addColorStop(0.7, `rgba(242,190,96,${(0.05 * flick).toFixed(3)})`);
  g.addColorStop(1, "rgba(242,181,68,0)");
  ctx.fillStyle = g;
  ctx.fillRect(110, 92, 274, SCENE_H - 92);

  // the beam itself — wide and soft, so it never reads as a drawn line
  ctx.save();
  const bg = ctx.createLinearGradient(325, 152, 250, 216);
  bg.addColorStop(0, `rgba(255,230,180,${(0.11 * flick).toFixed(3)})`);
  bg.addColorStop(0.6, `rgba(255,222,150,${(0.04 * flick).toFixed(3)})`);
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
  // Motes live in the sun shaft first — that is the classic morning tell — with
  // a few left in the lamp pool and under the ceiling fixtures.
  const zones: Array<[number, number, number, number, string]> = [
    [80, 26, 210, 170, "rgba(255,244,214,"],
    [230, 130, 130, 80, "rgba(255,232,180,"],
    [40, 30, 80, 90, "rgba(226,236,255,"],
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

/**
 * Ambient fill.
 *
 * Morning light is not just a shaft — it bounces. Everything in the room sits a
 * stop or two brighter than it did at night, cooler in the upper half where the
 * sky reaches and warmer down near the floor where the light has bounced off the
 * wood. Without this the scene reads as dusk with a bright window in it.
 */
function drawMorningFill(ctx: Ctx) {
  const g = ctx.createLinearGradient(0, 0, 0, SCENE_H);
  g.addColorStop(0, "rgba(150,180,230,0.16)");
  g.addColorStop(0.5, "rgba(190,196,224,0.12)");
  g.addColorStop(1, "rgba(232,196,150,0.10)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, SCENE_W, SCENE_H);

  // the window wall is closest to the source
  const side = ctx.createLinearGradient(SCENE_W, 0, 120, 0);
  side.addColorStop(0, "rgba(255,238,200,0.13)");
  side.addColorStop(1, "rgba(255,238,200,0)");
  ctx.fillStyle = side;
  ctx.fillRect(0, 0, SCENE_W, SCENE_H);
}

function drawVignette(ctx: Ctx) {
  const g = ctx.createRadialGradient(SCENE_W / 2, SCENE_H / 2, 80, SCENE_W / 2, SCENE_H / 2, 260);
  g.addColorStop(0, "rgba(14,16,28,0)");
  g.addColorStop(0.7, "rgba(14,16,28,0.14)");
  g.addColorStop(1, "rgba(14,16,28,0.42)");
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
  drawDoor(ctx, s.doorOpenness);
  drawAITerminal(ctx, t, s.aiBusy, s.reducedMotion);
  drawSunShaft(ctx, t, s.reducedMotion);
  drawCandidateRow(ctx, s);
  drawHRDesk(ctx, t, s.reducedMotion);
  drawHRBack(ctx, 192, SCENE_H, HR_PALETTE, s.reducedMotion ? 0 : Math.floor((t / 1300) % 2));
  drawLampLight(ctx, t, s.reducedMotion);
  drawMorningFill(ctx);
  if (!s.reducedMotion) drawDust(ctx, t);
  if (s.selectedIndex !== null && s.seats[s.selectedIndex]) drawSpotlight(ctx, s.selectedIndex);
  drawVignette(ctx);
}
