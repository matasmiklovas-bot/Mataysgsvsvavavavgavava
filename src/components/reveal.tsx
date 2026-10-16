"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  className?: string;
  id?: string;
};

/** Eases content in the first time it scrolls into view. Visible by default without JavaScript. */
export function Reveal({ children, as: Tag = "div", delay = 0, className = "", id }: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const show = () => node.setAttribute("data-shown", "");
    if (typeof IntersectionObserver === "undefined") return show();
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          show();
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return (
    <Tag ref={ref} id={id} className={`reveal ${className}`} style={{ "--delay": `${delay}ms` } as React.CSSProperties}>
      {children}
    </Tag>
  );
}
