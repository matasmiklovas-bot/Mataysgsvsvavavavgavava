"use client";

import { useEffect, useState } from "react";
import { navItems } from "@/config/site";

/** Header links that highlight the section currently on screen. */
export function NavLinks() {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const ids = navItems.map((item) => item.href.split("#")[1]);
    const sections = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    if (sections.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
          else setActive((current) => (current === entry.target.id ? null : current));
        }
      },
      // A section counts as current while it crosses the middle band of the screen.
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <ul className="flex items-center gap-8">
      {navItems.map((item) => {
        const current = active === item.href.split("#")[1];
        return (
          <li key={item.href}>
            <a
              href={item.href}
              aria-current={current ? "location" : undefined}
              className={`relative inline-flex min-h-11 items-center text-[14px] transition-colors hover:text-white ${
                current ? "text-white" : "text-night-text/75"
              }`}
            >
              {item.label}
              <span
                aria-hidden="true"
                className={`absolute inset-x-0 bottom-2 h-px origin-left bg-white transition-transform duration-300 ${
                  current ? "scale-x-100" : "scale-x-0"
                }`}
              />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
