import { siteConfig } from "@/config/site";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { EquipmentPicker, PriceReceipt } from "@/components/equipment-choice";
import { buttonClass } from "@/components/ui";

export function Pricing() {
  return (
    <section id="kaina" aria-labelledby="kaina-title" className="scroll-mt-14 bg-paper">
      <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 sm:pb-28">
        <SectionHeading
          id="kaina-title"
          title="Aiški kaina be smulkaus šrifto."
          lead="Sumokate tik už įdiegimą. Sistema, priežiūra ir visi pakeitimai toliau nieko nekainuoja."
        />
        <div className="mt-10 grid grid-cols-1 gap-x-10 gap-y-10 sm:mt-14 lg:grid-cols-12">
          <Reveal className="lg:col-span-6 xl:col-span-5">
            <EquipmentPicker />
          </Reveal>
          <Reveal
            delay={100}
            className="flex items-start justify-center lg:col-span-6 lg:col-start-7 lg:row-span-2 lg:row-start-1 lg:justify-end xl:col-span-5 xl:col-start-8"
          >
            <PriceReceipt />
          </Reveal>
          <div className="lg:col-span-6 xl:col-span-5">
            <a href="#forma" className={buttonClass({ fullOnMobile: true })}>
              {siteConfig.cta}
            </a>
            <p className="mt-4 max-w-[28rem] text-[15px] text-ink-2">
              Reikia tik stabilaus interneto. Nieko nepasirašote, kol viskas aišku.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
