"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import {
  categories,
  formatOrderNumber,
  formatPrice,
  getItem,
  heroOrder,
  linesTotal,
  restaurant,
  seedOrders,
  type MenuItem,
  type OrderLine,
} from "@/lib/data";
import { Ticket } from "@/components/ticket";
import { StatusBar } from "@/components/status-bar";
import { PaymentSheet } from "@/components/payment-sheet";

/**
 * A short, looping film of one order at table 4: the guest taps dishes, adds a note, pays,
 * and ticket #024 drops onto the kitchen screen and moves Naujas → Ruošiama → Paruošta.
 * Everything comes from lib/data and mirrors the demo below, only smaller. No sound, no input.
 */

// [time in ms when the step starts]
const timeline = [0, 1100, 1800, 2600, 3500, 4400, 5300, 6400, 8200, 9800, 11800];
const LAST = timeline.length - 1;
const FINAL_STILL = 8; // shown when motion is reduced
// Second of the loop at which the ticket reaches the kitchen (its timer starts at 0:00).
const ARRIVAL_SECOND = 7;

const soup = getItem("saltibarsciai");
const burger = getItem("mesainis");
const cepelinai = getItem("cepelinai");
const total = linesTotal(heroOrder.lines);
const merchant = `${restaurant.kind} „${restaurant.name}“`;

// The phone's own background, as in the demo.
const screenBg = "bg-[#fffdf9]";
const easeOut = "cubic-bezier(0.2, 0.7, 0.2, 1)";

type Stage = "naujas" | "ruosiama" | "paruosta";

export function HeroStory({ stand, standCompact }: { stand: ReactNode; standCompact: ReactNode }) {
  const [t, setT] = useState(0);
  // Whole seconds since the loop started: drives the kitchen timers.
  const [sec, setSec] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const id = window.setTimeout(() => {
        setT(FINAL_STILL);
        setSec(ARRIVAL_SECOND + 3);
      }, 0);
      return () => window.clearTimeout(id);
    }
    let timers: number[] = [];
    let clock = 0;
    let running = false;
    const play = () => {
      if (running) return;
      running = true;
      const loop = () => {
        const start = Date.now();
        setSec(0);
        window.clearInterval(clock);
        clock = window.setInterval(() => setSec(Math.floor((Date.now() - start) / 1000)), 1000);
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
      window.clearInterval(clock);
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
  const stage: Stage | null = t >= 9 ? "paruosta" : t >= 8 ? "ruosiama" : t >= 7 ? "naujas" : null;
  const guestStatus = t >= 9 ? 2 : t >= 8 ? 1 : 0;
  const done = t >= 7;

  const kitchen = { stage, t, sec };

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
              <div className={`relative flex h-[540px] flex-col overflow-hidden rounded-[2.35rem] ${screenBg} text-ink sm:h-[580px]`}>
                <StatusBar compact />
                <div
                  className={`shrink-0 border-b px-5 pb-2.5 transition-colors duration-300 ${
                    screen === "menu" ? "border-transparent" : "border-line"
                  }`}
                >
                  <p className="text-[12px] text-ink-2">{merchant}</p>
                  <p className="text-[21px] leading-tight font-semibold tracking-[-0.03em]">Staliukas {heroOrder.table}</p>
                </div>

                <div className="relative min-h-0 flex-1">
                  {/* Menu: section chips, then rows with a photo and the add control on it */}
                  <Screen show={screen === "menu"}>
                    <div className="border-b border-line">
                      <div className="flex gap-1 overflow-hidden px-4 py-1.5">
                        {categories.map((cat, i) => (
                          <span
                            key={cat.id}
                            className={`flex h-8 shrink-0 items-center rounded-full px-3 text-[13px] font-semibold whitespace-nowrap ${
                              i === 0 ? "bg-ink text-white" : "text-ink-2"
                            }`}
                          >
                            {cat.label}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="px-5">
                      <p className={sectionTitle}>{categories[0].label}</p>
                      <ul>
                        <MenuRow item={soup} quantity={soupQty} tap={t === 3 ? "add" : null} tapKey={t} />
                      </ul>
                      <p className={sectionTitle}>{categories[1].label}</p>
                      <ul className="divide-y divide-line">
                        <MenuRow
                          item={burger}
                          quantity={burgerQty}
                          tap={t === 1 ? "add" : t === 2 ? "more" : null}
                          tapKey={t}
                        />
                        <MenuRow item={cepelinai} quantity={0} tap={null} tapKey={t} />
                      </ul>
                    </div>

                    <div
                      className={`absolute inset-x-3 bottom-3 transition-[opacity,translate] duration-400 ease-[var(--ease-out-soft)] ${
                        count > 0 ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                      }`}
                    >
                      <span className="relative flex h-12 items-center gap-2.5 rounded-2xl bg-ink pr-4 pl-2.5 text-white shadow-[0_8px_20px_-12px_rgb(0_0_0/0.6)]">
                        <span
                          key={count}
                          className={`flex h-7 min-w-7 items-center justify-center rounded-lg bg-tomato px-1.5 text-[13px] font-semibold tabular-nums ${
                            count > 0 ? "animate-pop" : ""
                          }`}
                        >
                          {count}
                        </span>
                        <span className="text-[14px] font-semibold">Krepšelis</span>
                        <span className="ml-auto text-[14px] font-semibold tabular-nums">
                          {formatPrice(burger.price * burgerQty + soup.price * soupQty)}
                        </span>
                        {t === 4 && <Tap key="cart" />}
                      </span>
                    </div>
                  </Screen>

                  {/* Cart */}
                  <Screen show={screen === "cart" || screen === "paying"}>
                    <div className="px-5 pt-1">
                      <p className="-ml-1 flex h-8 items-center gap-0.5 text-[14px] font-medium">
                        <Glyph className="size-4" strokeWidth={2.2}>
                          <path d="M15 5l-7 7 7 7" />
                        </Glyph>
                        Meniu
                      </p>
                      <p className="text-[19px] leading-tight font-semibold tracking-[-0.03em]">Jūsų užsakymas</p>
                      <ul className="mt-1 divide-y divide-line">
                        <li className="py-2.5">
                          <CartRow item={burger} quantity={2} />
                          <div className="mt-2 flex gap-1.5">
                            <NoteChip note="be svogūnų" on={noteOn} tap={t === 5} />
                            <NoteChip note="be padažo" on={false} tap={false} />
                          </div>
                        </li>
                        <li className="py-2.5">
                          <CartRow item={soup} quantity={1} />
                        </li>
                      </ul>
                      <div className="flex items-baseline justify-between border-t border-line pt-2.5">
                        <span className="text-[14px] font-semibold">Iš viso</span>
                        <span className="text-[19px] leading-tight font-semibold tracking-[-0.02em] tabular-nums">{formatPrice(total)}</span>
                      </div>
                      <p className="mt-3 text-[14px] font-semibold">Kaip mokėsite?</p>
                      <div className="mt-1.5 grid gap-1.5">
                        <PayOption
                          checked
                          label="Kortele dabar, telefonu"
                          icon={
                            <>
                              <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
                              <path d="M3 10h18M7 15h3" />
                            </>
                          }
                        />
                        <PayOption
                          checked={false}
                          label="Grynaisiais padavėjui"
                          icon={
                            <>
                              <rect x="2.5" y="6" width="19" height="12" rx="2" />
                              <circle cx="12" cy="12" r="2.5" />
                            </>
                          }
                        />
                      </div>
                    </div>
                    {/* The main action is pinned to the bottom, like in the demo. */}
                    <div className={`absolute inset-x-0 bottom-0 border-t border-line px-4 pt-2.5 pb-3 ${screenBg}`}>
                      <span className="relative flex h-11 items-center justify-center rounded-2xl bg-tomato text-[15px] font-semibold text-white tabular-nums">
                        Apmokėti {formatPrice(total)}
                        {t === 6 && <Tap key="pay" />}
                      </span>
                    </div>
                  </Screen>

                  {/* Paying: the card sheet slides up over the order */}
                  <PaymentSheet
                    active={screen === "paying"}
                    amount={formatPrice(total)}
                    merchant={merchant}
                    table={heroOrder.table}
                    approveAfter={550}
                    compact
                  />

                  {/* Done: drawn check, order number, live status, what was ordered */}
                  <Screen show={screen === "done"}>
                    <div className="px-4 pt-5">
                      <div className="flex flex-col items-center text-center">
                        <span
                          key={done ? "on" : "off"}
                          style={{ animationDelay: "200ms" }}
                          className={`flex size-12 items-center justify-center rounded-full bg-ready text-white ${
                            done ? "animate-scale-in" : ""
                          }`}
                        >
                          <Glyph className="size-6" strokeWidth={2.6}>
                            <path
                              d="M5 12.5l4.5 4.5L19 7.5"
                              pathLength="1"
                              style={{ animationDelay: "380ms" }}
                              className={done ? "animate-check [stroke-dasharray:1]" : ""}
                            />
                          </Glyph>
                        </span>
                        <p className="mt-2.5 text-[13px] text-ink-2">Užsakymas priimtas</p>
                        <p className="mt-0.5 text-[34px] leading-none font-semibold tracking-[-0.04em] tabular-nums">
                          {formatOrderNumber(heroOrder.id)}
                        </p>
                      </div>

                      <div className="mt-5 grid grid-cols-3 gap-1.5">
                        {["Priimta", "Ruošiama", "Nešama"].map((label, i) => (
                          <div key={label}>
                            <span className="block h-1.5 overflow-hidden rounded-full bg-line">
                              {done && i <= guestStatus && (
                                <span className="block h-full origin-left animate-progress rounded-full bg-ready" />
                              )}
                            </span>
                            <span
                              className={`mt-1.5 block text-[12px] transition-colors duration-300 ${
                                i === guestStatus ? "font-semibold text-ink" : i < guestStatus ? "text-ink" : "text-ink-2"
                              }`}
                            >
                              {label}
                            </span>
                          </div>
                        ))}
                      </div>
                      <p className="mt-3 text-center text-[13.5px]">
                        <span key={guestStatus} className="inline-block animate-fade-up">
                          {guestStatus === 0 && "Virtuvė jau mato jūsų užsakymą."}
                          {guestStatus === 1 && "Ruošiama. Atnešime prie staliuko."}
                          {guestStatus === 2 && "Paruošta, padavėjas jau neša."}
                        </span>
                      </p>

                      <div className="mt-4 rounded-2xl bg-paper px-3">
                        <ul className="divide-y divide-line">
                          {heroOrder.lines.map((line) => {
                            const item = getItem(line.itemId);
                            return (
                              <li key={line.itemId} className="flex items-center gap-2.5 py-2.5">
                                <Thumb item={item} className="size-9 rounded-lg" />
                                <div className="min-w-0 flex-1 text-[13.5px] leading-snug">
                                  <p>
                                    <span className="tabular-nums">{line.quantity}×</span> {item.name}
                                  </p>
                                  {line.notes.length > 0 && (
                                    <p className="text-[12px] text-tomato-dark">{line.notes.join(", ")}</p>
                                  )}
                                </div>
                                <span className="shrink-0 text-[12.5px] text-ink-2 tabular-nums">
                                  {formatPrice(item.price * line.quantity)}
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                        <p className="border-t border-line py-2.5 text-[13px]">
                          Apmokėta kortele · <span className="font-semibold tabular-nums">{formatPrice(total)}</span>
                        </p>
                      </div>
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
                className="absolute top-1/2 size-2.5 -translate-x-1/2 -translate-y-1/2 animate-travel rounded-full bg-tomato-bright"
              />
            )}
          </div>
          <div className="rounded-[2rem] bg-[#2a2826] p-[3px] shadow-[0_40px_80px_-30px_rgb(0_0_0/0.9),inset_0_1px_0_rgb(255_255_255/0.18)]">
            <div className="rounded-[1.85rem] bg-black p-3">
              <KitchenScreen {...kitchen} variant="tablet" />
            </div>
          </div>
        </div>
      </div>

      {/* Phones: the table stand and a small kitchen screen sit side by side under the phone. */}
      <div aria-hidden="true" className="mx-auto mt-8 flex max-w-[360px] items-end justify-center gap-3 md:hidden">
        <div className="w-[136px] shrink-0 min-[380px]:w-[148px]">{standCompact}</div>
        <div className="w-[182px] shrink-0 rounded-[1.25rem] shadow-[0_0_0_6px_#000,0_0_0_8px_#2a2826,0_30px_50px_-25px_rgb(0_0_0/0.9)] min-[380px]:w-[192px]">
          <KitchenScreen {...kitchen} variant="mini" />
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------------------- */
/* Kitchen screen                                                                            */
/* ---------------------------------------------------------------------------------------- */

type FilmTicket = {
  id: number;
  table: number;
  lines: OrderLine[];
  payment: "Apmokėta" | "Grynaisiais";
  /** Seconds the ticket had been waiting when the loop started. */
  waited: number;
};

// Two tables that were already cooking before table 4 ordered.
const cooking: FilmTicket[] = [seedOrders[1], seedOrders[0]].map((order): FilmTicket => ({
  id: order.id,
  table: order.table,
  lines: order.lines.filter((line) => getItem(line.itemId).station === "virtuve"),
  payment: order.payment === "kortele" ? "Apmokėta" : "Grynaisiais",
  waited: order.minutesAgo * 60 + 14,
}));

// Table 4's ticket; its timer starts when it lands.
const ownTicket: FilmTicket = {
  id: heroOrder.id,
  table: heroOrder.table,
  lines: heroOrder.lines,
  payment: "Apmokėta",
  waited: -ARRIVAL_SECOND,
};

const stageStatus: Record<Stage, { label: string; tone: "new" | "cooking" | "ready" }> = {
  naujas: { label: "Naujas", tone: "new" },
  ruosiama: { label: "Ruošiama", tone: "cooking" },
  paruosta: { label: "Paruošta", tone: "ready" },
};

const statusDot: Record<Stage, string> = {
  naujas: "bg-tomato-bright",
  ruosiama: "bg-cooking",
  paruosta: "bg-ready-on-dark",
};

function timer(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

// The list runs on below the screen's edge, as on a busy evening; it fades out there.
function fadeBottom(px: number) {
  const mask = `linear-gradient(to bottom, #000 calc(100% - ${px}px), transparent)`;
  return { maskImage: mask, WebkitMaskImage: mask };
}

/**
 * A small copy of the demo's kitchen display: header with the bell and counts, then a grid of
 * ticket cards, newest first. "tablet" is the desktop mock-up, "mini" the screen under the phone.
 */
function KitchenScreen({
  stage,
  t,
  sec,
  variant,
}: {
  stage: Stage | null;
  t: number;
  sec: number;
  variant: "tablet" | "mini";
}) {
  const listRef = useRef<HTMLUListElement>(null);
  const tablet = variant === "tablet";
  const counts: Record<Stage, number> = {
    naujas: stage === "naujas" ? 1 : 0,
    ruosiama: cooking.length + (stage === "ruosiama" ? 1 : 0),
    paruosta: stage === "paruosta" ? 1 : 0,
  };
  const active = counts.naujas + counts.ruosiama;

  const tickets = stage ? [ownTicket, ...cooking] : cooking;
  useFilmFlip(listRef, tickets.map((ticket) => ticket.id).join(","));

  return (
    <div
      className={`flex flex-col overflow-hidden bg-kds text-kds-text ${
        tablet ? "h-[340px] rounded-[1.1rem]" : "h-[288px] rounded-[1.25rem]"
      }`}
    >
      {tablet && (
        <div className="grid h-6 shrink-0 grid-cols-[1fr_auto_1fr] items-center px-4 text-[10px] text-kds-muted">
          <span className="font-medium tabular-nums">19:42</span>
          <span className="truncate">{merchant}</span>
          <span className="flex items-center justify-end">
            <span className="relative h-[9px] w-[18px] rounded-[2.5px] border border-current p-[1.5px] opacity-80">
              <span className="block h-full w-[75%] rounded-[1px] bg-current" />
            </span>
          </span>
        </div>
      )}

      <div
        className={`flex shrink-0 items-center justify-between gap-2 border-b border-kds-line ${
          tablet ? "h-10 px-4" : "h-9 px-3"
        }`}
      >
        <p className="flex items-baseline gap-1.5">
          <span className={`font-semibold tracking-[-0.01em] ${tablet ? "text-[15px]" : "text-[13.5px]"}`}>Virtuvė</span>
          {!tablet && (
            <span key={active} className="inline-block animate-bump text-[12px] text-kds-muted tabular-nums">
              {active}
            </span>
          )}
        </p>
        <div className="flex items-center gap-3">
          {tablet && (
            <p className="flex items-center gap-2.5 text-[10.5px] text-kds-muted xl:gap-3 xl:text-[11px]">
              {(["naujas", "ruosiama", "paruosta"] as const).map((status) => (
                <span key={status} className="inline-flex items-center gap-1.5">
                  <span className={`size-1.5 rounded-full ${statusDot[status]}`} />
                  {status === "naujas" ? "Nauji" : status === "ruosiama" ? "Ruošiami" : "Paruošti"}
                  <span key={counts[status]} className="inline-block animate-bump font-semibold text-kds-text tabular-nums">
                    {counts[status]}
                  </span>
                </span>
              ))}
            </p>
          )}
          <Bell ringing={stage === "naujas"} small={!tablet} />
        </div>
      </div>

      <div className={`min-h-0 flex-1 overflow-hidden ${tablet ? "px-3 pt-2.5" : "px-2.5 pt-2.5"}`} style={fadeBottom(tablet ? 28 : 16)}>
        <ul ref={listRef} className={tablet ? "grid grid-cols-2 gap-2.5" : "grid gap-2"}>
          {tickets.map((ticket) => {
            const own = ticket.id === heroOrder.id;
            const ticketStage: Stage = own && stage ? stage : "ruosiama";
            const waited = Math.max(0, ticket.waited + sec);
            const ready = ticketStage === "paruosta";
            return (
              <li
                key={ticket.id}
                data-flip={ticket.id}
                className={`flex rounded-lg transition-[opacity,box-shadow] duration-500 ${ready ? "opacity-80" : ""} ${
                  own && ticketStage === "naujas" ? "ring-2 ring-tomato-bright ring-offset-2 ring-offset-kds" : ""
                }`}
              >
                <Ticket
                  orderId={ticket.id}
                  table={ticket.table}
                  station="Virtuvė"
                  time={timer(waited)}
                  late={!ready && waited >= 600}
                  overdue={!ready && waited >= 900}
                  lines={ticket.lines}
                  payment={ticket.payment}
                  status={stageStatus[ticketStage]}
                  compact
                  className="w-full"
                >
                  <CardAction stage={ticketStage} tap={own && (t === 8 || t === 9)} tapKey={t} />
                </Ticket>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

/** The card's one big action, as on the demo's kitchen screen (here only a picture of it). */
function CardAction({ stage, tap, tapKey }: { stage: Stage; tap: boolean; tapKey: number }) {
  if (stage === "paruosta") {
    return (
      <span className="flex h-8 items-center justify-center gap-1.5 text-[11.5px] text-ink-2">
        <svg viewBox="0 0 16 16" className="size-3.5 text-ready" fill="none">
          <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.5" />
          <path d="M8 4.75V8l2.25 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        Laukia padavėjo
        {tap && <Tap key={tapKey} />}
      </span>
    );
  }
  return (
    <span
      className={`relative flex h-8 items-center justify-center gap-1.5 rounded-md text-[12px] font-semibold transition-colors duration-300 ${
        stage === "naujas" ? "bg-ink text-slip" : "bg-ready text-white"
      }`}
    >
      {stage === "ruosiama" && (
        <svg viewBox="0 0 16 16" className="size-3.5" fill="none">
          <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      {stage === "naujas" ? "Pradėti ruošti" : "Paruošta"}
      {tap && <Tap key={tapKey} />}
    </span>
  );
}

/**
 * Cards glide to their new place when the list changes (FLIP); a new card drops in at the top,
 * a moment after the order leaves the phone. Skipped while hidden and when motion is reduced.
 */
function useFilmFlip(ref: RefObject<HTMLElement | null>, signature: string) {
  const positions = useRef<Map<string, { x: number; y: number }> | null>(null);
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (root.getClientRects().length === 0) {
      positions.current = null;
      return;
    }
    const previous = positions.current;
    const animate = previous !== null && !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const origin = root.getBoundingClientRect();
    const next = new Map<string, { x: number; y: number }>();
    root.querySelectorAll<HTMLElement>("[data-flip]").forEach((el) => {
      const id = el.dataset.flip!;
      const rect = el.getBoundingClientRect();
      const pos = { x: rect.left - origin.left, y: rect.top - origin.top };
      next.set(id, pos);
      if (!animate || !previous) return;
      const before = previous.get(id);
      if (!before) {
        el.animate(
          [
            { opacity: 0, transform: "translateY(-16px) scale(0.96)" },
            { opacity: 1, transform: "none" },
          ],
          { duration: 420, delay: 450, easing: easeOut, fill: "backwards" },
        );
        return;
      }
      const dx = before.x - pos.x;
      const dy = before.y - pos.y;
      if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
        el.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: "none" }], {
          duration: 380,
          delay: 150,
          easing: easeOut,
          fill: "backwards",
        });
      }
    });
    positions.current = next;
  }, [ref, signature]);
}

/** Kitchen bell that swings when a new ticket lands. */
function Bell({ ringing, small = false }: { ringing: boolean; small?: boolean }) {
  return (
    <span
      key={ringing ? "ring" : "still"}
      style={{ animationDelay: "450ms" }}
      className={`flex origin-[50%_25%] items-center justify-center transition-colors duration-300 ${
        ringing ? "animate-ring text-tomato-bright" : "text-kds-muted"
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        className={small ? "size-3.5" : "size-4"}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15z" />
        <path d="M10 20.5a2 2 0 0 0 4 0" />
      </svg>
    </span>
  );
}

/* ---------------------------------------------------------------------------------------- */
/* Phone parts (pictures of the demo's controls; nothing here is interactive)               */
/* ---------------------------------------------------------------------------------------- */

const sectionTitle = "pt-3.5 text-[16px] leading-6 font-semibold tracking-[-0.02em]";

function MenuRow({
  item,
  quantity,
  tap,
  tapKey,
}: {
  item: MenuItem;
  quantity: number;
  /** Where the finger lands: the round "+" or the stepper's "+". */
  tap: "add" | "more" | null;
  tapKey: number;
}) {
  return (
    <li className="flex items-start gap-3 py-3">
      <div className="min-w-0 flex-1">
        <p className="text-[15px] leading-snug font-semibold">{item.name}</p>
        <p className="mt-0.5 line-clamp-2 text-[12.5px] leading-snug text-ink-2">{item.description}</p>
        <p className="mt-1 text-[14px] font-semibold tabular-nums">{formatPrice(item.price)}</p>
      </div>
      <div className="relative shrink-0 pb-2.5">
        <Thumb item={item} className="size-[76px] rounded-2xl" />
        <div className={`absolute right-0 bottom-0 flex w-[76px] ${quantity > 0 ? "justify-center" : "justify-end"}`}>
          {quantity > 0 ? (
            <span className="flex h-8 animate-scale-in items-center rounded-full bg-white shadow-[0_2px_8px_-2px_rgb(0_0_0/0.3)] ring-1 ring-black/5">
              <span className="flex size-7 items-center justify-center">
                <Glyph className="size-3.5" strokeWidth={2.4}>
                  <path d="M5 12h14" />
                </Glyph>
              </span>
              <span key={quantity} className="min-w-4 animate-fade-in text-center text-[13px] font-semibold tabular-nums">
                {quantity}
              </span>
              <span className="relative flex size-7 items-center justify-center">
                <Glyph className="size-3.5" strokeWidth={2.4}>
                  <path d="M12 5v14M5 12h14" />
                </Glyph>
                {tap && <Tap key={tapKey} />}
              </span>
            </span>
          ) : (
            <span className="relative -mr-1 flex size-8 items-center justify-center rounded-full bg-white shadow-[0_2px_8px_-2px_rgb(0_0_0/0.3)] ring-1 ring-black/5">
              <Glyph className="size-4" strokeWidth={2.2}>
                <path d="M12 5v14M5 12h14" />
              </Glyph>
              {tap && <Tap key={tapKey} />}
            </span>
          )}
        </div>
      </div>
    </li>
  );
}

function CartRow({ item, quantity }: { item: MenuItem; quantity: number }) {
  return (
    <div className="flex items-center gap-2.5">
      <Thumb item={item} className="size-10 rounded-xl" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13.5px] leading-snug font-semibold">{item.name}</p>
        <p className="text-[12.5px] text-ink-2 tabular-nums">{formatPrice(item.price * quantity)}</p>
      </div>
      <span className="flex h-8 shrink-0 items-center rounded-full bg-paper">
        <span className="flex size-7 items-center justify-center">
          <Glyph className="size-3.5" strokeWidth={2.4}>
            <path d="M5 12h14" />
          </Glyph>
        </span>
        <span className="min-w-4 text-center text-[13px] font-semibold tabular-nums">{quantity}</span>
        <span className="flex size-7 items-center justify-center">
          <Glyph className="size-3.5" strokeWidth={2.4}>
            <path d="M12 5v14M5 12h14" />
          </Glyph>
        </span>
      </span>
    </div>
  );
}

function NoteChip({ note, on, tap }: { note: string; on: boolean; tap: boolean }) {
  return (
    <span
      className={`relative inline-flex h-7 items-center gap-1 rounded-full border px-2.5 text-[12px] whitespace-nowrap transition-colors duration-300 ${
        on ? "border-tomato bg-tomato/10 font-semibold text-tomato-dark" : "border-line text-ink-2"
      }`}
    >
      {on && (
        <Glyph className="-ml-0.5 size-3 animate-scale-in" strokeWidth={3}>
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </Glyph>
      )}
      {on ? note : `+ ${note}`}
      {tap && <Tap key="note" />}
    </span>
  );
}

function PayOption({ checked, label, icon }: { checked: boolean; label: string; icon: ReactNode }) {
  return (
    <span
      className={`flex h-10 items-center gap-2.5 rounded-xl border px-3 text-[13px] ${
        checked ? "border-ink font-semibold ring-1 ring-ink" : "border-line"
      }`}
    >
      <Glyph className={`size-[18px] shrink-0 ${checked ? "text-ink" : "text-ink-2"}`} strokeWidth={1.7}>
        {icon}
      </Glyph>
      <span className="flex-1">{label}</span>
      <span
        className={`flex size-[18px] shrink-0 items-center justify-center rounded-full border-2 ${
          checked ? "border-ink bg-ink" : "border-line"
        }`}
      >
        {checked && <span className="size-1.5 rounded-full bg-white" />}
      </span>
    </span>
  );
}

function Thumb({ item, className }: { item: MenuItem; className: string }) {
  return (
    <span className={`block shrink-0 overflow-hidden bg-paper-2 ${className}`}>
      {item.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={item.image} alt="" width={80} height={80} decoding="async" className="size-full object-cover" />
      )}
    </span>
  );
}

function Screen({ show, children }: { show: boolean; children: ReactNode }) {
  return (
    <div
      className={`absolute inset-0 transition-[opacity,translate] ease-[var(--ease-out-soft)] ${
        show
          ? "translate-x-0 opacity-100 delay-150 duration-500"
          : "pointer-events-none -translate-x-6 opacity-0 duration-200"
      }`}
    >
      {children}
    </div>
  );
}

/** A soft ring where the finger touches the screen. */
function Tap() {
  return <span className="pointer-events-none absolute inset-0 m-auto size-10 animate-tap rounded-full bg-ink/30" />;
}

/** Line icon on a 24 px grid, drawn with the current text colour. */
function Glyph({ children, className, strokeWidth = 2 }: { children: ReactNode; className: string; strokeWidth?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}
