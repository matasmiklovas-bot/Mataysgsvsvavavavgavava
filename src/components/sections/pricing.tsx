import { siteConfig } from "@/config/site";
import { Reveal } from "@/components/reveal";

export function Pricing() {
  const { setup, monthly, equipmentRent, maintenance } = siteConfig.pricing;
  const tiles = [
    { label: "Įdiegimas", amount: setup, note: "vieną kartą" },
    { label: "Sistema", amount: monthly, note: "per mėnesį" },
    { label: "Priežiūra", amount: maintenance, note: "pakeitimai pagal jūsų prašymą" },
  ];
  return (
    <section id="kaina" aria-labelledby="kaina-title" className="scroll-mt-14 bg-paper">
      <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 sm:py-28">
        <Reveal className="text-center">
          <h2
            id="kaina-title"
            className="mx-auto max-w-[18ch] text-[2.4rem] leading-[1.04] font-semibold tracking-[-0.04em] text-balance sm:text-[3.5rem] lg:text-[4rem]"
          >
            Aiški kaina be smulkaus šrifto.
          </h2>
          <p className="mx-auto mt-5 max-w-[30rem] text-[1.125rem] text-balance text-ink-2 sm:text-[1.25rem]">
            Vieną kartą sumokate už įdiegimą. Toliau tik {monthly}&nbsp;€ per mėnesį.
          </p>
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-3 sm:mt-16 sm:grid-cols-3 sm:gap-5">
          {tiles.map((tile, index) => (
            <Reveal
              key={tile.label}
              delay={index * 100}
              className="flex items-center justify-between gap-4 rounded-[1.5rem] bg-white px-6 py-5 sm:flex-col sm:justify-start sm:gap-0 sm:rounded-[2rem] sm:py-10 sm:text-center"
            >
              <div className="sm:contents">
                <p className="text-[17px] font-semibold text-ink sm:font-normal sm:text-ink-2">{tile.label}</p>
                <p className="mt-0.5 text-[15px] text-ink-2 sm:order-last sm:mt-3 sm:text-[16px]">{tile.note}</p>
              </div>
              <p className="shrink-0 text-[2.75rem] leading-none font-semibold tracking-[-0.05em] tabular-nums sm:mt-2 sm:text-[4rem] sm:tracking-[-0.06em] lg:text-[5.25rem]">
                {tile.amount}&nbsp;€
              </p>
            </Reveal>
          ))}
        </div>

        {/* Equipment: own tablets or rent everything */}
        <Reveal className="mt-4 rounded-[2rem] bg-white p-7 sm:mt-5 sm:p-10">
          <h3 className="text-[1.6rem] leading-tight font-semibold tracking-[-0.03em] sm:text-[1.9rem]">
            Planšetės: savos arba nuomojamos
          </h3>
          <p className="mt-2 max-w-[40rem] text-ink-2">
            Užsakymai rodomi virtuvės, baro ir personalo planšetėse. Pasirinkite, kaip jums patogiau.
          </p>
          <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-line p-6">
              <p className="text-[15px] font-semibold text-ink-2">Savo įranga</p>
              <p className="mt-2 text-[2.25rem] leading-none font-semibold tracking-[-0.04em]">0&nbsp;€</p>
              <p className="mt-3 text-ink-2">Planšetes perkate patys arba naudojate jau turimas.</p>
            </div>
            <div className="relative rounded-2xl bg-night p-6 text-night-text">
              <span className="absolute top-5 right-5 rounded-full bg-tomato px-2.5 py-1 text-[12px] font-semibold text-white">
                Nieko pirkti nereikia
              </span>
              <p className="text-[15px] font-semibold text-night-muted">Įrangos nuoma</p>
              <p className="mt-2 text-[2.25rem] leading-none font-semibold tracking-[-0.04em]">
                {equipmentRent}&nbsp;€
                <span className="ml-1 text-[1rem] font-normal tracking-normal text-night-muted">/mėn.</span>
              </p>
              <p className="mt-3 text-night-muted">Visa reikalinga įranga iš mūsų už vieną mėnesio kainą.</p>
            </div>
          </div>

          <dl className="mt-8 divide-y divide-line border-t border-line">
            <PriceRow term="Priežiūra">
              Neribota ir nemokama. Meniu, kainų ar kitus pakeitimus, kurių paprašysite, atliekame be
              papildomo mokesčio.
            </PriceRow>
            <PriceRow term="Ko reikia iš jūsų">Stabilaus interneto salėje, virtuvėje ir bare.</PriceRow>
            <PriceRow term="Prieš apsisprendžiant">
              Parodysime demonstraciją ir atsakysime į klausimus apie įrangą, mokėjimus kortele ir
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
    <div className="grid grid-cols-1 gap-1 py-5 sm:grid-cols-[14rem_1fr] sm:gap-8">
      <dt className="font-semibold">{term}</dt>
      <dd className="text-ink-2">{children}</dd>
    </div>
  );
}
