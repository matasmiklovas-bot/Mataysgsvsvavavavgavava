/** iPhone-style status bar: time, Dynamic Island, signal and battery. Decorative. */
export function StatusBar({ time = "19:42", compact = false }: { time?: string; compact?: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={`grid shrink-0 grid-cols-[1fr_auto_1fr] items-center px-6 ${compact ? "h-9" : "h-10"}`}
    >
      <span className="text-[13px] font-semibold tracking-[-0.01em] tabular-nums">{time}</span>
      <span className={`rounded-full bg-black ${compact ? "h-[22px] w-[84px]" : "h-[24px] w-[92px]"}`} />
      <span className="flex items-center justify-end gap-1.5">
        <span className="flex items-end gap-[2px]">
          {[4, 6, 8, 10].map((h) => (
            <span key={h} className="w-[3px] rounded-[1px] bg-ink" style={{ height: h }} />
          ))}
        </span>
        <span className="relative h-[11px] w-[22px] rounded-[3px] border border-ink/50 p-[1.5px]">
          <span className="block h-full w-[70%] rounded-[1.5px] bg-ink" />
        </span>
      </span>
    </div>
  );
}
