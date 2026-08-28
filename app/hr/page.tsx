"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense, useState } from "react";

function SignInForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") ?? "/room";

  const [id, setId] = useState("");
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/hr/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, passcode }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!data.ok) {
        setError(data.error ?? "Sign-in failed.");
        return;
      }
      router.push(next);
      router.refresh();
    } catch {
      setError("The request never reached the server.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="pixel-frame w-full max-w-md p-6">
      <h1 className="font-pixel text-[13px] text-brass-100">HR sign in</h1>
      <p className="mt-3 text-slate-400">
        One shared passcode, set on the server. This is access control for a demo, not
        authentication — there are no accounts behind it.
      </p>

      <div className="mt-6 space-y-4">
        <div>
          <label
            htmlFor="hr-id"
            className="mb-2 block font-pixel text-[8px] uppercase tracking-wider text-slate-400"
          >
            Id
          </label>
          <input
            id="hr-id"
            value={id}
            autoComplete="username"
            onChange={(e) => setId(e.target.value)}
            className="pixel-input w-full px-3 py-3"
          />
        </div>
        <div>
          <label
            htmlFor="hr-pass"
            className="mb-2 block font-pixel text-[8px] uppercase tracking-wider text-slate-400"
          >
            Passcode
          </label>
          <input
            id="hr-pass"
            type="password"
            value={passcode}
            autoComplete="current-password"
            onChange={(e) => setPasscode(e.target.value)}
            className="pixel-input w-full px-3 py-3"
          />
        </div>
      </div>

      {error && (
        <p className="mt-4 border-2 border-verdict-fail p-3 text-verdict-fail" role="alert">
          {error}
        </p>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={busy || !id || !passcode}
          className="pixel-btn pixel-btn--primary px-4 py-3 font-pixel text-[9px] uppercase tracking-wider disabled:opacity-40"
        >
          {busy ? "Checking…" : "Sign in"}
        </button>
        <Link href="/" className="text-slate-400 underline">
          Back
        </Link>
      </div>
    </form>
  );
}

export default function HrSignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-16">
      <Suspense fallback={<p className="text-slate-400">Loading…</p>}>
        <SignInForm />
      </Suspense>
    </main>
  );
}
