import { ArrowRight, Check, ChefHat, CreditCard, Plus, ScanLine, Smartphone, Wallet, Utensils } from "lucide-react";
import { siteConfig } from "@/config/site";
import { photos } from "@/lib/images";
import { formatPrice, menu } from "@/lib/menu";
import { ButtonLink } from "@/components/ui/button";
import { Photo } from "@/components/ui/photo";
import { DishImage } from "@/components/ui/dish-image";
import { QrCode } from "@/components/ui/qr-code";
import { LogoMark } from "@/components/ui/logo";

const highlights = [
  { icon: Smartphone, label: "Be programėlės" },
  { icon: Wallet, label: "Kortele arba grynaisiais" },
  { icon: Utensils, label: "Virtuvė, baras ir salė kartu" },
];

export function Hero() {
  return (
    <section
      id="pradzia"
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden pt-32 pb-24 sm:pt-40 lg:pt-44 lg:pb-32"
    >
      <HeroBackdrop />

      <div className="mx-auto grid max-w-6xl items-center gap-16 px-5 sm:px-6 lg:grid-cols-[1.2fr_1fr] lg:gap-8">
        <div className="relative z-10 flex flex-col items-start">
          <p
            className="rise text-[13px] font-medium tracking-[0.08em] text-fg-subtle uppercase"
            style={{ "--rise-delay": "0ms" } as React.CSSProperties}
          >
            QR užsakymų sistema restoranams
          </p>

          <h1
            id="hero-title"
            className="rise mt-6 text-[2.75rem] leading-[1.02] font-semibold tracking-[-0.045em] sm:text-6xl lg:text-[3.4rem] xl:text-[3.85rem]"
            style={{ "--rise-delay": "80ms" } as React.CSSProperties}
          >
            Jūsų restoranas.
            <br />
            <span className="text-fg-muted">Išmanesni užsakymai.</span>
          </h1>

          <p
            className="rise mt-7 max-w-xl text-lg leading-relaxed text-pretty text-fg-muted sm:text-xl"
            style={{ "--rise-delay": "160ms" } as React.CSSProperties}
          >
            QR užsakymų sistema, kuri sujungia jūsų klientus, virtuvę, barą ir personalą į vieną
            sklandžiai veikiančią sistemą.
          </p>

          <div
            className="rise mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row"
            style={{ "--rise-delay": "240ms" } as React.CSSProperties}
          >
            <ButtonLink href="#kaip-veikia" size="lg">
              Pamatyti, kaip veikia
              <ArrowRight
                className="size-4 transition-transform duration-300 group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </ButtonLink>
            <ButtonLink href="#kontaktai" size="lg" variant="secondary">
              Susisiekti
            </ButtonLink>
          </div>

          <ul
            className="rise mt-12 flex flex-wrap gap-x-6 gap-y-3 text-sm text-fg-muted"
            style={{ "--rise-delay": "320ms" } as React.CSSProperties}
          >
            {highlights.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2">
                <Icon className="size-4 text-violet-300" aria-hidden="true" />
                {label}
              </li>
            ))}
          </ul>
        </div>

        <HeroVisual />
      </div>
    </section>
  );
}

function HeroBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_60%_30%,black,transparent_75%)]" />
      <div className="absolute -top-40 right-[-10%] h-[720px] w-[720px] rounded-full bg-violet-600/25 blur-[140px]" />
      <div className="absolute top-1/3 -left-60 h-[520px] w-[520px] rounded-full bg-indigo-500/10 blur-[140px]" />
      <div className="noise absolute inset-0 opacity-[0.035] mix-blend-overlay" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-ink-950" />
    </div>
  );
}

function HeroVisual() {
  const dish = menu.find((item) => item.id === "mesainis") ?? menu[0];

  return (
    <div
      className="rise relative mx-auto w-[calc(100%-2.5rem)] max-w-[340px] sm:w-full sm:max-w-[420px] lg:mr-10 lg:ml-auto lg:max-w-[440px] xl:mr-6"
      style={{ "--rise-delay": "200ms" } as React.CSSProperties}
    >
      {/* Glow behind portrait */}
      <div
        aria-hidden="true"
        className="absolute -inset-10 -z-10 rounded-full bg-[radial-gradient(closest-side,rgba(139,92,246,0.45),transparent)] blur-2xl"
      />

      {/* Portrait */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-[2.25rem] border border-white/10 bg-ink-800 shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)]">
        <Photo
          src={photos.hero}
          alt="Šypsanti restorano vadovė su dalykiniu švarku"
          fill
          preload
          sizes="(min-width: 1024px) 440px, (min-width: 640px) 420px, 360px"
          className="object-cover object-[50%_20%]"
          fallback={<PortraitFallback />}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent to-ink-950/10"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-[2.25rem] ring-1 ring-white/10 ring-inset"
        />
      </div>

      {/* Floating UI — decorative illustration of the product */}
      <div aria-hidden="true">
        {/* QR card */}
        <div className="absolute top-[9%] -left-5 w-[112px] animate-float-slow sm:-left-14 sm:w-[150px]">
          <div className="glass-strong rounded-2xl p-3">
            <div className="relative overflow-hidden rounded-xl bg-white p-1.5">
              <QrCode
                value={`${siteConfig.url}/#demonstracija`}
                label="QR kodas"
                className="block h-auto w-full"
              />
              <span
                className="absolute inset-x-1.5 top-1.5 h-0.5 animate-scan rounded-full bg-violet-500 shadow-[0_0_14px_3px_rgba(139,92,246,0.7)]"
                style={{ "--scan-distance": "104px" } as React.CSSProperties}
              />
            </div>
            <div className="mt-2.5 flex items-center justify-between text-[11px]">
              <span className="font-medium text-fg">Staliukas 7</span>
              <ScanLine className="size-3.5 text-violet-300" />
            </div>
          </div>
        </div>

        {/* Order confirmation */}
        <div className="absolute top-[3%] -right-5 animate-float-med [animation-delay:-2s] sm:-right-12 lg:-right-6 xl:-right-12">
          <div className="glass-strong flex items-center gap-3 rounded-2xl py-2.5 pr-4 pl-2.5">
            <span className="relative flex size-9 items-center justify-center rounded-full bg-emerald-400/15">
              <span className="absolute inset-0 animate-pulse-ring rounded-full bg-emerald-400/30" />
              <Check className="size-4.5 text-emerald-300" strokeWidth={2.5} />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-[13px] font-medium text-fg">Užsakymas priimtas</span>
              <span className="text-[11.5px] text-fg-subtle">Staliukas 7 · 3 patiekalai</span>
            </span>
          </div>
        </div>

        {/* Payment indicator */}
        <div className="absolute top-[44%] -right-5 hidden animate-float-fast [animation-delay:-1s] sm:block sm:-right-16 lg:-right-8 xl:-right-16">
          <div className="glass-strong w-[188px] rounded-2xl p-3.5">
            <div className="flex items-center justify-between">
              <span className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-400 to-violet-700">
                <CreditCard className="size-4 text-white" />
              </span>
              <span className="rounded-full bg-emerald-400/15 px-2 py-0.5 text-[10.5px] font-medium text-emerald-300">
                Patvirtinta
              </span>
            </div>
            <p className="mt-3 text-[11.5px] text-fg-subtle">Mokėjimas kortele</p>
            <p className="text-xl font-semibold tracking-tight text-fg tabular-nums">42,60 €</p>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-full rounded-full bg-gradient-to-r from-violet-400 to-emerald-300" />
            </div>
          </div>
        </div>

        {/* Kitchen panel */}
        <div className="absolute bottom-[10%] -left-5 w-[206px] animate-float-med [animation-delay:-3.5s] sm:-left-20 sm:w-[236px]">
          <div className="glass-strong rounded-2xl p-3.5">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-[12.5px] font-medium text-fg">
                <ChefHat className="size-4 text-violet-300" />
                Virtuvė
              </span>
              <span className="flex items-center gap-1.5 text-[10.5px] text-fg-subtle">
                <span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(74,222,128,0.9)]" />
                Gyvai
              </span>
            </div>
            <ul className="mt-3 space-y-2">
              <li className="rounded-xl border border-white/8 bg-white/[0.04] p-2.5">
                <div className="flex items-center justify-between gap-2 text-[11px]">
                  <span className="font-mono whitespace-nowrap text-fg-muted">#024 · St. 7</span>
                  <span className="rounded-full bg-amber-400/15 px-2 py-0.5 font-medium text-amber-300">
                    Ruošiama
                  </span>
                </div>
                <p className="mt-1.5 text-[12px] text-fg">2× Jautienos mėsainis</p>
              </li>
              <li className="rounded-xl border border-white/8 bg-white/[0.04] p-2.5 max-sm:hidden">
                <div className="flex items-center justify-between gap-2 text-[11px]">
                  <span className="font-mono whitespace-nowrap text-fg-muted">#025 · St. 3</span>
                  <span className="rounded-full bg-violet-400/15 px-2 py-0.5 font-medium text-violet-200">
                    Nauja
                  </span>
                </div>
                <p className="mt-1.5 text-[12px] text-fg">1× Sezoninės salotos</p>
              </li>
            </ul>
          </div>
        </div>

        {/* Menu preview */}
        <div className="absolute -right-5 -bottom-8 w-[196px] animate-float-slow [animation-delay:-5s] sm:-right-10 sm:w-[224px] lg:-right-4 xl:-right-10">
          <div className="glass-strong flex items-center gap-3 rounded-2xl p-2.5">
            <span className="relative size-14 shrink-0 overflow-hidden rounded-xl">
              <DishImage item={dish} sizes="56px" />
            </span>
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-[12.5px] font-medium text-fg">{dish.name}</span>
              <span className="text-[12px] text-fg-muted tabular-nums">{formatPrice(dish.price)}</span>
            </span>
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-white text-ink-950">
              <Plus className="size-4" strokeWidth={2.5} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PortraitFallback() {
  return (
    <div
      role="img"
      aria-label={siteConfig.name}
      className="absolute inset-0 flex items-start justify-center bg-[radial-gradient(circle_at_50%_32%,#2b2140,#0b0b0f_72%)] pt-[30%]"
    >
      <span className="relative flex size-28 items-center justify-center rounded-full border border-white/10 bg-white/[0.03]">
        <span className="absolute -inset-6 rounded-full border border-white/[0.05]" />
        <LogoMark className="size-14" />
      </span>
    </div>
  );
}
