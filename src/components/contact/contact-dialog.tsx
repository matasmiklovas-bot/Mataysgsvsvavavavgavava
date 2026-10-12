"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { ContactForm } from "./contact-form";
import { OPEN_CONTACT_EVENT } from "./contact-trigger";

/** Slide-in contact form, reachable from every "Susisiekti" button without scrolling. */
export function ContactDialog() {
  const ref = useRef<HTMLDialogElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const open = () => {
      const dialog = ref.current;
      if (!dialog || dialog.open) return;
      returnFocus.current = document.activeElement as HTMLElement | null;
      dialog.showModal();
      document.documentElement.style.overflow = "hidden";
    };
    window.addEventListener(OPEN_CONTACT_EVENT, open);
    return () => window.removeEventListener(OPEN_CONTACT_EVENT, open);
  }, []);

  function close() {
    ref.current?.close();
  }

  return (
    <dialog
      ref={ref}
      aria-labelledby="contact-dialog-title"
      onClose={() => {
        document.documentElement.style.overflow = "";
        returnFocus.current?.focus();
      }}
      onClick={(event) => {
        // Close when the backdrop (the dialog element itself) is clicked.
        if (event.target === event.currentTarget) close();
      }}
      className="m-0 ml-auto h-dvh max-h-none w-full max-w-[34rem] bg-transparent p-0 text-fg open:animate-[slide-in_0.35s_cubic-bezier(0.2,0.7,0.2,1)] sm:p-3"
    >
      <div className="flex h-full flex-col overflow-y-auto border-white/10 bg-ink-900 sm:rounded-3xl sm:border">
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-white/[0.07] bg-ink-900/95 px-6 pt-[max(1.25rem,env(safe-area-inset-top))] pb-5 backdrop-blur sm:px-8">
          <div>
            <h2 id="contact-dialog-title" className="font-display text-2xl font-semibold tracking-[-0.02em]">
              Pažiūrėkime, kaip tai veiktų jūsų restorane.
            </h2>
            <p className="mt-1.5 text-[15px] text-fg-muted">
              Palikite kontaktus — susisieksime ir suderinsime demonstraciją.
            </p>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Uždaryti"
            className="-mr-2 flex size-10 shrink-0 items-center justify-center rounded-full text-fg-muted transition-colors hover:bg-white/10 hover:text-fg"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>
        <div className="px-6 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-8">
          <ContactForm compact />
        </div>
      </div>
    </dialog>
  );
}
