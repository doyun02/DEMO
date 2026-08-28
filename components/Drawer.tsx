"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { useApp } from "@/lib/store";

const NAV = [
  { href: "/", label: "Interview Room", hint: "the panel, as it stands" },
  { href: "/criteria", label: "Priority Criteria", hint: "must pass, all of them" },
  { href: "/nice-to-have", label: "Nice-to-Have", hint: "bonus, never disqualifying" },
  { href: "/candidates", label: "Candidates", hint: "intake + run screening" },
  { href: "/records", label: "Records", hint: "every judgment, kept" },
];

export function Drawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const departments = useApp((s) => s.departments);
  const activeId = useApp((s) => s.activeDepartmentId);
  const setActive = useApp((s) => s.setActiveDepartment);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    panelRef.current?.querySelector<HTMLElement>("a, button")?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <>
      <div
        aria-hidden={!open}
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/70 ${open ? "" : "pointer-events-none opacity-0"}`}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Main navigation"
        aria-hidden={!open}
        className={`fixed left-0 top-0 z-50 flex h-full w-[min(88vw,320px)] flex-col bg-ink-800 shadow-[6px_0_0_0_#080a12] ${
          open ? "animate-slidein" : "pointer-events-none -translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b-2 border-ink-600 p-4">
          <span className="font-pixel text-[10px] leading-relaxed text-brass-500">
            HIRE
            <br />
            SCOPE
          </span>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="pixel-btn px-3 py-2 font-pixel text-[10px]"
          >
            ✕
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3">
          <ul className="space-y-2">
            {NAV.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    aria-current={active ? "page" : undefined}
                    className={`block border-l-4 px-3 py-3 ${
                      active
                        ? "border-brass-500 bg-ink-700 text-brass-100"
                        : "border-transparent text-slate-300 hover:border-ink-500 hover:bg-ink-700"
                    }`}
                  >
                    <span className="font-pixel text-[9px] uppercase tracking-wider">
                      {item.label}
                    </span>
                    <span className="mt-1 block text-slate-400">{item.hint}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t-2 border-ink-600 p-4">
          <label
            htmlFor="drawer-department"
            className="mb-2 block font-pixel text-[8px] uppercase tracking-wider text-slate-400"
          >
            Department
          </label>
          <select
            id="drawer-department"
            value={activeId}
            onChange={(e) => setActive(e.target.value)}
            className="pixel-input w-full px-3 py-2"
          >
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
}
