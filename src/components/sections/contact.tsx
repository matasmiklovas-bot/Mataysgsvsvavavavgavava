import { CalendarCheck, MessageSquareText, MonitorSmartphone } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { ContactForm } from "./contact-form";

const steps = [
  {
    icon: MessageSquareText,
    title: "Parašykite mums",
    text: "Trumpai papasakokite apie savo restoraną.",
  },
  {
    icon: CalendarCheck,
    title: "Suderiname laiką",
    text: "Susisieksime ir pasiūlysime demonstracijos laiką.",
  },
  {
    icon: MonitorSmartphone,
    title: "Pamatote sistemą",
    text: "Parodome, kaip užsakymai keliautų jūsų komandoje.",
  },
];

export function Contact() {
  return (
    <section id="kontaktai" aria-labelledby="kontaktai-title" className="relative py-24 sm:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="mx-auto grid max-w-6xl gap-14 px-5 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <Reveal className="flex flex-col">
          <p className="text-[13px] font-medium tracking-[0.08em] text-fg-subtle uppercase">
            Demonstracija ir kontaktai
          </p>
          <h2
            id="kontaktai-title"
            className="mt-4 text-[2.1rem] leading-[1.06] font-semibold tracking-[-0.035em] text-balance sm:text-[2.75rem]"
          >
            Pažiūrėkime, kaip tai veiktų jūsų restorane.
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-fg-muted">
            Užpildykite formą ir aptarsime, kaip QR užsakymai derėtų prie jūsų salės, virtuvės ir
            baro darbo.
          </p>

          <ol className="mt-10 space-y-5">
            {steps.map(({ icon: Icon, title, text }, index) => (
              <li key={title} className="flex gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
                  <Icon className="size-5 text-violet-200" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-medium">
                    <span className="mr-2 font-mono text-[13px] text-fg-subtle">0{index + 1}</span>
                    {title}
                  </p>
                  <p className="mt-0.5 text-[15px] text-fg-muted">{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal delay={120}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
