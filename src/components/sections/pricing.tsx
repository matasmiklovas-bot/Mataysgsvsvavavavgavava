import { Check } from "lucide-react";
import { siteConfig } from "@/config/site";
import { ContactForm } from "@/components/contact/contact-form";
import { ContactTrigger } from "@/components/contact/contact-trigger";
import { Reveal } from "@/components/ui/reveal";

const features = [
  "QR meniu, kuris atsidaro telefone be programėlės",
  "Krepšelis ir aiški užsakymo suvestinė",
  "Atsiskaitymas kortele arba grynaisiais pagal jūsų nustatymus",
  "Užsakymų perdavimas virtuvės, baro ir personalo planšetėms",
];

/** Pricing and the contact form side by side, so the price and the next step are seen together. */
export function Pricing() {
  const { setup, monthly } = siteConfig.pricing;
  return (
    <section className="relative py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-14">
        <Reveal as="div" className="flex flex-col">
          <div id="kaina" className="scroll-mt-24 border-t border-white/[0.08] pt-8">
            <p className="text-[13px] font-medium tracking-[0.08em] text-fg-subtle uppercase">Kaina</p>
            <h2 className="mt-4 font-display text-[2.1rem] leading-[1.06] font-semibold tracking-[-0.035em] text-balance sm:text-[2.75rem]">
              Paprasta ir skaidri kaina
            </h2>
          </div>

          <dl className="mt-8 grid grid-cols-2 overflow-hidden rounded-3xl border border-white/[0.08]">
            <div className="p-5 sm:p-7">
              <dt className="text-[14px] text-fg-muted">Vienkartinis sistemos įdiegimas</dt>
              <dd className="mt-3 font-display text-5xl font-semibold tracking-[-0.04em] tabular-nums sm:text-6xl">
                {setup} €
              </dd>
            </div>
            <div className="border-l border-white/[0.08] bg-white/[0.02] p-5 sm:p-7">
              <dt className="text-[14px] text-fg-muted">Mėnesinis sistemos mokestis</dt>
              <dd className="mt-3 font-display text-5xl font-semibold tracking-[-0.04em] tabular-nums sm:text-6xl">
                {monthly} €<span className="ml-1 text-lg font-normal tracking-normal text-fg-muted">/mėn.</span>
              </dd>
            </div>
          </dl>

          <ul className="mt-8 grid gap-3">
            {features.map((feature) => (
              <li key={feature} className="flex gap-3 text-[15.5px] text-fg-muted">
                <Check className="mt-1 size-4 shrink-0 text-accent" strokeWidth={2.5} aria-hidden="true" />
                {feature}
              </li>
            ))}
          </ul>

          <p className="mt-8 max-w-md text-[15px] leading-relaxed text-fg-muted">
            Prieš priimdami sprendimą galite pamatyti, kaip sistema veikia — paprašykite
            demonstracijos.
          </p>
          <ContactTrigger className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-full bg-fg px-7 text-[15px] font-semibold text-ink-950 transition-colors hover:bg-white sm:w-fit lg:hidden">
            Noriu išbandyti
          </ContactTrigger>
        </Reveal>

        <Reveal as="div" delay={100} className="flex flex-col">
          <div id="kontaktai" className="scroll-mt-24 border-t border-white/[0.08] pt-8">
            <p className="text-[13px] font-medium tracking-[0.08em] text-fg-subtle uppercase">
              Noriu išbandyti
            </p>
            <h2 className="mt-4 font-display text-[2.1rem] leading-[1.06] font-semibold tracking-[-0.035em] text-balance sm:text-[2.75rem]">
              Pažiūrėkime, kaip tai veiktų jūsų restorane.
            </h2>
          </div>
          <div className="mt-8">
            <ContactForm />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
