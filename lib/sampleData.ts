import { buildSample } from "./sample/build";
import { SAMPLE_DEPARTMENTS as SPECS } from "./sample/departments";

/**
 * A fixed timestamp keeps the seeded runs stable across reloads and machines —
 * a Date.now() here would make every visitor's "screened at" different and the
 * persisted state churn for no reason.
 */
const SEEDED_AT = "2026-08-27T09:00:00.000Z";

const built = buildSample(SPECS, SEEDED_AT);

export const SAMPLE_DEPARTMENTS = built.departments;
export const SAMPLE_CANDIDATES = built.candidates;
/** Seeded demo runs — marked `sample: true` so the UI can say so. */
export const SAMPLE_RUNS = built.runs;
