/**
 * One place for the site's public identity. Change SITE_URL here and the
 * canonical link, Open Graph tags and any absolute URL follow.
 */
export const SITE = {
  name: "HireScope",
  /**
   * Canonical production origin. No trailing slash.
   *
   * This is the Vercel address the project actually answers on. Point it at a
   * custom domain once one is registered and pointed here — a canonical tag
   * naming an address that does not resolve is worse than no canonical tag.
   */
  url: "https://demo1-alpha-mocha.vercel.app",
  tagline: "Every judgment leaves a record.",
  description:
    "An AI screens every resume against HR's criteria, scores it out of 10, and seats only the five who clear the bar — and every judgment it makes leaves an inspectable record behind.",
} as const;
