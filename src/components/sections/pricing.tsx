import { siteConfig } from "@/config/site";
import { Reveal } from "@/components/reveal";

export function Pricing() {
  const { setup, monthly } = siteConfig.pricing;
  return (
    <section id="kaina" aria-labelledby="kaina-title" className="scroll-mt-14 bg-paper">
      <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 sm:py-28">
        <Reveal className="text-center">
          <h2
            id="kaina-title"
            className="text-[2.4rem] leading-[1.04] font-semibold tracking-[-0.04em] text-balance sm:text-[3.5rem] lg:text-[4rem]"
          >
            {setup}&nbsp;€ už įdiegimą ir {monthly}&nbsp;€ per mėnesį.
          </h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:mt-16 sm:grid-cols-2 sm:gap-5">
          <Reveal className="rounded-[2rem] bg-white p-8 text-center sm:p-10">
            <p className="text-[17px] text-ink-2">Įdiegimas</p>
            <p className="mt-2 text-[5rem] leading-none font-semibold tracking-[-0.06em] tabular-nums sm:text-[6.5rem]">
              {setup}&nbsp;€
            </p>
            <p className="mt-3 text-[17px] text-ink-2">vieną kartą</p>
          </Reveal>
          <Reveal delay={120} className="rounded-[2rem] bg-white p-8 text-center sm:p-10">
            <p className="text-[17px] text-ink-2">Naudojimas</p>
            <p className="mt-2 text-[5rem] leading-none font-semibold tracking-[-0.06em] tabular-nums sm:text-[6.5rem]">
              {monthly}&nbsp;€
            </p>
            <p className="mt-3 text-[17px] text-ink-2">per mėnesį</p>
          </Reveal>
        </div>

        <Reveal className="mt-4 rounded-[2rem] bg-white p-7 sm:mt-5 sm:p-10">
          {/* TODO (site owner): add exact scope of setup, tablet requirements, VAT and contract terms when confirmed. */}
          <dl className="divide-y divide-line">
            <PriceRow term="Įdiegimas, 400 €">
              Mokama vieną kartą, kai sistema paruošiama jūsų restoranui: meniu, staliukams, virtuvei,
              barui ir personalui.
            </PriceRow>
            <PriceRow term="Naudojimas, 1 € per mėnesį">
              Mokama kas mėnesį, kol sistema veikia jūsų restorane.
            </PriceRow>
            <PriceRow term="Ko reikia iš jūsų">
              Planšetės virtuvei, barui ir personalui bei stabilus internetas salėje. Kokių planšečių
              reikia, pasakysime per demonstraciją.
            </PriceRow>
            <PriceRow term="Prieš apsisprendžiant">
              Parodysime demonstraciją ir atsakysime į klausimus apie planšetes, mokėjimus kortele ir
              sutarties sąlygas. Nieko nepasirašote, kol viskas aišku.
            </PriceRow>
          </dl>
          <div className="mt-8 text-center">
            <a
              href="#forma"
              className="inline-flex h-13 w-full items-center justify-center rounded-full bg-tomato px-8 text-[1.0625rem] font-medium whitespace-nowrap text-white transition-colors hover:bg-tomato-dark sm:w-auto"
            >
              {siteConfig.cta}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function PriceRow({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-1 py-5 first:pt-0 sm:grid-cols-[14rem_1fr] sm:gap-8">
      <dt className="font-semibold">{term}</dt>
      <dd className="text-ink-2">{children}</dd>
    </div>
  );
}
