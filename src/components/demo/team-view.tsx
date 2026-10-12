"use client";

import { useRef, type Dispatch, type KeyboardEvent } from "react";
import { Banknote, ChefHat, ConciergeBell, CreditCard, Inbox, RotateCcw, Sparkles, Wine } from "lucide-react";
import { formatPrice, stationLabels, type Station } from "@/lib/menu";
import {
  formatOrderNumber,
  formatTime,
  getItem,
  linesForStation,
  linesTotal,
  paymentLabels,
  statusLabels,
  type DemoAction,
  type DemoOrder,
  type DemoState,
  type TicketStatus,
} from "./store";

export type TeamTab = Station | "personalas";

const tabs: { id: TeamTab; label: string; icon: typeof ChefHat }[] = [
  { id: "virtuve", label: "Virtuvė", icon: ChefHat },
  { id: "baras", label: "Baras", icon: Wine },
  { id: "personalas", label: "Personalas", icon: ConciergeBell },
];

const statusTone: Record<TicketStatus, string> = {
  nauja: "bg-white/10 text-fg",
  ruosiama: "bg-amber-400/15 text-amber-300",
  paruosta: "bg-emerald-400/15 text-emerald-300",
};

const actionLabel: Partial<Record<TicketStatus, string>> = {
  nauja: "Pradėti ruošti",
  ruosiama: "Pažymėti paruoštu",
};

type TeamViewProps = {
  state: DemoState;
  dispatch: Dispatch<DemoAction>;
  tab: TeamTab;
  onTabChange: (tab: TeamTab) => void;
  announce: (message: string) => void;
};

export function TeamView({ state, dispatch, tab, onTabChange, announce }: TeamViewProps) {
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const openCount = (station: Station) =>
    state.orders.filter((order) => {
      const status = order.stations[station];
      return status && status !== "paruosta";
    }).length;

  function onTabKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const index = tabs.findIndex((t) => t.id === tab);
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
    else if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = tabs.length - 1;
    else return;
    event.preventDefault();
    onTabChange(tabs[next].id);
    tabRefs.current[tabs[next].id]?.focus();
  }

  return (
    <div className="panel flex min-h-[460px] flex-col overflow-hidden rounded-3xl">
      {/* Tablet top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] px-4 py-3 sm:px-5">
        <div
          role="tablist"
          aria-label="Komandos ekranai"
          onKeyDown={onTabKeyDown}
          className="flex gap-1 rounded-full bg-white/[0.05] p-1"
        >
          {tabs.map(({ id, label, icon: Icon }) => {
            const selected = tab === id;
            const badge = id === "personalas" ? state.orders.filter((o) => !o.served).length : openCount(id);
            return (
              <button
                key={id}
                ref={(node) => {
                  tabRefs.current[id] = node;
                }}
                id={`tab-${id}`}
                role="tab"
                type="button"
                aria-selected={selected}
                aria-controls={`panel-${id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => onTabChange(id)}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors sm:px-3.5 ${
                  selected ? "bg-white text-ink-950" : "text-fg-muted hover:text-fg"
                }`}
              >
                <Icon className="size-3.5" aria-hidden="true" />
                {label}
                {badge > 0 && (
                  <span
                    className={`ml-0.5 rounded-full px-1.5 text-[10.5px] ${
                      selected ? "bg-ink-950 text-white" : "bg-white/10 text-fg"
                    }`}
                  >
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => {
              dispatch({ type: "seed", createdAt: Date.now() });
              announce("Pridėti du pavyzdiniai užsakymai.");
            }}
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px] text-fg-muted transition-colors hover:bg-white/5 hover:text-fg"
          >
            <Sparkles className="size-3.5" aria-hidden="true" />
            Pavyzdiniai užsakymai
          </button>
          {state.orders.length > 0 && (
            <button
              type="button"
              onClick={() => {
                dispatch({ type: "reset" });
                announce("Demonstracija išvalyta.");
              }}
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px] text-fg-muted transition-colors hover:bg-white/5 hover:text-fg"
            >
              <RotateCcw className="size-3.5" aria-hidden="true" />
              Išvalyti
            </button>
          )}
        </div>
      </div>

      <div
        role="tabpanel"
        id={`panel-${tab}`}
        aria-labelledby={`tab-${tab}`}
        tabIndex={0}
        className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5"
      >
        {tab === "personalas" ? (
          <StaffPanel orders={state.orders} dispatch={dispatch} announce={announce} />
        ) : (
          <StationPanel station={tab} orders={state.orders} dispatch={dispatch} announce={announce} />
        )}
      </div>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="flex h-full min-h-[320px] flex-col items-center justify-center gap-3 text-center">
      <span className="flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
        <Inbox className="size-5 text-fg-subtle" aria-hidden="true" />
      </span>
      <p className="max-w-xs text-[14px] leading-relaxed text-fg-muted">{text}</p>
    </div>
  );
}

const ticketStamp: Record<TicketStatus, string> = {
  nauja: "border-paper-ink text-paper-ink",
  ruosiama: "border-amber-700 text-amber-800",
  paruosta: "border-emerald-700 text-emerald-800",
};

function StationPanel({
  station,
  orders,
  dispatch,
  announce,
}: {
  station: Station;
  orders: DemoOrder[];
  dispatch: Dispatch<DemoAction>;
  announce: (message: string) => void;
}) {
  const tickets = orders.filter((order) => order.stations[station]);
  if (tickets.length === 0) {
    return (
      <EmptyState
        text={
          station === "virtuve"
            ? "Virtuvei skirtų užsakymų nėra. Užsakykite patiekalų telefone arba įkelkite pavyzdinius užsakymus."
            : "Barui skirtų užsakymų nėra. Užsakykite gėrimų telefone arba įkelkite pavyzdinius užsakymus."
        }
      />
    );
  }

  return (
    <div>
      {/* Ticket rail, like the steel bar above a kitchen pass */}
      <div
        aria-hidden="true"
        className="h-2.5 rounded-full bg-gradient-to-b from-[#cfcfd4] via-[#8d8d95] to-[#55555d] shadow-[0_6px_14px_-6px_rgba(0,0,0,0.9)]"
      />
      <ul className="-mt-1 grid gap-x-4 gap-y-6 sm:grid-cols-2 xl:grid-cols-3">
        {tickets.map((order) => {
          const status = order.stations[station]!;
          const lines = linesForStation(order.lines, station);
          const action = actionLabel[status];
          return (
            <li key={order.id} className="flex flex-col">
              <div
                className={`ticket animate-print px-4 pt-4 text-[12.5px] leading-[1.6] transition-opacity ${
                  status === "paruosta" ? "opacity-60" : ""
                }`}
              >
                <div className="flex items-center justify-between font-semibold">
                  <span>{stationLabels[station].toUpperCase()}</span>
                  <span>{formatOrderNumber(order.id)}</span>
                </div>
                <div className="flex justify-between text-paper-muted">
                  <span>Stalas {order.table}</span>
                  <span>{formatTime(order.createdAt)}</span>
                </div>
                <div className="my-2.5 border-t border-dashed border-paper-ink/30" />
                <ul>
                  {lines.map((line) => (
                    <li key={line.itemId}>
                      {line.quantity}× {getItem(line.itemId).name}
                    </li>
                  ))}
                </ul>
                <p
                  className={`mt-3 inline-block -rotate-2 rounded border-[1.5px] px-1.5 text-[11px] font-semibold tracking-[0.12em] uppercase ${ticketStamp[status]}`}
                >
                  {statusLabels[status]}
                </p>
              </div>
              {action && (
                <button
                  type="button"
                  onClick={() => {
                    dispatch({ type: "advance", orderId: order.id, station });
                    announce(
                      `${stationLabels[station]}: užsakymas ${formatOrderNumber(order.id)} — ${
                        status === "nauja" ? "ruošiamas" : "paruoštas"
                      }.`,
                    );
                  }}
                  className="mt-2 h-10 rounded-full border border-white/10 text-[13.5px] font-medium text-fg transition-colors hover:border-transparent hover:bg-fg hover:text-ink-950"
                >
                  {action}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function StaffPanel({
  orders,
  dispatch,
  announce,
}: {
  orders: DemoOrder[];
  dispatch: Dispatch<DemoAction>;
  announce: (message: string) => void;
}) {
  if (orders.length === 0) {
    return (
      <EmptyState text="Čia personalas matys staliuko numerį, užsakymo būseną ir pasirinktą atsiskaitymo būdą." />
    );
  }

  return (
    <ul className="grid gap-3">
      {orders.map((order) => {
        const total = linesTotal(order.lines);
        const stations = Object.entries(order.stations) as [Station, TicketStatus][];
        const pending = stations
          .filter(([, status]) => status !== "paruosta")
          .map(([station]) => (station === "virtuve" ? "virtuvės" : "baro"));
        const allReady = pending.length === 0;
        const PaymentIcon = order.payment === "kortele" ? CreditCard : Banknote;
        return (
          <li
            key={order.id}
            className={`rounded-2xl border p-4 ${
              order.served ? "border-white/[0.05] bg-white/[0.02] opacity-70" : "border-white/10 bg-white/[0.04]"
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex size-12 flex-col items-center justify-center rounded-xl bg-paper text-paper-ink leading-none">
                  <span className="font-mono text-[9px] tracking-wider uppercase">Stalas</span>
                  <span className="mt-0.5 text-lg font-semibold">{order.table}</span>
                </span>
                <div>
                  <p className="text-[14px] font-medium">
                    Staliukas {order.table}{" "}
                    <span className="font-mono text-[12.5px] text-fg-subtle">
                      {formatOrderNumber(order.id)}
                    </span>
                  </p>
                  <p className="text-[12px] text-fg-subtle">
                    {formatTime(order.createdAt)} · {formatPrice(total)}
                  </p>
                </div>
              </div>
              <span
                className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-medium ${
                  order.paid ? "bg-emerald-400/15 text-emerald-300" : "bg-amber-400/15 text-amber-300"
                }`}
              >
                <PaymentIcon className="size-3.5" aria-hidden="true" />
                {paymentLabels[order.payment]} ·{" "}
                {order.paid
                  ? order.payment === "kortele"
                    ? "apmokėta (demo)"
                    : "apmokėta"
                  : "laukia apmokėjimo"}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {stations.map(([station, status]) => (
                <span
                  key={station}
                  className="flex items-center gap-1.5 rounded-full border border-white/10 px-2.5 py-1 text-[12px] text-fg-muted"
                >
                  {stationLabels[station]}:
                  <span className={`rounded-full px-1.5 text-[11px] font-medium ${statusTone[status]}`}>
                    {statusLabels[status]}
                  </span>
                </span>
              ))}
              {order.served && (
                <span className="rounded-full bg-white/10 px-2.5 py-1 text-[12px] text-fg">Patiekta</span>
              )}
            </div>

            {!order.served && (
              <div className="mt-4 flex flex-wrap gap-2">
                {!order.paid && (
                  <button
                    type="button"
                    onClick={() => {
                      dispatch({ type: "markPaid", orderId: order.id });
                      announce(`Staliukas ${order.table}: atsiskaitymas grynaisiais pažymėtas.`);
                    }}
                    className="h-9 rounded-full bg-white/[0.08] px-4 text-[13px] font-medium transition-colors hover:bg-white hover:text-ink-950"
                  >
                    Pažymėti apmokėtu
                  </button>
                )}
                <button
                  type="button"
                  disabled={!allReady}
                  onClick={() => {
                    dispatch({ type: "markServed", orderId: order.id });
                    announce(`Staliukas ${order.table}: užsakymas patiektas.`);
                  }}
                  className="h-9 rounded-full bg-white/[0.08] px-4 text-[13px] font-medium transition-colors enabled:hover:bg-white enabled:hover:text-ink-950 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {allReady ? "Pažymėti patiektu" : `Laukiama ${pending.join(" ir ")}`}
                </button>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
