"use client";

import { useCallback, useEffect, useLayoutEffect, useReducer, useRef, useState, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import { formatOrderNumber, getItem, restaurant, tables, type OrderLine, type Station } from "@/lib/data";
import { Ticket } from "@/components/ticket";
import { GuestPhone, type PhoneScreen } from "./guest-phone";
import { StaffBoard, StationRail } from "./team-screens";
import { cartLines, demoReducer, initialDemoState, linesForStation, type Payment } from "./store";
import { playChime } from "./chime";
import { playSound, setSoundEnabled, useSoundEnabled } from "./sounds";

type TeamTab = Station | "personalas";
type View = "svecias" | TeamTab;

const viewLabels: Record<View, string> = {
  svecias: "Svečio telefonas",
  virtuve: "Virtuvė",
  baras: "Baras",
  personalas: "Personalas",
};
const views: View[] = ["svecias", "virtuve", "baras", "personalas"];
const teamTabs: TeamTab[] = ["virtuve", "baras", "personalas"];

const steps = ["Nuskenuoja", "Išsirenka", "Apmoka", "Virtuvė gauna"];

type Flight = {
  from: DOMRect;
  orderId: number;
  table: number;
  station: Station;
  lines: OrderLine[];
  payment: Payment;
};

// The ticket's trip from the phone to the tablet. It lands at LAND_AT (the bell rings, the
// real card drops in) and fades out over the rest, so the two cross-fade.
const FLIGHT_MS = 900;
const LAND_AT = 0.8;

function arrowNav<T>(event: KeyboardEvent, list: T[], current: T, select: (value: T) => void, idPrefix: string) {
  const index = list.indexOf(current);
  let next = index;
  if (event.key === "ArrowRight") next = (index + 1) % list.length;
  else if (event.key === "ArrowLeft") next = (index - 1 + list.length) % list.length;
  else if (event.key === "Home") next = 0;
  else if (event.key === "End") next = list.length - 1;
  else return;
  event.preventDefault();
  select(list[next]);
  document.getElementById(`${idPrefix}-${String(list[next])}`)?.focus();
}

function easeInOut(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function SpeakerIcon({ on }: { on: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-[18px] shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 9.5h3.5L12 6v12l-4.5-3.5H4z" />
      {on ? <path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" /> : <path d="M16 9.5l5 5M21 9.5l-5 5" />}
    </svg>
  );
}

/** The one sound switch for every device; turning it on gives a tick so the visitor hears it works. */
function SoundToggle({
  tone,
  className = "",
  labelClass = "max-sm:sr-only",
}: {
  tone: "dark" | "light";
  className?: string;
  /** When the visible word is hidden (the button keeps its aria-label either way). */
  labelClass?: string;
}) {
  const on = useSoundEnabled();
  const colours =
    tone === "dark"
      ? `text-[14px] hover:bg-kds-2 ${on ? "text-kds-text" : "text-kds-muted hover:text-kds-text"}`
      : `text-[15px] hover:bg-paper-2 ${on ? "text-ink" : "text-ink-2 hover:text-ink"}`;
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={on ? "Išjungti garsą" : "Įjungti garsą"}
      onClick={() => {
        setSoundEnabled(!on);
        if (!on) playSound("tap");
      }}
      className={`inline-flex h-11 items-center gap-2 rounded-full px-3 font-medium transition select-none active:scale-[0.96] ${colours} ${className}`}
    >
      <SpeakerIcon on={on} />
      <span className={labelClass}>{on ? "Garsas" : "Be garso"}</span>
    </button>
  );
}

/** Minimal tablet status row: time, the restaurant, connection. Decorative, like the phone's. */
function TabletStatus() {
  return (
    <div
      aria-hidden="true"
      className="grid h-7 shrink-0 grid-cols-[1fr_auto_1fr] items-center px-4 text-[12px] text-kds-muted sm:px-5"
    >
      <span className="font-medium tabular-nums">19:42</span>
      <span className="truncate">
        {restaurant.kind} „{restaurant.name}“
      </span>
      <span className="flex items-center justify-end gap-1.5">
        <svg viewBox="0 0 16 12" className="h-[11px] w-[15px]" fill="currentColor">
          <path d="M8 2.2c2.3 0 4.4.9 6 2.4l1.1-1.2A10.2 10.2 0 0 0 8 .6 10.2 10.2 0 0 0 .9 3.4L2 4.6a8.6 8.6 0 0 1 6-2.4z" />
          <path d="M8 5.4c1.5 0 2.8.5 3.8 1.4l1.1-1.2A7.3 7.3 0 0 0 8 3.8c-1.9 0-3.6.7-4.9 1.8l1.1 1.2c1-.9 2.3-1.4 3.8-1.4z" />
          <path d="M8 8.6c.7 0 1.3.2 1.7.6L8 11.2 6.3 9.2c.4-.4 1-.6 1.7-.6z" />
        </svg>
        <span className="relative h-[10px] w-[20px] rounded-[3px] border border-current p-[1.5px] opacity-80">
          <span className="block h-full w-[75%] rounded-[1px] bg-current" />
        </span>
      </span>
    </div>
  );
}

export function Demo() {
  const [state, dispatch] = useReducer(demoReducer, initialDemoState);
  const [view, setView] = useState<View>("svecias");
  const [teamTab, setTeamTab] = useState<TeamTab>("virtuve");
  const [phase, setPhase] = useState<{ screen: PhoneScreen; hasItems: boolean }>({ screen: "menu", hasItems: false });
  const [highlightId, setHighlightId] = useState<number | null>(null);
  // Kitchen tablets ding when a ticket arrives and the bell swings (sound follows the global switch).
  const [ring, setRing] = useState(0);
  const [ringing, setRinging] = useState(false);
  const [now, setNow] = useState(0);
  const [message, setMessage] = useState("");
  const [flight, setFlight] = useState<Flight | null>(null);
  const [landedId, setLandedId] = useState<number | null>(null);

  const mountedAt = useRef<number | null>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const teamRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const devicesRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);

  // Page clock: 0 at load, so the server render and the first client render agree.
  useEffect(() => {
    mountedAt.current = Date.now();
    const interval = window.setInterval(() => setNow(Date.now() - (mountedAt.current ?? Date.now())), 15_000);
    const pending = timers.current;
    return () => {
      window.clearInterval(interval);
      pending.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  const clock = () => (mountedAt.current ? Date.now() - mountedAt.current : 0);

  const announceTimer = useRef(0);
  const announce = useCallback((text: string) => {
    setMessage("");
    // A newer message replaces one still waiting, so the last announcement always wins.
    window.clearTimeout(announceTimer.current);
    announceTimer.current = window.setTimeout(() => setMessage(text), 30);
  }, []);
  useEffect(() => () => window.clearTimeout(announceTimer.current), []);

  const ringBell = useCallback(() => {
    setRing((r) => r + 1);
    setRinging(true);
    playChime();
  }, []);

  const onScreenChange = useCallback((screen: PhoneScreen, hasItems: boolean) => {
    setPhase({ screen, hasItems });
  }, []);

  const showStation = useCallback((station: TeamTab) => {
    setTeamTab(station);
    setView(station);
    const top = devicesRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 0) {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      devicesRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    }
  }, []);

  const onSubmit = useCallback(
    (payment: Payment) => {
      const lines = cartLines(state.cart);
      if (lines.length === 0) return;
      const id = state.nextId;
      const target: Station = lines.some((l) => getItem(l.itemId).station === "virtuve") ? "virtuve" : "baras";
      const now = clock();
      dispatch({ type: "submit", payment, at: now });
      setNow(now);
      setTeamTab(target);
      setHighlightId(id);
      announce(`Užsakymas ${formatOrderNumber(id)} atkeliavo į ${target === "virtuve" ? "virtuvę" : "barą"}.`);
      timers.current.push(window.setTimeout(() => setHighlightId((h) => (h === id ? null : h)), 4000));

      const wide = window.matchMedia("(min-width: 1024px)").matches;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const flies = wide && !reduce && !!phoneRef.current && !!teamRef.current;
      // The ding comes as the ticket lands on the tablet.
      const landing = flies ? Math.round(FLIGHT_MS * LAND_AT) : 150;
      timers.current.push(window.setTimeout(ringBell, landing));
      if (flies && phoneRef.current) {
        setLandedId(null);
        timers.current.push(window.setTimeout(() => setLandedId(id), landing));
        setFlight({
          from: phoneRef.current.getBoundingClientRect(),
          orderId: id,
          table: state.table,
          station: target,
          lines: linesForStation(lines, target),
          payment,
        });
      }
      if (!wide) {
        // On phones the guest sees the confirmation first, then the screen where the order landed.
        timers.current.push(window.setTimeout(() => showStation(target), 1500));
      }
    },
    [state.cart, state.nextId, state.table, announce, showStation, ringBell],
  );

  /*
    Fly a miniature of the new ticket from the phone to the spot where the real card appears
    (desktop only). The team screen holds the real card back until the ghost lands.
  */
  useLayoutEffect(() => {
    const ghost = ghostRef.current;
    if (!flight || !ghost) return;

    const panel = document.getElementById("demo-team-panel");
    const card = panel?.querySelector<HTMLElement>(`[data-flip="${flight.orderId}"]`) ?? null;
    let to: { left: number; top: number; width: number };
    if (card) {
      const rect = card.getBoundingClientRect();
      // If the kitchen list was scrolled, bring it back to the top where the ticket lands.
      const scroller = card.closest<HTMLElement>('[role="region"]');
      const offset = scroller?.scrollTop ?? 0;
      if (scroller && offset > 0) scroller.scrollTo({ top: 0, behavior: "smooth" });
      to = { left: rect.left, top: rect.top + offset, width: rect.width };
    } else {
      const rect = (panel ?? teamRef.current)?.getBoundingClientRect();
      to = rect ? { left: rect.left + 20, top: rect.top + 48, width: 240 } : { left: 0, top: 0, width: 240 };
    }

    // Laid out at the real card's width so it lands at scale 1 and cross-fades onto an identical card.
    const width = Math.round(to.width);
    ghost.style.width = `${width}px`;
    const height = ghost.offsetHeight;
    const s0 = 0.5;
    const s1 = to.width / width;
    const x0 = flight.from.left + flight.from.width / 2 - (width * s0) / 2;
    const y0 = flight.from.top + flight.from.height * 0.42 - (height * s0) / 2;
    const x1 = to.left;
    const y1 = to.top;
    // A gentle arc: the control point sits between the two, lifted above both.
    const cx = (x0 + x1) / 2;
    const cy = Math.min(y0, y1) - 110;

    const frames: Keyframe[] = [];
    const n = 24;
    for (let i = 0; i <= n; i++) {
      const t = easeInOut(i / n);
      const x = (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * cx + t * t * x1;
      const y = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * cy + t * t * y1;
      const scale = s0 + (s1 - s0) * t;
      const rotate = -5 * (1 - t) + 3 * Math.sin(Math.PI * t);
      frames.push({
        offset: (i / n) * LAND_AT,
        transform: `translate(${x}px, ${y}px) rotate(${rotate}deg) scale(${scale})`,
        opacity: i === 0 ? 0 : 1,
      });
    }
    // On the tablet: hand over to the real card.
    frames.push({ offset: 1, transform: `translate(${x1}px, ${y1}px) scale(${s1})`, opacity: 0 });

    const animation = ghost.animate(frames, { duration: FLIGHT_MS, easing: "linear", fill: "both" });
    animation.onfinish = () => setFlight(null);
    return () => animation.cancel();
  }, [flight]);

  const guestOrder = state.guestOrderId ? state.orders.find((o) => o.id === state.guestOrderId) : undefined;
  const guestStation: Station | null = guestOrder ? (guestOrder.status.virtuve ? "virtuve" : "baras") : null;

  const activeStep =
    phase.screen === "done" ? 4 : phase.screen === "cart" || phase.screen === "paying" ? 2 : 1;

  const counts: Record<TeamTab, number> = {
    virtuve: state.orders.filter((o) => o.status.virtuve && o.status.virtuve !== "paruosta").length,
    baras: state.orders.filter((o) => o.status.baras && o.status.baras !== "paruosta").length,
    personalas: state.orders.reduce(
      (n, o) =>
        n +
        (["virtuve", "baras"] as Station[]).filter((s) => o.status[s] === "paruosta" && !o.delivered[s]).length +
        (o.payment === "grynieji" && !o.paid ? 1 : 0),
      0,
    ),
  };

  const currentTeam: TeamTab = view === "svecias" ? teamTab : view;

  const selectView = (v: View) => {
    setView(v);
    if (v !== "svecias") setTeamTab(v);
  };

  const controlClass =
    "inline-flex h-11 items-center gap-2 rounded-full px-4 text-ink-2 transition select-none hover:bg-paper-2 hover:text-ink active:scale-[0.97]";

  return (
    <div>
      {/* Steps + device tabs. Sticky on phones so the progress stays in view while tapping. */}
      <div className="sticky top-14 z-30 -mx-4 border-b border-line bg-paper px-4 pt-3 sm:-mx-6 sm:px-6 lg:static lg:mx-0 lg:border-0 lg:bg-transparent lg:p-0">
        <ol className="grid grid-cols-4 gap-1.5 sm:gap-2" aria-label="Užsakymo eiga">
          {steps.map((label, i) => {
            const done = i < activeStep;
            const currentStep = i === activeStep;
            return (
              <li key={label} aria-current={currentStep ? "step" : undefined}>
                <span aria-hidden="true" className="block h-1 overflow-hidden rounded-full bg-line">
                  <span
                    className={`block h-full origin-left rounded-full transition-[transform,background-color] duration-500 ease-out ${
                      done || currentStep ? "scale-x-100" : "scale-x-0"
                    } ${done ? "bg-ink" : "bg-tomato"}`}
                  />
                </span>
                <span
                  className={`mt-1.5 block text-[12px] leading-tight transition-colors duration-300 min-[400px]:text-[13px] sm:text-[15px] ${
                    currentStep ? "font-semibold text-ink" : done ? "font-medium text-ink" : "text-ink-2"
                  }`}
                >
                  {done && <span className="sr-only">Atlikta: </span>}
                  {label}
                </span>
              </li>
            );
          })}
        </ol>

        <div
          role="tablist"
          aria-label="Ekranai"
          onKeyDown={(e) => arrowNav(e, views, view, selectView, "view-tab")}
          className="no-scrollbar -mx-1.5 mt-1.5 flex justify-between overflow-x-auto lg:hidden"
        >
          {views.map((v) => {
            const selected = view === v;
            const fresh = v !== "svecias" && highlightId !== null && v === teamTab && !selected;
            return (
              <button
                key={v}
                id={`view-tab-${v}`}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={v === "svecias" ? "demo-phone" : "demo-team"}
                tabIndex={selected ? 0 : -1}
                onClick={() => {
                  playSound("tap");
                  selectView(v);
                }}
                className={`relative min-h-11 shrink-0 px-1.5 text-[13px] font-semibold whitespace-nowrap transition-colors duration-200 select-none min-[400px]:px-2 min-[400px]:text-[14px] sm:text-[15px] ${
                  selected ? "text-ink" : "text-ink-2 active:text-ink"
                }`}
              >
                {viewLabels[v]}
                {fresh && (
                  <span aria-hidden="true" className="absolute top-2.5 right-0 size-1.5 animate-pop rounded-full bg-tomato" />
                )}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-1.5 -bottom-px h-0.5 origin-center rounded-full bg-ink transition-transform duration-250 ease-out min-[400px]:inset-x-2 ${
                    selected ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      <div
        ref={devicesRef}
        className="mt-6 grid scroll-mt-44 grid-cols-1 items-start gap-10 lg:mt-12 lg:grid-cols-[370px_minmax(0,1fr)] lg:gap-14"
      >
        <div id="demo-phone" role="tabpanel" aria-labelledby="view-tab-svecias" className={view === "svecias" ? "" : "max-lg:hidden"}>
          <GuestPhone ref={phoneRef} state={state} dispatch={dispatch} onScreenChange={onScreenChange} onSubmit={onSubmit} />
          {guestStation && (
            <button
              type="button"
              onClick={() => {
                playSound("tap");
                showStation(guestStation);
              }}
              className="mx-auto mt-4 flex min-h-11 animate-fade-in items-center gap-1.5 rounded-full px-4 font-semibold text-ink transition select-none active:scale-[0.97] lg:hidden"
            >
              Žiūrėti komandos ekranus
              <svg viewBox="0 0 16 16" className="size-4" fill="none" aria-hidden="true">
                <path d="M3 8h9.5M8.5 4l4 4-4 4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
        </div>

        {/* The team tablet: same bezel as the phone, a dark kitchen display inside. */}
        <div
          id="demo-team"
          role="tabpanel"
          aria-labelledby={`view-tab-${currentTeam}`}
          ref={teamRef}
          className={`rounded-[1.75rem] bg-[#2a2826] p-[2px] shadow-[0_50px_90px_-40px_rgb(0_0_0/0.65),inset_0_1px_0_rgb(255_255_255/0.18)] lg:rounded-[2.1rem] lg:p-[3px] ${
            view === "svecias" ? "max-lg:hidden" : ""
          }`}
        >
          <div className="rounded-[calc(1.75rem-2px)] bg-black p-2 lg:rounded-[calc(2.1rem-3px)] lg:p-3">
            <div className="flex flex-col overflow-hidden rounded-[1.2rem] bg-kds text-kds-text lg:h-[636px]">
              <TabletStatus />

              <div className="flex h-[60px] shrink-0 items-center justify-between gap-3 border-b border-kds-line px-3 sm:px-4">
                <div
                  role="tablist"
                  aria-label="Komandos planšetės"
                  onKeyDown={(e) => arrowNav(e, teamTabs, teamTab, setTeamTab, "team-tab")}
                  className="flex gap-0.5 rounded-xl bg-kds-2 p-[3px] max-lg:hidden"
                >
                  {teamTabs.map((t) => {
                    const selected = teamTab === t;
                    return (
                      <button
                        key={t}
                        id={`team-tab-${t}`}
                        type="button"
                        role="tab"
                        aria-selected={selected}
                        aria-controls="demo-team-panel"
                        tabIndex={selected ? 0 : -1}
                        onClick={() => {
                          playSound("tap");
                          setTeamTab(t);
                        }}
                        className={`inline-flex h-10 items-center justify-center gap-2 rounded-[9px] px-3.5 text-[15px] xl:px-4 font-semibold transition select-none active:scale-[0.97] ${
                          selected ? "bg-kds-line text-kds-text" : "text-kds-muted hover:text-kds-text"
                        }`}
                      >
                        {viewLabels[t]}
                        <span
                          key={counts[t]}
                          className={`min-w-[1ch] animate-bump text-[14px] font-medium tabular-nums ${
                            selected ? "text-kds-text/70" : "text-kds-muted"
                          }`}
                        >
                          {counts[t] > 0 ? counts[t] : ""}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <p className="flex items-baseline gap-2 pl-1 lg:hidden">
                  <span className="text-[19px] font-semibold tracking-[-0.01em]">{viewLabels[currentTeam]}</span>
                  {counts[currentTeam] > 0 && (
                    <span key={counts[currentTeam]} className="animate-bump text-[15px] text-kds-muted tabular-nums">
                      {counts[currentTeam]}
                    </span>
                  )}
                </p>

                <div className="flex items-center gap-0.5">
                  <span
                    key={ring}
                    aria-hidden="true"
                    onAnimationEnd={() => setRinging(false)}
                    className={`flex size-10 origin-[50%_25%] items-center justify-center transition-colors duration-300 ${
                      ring > 0 ? "animate-ring" : ""
                    } ${ringing ? "text-tomato-bright" : "text-kds-muted"}`}
                  >
                    <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 16V11a6 6 0 1 1 12 0v5l1.5 2h-15z" />
                      <path d="M10 20.5a2 2 0 0 0 4 0" />
                    </svg>
                  </span>
                  {/* On a 1024 px screen the tabs need the room, so the word shows from xl up. */}
                  <SoundToggle tone="dark" labelClass="max-sm:sr-only lg:max-xl:sr-only" />
                </div>
              </div>

              {/*
                Desktop: the phone is 666 px tall outside. The tablet matches it: 15 px bezel each
                side, 28 px status row, 60 px header, 548 px panel (536 px of screen below pt-3).
              */}
              <div id="demo-team-panel" className="min-h-[420px] pt-3 lg:h-[548px] lg:min-h-0 lg:[--team-screen-h:536px]">
                {currentTeam === "personalas" ? (
                  <StaffBoard state={state} now={now} dispatch={dispatch} announce={announce} />
                ) : (
                  <StationRail
                    station={currentTeam}
                    state={state}
                    now={now}
                    highlightId={flight && landedId !== flight.orderId ? null : highlightId}
                    dispatch={dispatch}
                    announce={announce}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Demo-only controls, kept outside the devices. */}
      <div
        role="group"
        aria-label="Demonstracijos valdymas"
        className="mt-8 flex flex-wrap items-center justify-center gap-x-1 gap-y-1 text-[15px] lg:mt-12"
      >
        <label className="relative inline-flex h-11 items-center rounded-full pl-4 text-ink-2 transition-colors hover:bg-paper-2 hover:text-ink has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-tomato-bright has-[:focus-visible]:outline-solid">
          Svečio staliukas
          <select
            value={state.table}
            onChange={(e) => {
              playSound("tap");
              dispatch({ type: "setTable", table: Number(e.target.value) });
            }}
            className="h-11 cursor-pointer appearance-none rounded-full bg-transparent pr-9 pl-1.5 font-semibold text-ink tabular-nums focus-visible:outline-none"
          >
            {tables.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <svg viewBox="0 0 16 16" className="pointer-events-none absolute right-3.5 size-3.5" fill="none" aria-hidden="true">
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </label>

        <span aria-hidden="true" className="h-5 w-px bg-line max-sm:hidden" />

        <button
          type="button"
          onClick={() => {
            const id = state.nextId;
            dispatch({ type: "addExtra", at: clock() });
            setNow(clock());
            ringBell();
            announce(`Naujas užsakymas ${formatOrderNumber(id)} iš kito staliuko.`);
          }}
          className={controlClass}
        >
          <svg viewBox="0 0 16 16" className="size-4" fill="none" aria-hidden="true">
            <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          Užsakymas iš kito staliuko
        </button>

        <span aria-hidden="true" className="h-5 w-px bg-line max-sm:hidden" />

        <button
          type="button"
          onClick={() => {
            playSound("tap");
            dispatch({ type: "reset", at: clock() });
            setHighlightId(null);
            setFlight(null);
            setView("svecias");
            setTeamTab("virtuve");
            announce("Demonstracija pradėta iš naujo.");
          }}
          className={controlClass}
        >
          <svg viewBox="0 0 16 16" className="size-4" fill="none" aria-hidden="true">
            <path
              d="M3.2 8a4.8 4.8 0 1 0 1.5-3.5M3 2.5v3h3"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Pradėti iš naujo
        </button>

        {/* On phones the tablet (and its sound switch) is hidden while the guest phone is shown. */}
        <span aria-hidden="true" className="h-5 w-px bg-line max-sm:hidden lg:hidden" />
        <SoundToggle tone="light" className="lg:hidden" />
      </div>

      {flight &&
        createPortal(
          <div
            ref={ghostRef}
            aria-hidden="true"
            className="pointer-events-none fixed top-0 left-0 z-50 origin-top-left rounded-xl shadow-[0_22px_44px_-16px_rgb(0_0_0/0.55)]"
            style={{ transform: "translate(-9999px, 0)", width: 240 }}
          >
            {/* Same props as the kitchen card it turns into (see StationRail), so the hand-over is seamless. */}
            <Ticket
              orderId={flight.orderId}
              table={flight.table}
              station={viewLabels[flight.station]}
              time="0:00"
              lines={flight.lines}
              payment={flight.payment === "kortele" ? "Apmokėta" : "Grynaisiais"}
              status={{ label: "Naujas", tone: "new" }}
              className="w-full"
            >
              {/* A look-alike of the card's action button; not a real button, so it stays out of the accessibility tree and tab order. */}
              <span className="flex h-12 w-full items-center justify-center rounded-lg bg-ink text-[15px] font-semibold text-slip">
                Pradėti ruošti
              </span>
            </Ticket>
          </div>,
          document.body,
        )}

      <p role="status" aria-live="polite" className="sr-only">
        {message}
      </p>
    </div>
  );
}
