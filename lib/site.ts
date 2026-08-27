/**
 * One place for the site's public identity. Change SITE_URL here and the
 * canonical link, Open Graph tags and any absolute URL follow.
 */
export const SITE = {
  name: "Judgment Track",
  /** Canonical production origin. No trailing slash. */
  url: "https://judgmenttrack.app",
  tagline: "Every judgment leaves a record.",
  description:
    "An AI screens every resume against HR's criteria, scores it out of 10, and seats only the five who clear the bar — and every judgment it makes leaves an inspectable record behind.",
} as const;
