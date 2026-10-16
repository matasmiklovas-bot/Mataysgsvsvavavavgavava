import type { ReactNode } from "react";
import { Reveal } from "@/components/reveal";

type SectionHeadingProps = {
  id: string;
  title: ReactNode;
  lead?: ReactNode;
  /** Light text for dark sections. */
  tone?: "light" | "dark";
  className?: string;
};

/** The one heading pattern used by every section: a large title and an optional lead. */
export function SectionHeading({ id, title, lead, tone = "dark", className = "" }: SectionHeadingProps) {
  const onDark = tone === "light";
  return (
    <Reveal className={`mx-auto max-w-3xl text-center ${className}`}>
      <h2
        id={id}
        className="text-[clamp(2.25rem,6.4vw,4rem)] leading-[1.04] font-semibold tracking-[-0.04em] text-balance"
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
