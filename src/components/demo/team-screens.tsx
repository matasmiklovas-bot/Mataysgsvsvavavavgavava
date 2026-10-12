"use client";

import type { Dispatch } from "react";
import { formatOrderNumber, formatPrice, getItem, linesTotal, type Station } from "@/lib/data";
import { Ticket } from "@/components/ticket";
import { linesForStation, type DemoAction, type DemoState, type Order, type TicketStatus } from "./store";

export function ageLabel(placedAt: number, now: number): { text: string; late: boolean } {
  const minutes = Math.max(0, Math.floor((now - placedAt) / 60_000));
  if (minutes < 1) return { text: "ką tik", late: false };
  return { text: `prieš ${minutes} min.`, late: minutes >= 10 };
}

const ticketStatus: Record<TicketStatus, { label: string; tone: "new" | "cooking" | "ready" }> = {
  naujas: { label: "Naujas", tone: "new" },
  ruosiama: { label: "Ruošiama", tone: "cooking" },
  paruosta: { label: "Paruošta", tone: "ready" },
};

const stationName: Record<Station, string> = { virtuve: "Virtuvė", baras: "Baras" };

type StationRailProps = {
  station: Station;
  state: DemoState;
  now: number;
  highlightId: number | null;
  dispatch: Dispatch<DemoAction>;
  announce: (text: string) => void;
};

/** Kitchen or bar display: paper tickets hanging on a rail, newest first. */
export function StationRail({ station, state, now, highlightId, dispatch, announce }: StationRailProps) {
  const tickets = state.orders.filter((order) => order.status[station] && !order.delivered[station]);
  const active = tickets.filter((order) => order.status[station] !== "paruosta").length;

  return (
    <div>
      <p className="px-4 text-[15px] text-kds-muted sm:px-5">
        {active === 0 ? "Visi užsakymai paruošti." : `Ruošti: ${active}`}
      </p>
      <div className="relative mt-3">
        <div
          aria-hidden="true"
          className="mx-4 h-2 rounded-full bg-[#8f8a80] shadow-[0_4px_10px_-4px_rgb(0_0_0/0.9)] sm:mx-5"
        />
        <ul className="no-scrollbar -mt-1 flex snap-x gap-4 overflow-x-auto overscroll-x-contain px-4 pt-0 pb-5 sm:px-5">
          {tickets.map((order) => {
            const status = order.status[station]!;
            const age = ageLabel(order.placedAt, now);
            const isNew = order.id === highlightId;
            return (
              <li
                key={order.id}
                className={`w-[232px] shrink-0 snap-start ${isNew ? "animate-ticket-in" : ""}`}
              >
                <Ticket
                  orderId={order.id}
                  table={order.table}
                  station={stationName[station]}
                  time={age.text}
                  late={age.late}
                  lines={linesForStation(order.lines, station)}
                  payment={order.payment === "kortele" ? "Apmokėta" : "Grynaisiais"}
                  status={ticketStatus[status]}
                  className={`${status === "paruosta" ? "opacity-70" : ""} ${isNew ? "animate-flash" : ""}`}
                />
                {status !== "paruosta" ? (
                  <button
                    type="button"
                    onClick={() => {
                      dispatch({ type: "advance", orderId: order.id, station });
                      announce(
                        `${stationName[station]}, ${formatOrderNumber(order.id)}: ${
                          status === "naujas" ? "ruošiama" : "paruošta"
                        }.`,
                      );
                    }}
                    className={`mt-2 h-11 w-full rounded-md text-[15px] font-semibold transition-colors ${
                      status === "naujas"
                        ? "bg-slip text-ink hover:bg-white"
                        : "bg-ready text-white hover:bg-[#256a42]"
                    }`}
                  >
                    {status === "naujas" ? "Pradėti ruošti" : "Paruošta"}
                  </button>
                ) : (
                  <p className="mt-2 flex h-11 items-center justify-center text-[14px] text-kds-muted">
                    Laukia padavėjo
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

/** Floor staff tablet: what to carry where, and which tables pay in cash. */
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
    for (const station of ["virtuve", "baras"] as Station[]) {
      if (order.status[station] === "paruosta" && !order.delivered[station]) toCarry.push({ order, station });
    }
  }
  // TODO: patikrinti, ar tikroje sistemoje personalui taip rodomi grynųjų atsiskaitymai.
  const cash = state.orders.filter((order) => order.payment === "grynieji" && !order.paid);
  const cooking = state.orders.filter((order) =>
    (Object.keys(order.status) as Station[]).some((s) => order.status[s] !== "paruosta"),
  );

  return (
    <div className="space-y-6 px-4 pb-5 sm:px-5">
      <StaffGroup title="Nešti dabar" empty="Šiuo metu nieko nešti nereikia.">
        {toCarry.map(({ order, station }) => (
          <li key={`${order.id}-${station}`} className="flex items-center gap-3 rounded-md bg-kds-2 p-3">
            <TableBadge table={order.table} />
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-kds-text">Nešti į staliuką {order.table}</p>
              <p className="text-[14px] text-kds-muted">
                {linesForStation(order.lines, station)
                  .map((line) => `${line.quantity}× ${getItem(line.itemId).name}`)
                  .join(", ")}
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                dispatch({ type: "deliver", orderId: order.id, station });
                announce(`Staliukas ${order.table}: nunešta.`);
              }}
              className="h-11 shrink-0 rounded-md bg-ready px-3.5 text-[15px] font-semibold text-white hover:bg-[#256a42]"
            >
              Nunešta
            </button>
          </li>
        ))}
      </StaffGroup>

      <StaffGroup title="Grynieji" empty="Visi atsiskaitė.">
        {cash.map((order) => (
          <li key={order.id} className="flex items-center gap-3 rounded-md bg-kds-2 p-3">
            <TableBadge table={order.table} />
            <p className="min-w-0 flex-1 font-semibold text-kds-text">
              Staliukas {order.table} mokės grynaisiais ·{" "}
              <span className="tabular-nums">{formatPrice(linesTotal(order.lines))}</span>
            </p>
            <button
              type="button"
              onClick={() => {
                dispatch({ type: "markPaid", orderId: order.id });
                announce(`Staliukas ${order.table}: atsiskaityta.`);
              }}
              className="h-11 shrink-0 rounded-md border border-kds-line px-3.5 text-[15px] font-semibold text-kds-text hover:bg-kds-line"
            >
              Atsiskaityta
            </button>
          </li>
        ))}
      </StaffGroup>

      <StaffGroup title="Ruošiama" empty="Nieko neruošiama.">
        {cooking.map((order) => (
          <li key={order.id} className="flex items-center gap-3 rounded-md border border-kds-line p-3">
            <TableBadge table={order.table} />
            <p className="min-w-0 flex-1 text-[15px] text-kds-text">
              {formatOrderNumber(order.id)} · {ageLabel(order.placedAt, now).text}
            </p>
          </li>
        ))}
      </StaffGroup>
    </div>
  );
}

function StaffGroup({ title, empty, children }: { title: string; empty: string; children: React.ReactNode[] }) {
  return (
    <section>
      <h4 className="text-[15px] font-semibold text-kds-muted">{title}</h4>
      {children.length > 0 ? (
        <ul className="mt-2 space-y-2">{children}</ul>
      ) : (
        <p className="mt-2 text-[15px] text-kds-muted">{empty}</p>
      )}
    </section>
  );
}

function TableBadge({ table }: { table: number }) {
  return (
    <span className="flex size-11 shrink-0 items-center justify-center rounded bg-slip font-display text-[1.5rem] font-semibold text-ink">
      {table}
    </span>
  );
}
