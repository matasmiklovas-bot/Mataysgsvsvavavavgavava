import { siteConfig } from "@/config/site";
import { heroOrder, restaurant } from "@/lib/data";
import { HeroStory } from "@/components/hero-story";
import { QrCode } from "@/components/qr-code";
import { LogoMark } from "@/components/logo";
import { buttonClass } from "@/components/ui";

const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as React.CSSProperties;

export function Hero() {
  const { setup, monthly } = siteConfig.pricing;
  return (
    <section aria-labelledby="hero-title" className="relative isolate -mt-14 overflow-hidden bg-night text-night-text">
      {/* Light: a soft glow above the headline and a slowly drifting warm pool under the devices. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(50%_60%_at_50%_0%,rgb(255_236_214/0.07),transparent_70%)]" />
        <div className="absolute inset-x-[-10%] bottom-[-8%] h-[72%] animate-glow bg-[radial-gradient(55%_50%_at_50%_70%,rgb(229_140_80/0.17),transparent_70%)] will-change-transform" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,transparent,rgb(255_255_255/0.08),transparent)]" />
      </div>
      <div className="mx-auto max-w-6xl px-4 pt-[7.5rem] pb-16 text-center sm:px-6 sm:pt-[9.5rem] lg:pt-[8.5rem] lg:pb-24 [@media(max-height:520px)]:pt-24">
        <p
          className="rise inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-3.5 py-1.5 text-[14px] text-night-text/85 sm:text-[15px]"
          style={delay(0)}
        >
          <span aria-hidden="true" className="size-1.5 rounded-full bg-tomato-bright shadow-[0_0_10px_2px_rgb(229_88_60/0.6)]" />
          QR užsakymai restoranams, kavinėms ir barams
        </p>
        <h1
          id="hero-title"
          className="rise mx-auto mt-6 max-w-[15ch] text-[2.6rem] leading-[1.02] font-semibold tracking-[-0.045em] text-balance sm:text-[4.25rem] lg:text-[4.75rem] xl:max-w-none"
          style={delay(80)}
        >
          Svečiai užsisako patys, <br className="max-xl:hidden" />o virtuvė užsakymą mato iškart.
        </h1>
        <p
          className="rise mx-auto mt-6 max-w-[34rem] text-[1.125rem] leading-relaxed text-night-muted sm:text-[1.25rem]"
          style={delay(160)}
        >
          Svečias nuskenuoja kodą ir užsisako telefone. Virtuvė, baras ir padavėjas mato iškart.
        </p>
        <div
          className="rise mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-8"
          style={delay(240)}
        >
          <a
            href="#forma"
            className={buttonClass({ fullOnMobile: true })}
          >
            {siteConfig.cta}
          </a>
          <a
            href="#demo"
            className="group inline-flex min-h-11 items-center gap-1.5 text-[1.0625rem] font-medium text-night-text hover:text-white"
          >
            Išbandyti demonstraciją
            <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-y-0.5">
              ↓
            </span>
          </a>
        </div>
        <p className="rise mt-6 text-[15px] text-balance text-night-muted" style={delay(300)}>
          {setup}&nbsp;€ už įdiegimą, toliau {monthly}&nbsp;€ per mėnesį
        </p>

        <div className="rise mt-14 sm:mt-16 lg:mt-14" style={delay(420)}>
          <HeroStory stand={<TableStand />} standCompact={<TableStand compact />} />
        </div>
      </div>
    </section>
  );
}

/** Table stand with a real, scannable QR code that opens the demo on this page. */
function TableStand({ compact = false }: { compact?: boolean }) {
  return (
    <figure
      aria-label={`Staliuko ${heroOrder.table} stovelis su QR kodu`}
      className={`relative text-left ${compact ? "w-full" : "w-[184px] xl:w-[204px]"}`}
    >
      <div className={`relative rounded-[22px] bg-[#fbf8f1] text-ink shadow-[0_40px_60px_-30px_rgb(0_0_0/0.95),inset_0_1px_0_rgb(255_255_255/0.9)] ring-1 ring-black/5 ${compact ? "p-3" : "p-3.5 xl:p-4"}`}>
        <div className="flex items-center gap-1.5 text-[11px] text-ink-2">
          <LogoMark className="size-3.5" />
          {restaurant.kind} „{restaurant.name}“
        </div>
        <div className="mt-2 flex items-end justify-between">
          <span className="pb-1 text-[10.5px] font-semibold tracking-[0.18em] text-ink-2 uppercase">Staliukas</span>
          <span className={`leading-[0.78] font-semibold tracking-[-0.06em] ${compact ? "text-[3.1rem]" : "text-[3.9rem] xl:text-[4.4rem]"}`}>
            {heroOrder.table}
          </span>
        </div>

        <div className="relative mt-3 overflow-hidden rounded-2xl bg-white p-2 ring-1 ring-black/[0.06]">
          <QrCode
            value={`${siteConfig.url}/#demo`}
            label="QR kodas, atidarantis demonstraciją"
            styled
            className="block h-auto w-full"
          />
          {/* Soft scanning light */}
          <span className="pointer-events-none absolute inset-x-0 h-12 -translate-y-1/2 animate-scan bg-[linear-gradient(to_bottom,transparent,rgb(229_88_60/0.16)_45%,rgb(229_88_60/0.16)_55%,transparent)]">
            <span className="absolute inset-x-2 top-1/2 h-[1.5px] -translate-y-1/2 rounded-full bg-tomato-bright/90 shadow-[0_0_12px_2px_rgb(229_88_60/0.55)]" />
          </span>
        </div>

        <div className={`mt-3 items-center gap-2 ${compact ? "hidden" : "flex"}`}>
          <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-ink text-white">
            <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <rect x="6" y="2.5" width="12" height="19" rx="3" />
              <path d="M10.5 18.5h3" strokeLinecap="round" />
            </svg>
          </span>
          <p className="text-[11.5px] leading-tight font-medium">
            Nuskenuokite kamera
            <span className="block font-normal text-ink-2">Meniu, užsakymas, apmokėjimas</span>
          </p>
        </div>
      </div>
      {/* Stand foot and its shadow on the table */}
      <div aria-hidden="true" className="mx-auto -mt-1 h-3 w-[86%] rounded-b-xl bg-[linear-gradient(to_bottom,#57514a,#2a2724)]" />
      <div aria-hidden="true" className="mx-auto mt-1 h-3 w-full rounded-[50%] bg-black/70 blur-md" />
    </figure>
  );
}
