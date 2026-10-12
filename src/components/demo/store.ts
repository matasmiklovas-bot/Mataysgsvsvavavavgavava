import {
  extraOrderTemplates,
  firstDemoOrderId,
  getItem,
  guestTable,
  menu,
  seedOrders,
  type OrderLine,
  type Station,
} from "@/lib/data";

export type Payment = "kortele" | "grynieji";
export type TicketStatus = "naujas" | "ruosiama" | "paruosta";
export type GuestStatus = "priimta" | "ruosiama" | "nesama" | "patiekta";

export type Order = {
  id: number;
  table: number;
  lines: OrderLine[];
  payment: Payment;
  paid: boolean;
  /** Milliseconds on the page clock (0 = page load). Seeded orders are negative. */
  placedAt: number;
  status: Partial<Record<Station, TicketStatus>>;
  delivered: Partial<Record<Station, boolean>>;
};

export type DemoState = {
  cart: Record<string, { quantity: number; notes: string[] }>;
  orders: Order[];
  nextId: number;
  table: number;
  guestOrderId: number | null;
  extraIndex: number;
};

export type DemoAction =
  | { type: "add"; itemId: string }
  | { type: "remove"; itemId: string }
  | { type: "toggleNote"; itemId: string; note: string }
  | { type: "submit"; payment: Payment; at: number }
  | { type: "advance"; orderId: number; station: Station }
  | { type: "deliver"; orderId: number; station: Station }
  | { type: "markPaid"; orderId: number }
  | { type: "setTable"; table: number }
  | { type: "addExtra"; at: number }
  | { type: "newGuestOrder" }
  | { type: "reset"; at: number };

function seeded(at: number): Order[] {
  return seedOrders.map((seed) => ({
    id: seed.id,
    table: seed.table,
    lines: seed.lines,
    payment: seed.payment,
    paid: seed.payment === "kortele",
    placedAt: at - seed.minutesAgo * 60_000,
    status: { ...seed.status },
    delivered: {},
  }));
}

export const initialDemoState: DemoState = {
  cart: {},
  orders: seeded(0).reverse(),
  nextId: firstDemoOrderId,
  table: guestTable,
  guestOrderId: null,
  extraIndex: 0,
};

export function cartLines(cart: DemoState["cart"]): OrderLine[] {
  return menu
    .filter((item) => (cart[item.id]?.quantity ?? 0) > 0)
    .map((item) => ({ itemId: item.id, quantity: cart[item.id].quantity, notes: cart[item.id].notes }));
}

export function linesForStation(lines: OrderLine[], station: Station): OrderLine[] {
  return lines.filter((line) => getItem(line.itemId).station === station);
}

function stationsOf(lines: OrderLine[]): Order["status"] {
  const status: Order["status"] = {};
  for (const line of lines) status[getItem(line.itemId).station] = "naujas";
  return status;
}

export function guestStatus(order: Order): GuestStatus {
  const stations = Object.keys(order.status) as Station[];
  if (stations.every((s) => order.delivered[s])) return "patiekta";
  if (stations.every((s) => order.status[s] === "paruosta")) return "nesama";
  if (stations.some((s) => order.status[s] !== "naujas")) return "ruosiama";
  return "priimta";
}

const nextStatus: Record<TicketStatus, TicketStatus> = {
  naujas: "ruosiama",
  ruosiama: "paruosta",
  paruosta: "paruosta",
};

function update(state: DemoState, id: number, fn: (order: Order) => Order): DemoState {
  return { ...state, orders: state.orders.map((order) => (order.id === id ? fn(order) : order)) };
}

export function demoReducer(state: DemoState, action: DemoAction): DemoState {
  switch (action.type) {
    case "add": {
      const current = state.cart[action.itemId] ?? { quantity: 0, notes: [] };
      return {
        ...state,
        cart: {
          ...state.cart,
          [action.itemId]: { ...current, quantity: Math.min(current.quantity + 1, 20) },
        },
      };
    }
    case "remove": {
      const current = state.cart[action.itemId];
      if (!current) return state;
      const cart = { ...state.cart };
      if (current.quantity <= 1) delete cart[action.itemId];
      else cart[action.itemId] = { ...current, quantity: current.quantity - 1 };
      return { ...state, cart };
    }
    case "toggleNote": {
      const current = state.cart[action.itemId];
      if (!current) return state;
      const notes = current.notes.includes(action.note)
        ? current.notes.filter((n) => n !== action.note)
        : [...current.notes, action.note];
      return { ...state, cart: { ...state.cart, [action.itemId]: { ...current, notes } } };
    }
    case "submit": {
      const lines = cartLines(state.cart);
      if (lines.length === 0) return state;
      const order: Order = {
        id: state.nextId,
        table: state.table,
        lines,
        payment: action.payment,
        paid: action.payment === "kortele",
        placedAt: action.at,
        status: stationsOf(lines),
        delivered: {},
      };
      return {
        ...state,
        cart: {},
        orders: [order, ...state.orders],
        nextId: state.nextId + 1,
        guestOrderId: order.id,
      };
    }
    case "advance":
      return update(state, action.orderId, (order) => {
        const current = order.status[action.station];
        if (!current) return order;
        return { ...order, status: { ...order.status, [action.station]: nextStatus[current] } };
      });
    case "deliver":
      return update(state, action.orderId, (order) => ({
        ...order,
        delivered: { ...order.delivered, [action.station]: true },
      }));
    case "markPaid":
      return update(state, action.orderId, (order) => ({ ...order, paid: true }));
    case "setTable":
      return { ...state, table: action.table };
    case "addExtra": {
      const template = extraOrderTemplates[state.extraIndex % extraOrderTemplates.length];
      const order: Order = {
        id: state.nextId,
        table: template.table,
        lines: template.lines,
        payment: template.payment,
        paid: template.payment === "kortele",
        placedAt: action.at,
        status: stationsOf(template.lines),
        delivered: {},
      };
      return {
        ...state,
        orders: [order, ...state.orders],
        nextId: state.nextId + 1,
        extraIndex: state.extraIndex + 1,
      };
    }
    case "newGuestOrder":
      return { ...state, guestOrderId: null };
    case "reset":
      // Order numbers keep counting up: a reset never takes the counter back.
      return {
        ...state,
        cart: {},
        orders: seeded(action.at).reverse(),
        guestOrderId: null,
      };
  }
}
