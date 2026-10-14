"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type Dispatch,
  type ReactNode,
  type RefObject,
} from "react";
import { formatOrderNumber, formatPrice, getItem, linesTotal, type Station } from "@/lib/data";
import { Ticket } from "@/components/ticket";
import { playSound } from "./sounds";
import { linesForStation, type DemoAction, type DemoState, type Order, type TicketStatus } from "./store";

export function ageLabel(placedAt: number, now: number): { text: string; late: boolean } {
  const minutes = Math.max(0, Math.floor((now - placedAt) / 60_000));
  if (minutes < 1) return { text: "ką tik", late: false };
  return { text: `prieš ${minutes} min.`, late: minutes >= 10 };
}

/** Waiting time as a kitchen timer: "4:05", "12:40". Amber from 10 min, red from 15. */
export function elapsed(placedAt: number, now: number): { text: string; late: boolean; overdue: boolean } {
  const seconds = Math.max(0, Math.floor((now - placedAt) / 1000));
  const minutes = Math.floor(seconds / 60);
  return {
    text: `${minutes}:${String(seconds % 60).padStart(2, "0")}`,
    late: minutes >= 10,
    overdue: minutes >= 15,
  };
}

const ticketStatus: Record<TicketStatus, { label: string; tone: "new" | "cooking" | "ready" }> = {
  naujas: { label: "Naujas", tone: "new" },
  ruosiama: { label: "Ruošiama", tone: "cooking" },
  paruosta: { label: "Paruošta", tone: "ready" },
};

const stationName: Record<Station, string> = { virtuve: "Virtuvė", baras: "Baras" };
const stations: Station[] = ["virtuve", "baras"];

const statusDot: Record<TicketStatus, string> = {
  naujas: "bg-tomato-bright",
  ruosiama: "bg-cooking",
  paruosta: "bg-ready-on-dark",
};

// Amber text on the dark tablet, lifted slightly so small digits stay readable.
const amberOnDark = "text-[color-mix(in_oklab,var(--color-cooking)_78%,white)]";

/*
  On desktop the team screens keep the tablet's height and scroll inside it. The demo shell
  can set --team-screen-h on #demo-team-panel if the panel changes size.
*/
const screenHeight = "lg:h-[var(--team-screen-h,570px)]";

const easeOut = "cubic-bezier(0.2, 0.7, 0.2, 1)";

function reducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// ---- live clock --------------------------------------------------------------------------

/*
  The demo's page clock (`now`) only moves every 15 s. Timers count on from the moment it last
  changed. Kept at module level so switching tabs doesn't restart the count.
*/
let clockSync = { now: Number.NaN, at: 0 };

function useLiveNow(now: number) {
  const [live, setLive] = useState({ now, extra: 0 });
  useEffect(() => {
    if (clockSync.now !== now) clockSync = { now, at: Date.now() };
    const update = () => setLive({ now, extra: Date.now() - clockSync.at });
    const first = window.setTimeout(update, 0);
    const interval = window.setInterval(update, 1000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(interval);
    };
  }, [now]);
  return now + (live.now === now ? live.extra : 0);
}

// ---- scrolling ---------------------------------------------------------------------------

/** Which edges of a scroll area have more content behind them. */
function useEdgeFade(ref: RefObject<HTMLElement | null>) {
  const [edges, setEdges] = useState({ top: false, bottom: false });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => {
      const top = el.scrollTop > 2;
      const bottom = el.scrollHeight - el.clientHeight - el.scrollTop > 2;
      setEdges((prev) => (prev.top === top && prev.bottom === bottom ? prev : { top, bottom }));
    };
    const frame = window.requestAnimationFrame(check);
    el.addEventListener("scroll", check, { passive: true });
    const observer = new ResizeObserver(check);
    observer.observe(el);
    for (const child of Array.from(el.children)) observer.observe(child);
    return () => {
      window.cancelAnimationFrame(frame);
      el.removeEventListener("scroll", check);
      observer.disconnect();
    };
  }, [ref]);
  return edges;
}

function fadeMask({ top, bottom }: { top: boolean; bottom: boolean }): CSSProperties | undefined {
  if (!top && !bottom) return undefined;
  const stops = [top ? "transparent, #000 24px" : "#000", bottom ? "#000 calc(100% - 40px), transparent" : "#000"];
  const mask = `linear-gradient(to bottom, ${stops.join(", ")})`;
  return { maskImage: mask, WebkitMaskImage: mask };
}

/** Shows an element that useFlip held back, without letting its CSS transition fight the entrance. */
function release(el: HTMLElement) {
  el.style.opacity = "";
  window.requestAnimationFrame(() => {
    el.style.transition = "";
  });
}

/**
 * Smoothly moves items to their new place when the list changes (FLIP), and fades new items in.
 * Items are the elements with data-flip inside the container. `scope` resets the memory, e.g.
 * when the tablet switches from kitchen to bar, so a whole new screen doesn't animate.
 */
function useFlip(
  containerRef: RefObject<HTMLElement | null>,
  signature: string,
  scope: string,
  options: { skip?: string | null; hold?: string | null } = {},
) {
  const positions = useRef<{ scope: string; map: Map<string, { x: number; y: number }> } | null>(null);
  const { skip = null, hold = null } = options;
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    // Hidden (the phone view on small screens): nothing to measure, start fresh when shown.
    if (container.getClientRects().length === 0) {
      positions.current = null;
      return;
    }
    const fresh = positions.current?.scope !== scope;
    const previous = positions.current?.map ?? new Map<string, { x: number; y: number }>();
    const next = new Map<string, { x: number; y: number }>();
    const animate = !fresh && !reducedMotion();
    const origin = container.getBoundingClientRect();
    container.querySelectorAll<HTMLElement>("[data-flip]").forEach((el) => {
      const id = el.dataset.flip!;
      const rect = el.getBoundingClientRect();
      const pos = { x: rect.left - origin.left, y: rect.top - origin.top };
      next.set(id, pos);
      if (fresh) return;
      const before = previous.get(id);
      if (before) {
        const dx = before.x - pos.x;
        const dy = before.y - pos.y;
        if (animate && (Math.abs(dx) > 1 || Math.abs(dy) > 1)) {
          el.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: "none" }], {
            duration: 340,
            easing: easeOut,
          });
        }
      } else if (id === hold) {
        // The guest's own ticket waits for the one flying over from the phone, then drops in.
        el.style.transition = "none";
        el.style.opacity = "0";
        window.setTimeout(() => {
          if (el.style.opacity === "0") release(el);
        }, 1600);
      } else if (id !== skip && animate) {
        el.animate(
          [
            { opacity: 0, transform: "translateY(-8px) scale(0.98)" },
            { opacity: 1, transform: "none" },
          ],
          { duration: 300, easing: easeOut },
        );
      }
    });
    positions.current = { scope, map: next };
  }, [containerRef, signature, scope, skip, hold]);
}

// ---- kitchen and bar ---------------------------------------------------------------------

// Ticked dishes survive tab switches; keyed by placedAt too, so a demo reset starts clean.
const tickedLines = new Set<string>();

type StationRailProps = {
  station: Station;
  state: DemoState;
  now: number;
  highlightId: number | null;
  dispatch: Dispatch<DemoAction>;
  announce: (text: string) => void;
};

/** Kitchen or bar display: a grid of ticket cards, newest first, each with one big action. */
export function StationRail({ station, state, now, highlightId, dispatch, announce }: StationRailProps) {
  const tickets = state.orders.filter((order) => order.status[station] && !order.delivered[station]);
  const counts: Record<TicketStatus, number> = { naujas: 0, ruosiama: 0, paruosta: 0 };
  for (const order of tickets) counts[order.status[station]!] += 1;

  const live = useLiveNow(now);
  const [ticked, setTicked] = useState(() => new Set(tickedLines));
  const scrollRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const edges = useEdgeFade(scrollRef);
  const overflowing = edges.top || edges.bottom;

  const guestId = state.guestOrderId;
  useFlip(listRef, tickets.map((order) => order.id).join(","), station, {
    skip: highlightId === null ? null : String(highlightId),
    hold: guestId !== null && guestId !== highlightId ? String(guestId) : null,
  });

  // A new ticket drops in at the top of the screen, outlined for a few seconds.
  useLayoutEffect(() => {
    if (highlightId === null) return;
    const el = listRef.current?.querySelector<HTMLElement>(`[data-flip="${highlightId}"]`);
    if (!el) return;
    release(el);
    const reduce = reducedMotion();
    if (!reduce) {
      el.animate(
        [
          { opacity: 0, transform: "translateY(-16px) scale(0.96)" },
          { opacity: 1, transform: "none" },
        ],
        { duration: 420, easing: easeOut },
      );
    }
    const scroller = scrollRef.current;
    if (scroller && scroller.scrollTop > 0) scroller.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  }, [highlightId]);

  const toggleLine = (key: string) => {
    playSound("tap");
    if (tickedLines.has(key)) tickedLines.delete(key);
    else tickedLines.add(key);
    setTicked(new Set(tickedLines));
  };

  return (
    <div className={`@container flex flex-col ${screenHeight}`}>
      <p className="flex flex-wrap items-center gap-x-5 gap-y-1 px-4 pb-3 text-[14px] text-kds-muted sm:px-5">
        {(["naujas", "ruosiama", "paruosta"] as const).map((status) => (
          <span key={status} className="inline-flex items-center gap-2">
            <span aria-hidden="true" className={`size-2 rounded-full ${statusDot[status]}`} />
            {status === "naujas" ? "Nauji" : status === "ruosiama" ? "Ruošiami" : "Paruošti"}
            <span key={counts[status]} className="inline-block animate-bump font-semibold text-kds-text tabular-nums">
              {counts[status]}
            </span>
          </span>
        ))}
      </p>

      <div
        ref={scrollRef}
        role="region"
        aria-label={`${stationName[station]}: užsakymai`}
        tabIndex={overflowing ? 0 : undefined}
        style={fadeMask(edges)}
        className="min-h-0 flex-1 overflow-y-auto px-4 pt-1 pb-5 focus-visible:outline-offset-[-3px]! sm:px-5"
      >
        <ul ref={listRef} className="relative grid grid-cols-1 gap-3 @xl:grid-cols-2 @3xl:grid-cols-3">
          {tickets.map((order) => {
            const status = order.status[station]!;
            const ready = status === "paruosta";
            const age = elapsed(order.placedAt, live);
            const isNew = order.id === highlightId;
            const lines = linesForStation(order.lines, station);
            const lineKey = (itemId: string) => `${station}:${order.id}:${order.placedAt}:${itemId}`;
            return (
              <li
                key={order.id}
                data-flip={order.id}
                className={`flex rounded-xl transition-[opacity,box-shadow] duration-500 ${ready ? "opacity-80" : ""} ${
                  isNew ? "ring-2 ring-tomato-bright ring-offset-2 ring-offset-kds" : ""
                }`}
              >
                <Ticket
                  orderId={order.id}
                  table={order.table}
                  station={stationName[station]}
                  time={age.text}
                  late={!ready && age.late}
                  overdue={!ready && age.overdue}
                  lines={lines}
                  payment={order.payment === "kortele" ? "Apmokėta" : "Grynaisiais"}
                  status={ticketStatus[status]}
                  doneLines={lines.filter((line) => ticked.has(lineKey(line.itemId))).map((line) => line.itemId)}
                  onToggleLine={status === "ruosiama" ? (itemId) => toggleLine(lineKey(itemId)) : undefined}
                  className="w-full"
                >
                  {ready ? (
                    <p className="flex h-12 items-center justify-center gap-2 text-[14px] text-ink-2">
                      <svg viewBox="0 0 16 16" className="size-4 text-ready" fill="none" aria-hidden="true">
                        <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M8 4.75V8l2.25 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                      Laukia padavėjo
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={(event) => {
                        // A double-click shouldn't skip straight past "Ruošiama".
                        if (event.detail > 1) return;
                        playSound(status === "naujas" ? "tap" : "ready");
                        dispatch({ type: "advance", orderId: order.id, station });
                        announce(
                          `${stationName[station]}, ${formatOrderNumber(order.id)}: ${
                            status === "naujas" ? "ruošiama" : "paruošta"
                          }.`,
                        );
                      }}
                      className={`flex h-12 w-full items-center justify-center gap-2 rounded-lg text-[15px] font-semibold transition select-none active:scale-[0.97] ${
                        status === "naujas"
                          ? "bg-ink text-slip hover:bg-black"
                          : "bg-ready text-white hover:bg-[#256a42]"
                      }`}
                    >
                      {status === "ruosiama" && (
                        <svg viewBox="0 0 16 16" className="size-4" fill="none" aria-hidden="true">
                          <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                      {status === "naujas" ? "Pradėti ruošti" : "Paruošta"}
                    </button>
                  )}
                </Ticket>
              </li>
            );
          })}
        </ul>
        {tickets.length === 0 && (
          <EmptyState title="Užsakymų nėra" text="Nauji atsiras čia, vos svečias užsakys." />
        )}
      </div>
    </div>
  );
}

// ---- floor staff -------------------------------------------------------------------------

/** Floor staff tablet: what to carry where, which tables pay in cash, and what's cooking. */
export function StaffBoard({
  state,
  now,
  dispatch,
  announce,
}: {
  state: DemoState;
  now: number;
  dispatch: Dispatch<DemoAction>;
  announce: (text: string) => void;
}) {
  const toCarry: { order: Order; station: Station }[] = [];
  for (const order of state.orders) {
    for (const station of stations) {
      if (order.status[station] === "paruosta" && !order.delivered[station]) toCarry.push({ order, station });
    }
  }
  // TODO: patikrinti, ar tikroje sistemoje personalui taip rodomi grynųjų atsiskaitymai.
  const cash = state.orders.filter((order) => order.payment === "grynieji" && !order.paid);
  const cooking = state.orders.filter((order) =>
    (Object.keys(order.status) as Station[]).some((s) => order.status[s] !== "paruosta"),
  );

  const live = useLiveNow(now);
  const [leaving, setLeaving] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const edges = useEdgeFade(scrollRef);

  const carryKey = (order: Order, station: Station) => `nesti-${order.id}-${station}`;
  const signature = [
    ...toCarry.map(({ order, station }) => carryKey(order, station)),
    ...cash.map((order) => `cash-${order.id}`),
    ...cooking.map((order) => `cook-${order.id}`),
  ].join(",");
  useFlip(boardRef, signature, "staff");

  /** Sound now, a short exit animation, then the state change; focus moves to a neighbour. */
  const finish = (key: string, button: HTMLElement, action: DemoAction, message: string) => {
    if (leaving.includes(key)) return;
    playSound("done");
    setLeaving((list) => [...list, key]);
    const row = button.closest("li");
    let nextFocus: HTMLElement | null = null;
    if (row?.contains(document.activeElement)) {
      const neighbour = row.nextElementSibling ?? row.previousElementSibling;
      nextFocus =
        neighbour?.querySelector<HTMLElement>("button") ?? row.closest("section")?.querySelector<HTMLElement>("h4") ?? null;
    }
    window.setTimeout(
      () => {
        dispatch(action);
        announce(message);
        setLeaving((list) => list.filter((k) => k !== key));
        if (nextFocus) window.requestAnimationFrame(() => nextFocus?.focus());
      },
      reducedMotion() ? 0 : 250,
    );
  };

  const carryRows = toCarry.map(({ order, station }) => {
    const key = carryKey(order, station);
    const isLeaving = leaving.includes(key);
    return (
      <StaffRow key={key} flip={key} leaving={isLeaving}>
        <TableBadge table={order.table} />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <p className="text-[16px] font-semibold text-kds-text">Nešti į staliuką {order.table}</p>
            <span className="rounded-full border border-kds-line px-2 py-px text-[12px] text-kds-muted">
              {stationName[station]}
            </span>
          </div>
          <div className="mt-2 space-y-1.5">
            {linesForStation(order.lines, station).map((line) => {
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
                  </span>
                </p>
              );
            })}
          </div>
        </div>
        <button
          type="button"
          aria-disabled={isLeaving || undefined}
          onClick={(event) =>
            finish(
              key,
              event.currentTarget,
              { type: "deliver", orderId: order.id, station },
              `Staliukas ${order.table}: nunešta.`,
            )
          }
          className={rowButton("bg-ready text-white hover:bg-[#256a42]")}
        >
          <svg viewBox="0 0 16 16" className="size-4" fill="none" aria-hidden="true">
            <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Nunešta
        </button>
      </StaffRow>
    );
  });

  const cashRows = cash.map((order) => {
    const key = `cash-${order.id}`;
    const isLeaving = leaving.includes(key);
    return (
      <StaffRow key={key} flip={key} leaving={isLeaving}>
        <TableBadge table={order.table} />
        <div className="min-w-0">
          <p className="text-[16px] leading-snug font-semibold text-kds-text">
            Staliukas {order.table} mokės grynaisiais ·{" "}
            <span className="tabular-nums">{formatPrice(linesTotal(order.lines))}</span>
          </p>
          <p className="mt-0.5 text-[14px] text-kds-muted tabular-nums">{formatOrderNumber(order.id)}</p>
        </div>
        <button
          type="button"
          aria-disabled={isLeaving || undefined}
          onClick={(event) =>
            finish(key, event.currentTarget, { type: "markPaid", orderId: order.id }, `Staliukas ${order.table}: atsiskaityta.`)
          }
          className={rowButton("bg-slip text-ink hover:bg-white")}
        >
          Atsiskaityta
        </button>
      </StaffRow>
    );
  });

  const cookingRows = cooking.map((order) => {
    const age = elapsed(order.placedAt, live);
    return (
      <li
        key={order.id}
        data-flip={`cook-${order.id}`}
        className="flex items-center gap-3 rounded-xl border border-kds-line px-3 py-2.5"
      >
        <span
          aria-hidden="true"
          className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-kds-2 text-[16px] font-semibold text-kds-text tabular-nums"
        >
          {order.table}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[14px] leading-snug">
            <span className="font-semibold text-kds-text">Staliukas {order.table}</span>{" "}
            <span className="text-kds-muted tabular-nums">{formatOrderNumber(order.id)}</span>
          </p>
          <p className="mt-1 flex flex-wrap gap-1.5">
            {(Object.keys(order.status) as Station[]).map((station) => {
              const status = order.status[station]!;
              const delivered = order.delivered[station];
              return (
                <span
                  key={station}
                  className="inline-flex items-center gap-1.5 rounded-full bg-kds-2 px-2 py-0.5 text-[12.5px] text-kds-text"
                >
                  <span
                    aria-hidden="true"
                    className={`size-1.5 rounded-full ${delivered ? "bg-kds-muted" : statusDot[status]}`}
                  />
                  {stationName[station]} · {delivered ? "Nunešta" : ticketStatus[status].label}
                </span>
              );
            })}
          </p>
        </div>
        <span
          className={`shrink-0 font-mono text-[14px] tabular-nums ${
            age.overdue ? "font-semibold text-tomato-bright" : age.late ? `font-semibold ${amberOnDark}` : "text-kds-muted"
          }`}
        >
          {age.text}
        </span>
      </li>
    );
  });

  return (
    <div className={`@container flex flex-col ${screenHeight}`}>
      <div
        ref={scrollRef}
        role="region"
        aria-label="Personalas: užduotys"
        tabIndex={edges.top || edges.bottom ? 0 : undefined}
        style={fadeMask(edges)}
        className="min-h-0 flex-1 overflow-y-auto px-4 pt-1 pb-5 focus-visible:outline-offset-[-3px]! sm:px-5"
      >
        <div
          ref={boardRef}
          className="relative grid grid-cols-1 items-start gap-7 @3xl:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] @3xl:gap-5"
        >
          <StaffGroup title="Nešti dabar" empty="Kol kas nieko. Paruošti patiekalai atsiras čia.">
            {carryRows}
          </StaffGroup>
          <div className="grid gap-7">
            <StaffGroup title="Grynieji" empty="Visi atsiskaitė.">
              {cashRows}
            </StaffGroup>
            <StaffGroup title="Ruošiama" empty="Virtuvė ir baras laisvi.">
              {cookingRows}
            </StaffGroup>
          </div>
        </div>
      </div>
    </div>
  );
}

function rowButton(tone: string) {
  return `col-span-2 flex h-11 items-center justify-center gap-2 rounded-lg px-4 text-[15px] font-semibold whitespace-nowrap transition select-none active:scale-[0.97] aria-disabled:pointer-events-none @sm:col-span-1 ${tone}`;
}

/** A row with a big action: the button sits under the text on narrow screens, beside it when there's room. */
function StaffRow({ flip, leaving, children }: { flip: string; leaving: boolean; children: ReactNode }) {
  return (
    <li
      data-flip={flip}
      className={`grid grid-cols-[auto_minmax(0,1fr)] items-start gap-x-3 gap-y-3 rounded-xl bg-kds-2 p-3 @sm:grid-cols-[auto_minmax(0,1fr)_auto] @sm:items-center ${
        leaving ? "pointer-events-none animate-leave" : ""
      }`}
    >
      {children}
    </li>
  );
}

function StaffGroup({ title, empty, children }: { title: string; empty: string; children: ReactNode[] }) {
  return (
    <section className="@container">
      <div className="flex items-baseline gap-2">
        <h4 tabIndex={-1} className="text-[15px] font-semibold text-kds-text focus:outline-none">
          {title}
        </h4>
        {children.length > 0 && (
          <span key={children.length} className="inline-block animate-bump text-[14px] text-kds-muted tabular-nums">
            {children.length}
          </span>
        )}
      </div>
      {children.length > 0 ? (
        <ul className="mt-2.5 space-y-2">{children}</ul>
      ) : (
        <p className="mt-2.5 animate-fade-in rounded-xl border border-dashed border-kds-line px-4 py-5 text-center text-[14px] text-kds-muted">
          {empty}
        </p>
      )}
    </section>
  );
}

function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div className="flex animate-fade-in flex-col items-center justify-center px-6 py-16 text-center">
      <svg viewBox="0 0 24 24" className="size-8 text-kds-muted" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 12.5l2.75 2.75L16 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <p className="mt-3 text-[16px] font-semibold text-kds-text">{title}</p>
      <p className="mt-1 text-[14px] text-kds-muted">{text}</p>
    </div>
  );
}

function TableBadge({ table }: { table: number }) {
  return (
    <span
      aria-hidden="true"
      className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-slip text-[22px] font-semibold text-ink tabular-nums"
    >
      {table}
    </span>
  );
}
