"use client";

import { Coffee, CakeSlice, Salad, UtensilsCrossed } from "lucide-react";
import type { MenuItem } from "@/lib/menu";
import { Photo } from "./photo";

const fallbackStyle: Record<MenuItem["category"], { icon: typeof Salad; tone: string }> = {
  uzkandziai: { icon: Salad, tone: "from-emerald-400/25 to-emerald-900/10" },
  pagrindiniai: { icon: UtensilsCrossed, tone: "from-amber-400/25 to-orange-900/10" },
  desertai: { icon: CakeSlice, tone: "from-rose-400/25 to-rose-900/10" },
  gerimai: { icon: Coffee, tone: "from-indigo-300/25 to-indigo-900/10" },
};

type DishImageProps = {
  item: Pick<MenuItem, "name" | "image" | "category">;
  sizes: string;
  className?: string;
  preload?: boolean;
};

/** Square dish photo that fills its (relative) parent, with a tasteful fallback. */
export function DishImage({ item, sizes, className = "", preload }: DishImageProps) {
  const { icon: Icon, tone } = fallbackStyle[item.category];
  return (
    <Photo
      src={item.image}
      alt={item.name}
      fill
      sizes={sizes}
      preload={preload}
      className={`object-cover ${className}`}
      fallback={
        <span
          className={`absolute inset-0 flex items-center justify-center bg-gradient-to-br ${tone}`}
          role="img"
          aria-label={item.name}
        >
          <Icon className="size-1/3 max-h-10 max-w-10 text-white/70" aria-hidden="true" />
        </span>
      }
    />
  );
}
