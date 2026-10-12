import type { ReactNode } from "react";
import { Reveal } from "./reveal";

type SectionHeadingProps = {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  id?: string;
  align?: "center" | "split";
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  id,
  align = "split",
}: SectionHeadingProps) {
  const label = (
    <p className="text-[13px] font-medium tracking-[0.08em] text-fg-subtle uppercase">{eyebrow}</p>
  );
  const heading = (
    <h2
      id={id}
      className="text-[2.1rem] leading-[1.06] font-semibold tracking-[-0.035em] text-balance sm:text-[2.75rem] lg:text-[3.25rem]"
    >
      {title}
    </h2>
  );

  if (align === "center") {
    return (
      <Reveal className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
        {label}
        {heading}
        {description ? (
          <p className="max-w-xl text-[17px] leading-relaxed text-pretty text-fg-muted">{description}</p>
        ) : null}
      </Reveal>
    );
  }

  return (
    <Reveal
      className={`grid gap-6 border-t border-white/[0.08] pt-8 lg:items-end lg:gap-16 ${
        description ? "lg:grid-cols-[1.25fr_1fr]" : ""
      }`}
    >
      <div className="flex flex-col gap-4">
        {label}
        {heading}
      </div>
      {description ? (
        <p className="max-w-md text-[17px] leading-relaxed text-pretty text-fg-muted lg:justify-self-end">
          {description}
        </p>
      ) : null}
    </Reveal>
  );
}
