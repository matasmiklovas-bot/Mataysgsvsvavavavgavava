"use client";

import { useSyncExternalStore } from "react";
import { siteConfig } from "@/config/site";

export type Equipment = "savo" | "nuoma";

// One choice shared by the pricing cards and the contact form.
let current: Equipment | null = null;
const listeners = new Set<() => void>();

export function setEquipment(value: Equipment) {
  current = value;
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useEquipment() {
  return useSyncExternalStore(
    subscribe,
    () => current,
    () => null,
  );
}

export const equipmentLabel: Record<Equipment, string> = {
  savo: "Savo įranga",
  nuoma: `Įrangos nuoma, ${siteConfig.pricing.equipmentRent} € per mėnesį`,
};

const { setup, monthly, equipmentRent } = siteConfig.pricing;

const options: {
  value: Equipment;
  title: string;
  price: number;
  perMonth?: boolean;
  text: string;
  badge?: string;
}[] = [
  { value: "savo", title: "Savo įranga", price: 0, text: "Planšetes perkate patys arba naudojate jau turimas." },
  {
    value: "nuoma",
    title: "Įrangos nuoma",
    price: equipmentRent,
    perMonth: true,
    text: "Visa reikalinga įranga iš mūsų už vieną mėnesio kainą.",
    badge: "Nieko pirkti nereikia",
  },
];

/** Pick own tablets or rent everything; shows the resulting price right away. */
export function EquipmentPicker() {
  const choice = useEquipment();
  const total = monthly + (choice === "nuoma" ? equipmentRent : 0);

  return (
    <div>
      <div role="radiogroup" aria-label="Įranga" className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
        {options.map((option) => {
          const selected = choice === option.value;
          return (
            <label
              key={option.value}
              className={`group relative flex cursor-pointer flex-col rounded-[1.5rem] p-6 transition-[background-color,box-shadow,color,transform] duration-300 active:scale-[0.99] sm:rounded-[2rem] sm:p-7 has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-tomato ${
                selected
                  ? "bg-night text-night-text shadow-[0_24px_40px_-24px_rgb(0_0_0/0.6)]"
                  : "bg-white shadow-[0_1px_2px_rgb(0_0_0/0.04)] hover:shadow-[0_18px_36px_-24px_rgb(0_0_0/0.35)]"
              }`}
            >
              <input
                type="radio"
                name="equipment"
                value={option.value}
                checked={selected}
                onChange={() => setEquipment(option.value)}
                className="sr-only"
              />
              <span className="flex items-start justify-between gap-3">
                <span className={`text-[15px] font-semibold ${selected ? "text-night-muted" : "text-ink-2"}`}>
                  {option.title}
                </span>
                <span
                  aria-hidden="true"
                  className={`flex size-6 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ${
                    selected ? "bg-tomato" : "ring-[1.5px] ring-[#d6d1c8] ring-inset group-hover:ring-ink-2"
                  }`}
                >
                  <svg
                    viewBox="0 0 16 16"
                    className={`size-3.5 text-white transition-[opacity,transform] duration-300 ${
                      selected ? "scale-100 opacity-100" : "scale-50 opacity-0"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M3.5 8.5l3 3 6-7" />
                  </svg>
                </span>
              </span>
              <span className="mt-2 text-[2.25rem] leading-none font-semibold tracking-[-0.04em]">
                {option.price}&nbsp;€
                {option.perMonth && (
                  <span
                    className={`ml-1 text-[1rem] font-normal tracking-normal ${selected ? "text-night-muted" : "text-ink-2"}`}
                  >
                    /mėn.
                  </span>
                )}
              </span>
              <span className={`mt-3 ${selected ? "text-night-muted" : "text-ink-2"}`}>{option.text}</span>
              {option.badge && (
                <span className="mt-4 w-fit rounded-full bg-tomato px-2.5 py-1 text-[12px] font-semibold text-white">
                  {option.badge}
                </span>
              )}
            </label>
          );
        })}
      </div>

      <div aria-live="polite" className="mt-4 min-h-0">
        {choice && (
          <p className="animate-fade-up rounded-[1.25rem] bg-white px-5 py-4 text-center text-[16px] text-ink">
            Jūsų kaina: <strong className="font-semibold">{setup}&nbsp;€</strong> už įdiegimą, toliau{" "}
            <strong className="font-semibold">{total}&nbsp;€</strong> per mėnesį.
          </p>
        )}
      </div>
    </div>
  );
}
