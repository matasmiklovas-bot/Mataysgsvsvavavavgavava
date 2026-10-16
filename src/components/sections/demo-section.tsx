import { guestTable } from "@/lib/data";
import { Demo } from "@/components/demo/demo";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";

export function DemoSection() {
  return (
    <section id="demo" aria-labelledby="demo-title" className="scroll-mt-14 bg-paper">
      <div className="mx-auto max-w-7xl px-4 pt-20 pb-16 sm:px-6 sm:pt-28 sm:pb-24">
        <SectionHeading
          id="demo-title"
          title={<>Užsisakykite patys, lyg sėdėtumėte prie {guestTable}&nbsp;staliuko.</>}
          lead="Įsidėkite patiekalą, užsakykite ir stebėkite, kur keliauja užsakymas."
        />
        <p className="mt-3 text-center text-[15px] text-pretty text-ink-2">Niekas nesiunčiama, pinigai nenuskaitomi.</p>
        <Reveal className="mt-12 sm:mt-16" delay={100}>
          <Demo />
        </Reveal>
      </div>
    </section>
  );
}
