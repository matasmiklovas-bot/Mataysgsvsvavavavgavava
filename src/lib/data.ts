/**
 * One source of truth for the whole page: the sample restaurant, its menu, the guest's
 * table and the order counter. The hero ticket and the live demo both read from here,
 * so numbers, dishes and totals always agree.
 */

export type Station = "virtuve" | "baras";
export type Category = "sriubos" | "pagrindiniai" | "desertai" | "gerimai";

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  /** Euro cents. */
  price: number;
  category: Category;
  station: Station;
  /** Notes the guest can tick, e.g. "be svogūnų". Printed on the ticket. */
  options: string[];
  /**
   * Square dish photo in public/menu (640 px WebP). Sources, all free for commercial use:
   * Pexels photos 3872373, 4202381, 17499948, 4340676, 2638019, 4021980 (Pexels license);
   * CC0 via Openverse/rawpixel: rawpixel 447950 (burger, Jakub Kapusnak), rawpixel 5963185
   * (steak), Flickr/JohannPiber beer (Openverse de4aa9b3-a062-4bf1-a7ff-a5f485c1964b);
   * Wikimedia Commons "Litavsko jelo šaltibarščiai.jpg" (CC0).
   * Replace with the restaurant's own photos for a real prototype.
   */
  image?: string;
};

export const restaurant = {
  name: "Kiemelis",
  kind: "Bistro",
};

/** The table whose QR code the demo guest has scanned. */
export const guestTable = 7;
export const tables = Array.from({ length: 16 }, (_, i) => i + 1);

export const categories: { id: Category; label: string }[] = [
  { id: "sriubos", label: "Sriubos ir užkandžiai" },
  { id: "pagrindiniai", label: "Pagrindiniai" },
  { id: "desertai", label: "Desertai" },
  { id: "gerimai", label: "Gėrimai" },
];

export const menu: MenuItem[] = [
  {
    id: "saltibarsciai",
    image: "/menu/saltibarsciai.webp",
    name: "Šaltibarščiai",
    description: "Su kiaušiniu, agurkais ir karštomis bulvėmis",
    price: 650,
    category: "sriubos",
    station: "virtuve",
    options: ["bulvės atskirai", "be krapų"],
  },
  {
    id: "salotos",
    image: "/menu/salotos.webp",
    name: "Sezoninės salotos",
    description: "Kinoja, brokoliai, agurkai, pomidorai",
    price: 890,
    category: "sriubos",
    station: "virtuve",
    options: ["padažas atskirai", "be kinojos"],
  },
  {
    id: "cepelinai",
    image: "/menu/cepelinai.webp",
    name: "Cepelinai su mėsa",
    description: "3 vnt., su spirgučiais",
    price: 990,
    category: "pagrindiniai",
    station: "virtuve",
    options: ["be spirgučių", "1 vnt."],
  },
  {
    id: "mesainis",
    image: "/menu/mesainis.webp",
    name: "Jautienos mėsainis",
    description: "Brandinta jautiena, čederis, karamelizuoti svogūnai",
    price: 1450,
    category: "pagrindiniai",
    station: "virtuve",
    options: ["be svogūnų", "be padažo"],
  },
  {
    id: "makaronai",
    image: "/menu/makaronai.webp",
    name: "Naminiai makaronai",
    description: "Pomidorų padažas, parmezanas, bazilikas",
    price: 1190,
    category: "pagrindiniai",
    station: "virtuve",
    options: ["be parmezano"],
  },
  {
    id: "kepsnys",
    image: "/menu/kepsnys.webp",
    name: "Jautienos kepsnys",
    description: "Su žolelių sviestu, bulvytėmis ir daržovėmis",
    price: 1390,
    category: "pagrindiniai",
    station: "virtuve",
    options: ["be sviesto"],
  },
  {
    id: "pyragas",
    image: "/menu/pyragas.webp",
    name: "Obuolių pyragas",
    description: "Su vaniliniais ledais",
    price: 590,
    category: "desertai",
    station: "virtuve",
    options: ["be ledų"],
  },
  {
    id: "kapucinas",
    image: "/menu/kapucinas.webp",
    name: "Kapučinas",
    description: "Dvigubas espresas, pieno puta",
    price: 350,
    category: "gerimai",
    station: "baras",
    options: ["augalinis pienas"],
  },
  {
    id: "limonadas",
    image: "/menu/limonadas.webp",
    name: "Naminis limonadas",
    description: "Citrina, mėta, 0,4 l",
    price: 450,
    category: "gerimai",
    station: "baras",
    options: ["be ledo"],
  },
  {
    id: "alus",
    image: "/menu/alus.webp",
    name: "Nefiltruotas alus",
    description: "Vietinė darykla, 0,5 l",
    price: 490,
    category: "gerimai",
    station: "baras",
    options: [],
  },
];

const byId = new Map(menu.map((item) => [item.id, item]));

export function getItem(id: string): MenuItem {
  const item = byId.get(id);
  if (!item) throw new Error(`Unknown menu item: ${id}`);
  return item;
}

export type OrderLine = { itemId: string; quantity: number; notes: string[] };

export function linesTotal(lines: OrderLine[]): number {
  return lines.reduce((sum, line) => sum + getItem(line.itemId).price * line.quantity, 0);
}

/** "14,50 €" with a non-breaking space before the euro sign. */
export function formatPrice(cents: number): string {
  return `${(cents / 100).toFixed(2).replace(".", ",")} €`;
}

export function formatOrderNumber(id: number): string {
  return `#${String(id).padStart(3, "0")}`;
}

/**
 * Orders already on the kitchen rail when the page opens. #024 is the ticket shown in the hero.
 * minutesAgo is relative to page load.
 */
export type SeedOrder = {
  id: number;
  table: number;
  lines: OrderLine[];
  payment: "kortele" | "grynieji";
  minutesAgo: number;
  status: Partial<Record<Station, "naujas" | "ruosiama" | "paruosta">>;
};

export const seedOrders: SeedOrder[] = [
  {
    id: 22,
    table: 3,
    payment: "grynieji",
    minutesAgo: 11,
    lines: [
      { itemId: "cepelinai", quantity: 2, notes: [] },
      { itemId: "alus", quantity: 2, notes: [] },
    ],
    status: { virtuve: "ruosiama", baras: "paruosta" },
  },
  {
    id: 23,
    table: 12,
    payment: "kortele",
    minutesAgo: 6,
    lines: [
      { itemId: "kepsnys", quantity: 1, notes: ["be sviesto"] },
      { itemId: "limonadas", quantity: 1, notes: [] },
    ],
    status: { virtuve: "ruosiama", baras: "naujas" },
  },
  {
    id: 24,
    table: 4,
    payment: "kortele",
    minutesAgo: 2,
    lines: [
      { itemId: "mesainis", quantity: 2, notes: ["be svogūnų"] },
      { itemId: "saltibarsciai", quantity: 1, notes: [] },
    ],
    status: { virtuve: "naujas" },
  },
];

/** The hero shows order #024 exactly as it sits in the kitchen. */
export const heroOrder = seedOrders[2];
export const heroOrderTime = "19:42";

/** The first order a visitor places in the demo gets this number. */
export const firstDemoOrderId = 25;

/** Orders "from other tables" that the demo controls can add. */
export const extraOrderTemplates: Omit<SeedOrder, "id" | "minutesAgo" | "status">[] = [
  {
    table: 9,
    payment: "kortele",
    lines: [
      { itemId: "makaronai", quantity: 1, notes: ["be parmezano"] },
      { itemId: "kapucinas", quantity: 2, notes: ["augalinis pienas"] },
    ],
  },
  {
    table: 2,
    payment: "grynieji",
    lines: [{ itemId: "salotos", quantity: 2, notes: ["padažas atskirai"] }],
  },
  {
    table: 14,
    payment: "kortele",
    lines: [
      { itemId: "alus", quantity: 3, notes: [] },
      { itemId: "limonadas", quantity: 1, notes: ["be ledo"] },
    ],
  },
];
