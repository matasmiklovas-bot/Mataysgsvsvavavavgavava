import { Gauge, ShieldCheck, Smile, Workflow } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

const benefits = [
  {
    icon: Gauge,
    title: "Greitesnis užsakymų priėmimas",
    text: "Svečiai užsako, kai yra pasiruošę, nelaukdami padavėjo. Personalui lieka daugiau laiko aptarnavimui.",
  },
  {
    icon: ShieldCheck,
    title: "Mažesnė klaidų tikimybė",
    text: "Užsakymą įveda pats svečias, todėl nebelieka neįskaitomų užrašų ir nesusipratimų perduodant.",
  },
  {
    icon: Workflow,
    title: "Patogesnis virtuvės ir baro darbas",
    text: "Patiekalai keliauja į virtuvę, gėrimai — į barą. Kiekvienas mato tik tai, ką reikia paruošti.",
  },
  {
    icon: Smile,
    title: "Geresnė klientų patirtis",
    text: "Aiškus meniu su nuotraukomis ir kainomis, o atsiskaitymo būdą svečias pasirenka pats.",
  },
];

export function Benefits() {
  return (
    <section id="naudos" aria-labelledby="naudos-title" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <SectionHeading
          id="naudos-title"
          eyebrow="Naudos restoranui"
          title={
            <>
              Mažiau rutinos. <span className="text-fg-muted">Daugiau sklandaus darbo.</span>
            </>
          }
        />

        <ul className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.08] sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map(({ icon: Icon, title, text }, index) => (
            <Reveal as="li" key={title} delay={index * 80} className="group bg-ink-950 p-6 sm:p-7">
              <Icon
                className="size-6 text-accent transition-transform duration-500 group-hover:-translate-y-0.5"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              <h3 className="mt-8 font-display text-lg leading-snug font-semibold tracking-[-0.01em]">
                {title}
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-fg-muted">{text}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
