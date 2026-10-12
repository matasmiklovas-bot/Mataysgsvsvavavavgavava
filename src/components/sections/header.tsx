"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { navItems } from "@/config/site";
import { Logo } from "@/components/ui/logo";
import { ButtonLink } from "@/components/ui/button";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onResize = () => {
      if (window.innerWidth >= 1024) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-3 sm:px-6 sm:pt-4">
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between rounded-2xl px-3 py-2.5 pl-4 transition-all duration-500 sm:pl-5 ${
          scrolled || open
            ? "glass-strong"
            : "border border-transparent bg-transparent"
        }`}
      >
        <a href="#pradzia" className="rounded-lg" aria-label="Stalas — į puslapio pradžią">
          <Logo />
        </a>

        <nav aria-label="Pagrindinė navigacija" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="rounded-full px-4 py-2 text-[14.5px] text-fg-muted transition-colors hover:bg-white/5 hover:text-fg"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <ButtonLink href="#kontaktai" className="max-sm:hidden">
            Susisiekti
          </ButtonLink>
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Uždaryti meniu" : "Atidaryti meniu"}
            className="inline-flex size-11 items-center justify-center rounded-full text-fg transition-colors hover:bg-white/10 lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        hidden={!open}
        className="mx-auto mt-2 max-w-6xl rounded-2xl border border-white/10 bg-ink-900/95 p-3 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl lg:hidden"
      >
        <nav aria-label="Mobili navigacija">
          <ul className="flex flex-col">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-4 py-3.5 text-lg text-fg-muted transition-colors hover:bg-white/5 hover:text-fg"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <ButtonLink href="#kontaktai" onClick={() => setOpen(false)} className="mt-2 w-full sm:hidden">
            Susisiekti
          </ButtonLink>
        </nav>
      </div>
    </header>
  );
}
