import type { ReactNode } from "react";
import { formatOrderNumber, getItem, type OrderLine } from "@/lib/data";

type Tone = "new" | "cooking" | "ready";

type TicketProps = {
  orderId: number;
  table: number;
  station: string;
  time: string;
  /** Waiting a while (10+ min): the time turns amber. */
  late?: boolean;
  /** Waiting too long (15+ min): the time turns red. */
  overdue?: boolean;
  lines: OrderLine[];
  payment?: "Apmokėta" | "Grynaisiais";
  status?: { label: string; tone: Tone };
  className?: string;
  /** Smaller type for tickets inside device mock-ups. */
  compact?: boolean;
  /** Item ids the cook has already ticked off. */
  doneLines?: string[];
  /** Turns every line into a toggle, so the cook can tick dishes off while cooking. */
  onToggleLine?: (itemId: string) => void;
  /** Action area at the bottom of the card (the kitchen screen's big button). */
  children?: ReactNode;
};

// The amber header is a touch darker than the "cooking" token so white text stays readable.
const bandTone: Record<Tone, string> = {
  new: "bg-tomato",
  cooking: "bg-[color-mix(in_oklab,var(--color-cooking),var(--color-cooking-dark))]",
  ready: "bg-ready",
};

/**
 * A kitchen display ticket: coloured status header, order number, table and waiting time,
 * then the dishes with their notes. Shared by the hero film, the demo and the team section.
 */
export function Ticket({
  orderId,
  table,
  station,
  time,
  late,
  overdue,
  lines,
  payment,
  status,
  className = "",
  compact = false,
  doneLines,
  onToggleLine,
  children,
}: TicketProps) {
  const pad = compact ? "px-2.5" : "px-3.5";
  const inset = compact ? "mx-2.5" : "mx-3.5";
  // Timers ("4:05") read best in mono; words like "ką tik" stay in the sans.
  const numericTime = /^\d+:\d{2}$/.test(time);
  const timeTone = overdue
    ? "font-semibold text-tomato-dark"
    : late
      ? "font-semibold text-cooking-dark"
      : "text-ink-2";
  const hasFooter = Boolean(payment || children);

  return (
    <div
      className={`flex flex-col bg-slip text-ink ${compact ? "rounded-lg leading-snug" : "rounded-xl leading-normal"} ${className}`}
    >
      {status && (
        <div
          className={`flex items-center justify-between gap-2 font-semibold text-white transition-colors duration-300 ${
            compact ? "h-6 rounded-t-lg text-[11px]" : "h-8 rounded-t-xl text-[13px]"
          } ${pad} ${bandTone[status.tone]}`}
        >
          <span key={status.label} className="animate-fade-in">
            {status.label}
          </span>
          <span className="truncate font-medium text-white/85">{station}</span>
        </div>
      )}

      <div className={`flex items-baseline justify-between gap-3 ${pad} ${compact ? "pt-2" : "pt-3"}`}>
        <span
          className={`font-semibold tracking-[-0.01em] tabular-nums ${compact ? "text-[15px]" : "text-[21px] leading-tight"}`}
        >
          {formatOrderNumber(orderId)}
        </span>
        <span
          className={`shrink-0 tabular-nums transition-colors duration-300 ${numericTime ? "font-mono" : ""} ${
            compact ? "text-[11px]" : "text-[14px]"
          } ${timeTone}`}
        >
          {time}
        </span>
      </div>
      <p className={`text-ink-2 ${pad} ${compact ? "text-[11.5px]" : "text-[14px]"}`}>
        Staliukas {table}
        {!status && ` · ${station}`}
      </p>

      <ul
        className={`divide-y divide-ink/[0.07] border-t border-ink/10 ${inset} ${compact ? "mt-2" : "mt-3"} ${
          hasFooter ? "" : compact ? "pb-1" : "pb-1.5"
        }`}
      >
        {lines.map((line) => {
          const item = getItem(line.itemId);
          const done = doneLines?.includes(line.itemId) ?? false;
          const body = (
            <>
              <span
                className={`shrink-0 font-semibold tabular-nums ${compact ? "w-5 text-[12.5px]" : "w-7 text-[16px]"} ${
                  done ? "text-ink-2" : ""
                }`}
              >
                {line.quantity}×
              </span>
              <span className="min-w-0 flex-1">
                <span
                  className={`block font-medium ${compact ? "text-[12.5px]" : "text-[15px]"} ${
                    done ? "text-ink-2 line-through decoration-ink/40 decoration-[1.5px]" : ""
                  }`}
                >
                  {item.name}
                </span>
                {line.notes.map((note) => (
                  <span
                    key={note}
                    className={`block font-semibold tracking-[0.02em] text-tomato-dark uppercase ${
                      compact ? "text-[10.5px]" : "mt-0.5 text-[12px]"
                    } ${done ? "opacity-50" : ""}`}
                  >
                    {note}
                  </span>
                ))}
              </span>
            </>
          );

          return (
            <li key={line.itemId}>
              {onToggleLine ? (
                <button
                  type="button"
                  aria-pressed={done}
                  aria-label={`Pažymėti: ${item.name}${line.notes.length ? ` (${line.notes.join(", ")})` : ""}`}
                  onClick={() => onToggleLine(line.itemId)}
                  className="-mx-2 flex min-h-11 w-[calc(100%+1rem)] items-start gap-2.5 rounded-lg px-2 py-2.5 text-left transition-colors hover:bg-ink/[0.04] focus-visible:outline-offset-0! active:bg-ink/[0.07]"
                >
                  {body}
                  <span
                    aria-hidden="true"
                    className={`mt-px flex size-[22px] shrink-0 items-center justify-center rounded-full border-[1.5px] transition-colors duration-200 ${
                      done ? "border-ready bg-ready text-white" : "border-ink/25"
                    }`}
                  >
                    {done && (
                      <svg viewBox="0 0 24 24" className="size-3.5" fill="none">
                        <path
                          d="M5.5 12.5l4 4L18.5 7.5"
                          pathLength="1"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="animate-check [stroke-dasharray:1]"
                        />
                      </svg>
                    )}
                  </span>
                </button>
              ) : (
                <div className={`flex items-start ${compact ? "gap-1.5 py-1.5" : "min-h-11 gap-2.5 py-2.5"}`}>{body}</div>
              )}
            </li>
          );
        })}
      </ul>

      {hasFooter && (
        <div className="mt-auto">
          {payment && (
            <p
              className={`flex items-center gap-1.5 border-t border-ink/10 text-ink-2 ${inset} ${
                compact ? "py-1.5 text-[11px]" : "py-2.5 text-[13px]"
              }`}
            >
              {payment === "Apmokėta" ? (
                <svg viewBox="0 0 16 16" className="size-3.5 shrink-0 text-ready" fill="none" aria-hidden="true">
                  <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg viewBox="0 0 16 16" className="size-3.5 shrink-0" fill="none" aria-hidden="true">
                  <rect x="1.75" y="4" width="12.5" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
                  <circle cx="8" cy="8" r="1.6" stroke="currentColor" strokeWidth="1.4" />
                </svg>
              )}
              {payment}
            </p>
          )}
          {children && <div className={compact ? "p-2 pt-0" : "p-2.5 pt-0"}>{children}</div>}
        </div>
      )}
    </div>
  );
}
