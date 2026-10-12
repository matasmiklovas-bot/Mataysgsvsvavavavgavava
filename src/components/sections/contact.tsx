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
        <div className="absolute bottom-0 left-0 h-[480px] w-[620px] rounded-full bg-violet-700/15 blur-[150px]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="mx-auto grid max-w-6xl gap-14 px-5 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
        <Reveal className="flex flex-col">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-1.5 text-xs font-medium tracking-wide text-violet-200/90 uppercase">
            <span className="size-1.5 rounded-full bg-violet-400 shadow-[0_0_10px_2px_rgba(167,139,250,0.7)]" />
            Demonstracija ir kontaktai
          </span>
          <h2
            id="kontaktai-title"
            className="mt-5 text-[2.25rem] leading-[1.05] font-semibold tracking-[-0.035em] text-balance sm:text-5xl"
          >
            Pažiūrėkime, kaip tai veiktų{" "}
            <span className="font-serif font-normal tracking-[-0.01em] text-violet-200 italic">
              jūsų restorane.
            </span>
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
