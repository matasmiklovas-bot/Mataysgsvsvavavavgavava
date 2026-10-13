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
      {/* One quiet light source: a warm pool on the "table" where the devices stand. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[60%] bg-[radial-gradient(55%_50%_at_50%_80%,rgb(229_140_80/0.12),transparent_70%)]"
      />
      <div className="mx-auto max-w-7xl px-4 pt-[7rem] pb-14 sm:px-6 sm:pt-[9rem] lg:pt-[9.5rem] lg:pb-20 [@media(max-height:520px)]:pt-24">
        <h1
          id="hero-title"
          className="rise text-[min(8.6vw,6rem)] leading-[1] sm:text-[min(7.6vw,6rem)] sm:leading-[0.98] font-semibold tracking-[-0.04em]"
          style={delay(0)}
        >
          Svečiai užsisako patys.
          <span className="block text-night-muted">Virtuvė mato iškart.</span>
        </h1>
        <div className="rise mt-8 grid gap-y-7 sm:mt-10 lg:grid-cols-12 lg:items-end lg:gap-x-10" style={delay(120)}>
          <p className="max-w-[32rem] text-[1.0625rem] leading-relaxed text-night-muted sm:text-[1.1875rem] lg:col-span-6">
            Svečias nuskenuoja QR kodą ant staliuko ir užsisako savo telefone. Užsakymas iškart atsiranda
            virtuvės ar baro planšetėje, o padavėjas mato, ką ir kur nešti.
          </p>
          <div className="lg:col-span-6 lg:justify-self-end">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <a href="#forma" className={buttonClass({ fullOnMobile: true })}>
                {siteConfig.cta}
              </a>
              <a href="#demo" className={buttonClass({ variant: "secondary", on: "dark", fullOnMobile: true })}>
                Išbandyti demonstraciją
              </a>
            </div>
            <p className="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-[14px] text-night-muted lg:justify-end">
              <span>{setup}&nbsp;€ įdiegimas</span>
              <span aria-hidden="true">·</span>
              <span>{monthly}&nbsp;€ per mėnesį</span>
              <span aria-hidden="true">·</span>
              <span>Be programėlės</span>
            </p>
          </div>
        </div>

        <div className="rise mt-14 sm:mt-16 lg:mt-20" style={delay(260)}>
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
