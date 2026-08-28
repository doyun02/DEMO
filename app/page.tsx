import Link from "next/link";
import { SITE } from "@/lib/site";

/**
 * The front door. Two ways in, and they are not the same product: one side
 * submits a resume and answers questions, the other decides who sits down.
 */
export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-2xl">
        <header className="mb-12 text-center">
          <h1 className="font-pixel text-[26px] leading-relaxed text-brass-500 sm:text-[34px]">
            HIRE
            <br />
            SCOPE
          </h1>
          <p className="mx-auto mt-6 max-w-md leading-relaxed text-slate-300">
            {SITE.tagline}
          </p>
        </header>

        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/apply"
            className="pixel-frame group flex flex-col p-6 hover:bg-ink-700 focus-visible:bg-ink-700"
          >
            <span className="font-pixel text-[11px] uppercase tracking-wider text-brass-100">
              Applicant
            </span>
            <span className="mt-3 flex-1 leading-relaxed text-slate-400">
              Submit a resume for a role. The screening runs on the spot, and if the panel wants
              to talk, you will be asked before anything starts.
            </span>
            <span className="mt-5 font-pixel text-[9px] uppercase tracking-wider text-brass-500">
              Apply →
            </span>
          </Link>

          <Link
            href="/hr"
            className="pixel-frame group flex flex-col p-6 hover:bg-ink-700 focus-visible:bg-ink-700"
          >
            <span className="font-pixel text-[11px] uppercase tracking-wider text-brass-100">
              HR
            </span>
            <span className="mt-3 flex-1 leading-relaxed text-slate-400">
              The interview room, the standard behind every score, and the record of every
              judgment made. Requires an id and passcode.
            </span>
            <span className="mt-5 font-pixel text-[9px] uppercase tracking-wider text-brass-500">
              Sign in →
            </span>
          </Link>
        </div>

        <p className="mt-10 text-center text-slate-400">
          An AI scores every resume against a standard the hiring team wrote, and seats only the
          five who clear it. A person makes the call — the record survives either way.
        </p>
      </div>
    </main>
  );
}
