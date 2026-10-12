import { Gauge, ShieldCheck, Smile, Workflow } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { SpotlightCard } from "@/components/ui/spotlight-card";

const benefits = [
  {
    icon: Gauge,
    title: "Greitesnis užsakymų priėmimas",
    text: "Svečiai užsako, kai yra pasiruošę, nelaukdami padavėjo. Personalui lieka daugiau laiko aptarnavimui.",
  },
  {
    icon: ShieldCheck,
    title: "Mažesnė klaidų tikimybė",
    text: "Užsakymą įveda pats klientas, todėl nebelieka neįskaitomų užrašų ir perdavimo „iš lūpų į lūpas“.",
  },
  {
    icon: Workflow,
    title: "Patogesnis virtuvės ir baro darbas",
    text: "Patiekalai keliauja į virtuvę, gėrimai — į barą. Kiekviena komanda mato tik tai, ką jai reikia paruošti.",
  },
  {
    icon: Smile,
    title: "Geresnė klientų patirtis",
    text: "Aiškus meniu su nuotraukomis ir kainomis telefone, o atsiskaitymo būdą svečias pasirenka pats.",
  },
];

export function Benefits() {
  return (
    <section id="naudos" aria-labelledby="naudos-title" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <SectionHeading
          id="naudos-title"
          eyebrow="Naudos restoranui"
          title={
            <>
              Mažiau rutinos. <br className="hidden sm:block" />
              <span className="text-fg-muted">Daugiau sklandaus darbo.</span>
            </>
          }
        />

        <ul className="mt-16 grid gap-5 sm:mt-20 md:grid-cols-2">
          {benefits.map(({ icon: Icon, title, text }, index) => (
            <Reveal as="li" key={title} delay={index * 90}>
              <SpotlightCard className="group h-full p-7 sm:p-8">
                <span className="relative flex size-12 items-center justify-center">
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-400/30 to-violet-700/10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6"
                  />
                  <span aria-hidden="true" className="absolute inset-px rounded-[15px] bg-ink-850" />
                  <Icon
                    className="relative size-5 text-violet-200 transition-transform duration-500 group-hover:scale-110"
                    aria-hidden="true"
                  />
                </span>
                <h3 className="mt-7 text-xl font-semibold tracking-tight">{title}</h3>
                <p className="mt-3 max-w-md text-[15.5px] leading-relaxed text-fg-muted">{text}</p>
              </SpotlightCard>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
