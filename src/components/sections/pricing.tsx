import { ArrowRight, Check, Eye } from "lucide-react";
import { siteConfig } from "@/config/site";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

const features = [
  "QR meniu, kuris atsidaro telefone be programėlės",
  "Krepšelis ir aiški užsakymo suvestinė",
  "Atsiskaitymas kortele arba grynaisiais pagal jūsų nustatymus",
  "Užsakymų perdavimas virtuvės, baro ir personalo planšetėms",
];

export function Pricing() {
  const { setup, monthly } = siteConfig.pricing;
  return (
    <section id="kaina" aria-labelledby="kaina-title" className="relative py-24 sm:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 h-[520px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/20 blur-[150px]" />
      </div>

      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <SectionHeading
          id="kaina-title"
          eyebrow="Kainodara"
          title="Paprasta ir skaidri kaina"
          description="Vienas įdiegimo mokestis ir simbolinis mėnesinis mokestis."
          align="center"
        />

        <Reveal className="mx-auto mt-16 max-w-4xl sm:mt-20">
          {/* Gradient border */}
          <div className="rounded-[2.1rem] bg-gradient-to-b from-violet-300/50 via-white/10 to-white/[0.04] p-px shadow-[0_40px_120px_-40px_rgba(139,92,246,0.55)]">
            <div className="relative overflow-hidden rounded-[2.05rem] bg-ink-900/95 p-6 sm:p-10 lg:p-12">
              <div
                aria-hidden="true"
                className="absolute -top-24 -right-24 size-72 rounded-full bg-violet-500/20 blur-3xl"
              />

              <div className="relative grid gap-4 sm:grid-cols-2">
                <PriceBlock label="Vienkartinis sistemos įdiegimas" amount={`${setup} €`} note="Mokama vieną kartą" />
                <PriceBlock
                  label="Mėnesinis sistemos mokestis"
                  amount={`${monthly} €`}
                  suffix="/mėn."
                  note="Kas mėnesį"
                  highlight
                />
              </div>

              <div className="relative mt-10 grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-end">
                <div>
                  <p className="text-[13px] font-medium tracking-wide text-fg-subtle uppercase">
                    Sistemos galimybės
                  </p>
                  <ul className="mt-4 grid gap-3">
                    {features.map((feature) => (
                      <li key={feature} className="flex gap-3 text-[15.5px] text-fg-muted">
                        <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-violet-400/15">
                          <Check className="size-3 text-violet-200" strokeWidth={3} aria-hidden="true" />
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-col gap-4">
                  <ButtonLink href="#kontaktai" size="lg" className="w-full">
                    Noriu išbandyti
                    <ArrowRight
                      className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </ButtonLink>
                  <p className="flex gap-2.5 text-[14px] leading-relaxed text-fg-muted">
                    <Eye className="mt-0.5 size-4 shrink-0 text-violet-300" aria-hidden="true" />
                    Prieš priimdami sprendimą galite pamatyti, kaip sistema veikia: paprašykite
                    demonstracijos ir kartu aptarsime, kaip ji veiktų jūsų restorane.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function PriceBlock({
  label,
  amount,
  suffix,
  note,
  highlight = false,
}: {
  label: string;
  amount: string;
  suffix?: string;
  note: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-3xl border p-6 sm:p-7 ${
        highlight ? "border-violet-300/25 bg-violet-500/[0.08]" : "border-white/10 bg-white/[0.03]"
      }`}
    >
      <p className="text-[15px] text-fg-muted">{label}</p>
      <p className="mt-4 flex items-baseline gap-1.5">
        <span className="text-6xl font-semibold tracking-[-0.05em] sm:text-7xl">{amount}</span>
        {suffix ? <span className="text-xl text-fg-muted">{suffix}</span> : null}
      </p>
      <p className="mt-3 text-[13px] text-fg-subtle">{note}</p>
    </div>
  );
}
