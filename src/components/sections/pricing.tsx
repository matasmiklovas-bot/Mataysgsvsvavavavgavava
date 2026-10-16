import { siteConfig } from "@/config/site";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { buttonClass } from "@/components/ui";
import { EquipmentPicker } from "@/components/equipment-choice";

/** What both payment options include. Only things the product actually does. */
const included = [
  "Meniu su nuotraukomis ir QR kodai staliukams",
  "Virtuvės, baro ir padavėjų ekranai",
  "Mokėjimas kortele telefonu arba grynaisiais",
  "Priežiūra ir pakeitimai, kurių paprašysite",
];

export function Pricing() {
  const { oneTime, perMonth } = siteConfig.pricing;
  const tiles = [
    { label: "Vienu mokėjimu", amount: oneTime, note: "vieną kartą, be mėnesio mokesčio" },
    { label: "Kas mėnesį", amount: perMonth, note: "be įdiegimo mokesčio" },
  ];
  return (
    <section id="kaina" aria-labelledby="kaina-title" className="scroll-mt-14 bg-paper">
      <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 sm:py-28">
        <SectionHeading
          id="kaina-title"
          title="Du būdai mokėti, jokio smulkaus šrifto."
          lead="Pirmiausia nemokamas prototipas. Patiks, renkatės, kaip mokėti. Priežiūra ir pakeitimai įskaičiuoti abiem atvejais."
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
                <p className="mt-0.5 text-[15px] text-pretty text-ink-2 sm:order-last sm:mt-3 sm:text-[16px]">{tile.note}</p>
              </div>
              <p className="shrink-0 text-[2.75rem] leading-none font-semibold tracking-[-0.05em] tabular-nums sm:mt-2 sm:text-[4rem] sm:tracking-[-0.06em] lg:text-[5.25rem]">
                {tile.amount}&nbsp;€
              </p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={150} className="mt-4 rounded-[1.5rem] bg-white px-6 py-6 sm:rounded-[2rem] sm:px-10 sm:py-8">
          <p className="text-[15px] font-semibold text-ink-2">Įskaičiuota abiem atvejais</p>
          <ul className="mt-4 grid gap-x-8 gap-y-3 text-[16px] sm:grid-cols-2">
            {included.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span aria-hidden="true" className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-ink text-white">
                  <svg viewBox="0 0 24 24" className="size-3" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12.5l4.5 4.5L19 7.5" />
                  </svg>
                </span>
                <span className="text-pretty">{item}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        {/* Equipment: own tablets or rent everything */}
        <Reveal className="mt-16 sm:mt-24">
          <div className="text-center">
            <h3 className="text-[1.75rem] leading-tight font-semibold tracking-[-0.03em] text-balance sm:text-[2.25rem]">
              Planšetės: savos arba nuomojamos.
            </h3>
            <p className="mt-3 text-[1.0625rem] text-pretty text-ink-2">Pasirinkite, ir iškart matysite savo kainą.</p>
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
            <p className="mx-auto mt-4 max-w-[30rem] text-[15px] text-balance text-ink-2">
              Prototipą jūsų restoranui paruošime nemokamai. Mokate tik tada, jei jis jums patinka.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
