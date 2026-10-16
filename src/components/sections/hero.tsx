import { siteConfig } from "@/config/site";
import { heroOrder, restaurant } from "@/lib/data";
import { HeroStory } from "@/components/hero-story";
import { QrCode } from "@/components/qr-code";
import { LogoMark } from "@/components/logo";
import { buttonClass } from "@/components/ui";

const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as React.CSSProperties;

export function Hero() {
  const { oneTime, perMonth } = siteConfig.pricing;
  return (
    <section aria-labelledby="hero-title" className="relative isolate -mt-14 overflow-hidden bg-night text-night-text">
      <div className="mx-auto max-w-6xl px-4 pt-[7rem] pb-16 text-center sm:px-6 sm:pt-[9rem] lg:pt-[8rem] lg:pb-24 [@media(max-height:520px)]:pt-24">
        <h1
          id="hero-title"
          className="rise mx-auto max-w-[15ch] text-[2.25rem] max-sm:max-w-none leading-[1.02] font-semibold tracking-[-0.045em] text-balance sm:text-[4.25rem] lg:text-[4.75rem] xl:max-w-none"
          style={delay(0)}
        >
          Svečiai užsisako patys, <br className="max-xl:hidden" />o virtuvė užsakymą mato iškart.
        </h1>
        <p
          className="rise mx-auto mt-6 max-w-[34rem] text-[1.125rem] leading-relaxed text-pretty text-night-muted sm:text-[1.25rem] sm:text-balance"
          style={delay(100)}
        >
          QR užsakymai restoranams, kavinėms ir barams. Svečias nuskenuoja kodą ir užsisako telefone, o virtuvė,
          baras ir padavėjas viską mato planšetėse.
        </p>
        <div
          className="rise mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-8"
          style={delay(200)}
        >
          <a
            href="#forma"
            className={buttonClass({ fullOnMobile: true })}
          >
            {siteConfig.cta}
          </a>
          <a
            href="#demo"
            className="group -mx-2 inline-flex min-h-11 touch-manipulation items-center gap-1.5 rounded-full px-2 text-[1.0625rem] font-medium text-night-text/85 transition-[color,scale] duration-150 select-none hover:text-white active:scale-[0.98]"
          >
            Išbandyti demonstraciją
            <span aria-hidden="true" className="transition-transform duration-300 ease-[var(--ease-out-soft)] group-hover:translate-y-0.5">
              ↓
            </span>
          </a>
        </div>
        <p className="rise mt-6 text-[15px] text-balance text-night-muted tabular-nums" style={delay(260)}>
          Prototipas nemokamai. Patiks, tada {oneTime}&nbsp;€ vieną kartą arba {perMonth}&nbsp;€ per mėnesį.
        </p>

        <div className="rise mt-14 sm:mt-16 lg:mt-14" style={delay(380)}>
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

        <div className="mt-3 rounded-2xl bg-white p-2 ring-1 ring-black/[0.06]">
          <QrCode
            value={`${siteConfig.url}/#demo`}
            label="QR kodas, atidarantis demonstraciją"
            styled
            className="block h-auto w-full"
          />
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
