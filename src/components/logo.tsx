type Tone = "dark" | "light";

/** "Stalas" mark: a kitchen ticket with a torn edge; the red line is the guest's note. */
export function LogoMark({ className = "size-8", tone = "dark" }: { className?: string; tone?: Tone }) {
  const body = tone === "dark" ? "#1d1d1f" : "#f5f3ef";
  const line = tone === "dark" ? "#f5f4f1" : "#0c0b0a";
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <path d="M6 2h20v24l-3.33 3.5-3.34-3.5-3.33 3.5-3.33-3.5-3.34 3.5L6 26z" fill={body} />
      <rect x="10" y="7.5" width="12" height="2.6" rx="1" fill={line} />
      <rect x="10" y="12.5" width="8" height="2.6" rx="1" fill={line} />
      <rect x="10" y="17.5" width="11" height="2.6" rx="1" fill="#e5583c" />
    </svg>
  );
}

export function Logo({ tone = "dark" }: { tone?: Tone }) {
  return (
    <span className="flex items-center gap-2">
      <LogoMark className="size-7" tone={tone} />
      <span
        className={`text-[1.3rem] leading-none font-semibold tracking-[-0.03em] ${
          tone === "dark" ? "text-ink" : "text-night-text"
        }`}
      >
        Stalas
      </span>
    </span>
  );
}
