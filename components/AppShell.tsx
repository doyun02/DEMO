"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { Drawer } from "./Drawer";
import { isHrRoute } from "@/lib/session/hr";

/**
 * The HR chrome — drawer, header, sign-out. Only the HR side gets it: the
 * landing page and the applicant flow are a different product with a different
 * shape, and hanging a hiring-team menu off them would be worse than useless.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isRoom = pathname === "/room";

  if (!isHrRoute(pathname)) return <>{children}</>;

  return (
    <div className="min-h-screen bg-ink-900">
      <Drawer open={open} onClose={() => setOpen(false)} />

      <header className="sticky top-0 z-30 flex items-center gap-4 border-b-2 border-ink-600 bg-ink-900/95 px-4 py-3 backdrop-blur">
        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
          className="pixel-btn px-4 py-3 font-pixel text-[12px] leading-none"
        >
          ☰
        </button>
        <Link href="/room" className="font-pixel text-[10px] tracking-wider text-brass-500">
          HIRESCOPE
        </Link>
        <button
          onClick={async () => {
            await fetch("/api/hr/session", { method: "DELETE" });
            router.push("/");
            router.refresh();
          }}
          className="pixel-btn ml-auto px-3 py-2 font-pixel text-[8px] uppercase tracking-wider"
        >
          Sign out
        </button>
      </header>

      <main className={isRoom ? "" : "mx-auto w-full max-w-4xl px-4 py-8"}>{children}</main>
    </div>
  );
}
