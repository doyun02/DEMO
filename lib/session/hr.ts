/**
 * The HR gate.
 *
 * This is access control for a demo, not authentication. It checks one shared
 * passcode against an environment variable and sets a cookie; there are no
 * accounts, no per-user identity, and nothing stopping someone who has the
 * passcode from being anyone. Real auth is still an open item — say so out loud
 * rather than letting a login box imply otherwise.
 *
 * What it does buy: the HR side is not reachable by anyone who wanders onto the
 * public URL, and every model call behind it costs money.
 */
export const HR_COOKIE = "hirescope_hr";

/** Routes only a signed-in HR user may see. */
export const HR_ROUTES = ["/room", "/criteria", "/competencies", "/candidates", "/records"];

export function isHrRoute(pathname: string): boolean {
  return HR_ROUTES.some((r) => pathname === r || pathname.startsWith(`${r}/`));
}

/**
 * The value the cookie must carry. Derived from the configured secret so that a
 * cookie set against an old passcode stops working when the passcode changes.
 */
export function sessionToken(id: string, passcode: string): string {
  let h = 2166136261;
  const input = `${id}:${passcode}`;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(36);
}

/**
 * Whether a passcode has actually been configured.
 *
 * The development default is published in this repo, so falling back to it on a
 * deployed site would hand the HR side to anyone who read the README — along
 * with an API key that bills per screening. In production an unset passcode
 * closes the door instead of leaving a known one in it.
 */
export function hasConfiguredPasscode(): boolean {
  return Boolean(process.env.HR_PASSCODE);
}

export function configuredCredentials(): { id: string; passcode: string } {
  return {
    id: process.env.HR_ID ?? "hr",
    passcode: process.env.HR_PASSCODE ?? "letmein",
  };
}
