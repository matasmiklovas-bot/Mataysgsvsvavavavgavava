"use client";

import { useEffect, useState } from "react";
import { ContactTrigger } from "@/components/contact/contact-trigger";

/** Phone-only bar that keeps "Susisiekti" one tap away once the hero is scrolled past. */
export function MobileCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-white/[0.08] bg-ink-950/90 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md transition-transform duration-300 md:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      aria-hidden={!visible}
    >
      <ContactTrigger
        tabIndex={visible ? 0 : -1}
        className="flex h-12 w-full items-center justify-center rounded-full bg-fg text-[15px] font-semibold text-ink-950"
      >
        Prašyti demonstracijos
      </ContactTrigger>
    </div>
  );
}
