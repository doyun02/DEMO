import { NextResponse } from "next/server";
import {
  HR_COOKIE,
  configuredCredentials,
  hasConfiguredPasscode,
  sessionToken,
} from "@/lib/session/hr";

export const runtime = "nodejs";

/** Sign in. The passcode is compared on the server; it never reaches the client. */
export async function POST(request: Request) {
  let body: { id?: string; passcode?: string };
  try {
    body = (await request.json()) as { id?: string; passcode?: string };
  } catch {
    return NextResponse.json({ ok: false, error: "Malformed request." }, { status: 400 });
  }

  if (process.env.NODE_ENV === "production" && !hasConfiguredPasscode()) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "No HR passcode is configured on this deployment, so the HR side is closed. "
          + "Set HR_PASSCODE in the host's environment settings.",
      },
      { status: 503 },
    );
  }

  const expected = configuredCredentials();
  const idOk = (body.id ?? "").trim() === expected.id;
  const passOk = (body.passcode ?? "") === expected.passcode;

  // One message for both failures, so the form cannot be used to discover
  // whether an id exists.
  if (!idOk || !passOk) {
    return NextResponse.json(
      { ok: false, error: "That id and passcode do not match." },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: HR_COOKIE,
    value: sessionToken(expected.id, expected.passcode),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  return response;
}

/** Sign out. */
export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set({ name: HR_COOKIE, value: "", path: "/", maxAge: 0 });
  return response;
}
