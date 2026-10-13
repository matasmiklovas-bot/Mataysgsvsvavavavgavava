import { guestTable } from "@/lib/data";
import { Demo } from "@/components/demo/demo";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";

export function DemoSection() {
  return (
    <section id="demo" aria-labelledby="demo-title" className="scroll-mt-14 bg-paper">
      <div className="mx-auto max-w-7xl px-4 pt-16 pb-16 sm:px-6 sm:pt-24 sm:pb-24">
        <SectionHeading
          id="demo-title"
          title={<>Užsisakykite patys, lyg sėdėtumėte prie {guestTable} staliuko.</>}
          lead={
            <>
              Įsidėkite patiekalą, užsakykite ir stebėkite, kur keliauja užsakymas.{" "}
              <span className="text-ink-2/90">Niekas nesiunčiama, pinigai nenuskaitomi.</span>
            </>
          }
        />
        <Reveal className="mt-10 sm:mt-14" delay={100}>
          <Demo />
        </Reveal>
      </div>
    </section>
  );
}
