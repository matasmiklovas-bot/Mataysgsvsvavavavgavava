import { BellRing, CreditCard, QrCode, ShoppingBag, Banknote, ChefHat, Wine, ConciergeBell } from "lucide-react";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { SpotlightCard } from "@/components/ui/spotlight-card";

const steps = [
  {
    number: "01",
    title: "Nuskenuoja QR kodą",
    text: "Klientas nuskenuoja kodą, esantį ant restorano staliuko.",
    icon: QrCode,
    visual: <ScanVisual />,
  },
  {
    number: "02",
    title: "Pasirenka patiekalus",
    text: "Meniu atsidaro tiesiog telefone. Nereikia atsisiųsti programėlės.",
    icon: ShoppingBag,
    visual: <MenuVisual />,
  },
  {
    number: "03",
    title: "Pasirenka atsiskaitymą",
    text: "Klientas gali atsiskaityti kortele arba pasirinkti atsiskaitymą grynaisiais pagal restorano nustatymus.",
    icon: CreditCard,
    visual: <PaymentVisual />,
  },
  {
    number: "04",
    title: "Užsakymas pasiekia komandą",
    text: "Užsakymas perduodamas virtuvės, baro ir personalo planšetėms pagal užsakymo tipą ir sistemos konfigūraciją.",
    icon: BellRing,
    visual: <RoutingVisual />,
  },
];

export function HowItWorks() {
  return (
    <section
      id="kaip-veikia"
      aria-labelledby="kaip-veikia-title"
      className="relative py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <SectionHeading
          id="kaip-veikia-title"
          eyebrow="Kaip veikia"
          title="Nuo staliuko iki virtuvės per keturis žingsnius"
          description="Klientas užsako savo tempu, o jūsų komanda iš karto mato, ką ir kam reikia paruošti."
        />

        <ol className="mt-16 grid gap-5 sm:mt-20 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <Reveal as="li" key={step.number} delay={index * 110} className="h-full">
              <SpotlightCard className="group flex h-full flex-col p-6 transition-transform duration-500 hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <span className="relative flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-ink-850">
                    <step.icon className="size-5 text-violet-200" aria-hidden="true" />
                  </span>
                  <span className="font-mono text-[13px] text-fg-subtle">{step.number}</span>
                </div>
                <div className="mt-6 h-28 overflow-hidden rounded-2xl border border-white/[0.06] bg-ink-900/70">
                  {step.visual}
                </div>
                <h3 className="mt-6 text-lg font-semibold tracking-tight">{step.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-fg-muted">{step.text}</p>
              </SpotlightCard>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

function ScanVisual() {
  return (
    <div aria-hidden="true" className="relative flex h-full items-center justify-center">
      <div className="relative size-16 rounded-xl border border-violet-300/40 p-2">
        <div className="grid size-full grid-cols-4 grid-rows-4 gap-0.5">
          {[1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1].map((on, i) => (
            <span key={i} className={on ? "rounded-[2px] bg-white/80" : ""} />
          ))}
        </div>
        <span
          className="absolute inset-x-1 top-1 h-0.5 animate-scan rounded-full bg-violet-400 shadow-[0_0_12px_2px_rgba(139,92,246,0.8)]"
          style={{ "--scan-distance": "54px" } as React.CSSProperties}
        />
      </div>
    </div>
  );
}

function MenuVisual() {
  return (
    <div aria-hidden="true" className="flex h-full flex-col justify-center gap-2 px-4">
      {[72, 56, 64].map((width, i) => (
        <div
          key={i}
          className="flex items-center gap-2.5 rounded-lg bg-white/[0.04] p-1.5 transition-transform duration-500 group-hover:translate-x-0.5"
          style={{ transitionDelay: `${i * 60}ms` }}
        >
          <span className="size-5 rounded-md bg-gradient-to-br from-violet-300/60 to-violet-700/40" />
          <span className="h-1.5 min-w-0 flex-1">
            <span className="block h-full rounded-full bg-white/25" style={{ width: `${width}%` }} />
          </span>
          <span className="size-4 shrink-0 rounded-full bg-white/80" />
        </div>
      ))}
    </div>
  );
}

function PaymentVisual() {
  return (
    <div aria-hidden="true" className="flex h-full flex-col items-stretch justify-center gap-2 px-4">
      <span className="flex items-center gap-2 rounded-xl border border-violet-300/40 bg-violet-500/15 px-3 py-2 text-xs text-violet-100">
        <CreditCard className="size-4" /> Kortele
        <span className="ml-auto flex size-3.5 items-center justify-center rounded-full bg-violet-400">
          <span className="size-1 rounded-full bg-white" />
        </span>
      </span>
      <span className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-fg-muted">
        <Banknote className="size-4" /> Grynaisiais
        <span className="ml-auto size-3.5 rounded-full border border-white/25" />
      </span>
    </div>
  );
}

function RoutingVisual() {
  const targets = [
    { icon: ChefHat, label: "Virtuvė" },
    { icon: Wine, label: "Baras" },
    { icon: ConciergeBell, label: "Salė" },
  ];
  return (
    <div aria-hidden="true" className="flex h-full items-center justify-center gap-2 px-3">
      {targets.map(({ icon: Icon, label }, i) => (
        <span
          key={label}
          className="flex min-w-0 flex-1 flex-col items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-1 py-2.5 text-[11px] text-fg-muted transition-colors duration-500 group-hover:border-violet-300/40 group-hover:text-violet-100"
          style={{ transitionDelay: `${i * 90}ms` }}
        >
          <Icon className="size-4" />
          {label}
        </span>
      ))}
    </div>
  );
}
