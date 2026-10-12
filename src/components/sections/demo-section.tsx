import { guestTable } from "@/lib/data";
import { Demo } from "@/components/demo/demo";
import { Reveal } from "@/components/reveal";

export function DemoSection() {
  return (
    <section id="demo" aria-labelledby="demo-title" className="scroll-mt-14 bg-paper">
      <div className="mx-auto max-w-6xl px-4 pt-20 pb-16 sm:px-6 sm:pt-28 sm:pb-24">
        <Reveal className="mx-auto max-w-3xl text-center">
          <h2
            id="demo-title"
            className="text-[2.4rem] leading-[1.04] font-semibold tracking-[-0.04em] text-balance sm:text-[3.5rem] lg:text-[4rem]"
          >
            Užsisakykite patys, lyg sėdėtumėte prie {guestTable} staliuko.
          </h2>
          <p className="mx-auto mt-5 max-w-[36rem] text-[1.125rem] leading-relaxed text-ink-2 sm:text-[1.25rem]">
            Įsidėkite patiekalą, pažymėkite pastabą virtuvei ir pasirinkite, kaip mokėsite. Tada
            pažiūrėkite, kur užsakymas atsiduria ir ką mato padavėjas.
          </p>
          <p className="mt-4 text-[16px] text-ink-2">
            Tai interaktyvi demonstracija: užsakymai niekur nesiunčiami, pinigai nenuskaitomi.
          </p>
        </Reveal>
        <Reveal className="mt-12 sm:mt-16" delay={100}>
          <Demo />
        </Reveal>
      </div>
    </section>
  );
}
