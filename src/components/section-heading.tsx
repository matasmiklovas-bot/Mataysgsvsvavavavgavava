import type { ReactNode } from "react";
import { Reveal } from "@/components/reveal";

type SectionHeadingProps = {
  id: string;
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  /** Light text for dark sections. */
  tone?: "light" | "dark";
  className?: string;
};

/** The one heading pattern used by every section: a small label, a large title and an optional lead. */
export function SectionHeading({ id, eyebrow, title, lead, tone = "dark", className = "" }: SectionHeadingProps) {
  const onDark = tone === "light";
  return (
    <Reveal className={`mx-auto max-w-3xl text-center ${className}`}>
      <p
        className={`inline-flex items-center gap-2 text-[14px] font-semibold tracking-[0.08em] uppercase ${
          onDark ? "text-tomato-bright" : "text-tomato-dark"
        }`}
      >
        <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
        {eyebrow}
      </p>
      <h2
        id={id}
        className="mt-4 text-[clamp(2.25rem,6.4vw,4rem)] leading-[1.04] font-semibold tracking-[-0.04em] text-balance"
      >
        {title}
      </h2>
      {lead && (
        <p
          className={`mx-auto mt-5 max-w-[34rem] text-[clamp(1.0625rem,2vw,1.25rem)] leading-relaxed text-balance ${
            onDark ? "text-night-muted" : "text-ink-2"
          }`}
        >
          {lead}
        </p>
      )}
    </Reveal>
  );
}
