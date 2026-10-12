import { unsplash } from "./images";

export type Station = "virtuve" | "baras";

export type MenuCategory = "uzkandziai" | "pagrindiniai" | "desertai" | "gerimai";

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  /** Price in euro cents. */
  price: number;
  category: MenuCategory;
  station: Station;
  image: string;
};

export const categories: { id: MenuCategory; label: string }[] = [
  { id: "uzkandziai", label: "Užkandžiai" },
  { id: "pagrindiniai", label: "Pagrindiniai" },
  { id: "desertai", label: "Desertai" },
  { id: "gerimai", label: "Gėrimai" },
];

export const stationLabels: Record<Station, string> = {
  virtuve: "Virtuvė",
  baras: "Baras",
};

/** Sample menu used only in the on-page demo. */
export const menu: MenuItem[] = [
  {
    id: "salotos",
    name: "Sezoninės salotos",
    description: "Avokadas, traškios daržovės, citrusinis padažas",
    price: 890,
    category: "uzkandziai",
    station: "virtuve",
    image: unsplash("photo-1546069901-ba9599a7e63c"),
  },
  {
    id: "dubenele",
    name: "Daržovių dubenėlis",
    description: "Bolivinė balanda, keptos daržovės, humusas",
    price: 950,
    category: "uzkandziai",
    station: "virtuve",
    image: unsplash("photo-1512621776951-a57141f2eefd"),
  },
  {
    id: "mesainis",
    name: "Jautienos mėsainis",
    description: "Brandinta jautiena, čederis, karamelizuoti svogūnai",
    price: 1450,
    category: "pagrindiniai",
    station: "virtuve",
    image: unsplash("photo-1568901346375-23c9450c58cd"),
  },
  {
    id: "pica",
    name: "Krosnyje kepta pica",
    description: "Pomidorų padažas, mocarela, šviežias baziliko lapas",
    price: 1290,
    category: "pagrindiniai",
    station: "virtuve",
    image: unsplash("photo-1565299624946-b28f40a0ae38"),
  },
  {
    id: "makaronai",
    name: "Naminiai makaronai",
    description: "Lėtai virtas pomidorų padažas, parmezanas",
    price: 1190,
    category: "pagrindiniai",
    station: "virtuve",
    image: unsplash("photo-1473093295043-cdd812d0e601"),
  },
  {
    id: "kepsnys",
    name: "Jautienos kepsnys",
    description: "Ant grotelių, su rozmarinų bulvėmis",
    price: 2390,
    category: "pagrindiniai",
    station: "virtuve",
    image: unsplash("photo-1600891964092-4316c288032e"),
  },
  {
    id: "pyragas",
    name: "Šokoladinis pyragas",
    description: "Juodasis šokoladas, vaniliniai ledai",
    price: 690,
    category: "desertai",
    station: "virtuve",
    image: unsplash("photo-1578985545062-69928b1d9587"),
  },
  {
    id: "kapucinas",
    name: "Kapučinas",
    description: "Dvigubas espresas, pieno puta",
    price: 350,
    category: "gerimai",
    station: "baras",
    image: unsplash("photo-1495474472287-4d71bcdd2085"),
  },
  {
    id: "kokteilis",
    name: "Namų kokteilis",
    description: "Sezoninis bartenderio receptas",
    price: 990,
    category: "gerimai",
    station: "baras",
    image: unsplash("photo-1514362545857-3bc16c4c7d1b"),
  },
  {
    id: "limonadas",
    name: "Naminis limonadas",
    description: "Citrina, mėta, gazuotas vanduo",
    price: 450,
    category: "gerimai",
    station: "baras",
    image: unsplash("photo-1556679343-c7306c1976bc"),
  },
];

const euro = new Intl.NumberFormat("lt-LT", { style: "currency", currency: "EUR" });

export function formatPrice(cents: number): string {
  return euro.format(cents / 100);
}
