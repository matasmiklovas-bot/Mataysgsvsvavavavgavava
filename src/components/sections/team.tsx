import type { ReactNode } from "react";
import { formatPrice, heroOrder, heroOrderTime, linesTotal, seedOrders } from "@/lib/data";
import { Ticket } from "@/components/ticket";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";

const barOrder = seedOrders[1];

type Role = {
  role: string;
  headline: string;
  text: ReactNode;
  fragment: ReactNode;
};

const roles: Role[] = [
  {
    role: "Padavėjams",
    headline: "Padavėjas nebebėgioja su užrašų knygele.",
    text: "Planšetėje mato, kas paruošta ir prie kurio staliuko nešti.",
    fragment: (
      <div className="rounded-2xl bg-kds p-3 text-kds-text">
        <div className="flex flex-wrap items-center gap-3 rounded-xl bg-kds-2 p-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded bg-slip font-display text-[1.5rem] font-semibold text-ink">
            {heroOrder.table}
          </span>
          <div className="min-w-[10rem] flex-1">
            <p className="font-semibold">Nešti į staliuką {heroOrder.table}</p>
            <p className="text-[14px] text-kds-muted">2× Jautienos mėsainis, 1× Šaltibarščiai</p>
          </div>
          <span className="rounded-full bg-ready px-3.5 py-2 text-[14px] font-semibold text-white max-[400px]:w-full max-[400px]:text-center">
            Nunešta
          </span>
        </div>
      </div>
    ),
  },
  {
    role: "Virtuvei",
    headline: "Pastaba „be svogūnų“ pasiekia virtuvę tiksliai.",
    text: "Jokių ranka rašytų lapelių ir pakartotinių klausimų.",
    fragment: (
      <div className="rounded-2xl bg-kds px-5 pt-5 pb-1">
        <Ticket
          orderId={heroOrder.id}
          table={heroOrder.table}
          station="Virtuvė"
          time={heroOrderTime}
          lines={heroOrder.lines}
          status={{ label: "Naujas", tone: "new" }}
          className="mx-auto max-w-[260px]"
        />
      </div>
    ),
  },
  {
    role: "Barui",
    headline: "Baras gauna tik gėrimus ir pradeda iškart.",
    text: "Virtuvė ir baras gauna atskirus bilietus.",
    fragment: (
      <div className="rounded-2xl bg-kds px-5 pt-5 pb-1">
        <Ticket
          orderId={barOrder.id}
          table={barOrder.table}
          station="Baras"
          time="19:38"
          lines={barOrder.lines.filter((line) => line.itemId === "limonadas")}
          status={{ label: "Paruošta", tone: "ready" }}
          className="mx-auto max-w-[260px]"
        />
      </div>
    ),
  },
  {
    role: "Savininkui",
    headline: "Svečiai susimoka patys, kada nori.",
    text: "Kortele telefonu, grynaisiais padavėjui arba abu. Renkatės jūs.",
    fragment: (
      // TODO: patikrinti, kaip tikroje sistemoje atrodo mokėjimo būdų nustatymai.
      <div className="rounded-2xl bg-white p-5 shadow-[0_20px_40px_-28px_rgb(0_0_0/0.35)]">
        <p className="text-[15px] font-semibold">Mokėjimo būdai svečiams</p>
        <ul className="mt-3 space-y-2 text-[15px]">
          <li className="flex items-center justify-between gap-3 border-t border-line pt-2">
            Kortele telefonu <Switch on />
          </li>
          <li className="flex items-center justify-between gap-3 border-t border-line pt-2">
            Grynaisiais padavėjui <Switch on />
          </li>
        </ul>
        <p className="mt-3 border-t border-line pt-2 text-[14px] text-ink-2">
          Staliukas {heroOrder.table} · apmokėta telefonu ·{" "}
          <span className="tabular-nums">{formatPrice(linesTotal(heroOrder.lines))}</span>
        </p>
      </div>
    ),
  },
];

function Switch({ on }: { on: boolean }) {
  return (
    <span
      aria-label={on ? "įjungta" : "išjungta"}
      className={`flex h-6 w-10 shrink-0 items-center rounded-full p-0.5 ${on ? "justify-end bg-ink" : "bg-line"}`}
    >
      <span className="size-5 rounded-full bg-white" />
    </span>
  );
}

export function Team() {
  return (
    <section aria-labelledby="team-title" className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <SectionHeading id="team-title" eyebrow="Kasdienis darbas" title="Kas pasikeičia salėje, virtuvėje ir bare." />
        <div className="mt-12 grid grid-cols-1 gap-4 sm:mt-16 md:grid-cols-2 md:gap-5">
          {roles.map((role, index) => (
            <Reveal
              as="article"
              key={role.role}
              delay={(index % 2) * 120}
              className="flex flex-col justify-between gap-7 overflow-hidden rounded-[1.75rem] bg-paper p-6 sm:gap-8 sm:rounded-[2rem] sm:p-9"
            >
              <div>
                <p className="text-[16px] font-semibold text-tomato-dark">{role.role}</p>
                <h3 className="mt-2 text-[1.6rem] leading-[1.15] font-semibold tracking-[-0.03em] text-balance sm:text-[1.9rem]">
                  {role.headline}
                </h3>
                <p className="mt-4 max-w-[32rem] text-ink-2">{role.text}</p>
              </div>
              <div className="flex w-full flex-1 items-center justify-center">
                <div className="w-full max-w-[400px]">{role.fragment}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
