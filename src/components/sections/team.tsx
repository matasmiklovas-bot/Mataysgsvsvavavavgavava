import type { ReactNode } from "react";
import { formatPrice, heroOrder, heroOrderTime, linesTotal, seedOrders } from "@/lib/data";
import { Ticket } from "@/components/ticket";

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
    headline: "Padavėjas nebebėgioja su užrašų knygele tarp staliuko ir virtuvės.",
    text: "Užsakymą įveda pats svečias. Planšetėje padavėjas mato, kas jau paruošta ir prie kurio staliuko nešti, o laiką skiria žmonėms salėje.",
    fragment: (
      <div className="rounded-lg bg-kds p-3 text-kds-text">
        <div className="flex items-center gap-3 rounded-md bg-kds-2 p-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded bg-slip font-display text-[1.5rem] font-bold text-ink">
            {heroOrder.table}
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-semibold">Nešti į staliuką {heroOrder.table}</p>
            <p className="text-[14px] text-kds-muted">2× Jautienos mėsainis, 1× Šaltibarščiai</p>
          </div>
          <span className="rounded-md bg-ready px-3 py-2 text-[14px] font-semibold text-white">Nunešta</span>
        </div>
      </div>
    ),
  },
  {
    role: "Virtuvei",
    headline: "Pastaba „be svogūnų“ virtuvę pasiekia tiksliai taip, kaip ją parašė svečias.",
    text: "Bilietas atsiranda planšetėje, vos svečias patvirtina užsakymą. Nereikia iššifruoti ranka rašytų lapelių ir antrą kartą klausti padavėjo.",
    fragment: (
      <div className="rounded-lg bg-kds px-5 pt-5 pb-1">
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
    headline: "Baras gauna tik gėrimus ir pradeda jų nelaukdamas virtuvės.",
    text: "Jei užsakyme yra ir patiekalų, ir gėrimų, virtuvė ir baras gauna atskirus bilietus. Limonadas jau ant staliuko, kol sprandinė dar ant grotelių.",
    fragment: (
      <div className="rounded-lg bg-kds px-5 pt-5 pb-1">
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
    headline: "Svečiui nebereikia gaudyti padavėjo žvilgsnio, kad galėtų susimokėti.",
    text: (
      <>
        Kuriuos mokėjimo būdus rodyti, nusprendžiate jūs: kortele telefonu, grynaisiais padavėjui
        arba abu. Kas sumokėjo telefonu, tas nelaukia sąskaitos ir išeina, kai nori.{" "}
        <span className="todo">[TODO: ar savininkas mato užsakymų istoriją ir apyvartą?]</span>
      </>
    ),
    fragment: (
      // TODO: patikrinti, kaip tikroje sistemoje atrodo mokėjimo būdų nustatymai.
      <div className="rounded-lg border border-line bg-white p-4">
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
    <section aria-labelledby="team-title" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
      <h2
        id="team-title"
        className="max-w-[20ch] font-display text-[2.25rem] leading-[1.02] font-bold text-balance sm:text-[3rem] lg:text-[3.4rem]"
      >
        Kas pasikeičia salėje, virtuvėje ir bare
      </h2>
      <div className="mt-10 divide-y divide-line border-y border-line sm:mt-14">
        {roles.map((role) => (
          <article key={role.role} className="grid grid-cols-1 gap-6 py-10 md:grid-cols-[1.1fr_1fr] md:items-center md:gap-12">
            <div>
              <p className="font-display text-[1.25rem] font-bold text-tomato-dark">{role.role}</p>
              <h3 className="mt-2 font-display text-[1.75rem] leading-[1.1] font-bold text-balance sm:text-[2rem]">
                {role.headline}
              </h3>
              <p className="mt-4 max-w-[34rem] text-ink-2">{role.text}</p>
            </div>
            <div className="md:max-w-[400px] md:justify-self-end md:w-full">{role.fragment}</div>
          </article>
        ))}
      </div>
    </section>
  );
}
