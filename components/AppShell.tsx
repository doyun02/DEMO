"use client";

import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { Drawer } from "./Drawer";

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isRoom = pathname === "/";

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
        <span className="font-pixel text-[10px] tracking-wider text-brass-500">
          HIRESCOPE
        </span>
      </header>

      <main className={isRoom ? "" : "mx-auto w-full max-w-4xl px-4 py-8"}>{children}</main>
    </div>
  );
}
