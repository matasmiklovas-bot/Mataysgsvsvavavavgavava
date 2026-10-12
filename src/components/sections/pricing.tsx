import { siteConfig } from "@/config/site";

export function Pricing() {
  const { setup, monthly } = siteConfig.pricing;
  return (
    <section id="kaina" aria-labelledby="kaina-title" className="scroll-mt-16 border-y border-line bg-paper-2">
      <div className="mx-auto grid grid-cols-1 max-w-6xl gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[minmax(0,380px)_1fr] lg:gap-16">
        {/* The price as a restaurant bill */}
        <div className="slip mx-auto w-full max-w-[380px] self-start px-6 pt-6 text-[15px] leading-[1.7] shadow-[0_24px_40px_-24px_rgb(0_0_0/0.5)] lg:mx-0">
          <p className="text-center font-semibold tracking-[0.2em]">SĄSKAITA</p>
          <p className="text-center text-[13px] text-ink-2">Stalas, QR užsakymai</p>
          <div className="my-4 border-t border-dashed border-ink/40" />
          <div className="flex justify-between gap-4">
            <span>Įdiegimas</span>
            <span className="font-semibold">{setup},00&nbsp;€</span>
          </div>
          <p className="text-[13px] text-ink-2">vieną kartą</p>
          <div className="mt-3 flex justify-between gap-4">
            <span>Naudojimas</span>
            <span className="font-semibold">{monthly},00&nbsp;€</span>
          </div>
          <p className="text-[13px] text-ink-2">kas mėnesį</p>
          <div className="my-4 border-t border-dashed border-ink/40" />
          <p className="text-[13px] text-ink-2">
            PVM: <span className="todo font-sans">[TODO: ar kainos su PVM]</span>
          </p>
          <p className="mt-4 text-center text-[13px] tracking-[0.15em]">AČIŪ, KAD UŽSUKOTE</p>
        </div>

        <div>
          <h2
            id="kaina-title"
            className="font-display text-[2.25rem] leading-[1.02] font-bold text-balance sm:text-[3rem] lg:text-[3.4rem]"
          >
            {setup}&nbsp;€ už įdiegimą ir {monthly}&nbsp;€ per mėnesį
          </h2>
          <dl className="mt-8 divide-y divide-line border-y border-line">
            <PriceRow term="Kas įeina į 400 €">
              <span className="todo">[TODO: kas tiksliai įeina į įdiegimą: meniu suvedimas, QR kodai staliukams, mokymai, planšečių paruošimas?]</span>
            </PriceRow>
            <PriceRow term="Ko reikia iš jūsų">
              Planšetės virtuvei, barui ir personalui bei internetas.{" "}
              <span className="todo">[TODO: ar planšetes perkate patys, kokie modeliai tinka, kiek jų reikia]</span>
            </PriceRow>
            <PriceRow term="Kodėl tik 1 € per mėnesį">
              <span className="todo">[TODO: paaiškinimas, kodėl mėnesio mokestis toks mažas]</span>
            </PriceRow>
            <PriceRow term="Sutartis">
              <span className="todo">[TODO: minimalus terminas, kaip nutraukti, ar yra kitų mokesčių]</span>
            </PriceRow>
          </dl>
          <a
            href="#forma"
            className="mt-8 inline-flex h-13 w-full items-center justify-center rounded-md bg-tomato px-7 text-[1.0625rem] font-semibold text-white transition-colors hover:bg-tomato-dark sm:w-auto"
          >
            {siteConfig.cta}
          </a>
        </div>
      </div>
    </section>
  );
}

function PriceRow({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-1 py-4 sm:grid-cols-[13rem_1fr] sm:gap-6">
      <dt className="font-semibold">{term}</dt>
      <dd className="text-ink-2">{children}</dd>
    </div>
  );
}
