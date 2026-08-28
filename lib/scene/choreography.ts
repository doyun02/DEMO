/**
 * Seat choreography.
 *
 * A screening run doesn't just change a list — it changes who is in the room.
 * Candidates who made the cut walk in through the door, candidates whose rank
 * moved get up and change seats, and candidates who dropped out of the top five
 * walk back out. This module turns "who sat where before" and "who sits where
 * now" into a timeline the renderer can sample at any moment.
 *
 * It is pure: no canvas, no React, no clock of its own.
 */

export type ActorKind = "stay" | "enter" | "move" | "leave";

export type SeatMove = {
  candidateId: string;
  kind: ActorKind;
  /** Seat index the candidate is coming from; null when entering. */
  fromSlot: number | null;
  /** Seat index the candidate is going to; null when leaving. */
  toSlot: number | null;
  /** ms to wait before this actor starts, so the room doesn't move as one block. */
  delay: number;
};

export type Choreography = {
  moves: SeatMove[];
  /** Total wall-clock length, in ms. */
  duration: number;
};

/** How far a standing candidate's head rises above the seated pose, in pixels. */
export const STAND_LIFT = 9;

const TIMING = {
  stand: 260,
  sit: 260,
  /** px per ms — a walk, not a march. */
  walkSpeed: 0.15,
  minWalk: 240,
  /** Enterers need the widest gap: they share one doorway and one lane, so a
   *  tight stagger turns the arrival into a huddle instead of a queue. */
  enterStagger: 340,
  leaveStagger: 220,
  moveStagger: 200,
  /** Enterers hold back until the room has started clearing. */
  enterHold: 250,
  moveHold: 160,
};

function walkDuration(fromX: number, toX: number): number {
  return Math.max(TIMING.minWalk, Math.abs(toX - fromX) / TIMING.walkSpeed);
}

/**
 * Diff two seatings. `prev` and `next` are arrays of candidate ids (or null) by
 * seat index — the same length, one entry per chair.
 */
export function planChoreography(
  prev: Array<string | null>,
  next: Array<string | null>,
  seatX: number[],
  doorX: number,
): Choreography {
  const prevSlotOf = new Map<string, number>();
  prev.forEach((id, i) => id && prevSlotOf.set(id, i));
  const nextSlotOf = new Map<string, number>();
  next.forEach((id, i) => id && nextSlotOf.set(id, i));

  const moves: SeatMove[] = [];

  // Anyone who was seated and no longer is walks out.
  let leaveIndex = 0;
  prevSlotOf.forEach((slot, id) => {
    if (nextSlotOf.has(id)) return;
    moves.push({
      candidateId: id,
      kind: "leave",
      fromSlot: slot,
      toSlot: null,
      delay: leaveIndex++ * TIMING.leaveStagger,
    });
  });

  // Anyone seated in both, in a different chair, gets up and moves across.
  let moveIndex = 0;
  nextSlotOf.forEach((slot, id) => {
    const was = prevSlotOf.get(id);
    if (was === undefined) return;
    if (was === slot) {
      moves.push({ candidateId: id, kind: "stay", fromSlot: slot, toSlot: slot, delay: 0 });
      return;
    }
    moves.push({
      candidateId: id,
      kind: "move",
      fromSlot: was,
      toSlot: slot,
      delay: TIMING.moveHold + moveIndex++ * TIMING.moveStagger,
    });
  });

  // Everyone new walks in.
  let enterIndex = 0;
  nextSlotOf.forEach((slot, id) => {
    if (prevSlotOf.has(id)) return;
    moves.push({
      candidateId: id,
      kind: "enter",
      fromSlot: null,
      toSlot: slot,
      delay: TIMING.enterHold + enterIndex++ * TIMING.enterStagger,
    });
  });

  const duration = moves.reduce((max, m) => Math.max(max, moveDuration(m, seatX, doorX)), 0);
  return { moves, duration };
}

function moveDuration(m: SeatMove, seatX: number[], doorX: number): number {
  switch (m.kind) {
    case "stay":
      return 0;
    case "leave":
      return m.delay + TIMING.stand + walkDuration(seatX[m.fromSlot!], doorX);
    case "enter":
      return m.delay + walkDuration(doorX, seatX[m.toSlot!]) + TIMING.sit;
    case "move":
      return (
        m.delay + TIMING.stand + walkDuration(seatX[m.fromSlot!], seatX[m.toSlot!]) + TIMING.sit
      );
  }
}

export type Pose = {
  /** Scene x of the sprite's centre. */
  x: number;
  /** 0 when seated, STAND_LIFT when fully upright. */
  lift: number;
  walking: boolean;
  /** false once the candidate has stepped through the door. */
  visible: boolean;
};

const ease = (t: number) => t * t * (3 - 2 * t);
const clamp01 = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Sample one actor's pose at time `t` ms into the choreography. */
export function poseAt(m: SeatMove, t: number, seatX: number[], doorX: number): Pose {
  const seatedAt = (slot: number): Pose => ({ x: seatX[slot], lift: 0, walking: false, visible: true });

  if (m.kind === "stay") return seatedAt(m.toSlot!);

  const local = t - m.delay;

  if (m.kind === "enter") {
    if (local <= 0) return { x: doorX, lift: STAND_LIFT, walking: false, visible: false };
    const target = seatX[m.toSlot!];
    const walk = walkDuration(doorX, target);
    if (local < walk) {
      return {
        x: lerp(doorX, target, clamp01(local / walk)),
        lift: STAND_LIFT,
        walking: true,
        visible: true,
      };
    }
    const sitT = clamp01((local - walk) / TIMING.sit);
    return { x: target, lift: STAND_LIFT * (1 - ease(sitT)), walking: false, visible: true };
  }

  if (m.kind === "leave") {
    const origin = seatX[m.fromSlot!];
    if (local <= 0) return seatedAt(m.fromSlot!);
    if (local < TIMING.stand) {
      return {
        x: origin,
        lift: STAND_LIFT * ease(local / TIMING.stand),
        walking: false,
        visible: true,
      };
    }
    const walk = walkDuration(origin, doorX);
    const wt = (local - TIMING.stand) / walk;
    if (wt >= 1) return { x: doorX, lift: STAND_LIFT, walking: false, visible: false };
    return {
      x: lerp(origin, doorX, clamp01(wt)),
      lift: STAND_LIFT,
      walking: true,
      visible: true,
    };
  }

  // move
  const origin = seatX[m.fromSlot!];
  const target = seatX[m.toSlot!];
  if (local <= 0) return seatedAt(m.fromSlot!);
  if (local < TIMING.stand) {
    return { x: origin, lift: STAND_LIFT * ease(local / TIMING.stand), walking: false, visible: true };
  }
  const walk = walkDuration(origin, target);
  const wt = (local - TIMING.stand) / walk;
  if (wt < 1) {
    return {
      x: lerp(origin, target, ease(clamp01(wt))),
      lift: STAND_LIFT,
      walking: true,
      visible: true,
    };
  }
  const sitT = clamp01((local - TIMING.stand - walk) / TIMING.sit);
  return { x: target, lift: STAND_LIFT * (1 - ease(sitT)), walking: false, visible: true };
}
