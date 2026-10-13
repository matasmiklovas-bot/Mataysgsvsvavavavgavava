import { siteConfig } from "@/config/site";
import { Reveal } from "@/components/reveal";
import { EquipmentPicker } from "@/components/equipment-choice";

export function Pricing() {
  const { setup, monthly } = siteConfig.pricing;
  const tiles = [
    { label: "Įdiegimas", amount: setup, note: "vieną kartą" },
    { label: "Kas mėnesį", amount: monthly, note: "sistema, priežiūra ir pakeitimai" },
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
            Sumokate tik už įdiegimą. Visa kita nemokama.
          </p>
        </Reveal>

        <div className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-3 sm:mt-16 sm:grid-cols-2 sm:gap-5">
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
            Užsakymai rodomi planšetėse virtuvėje, bare ir salėje.
          </p>
          <div className="mt-7">
            <EquipmentPicker />
          </div>

          <p className="mt-6 text-center text-[15px] text-ink-2">
            Reikia tik stabilaus interneto. Nieko nepasirašote, kol viskas aišku.
          </p>
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
