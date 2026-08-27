import { hashString } from "../id";

/** Scene buffer size. Everything is authored in these coordinates, then
 *  upscaled with image-rendering: pixelated, so pixels stay chunky. */
export const SCENE_W = 384;
export const SCENE_H = 216;

/** Fixed room palette — the dark tribunal set. */
export const ROOM = {
  wallDark: "#111629",
  wall: "#18203a",
  wallLight: "#1e2846",
  wallTrim: "#0c1020",
  ceiling: "#0b0f1c",
  floor: "#1a1526",
  floorDark: "#120e1c",
  rug: "#2a1a2e",
  rugTrim: "#3a2440",

  shadow: "#05070e",

  brass: "#f2b544",
  brassMid: "#c98a25",
  brassDeep: "#8a5c17",
  brassPale: "#ffe9b8",

  cool: "#7f95c4",
  coolPale: "#c3d3f2",
  coolDeep: "#3c4a72",
} as const;

/** Wood tones for the two desks. */
export const WOOD = {
  top: "#5a3f2a",
  topLight: "#6f5036",
  face: "#3d2a1c",
  edge: "#251a12",
} as const;

export type CandidatePalette = {
  skin: string;
  skinShade: string;
  hair: string;
  hairShade: string;
  outfit: string;
  outfitShade: string;
  accent: string;
  hairStyle: 0 | 1 | 2 | 3;
  glasses: boolean;
  collar: 0 | 1 | 2;
};

const SKINS: Array<[string, string]> = [
  ["#f0c8a0", "#c99b74"],
  ["#e0a878", "#b57d4f"],
  ["#c98a5e", "#9c6440"],
  ["#8d5a3b", "#6b4029"],
  ["#5e3a26", "#43281a"],
  ["#f7dcc0", "#d4b190"],
];

const HAIRS: Array<[string, string]> = [
  ["#2a1c14", "#170e0a"],
  ["#4a3020", "#2c1b12"],
  ["#7a5230", "#4e321c"],
  ["#c9a227", "#8f7018"],
  ["#8a8f9c", "#5c616d"],
  ["#3c2a4a", "#241830"],
  ["#8c2f2f", "#5c1c1c"],
];

const OUTFITS: Array<[string, string]> = [
  ["#2f4b7c", "#1d3054"],
  ["#3c6e5a", "#254738"],
  ["#6b3a52", "#452334"],
  ["#4a4a58", "#2e2e38"],
  ["#5a4630", "#382a1c"],
  ["#2f5f6e", "#1c3c47"],
  ["#5c3030", "#3a1c1c"],
];

const ACCENTS = ["#f2b544", "#7f95c4", "#c25e5e", "#5fa887", "#b07fc4", "#d9d2c2"];

/**
 * Distinct look per candidate, same underlying rig — seeded by name so a
 * candidate always renders identically across sessions.
 */
export function candidatePalette(seedSource: string): CandidatePalette {
  const h = hashString(seedSource);
  const pick = <T,>(arr: T[], shift: number): T => arr[(h >>> shift) % arr.length];

  const [skin, skinShade] = pick(SKINS, 0);
  const [hair, hairShade] = pick(HAIRS, 5);
  const [outfit, outfitShade] = pick(OUTFITS, 11);

  return {
    skin,
    skinShade,
    hair,
    hairShade,
    outfit,
    outfitShade,
    accent: pick(ACCENTS, 17),
    hairStyle: ((h >>> 22) % 4) as 0 | 1 | 2 | 3,
    glasses: ((h >>> 26) & 1) === 1,
    collar: ((h >>> 28) % 3) as 0 | 1 | 2,
  };
}
