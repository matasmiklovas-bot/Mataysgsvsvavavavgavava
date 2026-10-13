import { formatOrderNumber, getItem, type OrderLine } from "@/lib/data";

type TicketProps = {
  orderId: number;
  table: number;
  station: string;
  time: string;
  /** Show the time in the "waiting too long" colour. */
  late?: boolean;
  lines: OrderLine[];
  payment?: "Apmokėta" | "Grynaisiais";
  status?: { label: string; tone: "new" | "cooking" | "ready" };
  className?: string;
  /** Smaller type for tickets inside device mock-ups. */
  compact?: boolean;
};

const statusTone = {
  new: "border-tomato text-tomato-dark",
  cooking: "border-[#8a5a12] text-[#7a4f0f]",
  ready: "border-ready text-ready",
};

/** A kitchen ticket as it appears on the rail. Shared by the hero, the demo and the team section. */
export function Ticket({ orderId, table, station, time, late, lines, payment, status, className = "", compact = false }: TicketProps) {
  return (
    <div
      className={`slip leading-[1.5] shadow-[0_14px_24px_-14px_rgb(0_0_0/0.55)] ${
        compact ? "px-3 pt-3 text-[11.5px]" : "px-4 pt-3.5 text-[13px]"
      } ${className}`}
    >
      <div className="flex items-baseline justify-between gap-3 font-semibold tracking-wide">
        <span>{station.toUpperCase()}</span>
        <span>{formatOrderNumber(orderId)}</span>
      </div>
      <div className="flex items-baseline justify-between gap-3 text-ink-2">
        <span>Staliukas {table}</span>
        <span className={late ? "font-semibold text-[#8a5a12]" : ""}>{time}</span>
      </div>
      <div className="my-2.5 border-t border-dashed border-ink/35" />
      <ul className="space-y-1">
        {lines.map((line) => (
          <li key={line.itemId}>
            <span className="font-semibold">{line.quantity}×</span> {getItem(line.itemId).name}
            {line.notes.map((note) => (
              <span
                key={note}
                className="mt-0.5 ml-5 block w-fit bg-tomato/12 px-1 font-semibold text-tomato-dark uppercase"
              >
                {note}
              </span>
            ))}
          </li>
        ))}
      </ul>
      {(payment || status) && (
        <>
          <div className="my-2.5 border-t border-dashed border-ink/35" />
          <div className="flex items-center justify-between gap-2">
            <span className="text-[13px] text-ink-2 uppercase">{payment}</span>
            {status && (
              <span
                key={status.label}
                className={`animate-stamp border-2 px-1.5 text-[12.5px] font-semibold tracking-[0.1em] uppercase ${statusTone[status.tone]}`}
              >
                {status.label}
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}
