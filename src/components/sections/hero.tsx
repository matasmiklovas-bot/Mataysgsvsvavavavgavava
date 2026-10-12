import { siteConfig } from "@/config/site";
import { formatPrice, heroOrder, heroOrderTime, linesTotal } from "@/lib/data";
import { QrCode } from "@/components/qr-code";
import { Ticket } from "@/components/ticket";

export function Hero() {
  const { setup, monthly } = siteConfig.pricing;
  return (
    <section aria-labelledby="hero-title" className="border-b border-line">
      <div className="mx-auto grid grid-cols-1 max-w-6xl gap-12 px-4 pt-10 pb-14 sm:px-6 sm:pt-16 xl:grid-cols-[1.4fr_1fr] xl:items-center xl:gap-10 lg:pt-20 lg:pb-24">
        <div>
          <h1
            id="hero-title"
            className="font-display text-[2.75rem] leading-[0.98] font-bold tracking-[-0.015em] text-balance sm:text-[4rem] lg:text-[4.25rem] xl:text-[4.9rem]"
          >
            Svečiai užsisako patys, o virtuvė užsakymą mato iškart.
          </h1>
          <p className="mt-6 max-w-[36rem] text-[1.125rem] leading-relaxed text-ink-2 sm:text-[1.2rem]">
            Ant staliuko stovi kodas. Svečias jį nuskenuoja ir meniu atsidaro telefone, be
            programėlės. Patiekalai iškart atsiranda virtuvės planšetėje, gėrimai baro, o padavėjas
            mato, ką ir prie kurio staliuko nešti.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-7">
            <a
              href="#forma"
              className="inline-flex h-13 items-center justify-center rounded-md bg-tomato px-7 whitespace-nowrap text-[1.0625rem] font-semibold text-white transition-colors hover:bg-tomato-dark"
            >
              {siteConfig.cta}
            </a>
            <a
              href="#demo"
              className="inline-flex min-h-11 items-center justify-center font-semibold text-ink underline decoration-2 underline-offset-[6px] hover:text-tomato-dark"
            >
              Išbandyti demonstraciją ↓
            </a>
          </div>
          <p className="mt-6 text-[1rem] text-ink-2">
            {setup}&nbsp;€ už įdiegimą ir {monthly}&nbsp;€ per mėnesį.
          </p>
        </div>

        <HeroVisual />
      </div>
    </section>
  );
}

function HeroVisual() {
  const total = linesTotal(heroOrder.lines);
  return (
    <div className="flex items-end justify-center gap-6 sm:gap-10 xl:justify-end">
      {/* Table stand with a real QR code that opens the demo. Hidden on phones: you would scan it with the phone you are holding. */}
      <figure className="hidden shrink-0 sm:block" aria-label={`Staliuko ${heroOrder.table} stovelis su QR kodu`}>
        <div className="w-[190px] rounded-t-lg border border-line bg-white px-5 pt-4 pb-5 shadow-[0_18px_30px_-20px_rgb(0_0_0/0.45)]">
          <div className="flex items-end justify-between">
            <span className="text-[13px] font-semibold tracking-[0.14em] text-ink-2 uppercase">Staliukas</span>
            <span className="font-display text-[4.5rem] leading-[0.8] font-bold">{heroOrder.table}</span>
          </div>
          <QrCode
            value={`${siteConfig.url}/#demo`}
            label="QR kodas, atidarantis demonstraciją"
            className="mt-4 block h-auto w-full"
          />
          <p className="mt-3 text-[13px] leading-snug text-ink-2">Nuskenuokite telefono kamera ir užsisakykite</p>
        </div>
        <div aria-hidden="true" className="mx-auto h-3 w-[210px] -translate-x-[10px] rounded-b-sm bg-ink" />
      </figure>

      <figure className="w-full max-w-[290px] shrink-0 sm:w-[260px]">
        <Ticket
          orderId={heroOrder.id}
          table={heroOrder.table}
          station="Virtuvė"
          time={heroOrderTime}
          lines={heroOrder.lines}
          payment="Apmokėta"
          status={{ label: "Naujas", tone: "new" }}
          className="rotate-[1.5deg]"
        />
        <figcaption className="mt-4 text-[16px] leading-snug text-ink-2">
          Taip užsakymas atrodo virtuvės planšetėje. Suma {formatPrice(total)}, apmokėta telefonu.
        </figcaption>
      </figure>
    </div>
  );
}
