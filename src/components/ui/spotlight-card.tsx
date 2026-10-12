"use client";

import type { ReactNode, PointerEvent } from "react";

type SpotlightCardProps = {
  children: ReactNode;
  className?: string;
};

/** A glass card with a soft violet light that follows the pointer. */
export function SpotlightCard({ children, className = "" }: SpotlightCardProps) {
  function handleMove(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--mx", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--my", `${event.clientY - rect.top}px`);
  }

  return (
    <div onPointerMove={handleMove} className={`spotlight glass rounded-3xl ${className}`}>
      {children}
    </div>
  );
}
