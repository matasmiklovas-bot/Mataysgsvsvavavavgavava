"use client";

import { useEffect, useRef, useState } from "react";
import { LogoMark } from "@/components/logo";

type PaymentSheetProps = {
  /** Shown while true; each time it turns on, the payment runs again from the start. */
  active: boolean;
  amount: string;
  merchant: string;
  table: number;
  /** How long the bank "connection" takes before the payment is approved. */
  approveAfter?: number;
  /** Tighter type for the small phone in the hero. */
  compact?: boolean;
  /** Called once when the payment shows as approved (the demo plays its sound here). */
  onApproved?: () => void;
  /** Move keyboard focus into the sheet when it opens. Off for the hero film. */
  autoFocus?: boolean;
};

/**
 * A card payment sheet sliding up over the order, like a phone wallet: merchant, amount and
 * card, then the bank connection and the approval. Purely visual; no card data exists anywhere
 * in the demo.
 */
export function PaymentSheet({
  active,
  amount,
  merchant,
  table,
  approveAfter = 800,
  compact = false,
  onApproved,
  autoFocus = false,
}: PaymentSheetProps) {
  const [approved, setApproved] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  // Kept in a ref so a new callback identity never restarts the payment.
  const approvedRef = useRef(onApproved);
  useEffect(() => {
    approvedRef.current = onApproved;
  }, [onApproved]);

  useEffect(() => {
    if (!active) return;
    const reset = window.setTimeout(() => setApproved(false), 0);
    const timer = window.setTimeout(() => {
      setApproved(true);
      approvedRef.current?.();
    }, approveAfter);
    return () => {
      window.clearTimeout(reset);
      window.clearTimeout(timer);
    };
  }, [active, approveAfter]);

  useEffect(() => {
    if (active && autoFocus) dialogRef.current?.focus({ preventScroll: true });
  }, [active, autoFocus]);

  if (!active) return null;

  return (
    <div className="absolute inset-0 z-20 flex flex-col justify-end">
      <div aria-hidden="true" className="absolute inset-0 animate-fade-in bg-black/30" />
      <div
        ref={dialogRef}
        role="dialog"
        aria-label="Mokėjimas kortele"
        tabIndex={-1}
        className={`relative animate-sheet-up rounded-t-[1.75rem] bg-white outline-none ${
          compact ? "px-4 pt-2 pb-5" : "px-5 pt-2 pb-7"
        }`}
      >
        <span aria-hidden="true" className="mx-auto block h-[5px] w-9 rounded-full bg-line" />

        <div className={`flex items-center gap-3 ${compact ? "mt-3" : "mt-4"}`}>
          <span
            className={`flex shrink-0 items-center justify-center rounded-[10px] bg-paper ${compact ? "size-8" : "size-10"}`}
          >
            <LogoMark className={compact ? "size-5" : "size-6"} />
          </span>
          <div className="min-w-0 leading-tight">
            <p className={`truncate font-semibold ${compact ? "text-[13px]" : "text-[15px]"}`}>{merchant}</p>
            <p className={`text-ink-2 ${compact ? "text-[11.5px]" : "text-[13px]"}`}>Staliukas {table}</p>
          </div>
        </div>

        <p
          className={`font-semibold tracking-[-0.04em] tabular-nums ${
            compact ? "mt-3.5 text-[1.9rem] leading-none" : "mt-5 text-[2.5rem] leading-none"
          }`}
        >
          {amount}
        </p>

        <div
          className={`flex items-center gap-3 rounded-xl bg-paper ${compact ? "mt-3.5 px-3 py-2.5" : "mt-5 px-3.5 py-3"}`}
        >
          {/* A plain card face: dark plate and a small chip. */}
          <span aria-hidden="true" className="relative h-6 w-9 shrink-0 rounded-[5px] bg-ink">
            <span className="absolute top-[7px] left-[6px] h-[7px] w-[9px] rounded-[2px] bg-[#cbb78a]" />
          </span>
          <span className={`tabular-nums ${compact ? "text-[12.5px]" : "text-[15px]"}`}>Kortelė •••• 4242</span>
        </div>

        {/* Fixed height so the switch from connecting to approved never moves anything. */}
        <div
          role="status"
          className={`flex flex-col items-center justify-center font-semibold ${
            compact ? "mt-3.5 h-11 text-[13px]" : "mt-5 h-14 text-[15px]"
          }`}
        >
          {approved ? (
            <span key="ok" className="flex animate-fade-in items-center gap-2.5">
              <span
                className={`flex animate-scale-in items-center justify-center rounded-full bg-ready text-white ${
                  compact ? "size-6" : "size-7"
                }`}
              >
                <svg
                  viewBox="0 0 24 24"
                  className={compact ? "size-3.5" : "size-4"}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12.5l4.5 4.5L19 7.5" pathLength="1" className="animate-check [stroke-dasharray:1]" />
                </svg>
              </span>
              Apmokėta
            </span>
          ) : (
            <span key="wait" className="flex w-full flex-col items-center">
              <span
                aria-hidden="true"
                className={`block h-1 overflow-hidden rounded-full bg-paper-2 ${compact ? "w-24" : "w-32"}`}
              >
                <span className="block h-full w-2/5 animate-indeterminate rounded-full bg-ink" />
              </span>
              <span className={`text-ink-2 ${compact ? "mt-2" : "mt-2.5"}`}>Jungiamasi prie banko…</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
