import type { ReactNode } from "react";

/** Section title type, shared by every section so the scale stays the same across the page. */
export const sectionTitleClass =
  "text-[clamp(2rem,4.4vw,3.25rem)] leading-[1.06] font-semibold tracking-[-0.035em] text-balance";

type SectionHeadingProps = {
  id: string;
  title: ReactNode;
  lead?: ReactNode;
  /** Light text for dark sections. */
  tone?: "light" | "dark";
  className?: string;
};

/**
 * Editorial section opening: a hairline across the content width, the title on the left and,
 * on wide screens, the lead in the right-hand column aligned to the title's last line.
 */
export function SectionHeading({ id, title, lead, tone = "dark", className = "" }: SectionHeadingProps) {
  const onDark = tone === "light";
  return (
    <header
      className={`grid gap-4 border-t pt-8 sm:pt-10 lg:grid-cols-12 lg:gap-10 ${
        onDark ? "border-night-line" : "border-line"
      } ${className}`}
    >
      <h2 id={id} className={`${sectionTitleClass} max-w-[18ch] lg:col-span-7`}>
        {title}
      </h2>
      {lead && (
        <p
          className={`max-w-[32rem] text-[1.0625rem] leading-relaxed sm:text-[1.125rem] lg:col-span-5 lg:self-end lg:pb-1.5 ${
            onDark ? "text-night-muted" : "text-ink-2"
          }`}
        >
          {lead}
        </p>
      )}
    </header>
  );
}
