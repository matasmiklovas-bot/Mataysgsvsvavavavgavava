import { InteractiveDemo } from "@/components/demo/interactive-demo";
import { SectionHeading } from "@/components/ui/section-heading";

export function HowItWorks() {
  return (
    <section id="kaip-veikia" aria-labelledby="kaip-veikia-title" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <SectionHeading
          id="kaip-veikia-title"
          eyebrow="Kaip veikia"
          title="Nuo staliuko iki virtuvės — keturi žingsniai"
          description={
            <>
              Išbandykite patys: užsakykite telefone ir stebėkite, kaip užsakymas pasiskirsto
              virtuvei, barui ir personalui.{" "}
              <span className="text-fg-subtle">
                Tai demonstracija — užsakymai niekur nesiunčiami, mokėjimai nevykdomi.
              </span>
            </>
          }
        />
        <div className="mt-12">
          <InteractiveDemo />
        </div>
      </div>
    </section>
  );
}
