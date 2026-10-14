"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { navItems, siteConfig } from "@/config/site";
import { NavLinks } from "@/components/nav-links";
import { Logo } from "@/components/logo";
import { buttonClass } from "@/components/ui";

type HeaderProps = {
  /** Start see-through over the dark hero and firm up once the page scrolls. */
  overHero?: boolean;
};

export function Header({ overHero = false }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Menu: Escape closes it, focus moves into it, and it closes when the screen grows past phone size.
  useEffect(() => {
    if (!open) return;
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const wide = window.matchMedia("(min-width: 768px)");
    const onWide = () => wide.matches && setOpen(false);
    document.addEventListener("keydown", onKey);
    wide.addEventListener("change", onWide);
    return () => {
      document.removeEventListener("keydown", onKey);
      wide.removeEventListener("change", onWide);
    };
  }, [open]);

  const solid = !overHero || scrolled || open;

  return (
    <header className="sticky top-0 z-50">
      <div
        className={`relative z-10 border-b transition-[background-color,border-color,backdrop-filter] duration-300 ${
          solid
            ? "border-white/10 bg-night/80 backdrop-blur-xl backdrop-saturate-150"
            : "border-transparent bg-night/0"
        }`}
      >
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link
            href="/"
            className="-mx-1 flex min-h-11 items-center rounded-lg px-1"
            aria-label={`${siteConfig.name}, į pradžią`}
            onClick={() => setOpen(false)}
          >
            <Logo tone="light" />
          </Link>
          <nav aria-label="Pagrindinė navigacija" className="hidden md:block">
            <NavLinks />
          </nav>
          <div className="flex items-center gap-1.5">
            <Link href="/#forma" className={buttonClass({ size: "sm" })} onClick={() => setOpen(false)}>
              <span className="sm:hidden">{siteConfig.ctaShort}</span>
              <span className="max-sm:hidden">{siteConfig.cta}</span>
            </Link>
            <button
              ref={buttonRef}
              type="button"
              aria-expanded={open}
              aria-controls={menuId}
              aria-label={open ? "Uždaryti meniu" : "Atidaryti meniu"}
              onClick={() => setOpen((value) => !value)}
              className="relative -mr-2 flex size-11 touch-manipulation items-center justify-center rounded-full text-night-text transition-[background-color,scale] duration-150 hover:bg-white/10 active:scale-[0.92] md:hidden"
            >
              <span
                aria-hidden="true"
                className={`absolute h-[1.5px] w-[18px] rounded-full bg-current transition-transform duration-300 ease-[var(--ease-out-soft)] ${
                  open ? "rotate-45" : "-translate-y-[4px]"
                }`}
              />
              <span
                aria-hidden="true"
                className={`absolute h-[1.5px] w-[18px] rounded-full bg-current transition-transform duration-300 ease-[var(--ease-out-soft)] ${
                  open ? "-rotate-45" : "translate-y-[4px]"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/*
        Phone menu: a sheet under the bar with large, easy-to-tap links. It stays mounted so it can
        fade out; `inert` keeps it out of the tab order and the accessibility tree while closed, and
        visibility flips only after the fade (immediately on open, so focus can move in).
      */}
      <div
        id={menuId}
        ref={panelRef}
        inert={!open}
        className={`absolute inset-x-0 top-full border-b border-white/10 bg-night/95 backdrop-blur-xl md:hidden ${
          open
            ? "visible translate-y-0 opacity-100 [transition:opacity_.3s_var(--ease-out-soft),translate_.3s_var(--ease-out-soft),visibility_0s]"
            : "pointer-events-none invisible -translate-y-2 opacity-0 [transition:opacity_.2s_ease-in,translate_.2s_ease-in,visibility_0s_.2s]"
        }`}
      >
        <nav aria-label="Meniu" className="px-4 pt-2 pb-6">
          <ul>
            {navItems.map((item, index) => (
              <li
                key={item.href}
                className={`border-b border-white/10 ${open ? "animate-menu-item" : ""}`}
                style={{ animationDelay: `${index * 45}ms` }}
              >
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-14 touch-manipulation items-center justify-between rounded-sm text-[1.375rem] font-medium tracking-[-0.02em] text-night-text transition-opacity duration-150 active:opacity-60"
                >
                  {item.label}
                  <span aria-hidden="true" className="text-night-muted">
                    →
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <Link
            href="/#forma"
            onClick={() => setOpen(false)}
            className={`${buttonClass({ full: true })} ${open ? "animate-menu-item" : ""} mt-6`}
            style={{ animationDelay: `${navItems.length * 45}ms` }}
          >
            {siteConfig.cta}
          </Link>
        </nav>
      </div>
      <button
        type="button"
        tabIndex={-1}
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className={`fixed inset-0 top-14 -z-10 cursor-default bg-black/40 transition-opacity duration-300 md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
    </header>
  );
}
