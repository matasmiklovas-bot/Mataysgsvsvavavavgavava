import { ArrowDown, Check, CreditCard, Plus } from "lucide-react";
import { siteConfig } from "@/config/site";
import { photos } from "@/lib/images";
import { formatPrice, menu } from "@/lib/menu";
import { Photo } from "@/components/ui/photo";
import { DishImage } from "@/components/ui/dish-image";
import { QrCode } from "@/components/ui/qr-code";
import { ContactTrigger } from "@/components/contact/contact-trigger";

const rise = (ms: number) => ({ "--rise-delay": `${ms}ms` }) as React.CSSProperties;

export function Hero() {
  const { setup, monthly } = siteConfig.pricing;
  return (
    <section
      id="pradzia"
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden pt-28 pb-20 sm:pt-32 lg:pt-36 lg:pb-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-48 right-[-15%] -z-10 h-[640px] w-[760px] rounded-full bg-accent-strong/20 blur-[150px]"
      />

      <div className="mx-auto grid max-w-6xl items-center gap-14 px-5 sm:px-6 lg:grid-cols-[1.15fr_1fr] lg:gap-10">
        <div className="flex flex-col items-start">
          <p className="rise flex items-center gap-2 text-[14px] text-fg-muted" style={rise(0)}>
            <span className="size-1.5 rounded-full bg-accent" />
            QR užsakymų sistema restoranams
          </p>

          <h1
            id="hero-title"
            className="rise mt-6 font-display text-[2.9rem] leading-[0.98] font-semibold tracking-[-0.04em] sm:text-[4rem] lg:text-[4.1rem] xl:text-[4.6rem]"
            style={rise(80)}
          >
            Jūsų restoranas.
            <br />
            <span className="text-fg-muted">Išmanesni užsakymai.</span>
          </h1>

          <p
            className="rise mt-6 max-w-[34rem] text-lg leading-relaxed text-pretty text-fg-muted sm:text-xl"
            style={rise(160)}
          >
            QR užsakymų sistema, kuri sujungia jūsų klientus, virtuvę, barą ir personalą į vieną
            sklandžiai veikiančią sistemą.
          </p>

          <div className="rise mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row" style={rise(240)}>
            <a
              href="#kaip-veikia"
              className="group inline-flex h-13 items-center justify-center gap-2 rounded-full bg-fg px-7 text-base font-semibold text-ink-950 transition-colors hover:bg-white"
            >
              Pamatyti, kaip veikia
              <ArrowDown
                className="size-4 transition-transform duration-300 group-hover:translate-y-0.5"
                aria-hidden="true"
              />
            </a>
            <ContactTrigger className="inline-flex h-13 items-center justify-center rounded-full border border-white/15 px-7 text-base font-semibold text-fg transition-colors hover:border-white/30 hover:bg-white/[0.04]">
              Susisiekti
            </ContactTrigger>
          </div>

          <dl
            className="rise mt-12 grid w-full max-w-md grid-cols-2 border-t border-white/[0.08] pt-6"
            style={rise(320)}
          >
            <div>
              <dt className="text-[13px] text-fg-subtle">Įdiegimas</dt>
              <dd className="mt-1 font-display text-2xl font-semibold tracking-[-0.02em] tabular-nums">
                {setup} €
              </dd>
            </div>
            <div className="border-l border-white/[0.08] pl-6">
              <dt className="text-[13px] text-fg-subtle">Sistemos mokestis</dt>
              <dd className="mt-1 font-display text-2xl font-semibold tracking-[-0.02em] tabular-nums">
                {monthly} €<span className="text-base font-normal text-fg-muted">/mėn.</span>
              </dd>
            </div>
          </dl>
        </div>

        <HeroVisual />
      </div>
    </section>
  );
}

function HeroVisual() {
  const dish = menu.find((item) => item.id === "mesainis") ?? menu[0];

  return (
    <div
      className="rise relative mx-auto w-[calc(100%-2.5rem)] max-w-[340px] sm:w-full sm:max-w-[400px] lg:mr-10 lg:ml-auto lg:max-w-[420px] xl:mr-8"
      style={rise(200)}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-ink-800 shadow-[0_50px_100px_-40px_rgba(0,0,0,0.9)]">
        <Photo
          src={photos.hero}
          alt="Šypsanti restorano vadovė"
          fill
          preload
          sizes="(min-width: 1024px) 420px, (min-width: 640px) 400px, 340px"
          className="object-cover object-[50%_22%]"
          fallback={<PhoneFallback />}
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink-950/70 to-transparent"
        />
        <div aria-hidden="true" className="absolute inset-0 rounded-[28px] ring-1 ring-white/10 ring-inset" />
      </div>

      {/* Product details placed around the portrait (decorative) */}
      <div aria-hidden="true">
        {/* QR table tent */}
        <div className="absolute top-[8%] -left-6 w-[118px] -rotate-3 animate-float-slow sm:-left-16 sm:w-[136px]">
          <div className="rounded-2xl bg-paper p-2.5 text-paper-ink shadow-[0_24px_40px_-20px_rgba(0,0,0,0.8)]">
            <p className="text-center font-mono text-[9.5px] font-semibold tracking-[0.18em]">STALAS 7</p>
            <QrCode
              value={`${siteConfig.url}/#kaip-veikia`}
              label="QR kodas"
              color="#1b1a17"
              className="mt-1.5 block h-auto w-full"
            />
            <p className="mt-1 text-center text-[9.5px] leading-tight text-paper-muted">
              Nuskenuokite ir užsakykite
            </p>
          </div>
        </div>

        {/* Order confirmation */}
        <div className="absolute top-[3%] -right-5 animate-float-med [animation-delay:-2s] sm:-right-10 lg:-right-6 xl:-right-12">
          <div className="flex items-center gap-2.5 rounded-full border border-white/10 bg-ink-850/95 py-2 pr-4 pl-2 shadow-xl backdrop-blur">
            <span className="flex size-7 items-center justify-center rounded-full bg-emerald-400/15">
              <Check className="size-4 text-emerald-300" strokeWidth={2.5} />
            </span>
            <span className="text-[13px] font-medium">Užsakymas priimtas</span>
          </div>
        </div>

        {/* Payment indicator */}
        <div className="absolute top-[40%] -right-5 hidden sm:block sm:-right-14 lg:-right-8 xl:-right-14">
          <div className="w-[176px] rounded-2xl border border-white/10 bg-ink-850/95 p-3.5 shadow-xl backdrop-blur">
            <div className="flex items-center gap-2 text-[12px] text-fg-muted">
              <CreditCard className="size-4 text-accent" />
              Mokėjimas kortele
            </div>
            <p className="mt-1.5 font-display text-[22px] font-semibold tracking-[-0.02em] tabular-nums">42,60 €</p>
            <p className="mt-0.5 flex items-center gap-1 text-[11.5px] text-emerald-300">
              <Check className="size-3" strokeWidth={3} /> Apmokėta
            </p>
          </div>
        </div>

        {/* Kitchen ticket */}
        <div className="absolute bottom-[9%] -left-6 w-[172px] rotate-2 animate-float-med [animation-delay:-3.5s] sm:-left-20 sm:w-[190px] lg:-left-16 xl:-left-20">
          <div className="ticket rounded-t-md px-3.5 pt-3 text-[11px] leading-[1.55]">
            <div className="flex justify-between font-semibold">
              <span>VIRTUVĖ</span>
              <span>#024</span>
            </div>
            <div className="flex justify-between text-paper-muted">
              <span>Stalas 7</span>
              <span>19:42</span>
            </div>
            <div className="my-2 border-t border-dashed border-paper-ink/30" />
            <p>2× Jautienos mėsainis</p>
            <p>1× Sezoninės salotos</p>
            <p className="text-paper-muted">— be svogūnų</p>
          </div>
        </div>

        {/* Menu item */}
        <div className="absolute -right-5 -bottom-7 w-[200px] animate-float-slow [animation-delay:-5s] sm:-right-10 sm:w-[214px] lg:-right-4 xl:-right-10">
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-ink-850/95 p-2 shadow-xl backdrop-blur">
            <span className="relative size-12 shrink-0 overflow-hidden rounded-xl bg-ink-700">
              <DishImage item={dish} sizes="48px" />
            </span>
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-[13px] font-medium">{dish.name}</span>
              <span className="text-[12px] text-fg-muted tabular-nums">{formatPrice(dish.price)}</span>
            </span>
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-fg text-ink-950">
              <Plus className="size-4" strokeWidth={2.5} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Shown if the portrait cannot load: the guest's view of the menu on a phone. */
function PhoneFallback() {
  const items = menu.filter((item) => item.category === "pagrindiniai");
  return (
    <div role="img" aria-label="Meniu telefone" className="absolute inset-0 flex flex-col bg-ink-850 px-5 pt-[22%]">
      <p className="text-[11px] tracking-[0.14em] text-fg-subtle uppercase">Bistro „Demo“ · Stalas 7</p>
      <p className="mt-1 font-display text-2xl font-semibold tracking-[-0.02em]">Pagrindiniai</p>
      <ul className="mt-4 divide-y divide-white/[0.07]">
        {items.map((item) => (
          <li key={item.id} className="flex items-baseline justify-between gap-3 py-3">
            <span className="min-w-0">
              <span className="block truncate text-[14px] font-medium">{item.name}</span>
              <span className="block truncate text-[12px] text-fg-subtle">{item.description}</span>
            </span>
            <span className="text-[13px] tabular-nums">{formatPrice(item.price)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
