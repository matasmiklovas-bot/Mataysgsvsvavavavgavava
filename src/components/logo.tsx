/** "Stalas" mark: a kitchen ticket with a torn edge; the red line is the guest's note. */
export function LogoMark({ className = "size-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <path d="M6 2h20v24l-3.33 3.5-3.34-3.5-3.33 3.5-3.33-3.5-3.34 3.5L6 26z" fill="#1d1b18" />
      <rect x="10" y="7.5" width="12" height="2.6" rx="1" fill="#f4efe6" />
      <rect x="10" y="12.5" width="8" height="2.6" rx="1" fill="#f4efe6" />
      <rect x="10" y="17.5" width="11" height="2.6" rx="1" fill="#c63d24" />
    </svg>
  );
}

export function Logo() {
  return (
    <span className="flex items-center gap-2">
      <LogoMark className="size-8" />
      <span className="font-display text-[1.6rem] leading-none font-bold tracking-[-0.01em] text-ink">Stalas</span>
    </span>
  );
}
