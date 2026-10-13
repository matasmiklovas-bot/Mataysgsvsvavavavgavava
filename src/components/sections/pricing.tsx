import { siteConfig } from "@/config/site";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { buttonClass } from "@/components/ui";
import { EquipmentPicker } from "@/components/equipment-choice";

export function Pricing() {
  const { setup, monthly } = siteConfig.pricing;
  const tiles = [
    { label: "Įdiegimas", amount: setup, note: "vieną kartą" },
    { label: "Kas mėnesį", amount: monthly, note: "sistema, priežiūra ir pakeitimai" },
  ];
  return (
    <section id="kaina" aria-labelledby="kaina-title" className="scroll-mt-14 bg-paper">
      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 sm:py-28">
        <SectionHeading
          id="kaina-title"
          title="Aiški kaina be smulkaus šrifto."
          lead="Pirmiausia nemokamas prototipas. Patiks, sumokate tik už įdiegimą, visa kita nemokama."
        />

        <div className="mt-10 grid grid-cols-1 gap-3 sm:mt-16 sm:grid-cols-2 sm:gap-4">
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
        <Reveal className="mt-16 sm:mt-24">
          <div className="text-center">
            <h3 className="text-[1.75rem] leading-tight font-semibold tracking-[-0.03em] text-balance sm:text-[2.25rem]">
              Planšetės: savos arba nuomojamos.
            </h3>
            <p className="mt-3 text-[1.0625rem] text-ink-2">Pasirinkite, ir iškart matysite savo kainą.</p>
          </div>
          <div className="mt-8">
            <EquipmentPicker />
          </div>

          <div className="mt-10 text-center">
            <a
              href="#forma"
              className={buttonClass({ fullOnMobile: true })}
            >
              {siteConfig.cta}
            </a>
            <p className="mt-4 text-[15px] text-ink-2">
              Prototipą jūsų restoranui paruošime nemokamai. Mokate tik tada, jei jis jums patinka.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
