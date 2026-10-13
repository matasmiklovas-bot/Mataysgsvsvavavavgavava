import { siteConfig } from "@/config/site";
import { heroOrder } from "@/lib/data";
import { HeroStory } from "@/components/hero-story";
import { QrCode } from "@/components/qr-code";

const delay = (ms: number) => ({ "--delay": `${ms}ms` }) as React.CSSProperties;

export function Hero() {
  const { setup, monthly } = siteConfig.pricing;
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden bg-night text-night-text">
      {/* Warm pool of light on the "table" under the devices */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[70%] bg-[radial-gradient(60%_55%_at_50%_75%,rgb(229_150_90/0.14),transparent_70%)]"
      />
      <div className="mx-auto max-w-6xl px-4 pt-16 pb-16 text-center sm:px-6 sm:pt-24 lg:pt-28 lg:pb-24">
        <p className="rise text-[15px] text-night-muted sm:text-[17px]" style={delay(0)}>
          QR užsakymai restoranams, kavinėms ir barams
        </p>
        <h1
          id="hero-title"
          className="rise mx-auto mt-4 max-w-[15ch] text-[2.6rem] leading-[1.02] font-semibold tracking-[-0.045em] text-balance sm:text-[4.25rem] lg:text-[5.4rem]"
          style={delay(80)}
        >
          Svečiai užsisako patys, o virtuvė užsakymą mato iškart.
        </h1>
        <p
          className="rise mx-auto mt-6 max-w-[38rem] text-[1.125rem] leading-relaxed text-night-muted sm:text-[1.25rem]"
          style={delay(160)}
        >
          Svečias nuskenuoja kodą ant staliuko, ir meniu atsidaro telefone, be programėlės.
          Patiekalai iškart atsiranda virtuvės planšetėje, gėrimai baro, o padavėjas mato, ką ir
          prie kurio staliuko nešti.
        </p>
        <div
          className="rise mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-8"
          style={delay(240)}
        >
          <a
            href="#forma"
            className="inline-flex h-13 w-full items-center justify-center rounded-full bg-tomato px-8 text-[1.0625rem] font-medium whitespace-nowrap text-white transition-colors hover:bg-tomato-dark sm:w-auto"
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
        <p className="rise mt-6 text-[15px] text-night-muted" style={delay(300)}>
          {setup}&nbsp;€ už įdiegimą ir {monthly}&nbsp;€ per mėnesį
        </p>

        <div className="rise mt-14 sm:mt-20" style={delay(420)}>
          <HeroStory stand={<TableStand />} />
        </div>
      </div>
    </section>
  );
}

/** Table stand with a real QR code that opens the demo on this page. */
function TableStand() {
  return (
    <figure aria-label={`Staliuko ${heroOrder.table} stovelis su QR kodu`} className="text-left">
      <div className="w-[176px] rounded-t-2xl bg-[#fbf8f1] px-4 pt-4 pb-4 text-ink shadow-[0_30px_50px_-25px_rgb(0_0_0/0.9)]">
        <div className="flex items-end justify-between">
          <span className="text-[11px] font-semibold tracking-[0.16em] text-ink-2 uppercase">Staliukas</span>
          <span className="text-[3.6rem] leading-[0.8] font-semibold tracking-[-0.05em]">{heroOrder.table}</span>
        </div>
        <div className="relative mt-3 overflow-hidden rounded-lg">
          <QrCode value={`${siteConfig.url}/#demo`} label="QR kodas, atidarantis demonstraciją" className="block h-auto w-full" />
          <span className="absolute inset-x-1 h-[2px] animate-scan rounded-full bg-tomato-bright shadow-[0_0_10px_2px_rgb(229_88_60/0.55)]" />
        </div>
        <p className="mt-2.5 text-[12px] leading-snug text-ink-2">Nuskenuokite ir užsisakykite</p>
      </div>
      <div aria-hidden="true" className="mx-auto h-2.5 w-[196px] -translate-x-[10px] rounded-b-md bg-[#3a3632]" />
    </figure>
  );
}
