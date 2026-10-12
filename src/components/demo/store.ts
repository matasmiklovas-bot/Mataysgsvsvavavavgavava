import { menu, type MenuItem, type Station } from "@/lib/menu";

export type PaymentMethod = "kortele" | "grynieji";
export type TicketStatus = "nauja" | "ruosiama" | "paruosta";

export type OrderLine = { itemId: string; quantity: number };

export type DemoOrder = {
  id: number;
  table: number;
  lines: OrderLine[];
  payment: PaymentMethod;
  paid: boolean;
  served: boolean;
  createdAt: number;
  stations: Partial<Record<Station, TicketStatus>>;
};

export type DemoState = {
  cart: Record<string, number>;
  table: number;
  orders: DemoOrder[];
  nextId: number;
};

export type DemoAction =
  | { type: "add"; itemId: string }
  | { type: "remove"; itemId: string }
  | { type: "clearCart" }
  | { type: "setTable"; table: number }
  | { type: "submit"; payment: PaymentMethod; createdAt: number }
  | { type: "advance"; orderId: number; station: Station }
  | { type: "markPaid"; orderId: number }
  | { type: "markServed"; orderId: number }
  | { type: "seed"; createdAt: number }
  | { type: "reset" };

export const initialDemoState: DemoState = {
  cart: {},
  table: 7,
  orders: [],
  nextId: 1,
};

const itemsById = new Map(menu.map((item) => [item.id, item]));

export function getItem(id: string): MenuItem {
  const item = itemsById.get(id);
  if (!item) throw new Error(`Unknown menu item: ${id}`);
  return item;
}

export function linesTotal(lines: OrderLine[]): number {
  return lines.reduce((sum, line) => sum + getItem(line.itemId).price * line.quantity, 0);
}

export function cartLines(cart: Record<string, number>): OrderLine[] {
  return menu
    .filter((item) => (cart[item.id] ?? 0) > 0)
    .map((item) => ({ itemId: item.id, quantity: cart[item.id] }));
}

export function linesForStation(lines: OrderLine[], station: Station): OrderLine[] {
  return lines.filter((line) => getItem(line.itemId).station === station);
}

const nextStatus: Record<TicketStatus, TicketStatus> = {
  nauja: "ruosiama",
  ruosiama: "paruosta",
  paruosta: "paruosta",
};

function createOrder(
  id: number,
  table: number,
  lines: OrderLine[],
  payment: PaymentMethod,
  createdAt: number,
): DemoOrder {
  const stations: DemoOrder["stations"] = {};
  for (const line of lines) stations[getItem(line.itemId).station] = "nauja";
  return {
    id,
    table,
    lines,
    payment,
    // Card orders are paid in the (simulated) checkout; cash is settled by staff.
    paid: payment === "kortele",
    served: false,
    createdAt,
    stations,
  };
}

function updateOrder(state: DemoState, orderId: number, update: (order: DemoOrder) => DemoOrder) {
  return {
    ...state,
    orders: state.orders.map((order) => (order.id === orderId ? update(order) : order)),
  };
}

export function demoReducer(state: DemoState, action: DemoAction): DemoState {
  switch (action.type) {
    case "add":
      return {
        ...state,
        cart: { ...state.cart, [action.itemId]: Math.min((state.cart[action.itemId] ?? 0) + 1, 20) },
      };
    case "remove": {
      const quantity = (state.cart[action.itemId] ?? 0) - 1;
      const cart = { ...state.cart };
      if (quantity <= 0) delete cart[action.itemId];
      else cart[action.itemId] = quantity;
      return { ...state, cart };
    }
    case "clearCart":
      return { ...state, cart: {} };
    case "setTable":
      return { ...state, table: action.table };
    case "submit": {
      const lines = cartLines(state.cart);
      if (lines.length === 0) return state;
      const order = createOrder(state.nextId, state.table, lines, action.payment, action.createdAt);
      return { ...state, cart: {}, orders: [order, ...state.orders], nextId: state.nextId + 1 };
    }
    case "advance":
      return updateOrder(state, action.orderId, (order) => {
        const current = order.stations[action.station];
        if (!current) return order;
        return { ...order, stations: { ...order.stations, [action.station]: nextStatus[current] } };
      });
    case "markPaid":
      return updateOrder(state, action.orderId, (order) => ({ ...order, paid: true }));
    case "markServed":
      return updateOrder(state, action.orderId, (order) => ({ ...order, served: true }));
    case "seed": {
      const first = createOrder(
        state.nextId,
        3,
        [
          { itemId: "pica", quantity: 1 },
          { itemId: "limonadas", quantity: 2 },
        ],
        "grynieji",
        action.createdAt - 4 * 60_000,
      );
      const second = createOrder(
        state.nextId + 1,
        12,
        [
          { itemId: "kepsnys", quantity: 1 },
          { itemId: "salotos", quantity: 1 },
          { itemId: "kokteilis", quantity: 1 },
        ],
        "kortele",
        action.createdAt - 60_000,
      );
      second.stations.virtuve = "ruosiama";
      const orders = [...state.orders, second, first].sort((a, b) => b.createdAt - a.createdAt);
      return { ...state, orders, nextId: state.nextId + 2 };
    }
    case "reset":
      return { ...initialDemoState, table: state.table };
  }
}

export const statusLabels: Record<TicketStatus, string> = {
  nauja: "Nauja",
  ruosiama: "Ruošiama",
  paruosta: "Paruošta",
};

export const paymentLabels: Record<PaymentMethod, string> = {
  kortele: "Kortele",
  grynieji: "Grynaisiais",
};

export function formatOrderNumber(id: number): string {
  return `#${String(id).padStart(3, "0")}`;
}

const timeFormat = new Intl.DateTimeFormat("lt-LT", { hour: "2-digit", minute: "2-digit" });

export function formatTime(timestamp: number): string {
  return timeFormat.format(timestamp);
}
