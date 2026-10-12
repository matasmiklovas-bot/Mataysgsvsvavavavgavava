import { FlaskConical } from "lucide-react";
import { InteractiveDemo } from "@/components/demo/interactive-demo";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

export function DemoSection() {
  return (
    <section
      id="demonstracija"
      aria-labelledby="demonstracija-title"
      className="relative overflow-hidden py-24 sm:py-32"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-violet-700/15 blur-[160px]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>

      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <SectionHeading
          id="demonstracija-title"
          eyebrow="Interaktyvi demonstracija"
          title="Išbandykite, kaip tai veikia"
          description="Sudarykite užsakymą telefone, pasirinkite atsiskaitymo būdą ir stebėkite, kaip jis pasiskirsto virtuvės, baro ir personalo ekranuose."
        />

        <Reveal className="mx-auto mt-8 flex max-w-2xl items-start gap-3 rounded-2xl border border-amber-300/20 bg-amber-300/[0.06] px-4 py-3 text-[14px] leading-relaxed text-amber-100/90">
          <FlaskConical className="mt-0.5 size-4 shrink-0 text-amber-300" aria-hidden="true" />
          <p>
            <strong className="font-medium text-amber-100">Demonstracinė aplinka.</strong> Užsakymai
            niekur nesiunčiami, mokėjimai nevykdomi, o duomenys išsitrina perkrovus puslapį.
          </p>
        </Reveal>

        <Reveal className="mt-14 sm:mt-16" delay={100}>
          <InteractiveDemo />
        </Reveal>
      </div>
    </section>
  );
}
