"use client";

import type { ReactNode } from "react";

export function PixelPanel({
  title,
  subtitle,
  children,
  warm = false,
  actions,
}: {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  warm?: boolean;
  actions?: ReactNode;
}) {
  return (
    <section className={`pixel-frame ${warm ? "pixel-frame--warm" : ""} p-5`}>
      {title && (
        <header className="mb-4 flex flex-wrap items-baseline justify-between gap-3 border-b-2 border-ink-600 pb-3">
          <div>
            <h2 className="font-pixel text-[11px] leading-relaxed text-brass-100">{title}</h2>
            {subtitle && <p className="mt-2 text-slate-400">{subtitle}</p>}
          </div>
          {actions}
        </header>
      )}
      {children}
    </section>
  );
}

export function PixelButton({
  children,
  onClick,
  variant = "default",
  type = "button",
  disabled,
  ariaLabel,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "default" | "primary" | "danger";
  type?: "button" | "submit";
  disabled?: boolean;
  ariaLabel?: string;
  className?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`pixel-btn ${variant === "primary" ? "pixel-btn--primary" : ""} px-4 py-2 font-pixel text-[9px] uppercase tracking-wider disabled:cursor-not-allowed disabled:opacity-40 ${
        variant === "danger" ? "text-verdict-fail" : ""
      } ${className}`}
    >
      {children}
    </button>
  );
}

/**
 * The overall score, 0-100, in ten pixel segments. The scale is the weighted
 * mean the scorer computes — never a number the model handed us.
 */
export function ScoreBar({ score, seated }: { score: number; seated?: boolean }) {
  const filled = Math.round(score / 10);
  return (
    <div className="flex items-center gap-3">
      <div className="flex gap-[2px]" role="img" aria-label={`Score ${score} out of 100`}>
        {Array.from({ length: 10 }, (_, i) => (
          <span
            key={i}
            className="h-4 w-3"
            style={{
              background: i < filled ? (seated ? "#f2b544" : "#7f95c4") : "#1d2540",
              boxShadow: "inset -1px -1px 0 0 rgba(0,0,0,0.5)",
            }}
          />
        ))}
      </div>
      <span className="font-pixel text-[11px] text-brass-100">{score}/100</span>
    </div>
  );
}

/** A single competency's 0-10 score, as a compact ten-cell strip. */
export function CompetencyBar({
  score,
  reached,
}: {
  score: number;
  reached: boolean;
}) {
  return (
    <div
      className="flex gap-[2px]"
      role="img"
      aria-label={reached ? `${score} out of 10` : "Not evidenced"}
    >
      {Array.from({ length: 10 }, (_, i) => (
        <span
          key={i}
          className="h-3 w-2"
          style={{
            background: !reached ? "transparent" : i < score ? "#f2b544" : "#1d2540",
            boxShadow: reached
              ? "inset -1px -1px 0 0 rgba(0,0,0,0.5)"
              : "inset 0 0 0 1px #2a3454",
          }}
        />
      ))}
    </div>
  );
}

export function Tag({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "pass" | "fail" | "seated" | "hold";
}) {
  const tones: Record<string, string> = {
    neutral: "text-slate-300 border-ink-500",
    pass: "text-verdict-pass border-verdict-pass",
    fail: "text-verdict-fail border-verdict-fail",
    seated: "text-brass-500 border-brass-500",
    hold: "text-verdict-hold border-verdict-hold",
  };
  return (
    <span className={`border-2 px-2 py-1 text-[13px] uppercase tracking-wide ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <p className="border-2 border-dashed border-ink-600 p-6 text-center text-slate-400">
      {children}
    </p>
  );
}
