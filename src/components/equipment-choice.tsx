"use client";

import { useSyncExternalStore } from "react";
import { siteConfig } from "@/config/site";
import { formatPrice } from "@/lib/data";
import { LogoMark } from "@/components/logo";

export type Equipment = "savo" | "nuoma";

// One choice shared by the pricing section and the contact form.
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

const options: { value: Equipment; title: string; text: string; price: string }[] = [
  { value: "savo", title: "Savo įranga", text: "Naudojate turimas planšetes arba perkate patys.", price: "0 €" },
  {
    value: "nuoma",
    title: "Įrangos nuoma",
    text: "Visa reikalinga įranga iš mūsų. Nieko pirkti nereikia.",
    price: `${equipmentRent} € / mėn.`,
  },
];

/** Own tablets or rent everything: a plain list of two choices. */
export function EquipmentPicker() {
  const choice = useEquipment();
  return (
    <fieldset>
      <legend className="text-[1.125rem] font-semibold tracking-[-0.01em]">Kokias planšetes naudosite?</legend>
      <div className="mt-4 divide-y divide-line overflow-hidden rounded-surface bg-white ring-1 ring-line">
        {options.map((option) => {
          const selected = choice === option.value;
          return (
            <label
              key={option.value}
              className="flex cursor-pointer items-start gap-4 px-5 py-5 transition-colors hover:bg-[#fbfaf8] has-[:focus-visible]:outline-3 has-[:focus-visible]:-outline-offset-3 has-[:focus-visible]:outline-tomato-bright sm:px-6"
            >
              <input
                type="radio"
                name="equipment"
                value={option.value}
                checked={selected}
                onChange={() => setEquipment(option.value)}
                className="sr-only"
              />
              <span
                aria-hidden="true"
                className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full ring-inset transition-[box-shadow] duration-200 ${
                  selected ? "ring-[6px] ring-ink" : "ring-[1.5px] ring-[#c9c4ba]"
                }`}
              />
              <span className="min-w-0 flex-1">
                <span className="block font-semibold">{option.title}</span>
                <span className="mt-0.5 block text-[15px] text-ink-2">{option.text}</span>
              </span>
              <span className="shrink-0 font-semibold tabular-nums">{option.price}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

/** The price written out as a kitchen-style ticket; it follows the equipment choice. */
export function PriceReceipt() {
  const choice = useEquipment();
  const perMonth = monthly + (choice === "nuoma" ? equipmentRent : 0);
  const equipmentLine =
    choice === "nuoma" ? `${formatPrice(equipmentRent * 100)} / mėn.` : choice === "savo" ? formatPrice(0) : "–";

  return (
    <div className="slip w-full max-w-[400px] px-6 pt-6 text-[14px] shadow-[0_30px_50px_-34px_rgb(0_0_0/0.4)]">
      <div className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-2 font-semibold tracking-wide">
          <LogoMark className="size-5" />
          KVITAS
        </span>
        <span className="text-ink-2">Kainos pasiūlymas</span>
      </div>
      <div className="my-4 border-t border-dashed border-ink/35" />
      <dl className="space-y-2.5">
        <Row term="Įdiegimas" note="vieną kartą" value={formatPrice(setup * 100)} />
        <Row term="Sistema" value={`${formatPrice(monthly * 100)} / mėn.`} />
        <Row term="Priežiūra" value={`${formatPrice(0)} / mėn.`} />
        <Row
          term="Įranga"
          note={choice === "nuoma" ? "nuoma" : choice === "savo" ? "savo" : "nepasirinkta"}
          value={equipmentLine}
        />
      </dl>
      <div className="my-4 border-t border-dashed border-ink/35" />
      <dl aria-live="polite" className="grid grid-cols-2 gap-4 pb-2">
        <div>
          <dt className="text-ink-2 uppercase">Dabar</dt>
          <dd className="mt-1 font-sans text-[2.25rem] leading-none font-semibold tracking-[-0.04em] tabular-nums">
            {setup}&nbsp;€
          </dd>
        </div>
        <div>
          <dt className="text-ink-2 uppercase">Kas mėnesį</dt>
          <dd
            key={perMonth}
            className="mt-1 animate-fade-up font-sans text-[2.25rem] leading-none font-semibold tracking-[-0.04em] tabular-nums"
          >
            {perMonth}&nbsp;€
          </dd>
        </div>
      </dl>
    </div>
  );
}

function Row({ term, note, value }: { term: string; note?: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt>
        {term}
        {note && <span className="text-ink-2"> · {note}</span>}
      </dt>
      <dd className="shrink-0 tabular-nums">{value}</dd>
    </div>
  );
}
