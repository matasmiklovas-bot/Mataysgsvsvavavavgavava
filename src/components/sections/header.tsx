"use client";

import { useEffect, useState } from "react";
import { navItems } from "@/config/site";
import { Logo } from "@/components/ui/logo";
import { ContactTrigger } from "@/components/contact/contact-trigger";

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)] transition-colors duration-300 ${
        scrolled ? "border-b border-white/[0.07] bg-ink-950/85 backdrop-blur-md" : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-6">
        <a href="#pradzia" className="rounded-lg" aria-label="Stalas — į puslapio pradžią">
          <Logo />
        </a>

        <nav aria-label="Pagrindinė navigacija" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {navItems.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="text-[15px] text-fg-muted transition-colors hover:text-fg">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <ContactTrigger className="inline-flex h-10 items-center rounded-full bg-fg px-5 text-[14.5px] font-semibold text-ink-950 transition-colors hover:bg-white">
          Susisiekti
        </ContactTrigger>
      </div>
    </header>
  );
}
