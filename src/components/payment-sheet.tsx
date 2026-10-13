"use client";

import { useEffect, useState } from "react";
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
};

/**
 * A card payment sheet sliding up over the order: it connects, then shows the approval.
 * Purely visual; no card data exists anywhere in the demo.
 */
export function PaymentSheet({ active, amount, merchant, table, approveAfter = 800, compact = false }: PaymentSheetProps) {
  const [approved, setApproved] = useState(false);

  useEffect(() => {
    if (!active) return;
    const reset = window.setTimeout(() => setApproved(false), 0);
    const timer = window.setTimeout(() => setApproved(true), approveAfter);
    return () => {
      window.clearTimeout(reset);
      window.clearTimeout(timer);
    };
  }, [active, approveAfter]);

  if (!active) return null;

  return (
    <div className="absolute inset-0 z-20 flex flex-col justify-end">
      <div aria-hidden="true" className="absolute inset-0 animate-fade-in bg-black/35" />
      <div
        role="dialog"
        aria-label="Mokėjimas kortele"
        className={`relative animate-sheet-up rounded-t-[1.6rem] bg-white shadow-[0_-12px_30px_-12px_rgb(0_0_0/0.35)] ${
          compact ? "px-4 pt-2.5 pb-5" : "px-5 pt-3 pb-7"
        }`}
      >
        <span aria-hidden="true" className="mx-auto block h-1 w-9 rounded-full bg-line" />
        <div className={`flex items-center gap-2.5 ${compact ? "mt-3" : "mt-4"}`}>
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-paper">
            <LogoMark className="size-5" />
          </span>
          <div className="min-w-0 leading-tight">
            <p className={`font-semibold ${compact ? "text-[13px]" : "text-[15px]"}`}>{merchant}</p>
            <p className={`text-ink-2 ${compact ? "text-[11.5px]" : "text-[13px]"}`}>Staliukas {table}</p>
          </div>
        </div>

        <p
          className={`font-semibold tracking-[-0.04em] tabular-nums ${
            compact ? "mt-3 text-[1.9rem] leading-none" : "mt-4 text-[2.4rem] leading-none"
          }`}
        >
          {amount}
        </p>

        <div
          className={`flex items-center gap-3 rounded-xl bg-paper ${compact ? "mt-3 px-3 py-2.5" : "mt-4 px-3.5 py-3"}`}
        >
          <span
            aria-hidden="true"
            className="relative h-6 w-9 shrink-0 overflow-hidden rounded-[5px] bg-[linear-gradient(135deg,#2b2b2e,#4a4a4f)]"
          >
            <span className="absolute top-1.5 left-1.5 h-1.5 w-2 rounded-[2px] bg-[#d9c27a]" />
          </span>
          <span className={`tabular-nums ${compact ? "text-[12.5px]" : "text-[14px]"}`}>Kortelė •••• 4242</span>
        </div>

        <div
          role="status"
          className={`flex items-center justify-center gap-2.5 font-semibold ${compact ? "mt-3.5 h-9 text-[13px]" : "mt-5 h-11 text-[15px]"}`}
        >
          {approved ? (
            <>
              <span className="flex size-6 animate-pop items-center justify-center rounded-full bg-ready text-white">
                <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M5 12.5l4.5 4.5L19 7.5" />
                </svg>
              </span>
              Apmokėta
            </>
          ) : (
            <>
              <span aria-hidden="true" className="size-5 animate-spin rounded-full border-[2.5px] border-line border-t-ink" />
              Jungiamasi prie banko…
            </>
          )}
        </div>
      </div>
    </div>
  );
}
