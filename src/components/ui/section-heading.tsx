import type { ReactNode } from "react";
import { Reveal } from "./reveal";

type SectionHeadingProps = {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  id?: string;
  align?: "center" | "left";
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  id,
  align = "center",
}: SectionHeadingProps) {
  const alignment = align === "center" ? "mx-auto text-center items-center" : "items-start";
  return (
    <Reveal className={`flex max-w-3xl flex-col gap-5 ${alignment}`}>
      <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-xs font-medium tracking-wide text-violet-200/90 uppercase">
        <span className="size-1.5 rounded-full bg-violet-400 shadow-[0_0_10px_2px_rgba(167,139,250,0.7)]" />
        {eyebrow}
      </span>
      <h2
        id={id}
        className="text-[2.25rem] leading-[1.05] font-semibold tracking-[-0.035em] text-balance sm:text-5xl lg:text-[3.5rem]"
      >
        {title}
      </h2>
      {description ? (
        <p className="max-w-2xl text-lg leading-relaxed text-pretty text-fg-muted">{description}</p>
      ) : null}
    </Reveal>
  );
}
