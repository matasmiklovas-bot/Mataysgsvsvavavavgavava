import type { ReactNode } from "react";
import { formatPrice, getItem, heroOrder, linesTotal, seedOrders } from "@/lib/data";
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
      // A slice of the staff tablet: the same row the demo's "Personalas" screen shows.
      <div className="@container rounded-2xl bg-kds p-3 text-kds-text sm:p-4">
        <p className="flex items-baseline gap-2 px-0.5 text-[15px] font-semibold">
          Nešti dabar <span className="text-[14px] font-normal text-kds-muted tabular-nums">1</span>
        </p>
        <div className="mt-2.5 grid grid-cols-[auto_minmax(0,1fr)] items-start gap-x-3 gap-y-3 rounded-xl bg-kds-2 p-3 @[22rem]:grid-cols-[auto_minmax(0,1fr)_auto] @[22rem]:items-center">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-slip text-[22px] font-semibold text-ink tabular-nums">
            {heroOrder.table}
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <p className="text-[16px] font-semibold">Nešti į staliuką {heroOrder.table}</p>
              <span className="rounded-full border border-kds-line px-2 py-px text-[12px] text-kds-muted">Virtuvė</span>
            </div>
            <div className="mt-2 space-y-1.5">
              {heroOrder.lines.map((line, i) => {
                const item = getItem(line.itemId);
                return (
                  <p key={line.itemId} className="flex items-center gap-2.5 text-[14px] leading-snug text-kds-muted">
                    {item.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.image}
                        alt=""
                        width={28}
                        height={28}
                        loading="lazy"
                        decoding="async"
                        className="size-7 shrink-0 rounded-md bg-kds-line object-cover"
                      />
                    )}
                    <span className="min-w-0">
                      <span className="font-semibold text-kds-text tabular-nums">{line.quantity}×</span> {item.name}
                      {i < heroOrder.lines.length - 1 && <span className="sr-only">,</span>}
                    </span>
                  </p>
                );
              })}
            </div>
          </div>
          {/* A picture of the button; the working one is in the demo above. */}
          <span className="col-span-2 flex h-11 items-center justify-center gap-2 rounded-lg bg-ready px-4 text-[15px] font-semibold whitespace-nowrap text-white @[22rem]:col-span-1">
            <svg viewBox="0 0 16 16" className="size-4" fill="none" aria-hidden="true">
              <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
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
      <StationPanel>
        <Ticket
          orderId={heroOrder.id}
          table={heroOrder.table}
          station="Virtuvė"
          time="0:42"
          lines={heroOrder.lines}
          payment="Apmokėta"
          status={{ label: "Naujas", tone: "new" }}
        />
      </StationPanel>
    ),
  },
  {
    role: "Barui",
    headline: "Baras gauna tik gėrimus ir pradeda iškart.",
    text: "Virtuvė ir baras gauna atskirus bilietus.",
    fragment: (
      <StationPanel>
        <Ticket
          orderId={barOrder.id}
          table={barOrder.table}
          station="Baras"
          time="3:18"
          lines={barOrder.lines.filter((line) => getItem(line.itemId).station === "baras")}
          payment="Apmokėta"
          status={{ label: "Paruošta", tone: "ready" }}
        >
          <p className="flex h-11 items-center justify-center gap-2 text-[14px] text-ink-2">
            <svg viewBox="0 0 16 16" className="size-4 text-ready" fill="none" aria-hidden="true">
              <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.5" />
              <path d="M8 4.75V8l2.25 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            Laukia padavėjo
          </p>
        </Ticket>
      </StationPanel>
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

/** A crop of the kitchen or bar screen: the dark display with one ticket card on it. */
function StationPanel({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl bg-kds p-4 sm:p-5">
      <div className="mx-auto max-w-[290px]">{children}</div>
    </div>
  );
}

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
        <SectionHeading id="team-title" title="Kas pasikeičia salėje, virtuvėje ir bare." />
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
