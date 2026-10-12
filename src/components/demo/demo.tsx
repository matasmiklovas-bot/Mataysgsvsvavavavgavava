"use client";

import { useCallback, useEffect, useLayoutEffect, useReducer, useRef, useState, type KeyboardEvent } from "react";
import { formatOrderNumber, getItem, tables, type Station } from "@/lib/data";
import { GuestPhone, type PhoneScreen } from "./guest-phone";
import { StaffBoard, StationRail } from "./team-screens";
import { cartLines, demoReducer, initialDemoState, type Payment } from "./store";

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

type Flight = { from: DOMRect; to: DOMRect; orderId: number };

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

export function Demo() {
  const [state, dispatch] = useReducer(demoReducer, initialDemoState);
  const [view, setView] = useState<View>("svecias");
  const [teamTab, setTeamTab] = useState<TeamTab>("virtuve");
  const [phase, setPhase] = useState<{ screen: PhoneScreen; hasItems: boolean }>({ screen: "menu", hasItems: false });
  const [highlightId, setHighlightId] = useState<number | null>(null);
  const [now, setNow] = useState(0);
  const [message, setMessage] = useState("");
  const [flight, setFlight] = useState<Flight | null>(null);

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

  const announce = useCallback((text: string) => {
    setMessage("");
    window.setTimeout(() => setMessage(text), 30);
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
      if (wide && !reduce && phoneRef.current && teamRef.current) {
        setFlight({
          from: phoneRef.current.getBoundingClientRect(),
          to: teamRef.current.getBoundingClientRect(),
          orderId: id,
        });
      }
      if (!wide) {
        // On phones the guest sees the confirmation first, then the screen where the order landed.
        timers.current.push(window.setTimeout(() => showStation(target), 1500));
      }
    },
    [state.cart, state.nextId, announce, showStation],
  );

  // Fly a small ticket from the phone to the start of the rail (desktop only).
  useLayoutEffect(() => {
    const ghost = ghostRef.current;
    if (!flight || !ghost) return;
    const startX = flight.from.left + flight.from.width / 2 - 110;
    const startY = flight.from.top + flight.from.height * 0.45;
    const endX = flight.to.left + 20;
    const endY = flight.to.top + 110;
    const animation = ghost.animate(
      [
        { transform: `translate(${startX}px, ${startY}px) scale(0.6) rotate(-6deg)`, opacity: 0 },
        { opacity: 1, offset: 0.15 },
        { transform: `translate(${endX}px, ${endY}px) scale(1) rotate(0deg)`, opacity: 1 },
      ],
      { duration: 750, easing: "cubic-bezier(0.3, 0.7, 0.2, 1)" },
    );
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

  return (
    <div>
      {/* Steps + device tabs. Sticky on phones so the progress stays in view while tapping. */}
      <div className="sticky top-16 z-30 -mx-4 border-b border-line bg-paper-2/95 px-4 pt-3 pb-2 backdrop-blur-sm sm:-mx-6 sm:px-6 lg:static lg:mx-0 lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
        <ol className="grid grid-cols-4 gap-2" aria-label="Užsakymo eiga">
          {steps.map((label, i) => {
            const done = i < activeStep;
            const currentStep = i === activeStep;
            return (
              <li key={label} aria-current={currentStep ? "step" : undefined}>
                <span
                  className={`block h-1.5 rounded-full transition-colors duration-500 ${
                    done ? "bg-ink" : currentStep ? "bg-tomato" : "bg-line"
                  }`}
                />
                <span
                  className={`mt-1.5 block text-[13px] leading-tight sm:text-[15px] ${
                    done || currentStep ? "font-semibold text-ink" : "text-ink-2"
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
          onKeyDown={(e) => arrowNav(e, views, view, setView, "view-tab")}
          className="no-scrollbar mt-3 -mb-2 flex gap-1 overflow-x-auto lg:hidden"
        >
          {views.map((v) => {
            const selected = view === v;
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
                  setView(v);
                  if (v !== "svecias") setTeamTab(v);
                }}
                className={`relative min-h-11 shrink-0 px-2 text-[14px] font-semibold whitespace-nowrap min-[400px]:px-2.5 min-[400px]:text-[15px] ${
                  selected ? "text-ink" : "text-ink-2"
                }`}
              >
                {viewLabels[v]}
                {v !== "svecias" && highlightId && v === teamTab && !selected && (
                  <span className="absolute top-2 right-0.5 size-2 rounded-full bg-tomato" aria-label="naujas užsakymas" />
                )}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-2 bottom-0 h-[3px] rounded-full ${selected ? "bg-tomato" : "bg-transparent"}`}
                />
              </button>
            );
          })}
        </div>
      </div>

      <div ref={devicesRef} className="mt-6 grid scroll-mt-40 grid-cols-1 items-start gap-8 lg:mt-8 lg:grid-cols-[370px_minmax(0,1fr)]">
        <div id="demo-phone" role="tabpanel" aria-labelledby="view-tab-svecias" className={view === "svecias" ? "" : "max-lg:hidden"}>
          <GuestPhone ref={phoneRef} state={state} dispatch={dispatch} onScreenChange={onScreenChange} onSubmit={onSubmit} />
          {guestStation && (
            <button
              type="button"
              onClick={() => showStation(guestStation)}
              className="mx-auto mt-4 flex min-h-11 items-center font-semibold underline underline-offset-4 lg:hidden"
            >
              Žiūrėti komandos ekranus →
            </button>
          )}
        </div>

        <div
          id="demo-team"
          role="tabpanel"
          aria-labelledby={`view-tab-${currentTeam}`}
          ref={teamRef}
          className={`overflow-hidden rounded-xl bg-kds text-kds-text ${view === "svecias" ? "max-lg:hidden" : ""}`}
        >
          <div className="flex items-center justify-between gap-3 border-b border-kds-line px-4 py-3 sm:px-5">
            <div
              role="tablist"
              aria-label="Komandos planšetės"
              onKeyDown={(e) => arrowNav(e, teamTabs, teamTab, setTeamTab, "team-tab")}
              className="flex gap-1 max-lg:hidden"
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
                    onClick={() => setTeamTab(t)}
                    className={`min-h-11 rounded-md px-3.5 text-[15px] font-semibold ${
                      selected ? "bg-slip text-ink" : "text-kds-muted hover:text-kds-text"
                    }`}
                  >
                    {viewLabels[t]}
                    {counts[t] > 0 && <span className="ml-1.5 tabular-nums opacity-70">{counts[t]}</span>}
                  </button>
                );
              })}
            </div>
            <p className="font-display text-[1.3rem] font-bold lg:hidden">{viewLabels[currentTeam]}</p>
            <p className="text-[14px] text-kds-muted">Planšetė</p>
          </div>

          <div id="demo-team-panel" className="min-h-[420px] pt-4">
            {currentTeam === "personalas" ? (
              <StaffBoard state={state} now={now} dispatch={dispatch} announce={announce} />
            ) : (
              <StationRail
                station={currentTeam}
                state={state}
                now={now}
                highlightId={flight ? null : highlightId}
                dispatch={dispatch}
                announce={announce}
              />
            )}
          </div>
        </div>
      </div>

      {/* Demo-only controls, kept outside the devices. */}
      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-line pt-4 text-[16px] text-ink-2">
        <span className="font-semibold text-ink">Demonstracijos valdymas</span>
        <label className="flex min-h-11 items-center gap-2">
          Svečio staliukas
          <select
            value={state.table}
            onChange={(e) => dispatch({ type: "setTable", table: Number(e.target.value) })}
            className="h-10 rounded border border-line bg-paper px-2 text-ink"
          >
            {tables.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          onClick={() => {
            const id = state.nextId;
            dispatch({ type: "addExtra", at: clock() });
            setNow(clock());
            announce(`Naujas užsakymas ${formatOrderNumber(id)} iš kito staliuko.`);
          }}
          className="min-h-11 underline underline-offset-4 hover:text-ink"
        >
          Pridėti užsakymą iš kito staliuko
        </button>
        <button
          type="button"
          onClick={() => {
            dispatch({ type: "reset", at: clock() });
            setHighlightId(null);
            setView("svecias");
            setTeamTab("virtuve");
            announce("Demonstracija pradėta iš naujo.");
          }}
          className="min-h-11 underline underline-offset-4 hover:text-ink"
        >
          Pradėti iš naujo
        </button>
      </div>

      {flight && (
        <div
          ref={ghostRef}
          aria-hidden="true"
          className="pointer-events-none fixed top-0 left-0 z-50 w-[220px]"
          style={{ transform: `translate(-9999px, 0)` }}
        >
          <div className="slip px-4 pt-3 text-[13px] font-semibold shadow-xl">
            {formatOrderNumber(flight.orderId)} · Staliukas {state.table}
          </div>
        </div>
      )}

      <p role="status" aria-live="polite" className="sr-only">
        {message}
      </p>
    </div>
  );
}
