"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { formatOrderNumber, formatPrice, getItem, heroOrder, linesTotal, restaurant, seedOrders } from "@/lib/data";
import { Ticket } from "@/components/ticket";
import { StatusBar } from "@/components/status-bar";
import { PaymentSheet } from "@/components/payment-sheet";

/**
 * A short, looping film of one order at table 4: the guest taps dishes, adds a note, pays,
 * and ticket #024 lands on the kitchen rail and moves Naujas → Ruošiama → Paruošta.
 * Everything comes from lib/data, so it matches the demo below.
 */

// [time in ms when the step starts]
const timeline = [0, 1100, 1800, 2600, 3500, 4400, 5300, 6400, 8200, 9800, 11800];
const LAST = timeline.length - 1;
const FINAL_STILL = 8; // shown when motion is reduced

const burger = getItem("mesainis");
const soup = getItem("saltibarsciai");
const cepelinai = getItem("cepelinai");
const total = linesTotal(heroOrder.lines);
const otherTickets = [seedOrders[1], seedOrders[0]];

export function HeroStory({ stand, standCompact }: { stand: ReactNode; standCompact: ReactNode }) {
  const [t, setT] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = window.setTimeout(() => setT(FINAL_STILL), 0);
      return () => window.clearTimeout(id);
    }
    let timers: number[] = [];
    let running = false;
    const play = () => {
      if (running) return;
      running = true;
      const loop = () => {
        timeline.forEach((at, step) => {
          timers.push(window.setTimeout(() => setT(step === LAST ? 0 : step), at));
        });
        timers.push(window.setTimeout(loop, timeline[LAST]));
      };
      loop();
    };
    const stop = () => {
      running = false;
      timers.forEach((id) => window.clearTimeout(id));
      timers = [];
    };
    // Only play while the hero is on screen.
    const observer = new IntersectionObserver(([entry]) => (entry.isIntersecting ? play() : stop()), {
      threshold: 0,
    });
    if (rootRef.current) observer.observe(rootRef.current);
    return () => {
      observer.disconnect();
      stop();
    };
  }, []);

  const burgerQty = t >= 2 ? 2 : t >= 1 ? 1 : 0;
  const soupQty = t >= 3 ? 1 : 0;
  const count = burgerQty + soupQty;
  const screen = t >= 7 ? "done" : t >= 6 ? "paying" : t >= 4 ? "cart" : "menu";
  const noteOn = t >= 5;
  const ticketStage = t >= 9 ? "paruosta" : t >= 8 ? "ruosiama" : t >= 7 ? "naujas" : null;
  const guestStatus = t >= 9 ? 2 : t >= 8 ? 1 : 0;

  return (
    <div ref={rootRef} className="relative text-left">
      <p className="sr-only">
        Animacija: svečias prie 4 staliuko telefone užsisako du jautienos mėsainius be svogūnų ir
        šaltibarščius, apmoka {formatPrice(total)}, o bilietas {heroOrder.id} atsiranda virtuvės planšetėje.
      </p>
      <div aria-hidden="true" className="relative flex items-end justify-center gap-6 lg:gap-7 xl:gap-10">
        {/* The table surface the devices stand on */}
        <div className="pointer-events-none absolute inset-x-[6%] -bottom-8 -z-10 h-16 rounded-[50%] bg-black/70 blur-2xl" />
        <div className="hidden pb-4 lg:block">{stand}</div>

        {/* Phone */}
        <div className="relative w-[272px] shrink-0 sm:w-[292px] lg:w-[272px] xl:w-[292px]">
          <div className="rounded-[3rem] bg-[#2a2826] p-[3px] shadow-[0_40px_80px_-30px_rgb(0_0_0/0.9),inset_0_1px_0_rgb(255_255_255/0.18)]">
            <div className="rounded-[2.85rem] bg-black p-[9px]">
              <div className="relative flex h-[540px] flex-col overflow-hidden rounded-[2.35rem] bg-[#fffdf9] text-ink sm:h-[580px]">
                <StatusBar compact />
                <div className="border-b border-line px-5 pb-3">
                  <p className="text-[12px] text-ink-2">
                    {restaurant.kind} „{restaurant.name}“
                  </p>
                  <p className="text-[21px] font-semibold tracking-[-0.03em]">Staliukas {heroOrder.table}</p>
                </div>

                <div className="relative min-h-0 flex-1">
                  {/* Menu */}
                  <Screen show={screen === "menu"}>
                    <div className="px-5 pt-3">
                      <p className="text-[13px] font-semibold text-ink-2">Šiandien siūlome</p>
                      <ul className="mt-1 divide-y divide-line">
                        {[soup, burger, cepelinai].map((item) => {
                          const qty = item.id === "mesainis" ? burgerQty : item.id === "saltibarsciai" ? soupQty : 0;
                          const tapping =
                            (item.id === "mesainis" && (t === 1 || t === 2)) || (item.id === "saltibarsciai" && t === 3);
                          return (
                            <li key={item.id} className="flex items-center gap-3 py-3">
                              <div className="min-w-0 flex-1">
                                <p className="text-[15px] leading-tight font-semibold">{item.name}</p>
                                <p className="mt-0.5 text-[12.5px] leading-snug text-ink-2">{item.description}</p>
                                <p className="mt-1 text-[14px] font-medium tabular-nums">{formatPrice(item.price)}</p>
                              </div>
                              <span className="relative shrink-0 pb-2">
                                {item.image && (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    src={item.image}
                                    alt=""
                                    width={72}
                                    height={72}
                                    decoding="async"
                                    className="size-[72px] rounded-xl bg-paper-2 object-cover"
                                  />
                                )}
                                <span
                                  className={`absolute -right-1 bottom-0 flex size-8 items-center justify-center rounded-full text-[14px] font-semibold shadow-[0_3px_10px_-3px_rgb(0_0_0/0.4)] transition-colors duration-300 ${
                                    qty > 0 ? "bg-ink text-white" : "bg-white text-ink"
                                  }`}
                                >
                                  <span key={qty} className={qty > 0 ? "animate-pop" : ""}>
                                    {qty > 0 ? qty : "+"}
                                  </span>
                                  {tapping && <Tap key={t} />}
                                </span>
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                    <div
                      className={`absolute inset-x-3 bottom-3 transition-all duration-500 ease-[var(--ease-out-soft)] ${
                        count > 0 ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                      }`}
                    >
                      <span className="relative flex h-12 items-center justify-between rounded-2xl bg-ink px-4 text-[14px] font-semibold text-white">
                        <span>
                          Krepšelis <span className="ml-1 rounded-md bg-tomato px-1.5 tabular-nums">{count}</span>
                        </span>
                        <span className="tabular-nums">
                          {formatPrice(burger.price * burgerQty + soup.price * soupQty)}
                        </span>
                        {t === 4 && <Tap key="cart" />}
                      </span>
                    </div>
                  </Screen>

                  {/* Cart */}
                  <Screen show={screen === "cart" || screen === "paying"}>
                    <div className="px-5 pt-3">
                      <p className="text-[19px] font-semibold tracking-[-0.02em]">Jūsų užsakymas</p>
                      <ul className="mt-2 divide-y divide-line text-[14px]">
                        <li className="py-3">
                          <div className="flex justify-between gap-2">
                            <span className="font-semibold">2× {burger.name}</span>
                            <span className="tabular-nums">{formatPrice(burger.price * 2)}</span>
                          </div>
                          <span
                            className={`relative mt-2 inline-flex h-8 items-center rounded-lg border px-2.5 text-[13px] transition-colors duration-300 ${
                              noteOn ? "border-tomato bg-tomato/10 font-semibold text-tomato-dark" : "border-line text-ink-2"
                            }`}
                          >
                            {noteOn ? "✓ be svogūnų" : "+ be svogūnų"}
                            {t === 5 && <Tap key="note" />}
                          </span>
                        </li>
                        <li className="flex justify-between gap-2 py-3">
                          <span className="font-semibold">1× {soup.name}</span>
                          <span className="tabular-nums">{formatPrice(soup.price)}</span>
                        </li>
                      </ul>
                      <div className="mt-1 flex items-baseline justify-between border-t border-ink pt-3">
                        <span className="text-[14px] font-semibold">Iš viso</span>
                        <span className="text-[20px] font-semibold tabular-nums">{formatPrice(total)}</span>
                      </div>
                      <p className="mt-4 text-[13px] font-semibold">Kaip mokėsite?</p>
                      <div className="mt-1.5 flex h-11 items-center gap-2.5 rounded-xl border-[1.5px] border-ink px-3 text-[13.5px] font-semibold">
                        <span className="size-3.5 rounded-full border-4 border-ink" /> Kortele dabar, telefonu
                      </div>
                    </div>
                    <div className="absolute inset-x-4 bottom-4">
                      <span className="relative flex h-12 items-center justify-center rounded-2xl bg-tomato text-[15px] font-semibold text-white">
                        Apmokėti {formatPrice(total)}
                        {t === 6 && <Tap key="pay" />}
                      </span>
                    </div>
                  </Screen>

                  {/* Paying: the card sheet slides up over the order */}
                  <PaymentSheet
                    active={screen === "paying"}
                    amount={formatPrice(linesTotal(heroOrder.lines))}
                    merchant={`${restaurant.kind} „${restaurant.name}“`}
                    table={heroOrder.table}
                    approveAfter={550}
                    compact
                  />

                  {/* Done */}
                  <Screen show={screen === "done"}>
                    <div className="px-5 pt-5">
                      <p className="text-[13px] text-ink-2">Užsakymas</p>
                      <p className="text-[38px] leading-none font-semibold tracking-[-0.04em]">{formatOrderNumber(heroOrder.id)}</p>
                      <div className="mt-5 grid grid-cols-3 gap-1.5">
                        {["Priimta", "Ruošiama", "Nešama"].map((label, i) => (
                          <div key={label}>
                            <span
                              className={`block h-1.5 rounded-full transition-colors duration-700 ${
                                i <= guestStatus ? "bg-tomato" : "bg-line"
                              }`}
                            />
                            <span
                              className={`mt-1.5 block text-[12.5px] ${i === guestStatus ? "font-semibold" : "text-ink-2"}`}
                            >
                              {label}
                            </span>
                          </div>
                        ))}
                      </div>
                      <p className="mt-4 text-[14px]">
                        {guestStatus === 0 && "Virtuvė jau mato jūsų užsakymą."}
                        {guestStatus === 1 && "Ruošiama. Atnešime prie staliuko."}
                        {guestStatus === 2 && "Paruošta, padavėjas jau neša."}
                      </p>
                      <ul className="mt-4 space-y-1 border-t border-line pt-3 text-[14px]">
                        {heroOrder.lines.map((line) => (
                          <li key={line.itemId}>
                            {line.quantity}× {getItem(line.itemId).name}
                            {line.notes.length > 0 && (
                              <span className="block text-[13px] text-tomato-dark">{line.notes.join(", ")}</span>
                            )}
                          </li>
                        ))}
                      </ul>
                      <p className="mt-3 border-t border-line pt-3 text-[13.5px] text-ink-2">
                        Apmokėta kortele · <span className="tabular-nums">{formatPrice(total)}</span>
                      </p>
                    </div>
                  </Screen>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Kitchen tablet */}
        <div className="relative hidden shrink-0 md:block md:w-[380px] lg:w-[410px] xl:w-[480px]">
          {/* Connection from the phone: a dot travels across when the order is sent. */}
          <div className="absolute top-[42%] right-full h-[2px] w-6 bg-[repeating-linear-gradient(to_right,rgb(163_159_151/0.45)_0_4px,transparent_4px_8px)] lg:w-7 xl:w-10">
            {t === 7 && (
              <span
                key="travel"
                className="absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 animate-travel rounded-full bg-tomato-bright shadow-[0_0_10px_2px_rgb(229_88_60/0.6)]"
              />
            )}
          </div>
          <div className="rounded-[2rem] bg-[#2a2826] p-[3px] shadow-[0_40px_80px_-30px_rgb(0_0_0/0.9),inset_0_1px_0_rgb(255_255_255/0.18)]">
            <div className="rounded-[1.85rem] bg-black p-3">
              <div className="h-[330px] overflow-hidden rounded-[1.1rem] bg-kds text-kds-text">
                <div className="flex items-center justify-between border-b border-kds-line px-4 py-2.5 text-[13px]">
                  <span className="flex items-center gap-1.5 font-semibold">
                    Virtuvė <Bell ringing={ticketStage === "naujas"} />
                  </span>
                  <span className="text-kds-muted">Ruošti: {ticketStage && ticketStage !== "paruosta" ? 3 : 2}</span>
                </div>
                <div className="mx-4 mt-3 h-1.5 rounded-full bg-[#8f8a80]" />
                <div className="-mt-0.5 flex gap-3 px-4">
                  <div
                    className={`shrink-0 transition-[width,margin] duration-700 ease-[var(--ease-out-soft)] ${
                      ticketStage ? "w-[192px]" : "-mr-3 w-0"
                    }`}
                  >
                    {ticketStage && (
                      <div key={`new-${ticketStage === "naujas" ? "in" : "stay"}`} className={ticketStage === "naujas" ? "animate-ticket-in" : ""}>
                        <Ticket
                          orderId={heroOrder.id}
                          table={heroOrder.table}
                          station="Virtuvė"
                          time="ką tik"
                          lines={heroOrder.lines}
                          payment="Apmokėta"
                          status={
                            ticketStage === "paruosta"
                              ? { label: "Paruošta", tone: "ready" }
                              : ticketStage === "ruosiama"
                                ? { label: "Ruošiama", tone: "cooking" }
                                : { label: "Naujas", tone: "new" }
                          }
                          compact
                          className={ticketStage === "naujas" ? "animate-flash" : ""}
                        />
                      </div>
                    )}
                  </div>
                  {otherTickets.map((order) => (
                    <div key={order.id} className="w-[192px] shrink-0">
                      <Ticket
                        orderId={order.id}
                        table={order.table}
                        station="Virtuvė"
                        time={`${order.minutesAgo} min.`}
                        lines={order.lines.filter((l) => getItem(l.itemId).station === "virtuve")}
                        status={{ label: "Ruošiama", tone: "cooking" }}
                        compact
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Phones: the table stand and a small kitchen screen sit side by side under the phone. */}
      <div aria-hidden="true" className="mx-auto mt-8 flex max-w-[360px] items-end justify-center gap-3 md:hidden">
        <div className="w-[136px] shrink-0 min-[380px]:w-[148px]">{standCompact}</div>
        <div className="h-[262px] w-[182px] shrink-0 overflow-hidden rounded-[1.25rem] bg-kds text-kds-text shadow-[0_0_0_6px_#000,0_0_0_8px_#2a2826,0_30px_50px_-25px_rgb(0_0_0/0.9)] min-[380px]:w-[192px]">
          <div className="flex items-center justify-between border-b border-kds-line px-3 py-2 text-[11.5px]">
            <span className="flex items-center gap-1 font-semibold">
              Virtuvė <Bell ringing={ticketStage === "naujas"} small />
            </span>
            <span className="flex items-center gap-1.5 text-kds-muted">
              <span className={`size-1.5 rounded-full ${ticketStage ? "bg-ready-on-dark" : "animate-pulse bg-tomato-bright"}`} />
              {ticketStage === "paruosta" ? "Paruošta" : ticketStage === "ruosiama" ? "Ruošiama" : ticketStage ? "1 naujas" : "Laukiama"}
            </span>
          </div>
          <div className="mx-3 mt-2.5 h-1 rounded-full bg-[#8f8a80]" />
          <div className="-mt-0.5 px-3">
            {ticketStage ? (
              <div key="mobile-ticket" className="animate-ticket-in">
                <Ticket
                  orderId={heroOrder.id}
                  table={heroOrder.table}
                  station="Virtuvė"
                  time="ką tik"
                  lines={heroOrder.lines}
                  status={
                    ticketStage === "paruosta"
                      ? { label: "Paruošta", tone: "ready" }
                      : ticketStage === "ruosiama"
                        ? { label: "Ruošiama", tone: "cooking" }
                        : { label: "Naujas", tone: "new" }
                  }
                  compact
                />
              </div>
            ) : (
              <p className="pt-16 text-center text-[12px] leading-snug text-kds-muted">
                Užsakymas atsiras čia, vos svečias jį patvirtins
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Kitchen bell that swings when a new ticket lands. */
function Bell({ ringing, small = false }: { ringing: boolean; small?: boolean }) {
  return (
    <svg
      key={ringing ? "ring" : "still"}
      viewBox="0 0 24 24"
      className={`${small ? "size-3" : "size-3.5"} origin-top ${ringing ? "animate-ring text-tomato-bright" : "text-kds-muted"}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15z" />
      <path d="M10 20.5a2 2 0 0 0 4 0" />
    </svg>
  );
}

function Screen({ show, children }: { show: boolean; children: ReactNode }) {
  return (
    <div
      className={`absolute inset-0 transition-[opacity,transform] ease-[var(--ease-out-soft)] ${
        show
          ? "translate-x-0 opacity-100 delay-150 duration-500"
          : "pointer-events-none -translate-x-6 opacity-0 duration-200"
      }`}
    >
      {children}
    </div>
  );
}

/** A soft ring where the guest's finger touches the screen. */
function Tap() {
  return <span className="pointer-events-none absolute inset-0 m-auto size-10 animate-tap rounded-full bg-ink/30" />;
}
