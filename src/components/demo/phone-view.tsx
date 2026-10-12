"use client";

import { useEffect, useRef, useState, type Dispatch } from "react";
import {
  ArrowLeft,
  Banknote,
  Check,
  CreditCard,
  Loader2,
  Minus,
  Plus,
  ShoppingBag,
} from "lucide-react";
import { categories, formatPrice, menu, type MenuCategory } from "@/lib/menu";
import { DishImage } from "@/components/ui/dish-image";
import {
  cartLines,
  formatOrderNumber,
  getItem,
  linesTotal,
  type DemoAction,
  type DemoState,
  type PaymentMethod,
} from "./store";

type Step = "menu" | "cart" | "paying" | "done";

type PhoneViewProps = {
  state: DemoState;
  dispatch: Dispatch<DemoAction>;
  announce: (message: string) => void;
  onShowTeam: () => void;
  /** Reports which of the four "how it works" steps the guest is on (0–3). */
  onProgress: (step: number) => void;
};

const TABLES = Array.from({ length: 12 }, (_, i) => i + 1);

export function PhoneView({ state, dispatch, announce, onShowTeam, onProgress }: PhoneViewProps) {
  const [step, setStep] = useState<Step>("menu");
  const [category, setCategory] = useState<MenuCategory>("pagrindiniai");
  const [payment, setPayment] = useState<PaymentMethod>("kortele");
  const [lastOrderId, setLastOrderId] = useState<number | null>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const lines = cartLines(state.cart);
  const count = lines.reduce((sum, line) => sum + line.quantity, 0);
  const total = linesTotal(lines);

  const progress = step === "done" ? 3 : step === "menu" ? (count > 0 ? 1 : 0) : 2;
  useEffect(() => {
    onProgress(progress);
  }, [progress, onProgress]);

  // Bring the new screen into view and move focus to its heading on step change.
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    screenRef.current?.scrollTo({ top: 0 });
    headingRef.current?.focus();
  }, [step]);

  // Simulated card checkout: no card data is collected and nothing is charged.
  useEffect(() => {
    if (step !== "paying") return;
    const timer = window.setTimeout(() => submit("kortele"), 1400);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  function submit(method: PaymentMethod) {
    setLastOrderId(state.nextId);
    dispatch({ type: "submit", payment: method, createdAt: Date.now() });
    setStep("done");
    announce(
      `Demonstracinis užsakymas ${formatOrderNumber(state.nextId)} sukurtas. Jis matomas komandos ekranuose.`,
    );
  }

  function confirm() {
    if (lines.length === 0) return;
    if (payment === "kortele") setStep("paying");
    else submit("grynieji");
  }

  const visibleItems = menu.filter((item) => item.category === category);

  return (
    <div className="relative mx-auto w-full max-w-[380px]">
      <div
        aria-hidden="true"
        className="absolute -inset-8 -z-10 rounded-[4rem] bg-[radial-gradient(closest-side,rgba(139,92,246,0.3),transparent)] blur-2xl"
      />
      {/* Device frame */}
      <div className="rounded-[2.9rem] border border-white/15 bg-gradient-to-b from-[#26242f] to-[#121118] p-2.5 shadow-[0_50px_100px_-30px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.15)]">
        <div className="relative flex h-[680px] flex-col overflow-hidden rounded-[2.35rem] bg-ink-900">
          {/* Notch / status bar */}
          <div aria-hidden="true" className="flex h-9 shrink-0 items-center justify-center">
            <span className="h-[22px] w-24 rounded-full bg-black" />
          </div>

          {/* Restaurant header */}
          <div className="shrink-0 border-b border-white/[0.07] px-5 pt-2 pb-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] tracking-wider text-fg-subtle uppercase">
                  Pavyzdinis restoranas
                </p>
                <p className="mt-0.5 text-lg font-display font-semibold tracking-tight">Bistro „Demo“</p>
              </div>
              <label className="flex flex-col items-end gap-1 text-[10.5px] text-fg-subtle">
                Staliukas
                <select
                  value={state.table}
                  onChange={(event) =>
                    dispatch({ type: "setTable", table: Number(event.target.value) })
                  }
                  className="rounded-lg border border-white/10 bg-ink-800 px-2 py-1 text-[13px] font-medium text-fg"
                  aria-label="Staliuko numeris (demonstracijai)"
                >
                  {TABLES.map((table) => (
                    <option key={table} value={table}>
                      Nr. {table}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div ref={screenRef} className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain">
            {step === "menu" && (
              <div className="px-4 pt-4 pb-28">
                <h3 ref={headingRef} tabIndex={-1} className="sr-only">
                  Meniu
                </h3>
                <div
                  role="group"
                  aria-label="Meniu kategorijos"
                  className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]"
                >
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      aria-pressed={category === cat.id}
                      onClick={() => setCategory(cat.id)}
                      className={`shrink-0 rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
                        category === cat.id
                          ? "bg-white text-ink-950"
                          : "bg-white/[0.06] text-fg-muted hover:bg-white/10 hover:text-fg"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                <ul className="mt-4 space-y-3">
                  {visibleItems.map((item) => {
                    const quantity = state.cart[item.id] ?? 0;
                    return (
                      <li
                        key={item.id}
                        className="flex gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-2.5"
                      >
                        <span className="relative size-[76px] shrink-0 overflow-hidden rounded-xl bg-ink-800">
                          <DishImage item={item} sizes="76px" />
                        </span>
                        <div className="flex min-w-0 flex-1 flex-col">
                          <p className="text-[14px] leading-snug font-medium">{item.name}</p>
                          <p className="mt-0.5 line-clamp-2 text-[12px] leading-snug text-fg-subtle">
                            {item.description}
                          </p>
                          <div className="mt-auto flex items-center justify-between pt-1.5">
                            <span className="text-[13.5px] font-medium text-fg tabular-nums">
                              {formatPrice(item.price)}
                            </span>
                            {quantity === 0 ? (
                              <button
                                type="button"
                                onClick={() => {
                                  dispatch({ type: "add", itemId: item.id });
                                  announce(`${item.name} pridėta į krepšelį.`);
                                }}
                                className="flex h-8 items-center gap-1 rounded-full bg-white px-3 text-[12.5px] font-medium text-ink-950 transition-transform hover:scale-105 active:scale-95"
                                aria-label={`Pridėti ${item.name} į krepšelį`}
                              >
                                <Plus className="size-3.5" strokeWidth={2.5} aria-hidden="true" />
                                Pridėti
                              </button>
                            ) : (
                              <QuantityStepper
                                name={item.name}
                                quantity={quantity}
                                onAdd={() => dispatch({ type: "add", itemId: item.id })}
                                onRemove={() => dispatch({ type: "remove", itemId: item.id })}
                              />
                            )}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {step === "cart" && (
              <div className="px-5 pt-4 pb-6">
                <button
                  type="button"
                  onClick={() => setStep("menu")}
                  className="-ml-1 flex items-center gap-1 rounded-lg px-1 py-1 text-[13px] text-fg-muted hover:text-fg"
                >
                  <ArrowLeft className="size-4" aria-hidden="true" /> Atgal į meniu
                </button>
                <h3 ref={headingRef} tabIndex={-1} className="mt-3 text-xl font-semibold tracking-tight">
                  Jūsų užsakymas
                </h3>
                <p className="text-[13px] text-fg-subtle">Staliukas Nr. {state.table}</p>

                {lines.length === 0 ? (
                  <p className="mt-6 rounded-2xl border border-dashed border-white/10 p-5 text-center text-[13px] text-fg-muted">
                    Krepšelis tuščias. Grįžkite į meniu ir pasirinkite patiekalų.
                  </p>
                ) : (
                  <>
                    <ul className="mt-5 divide-y divide-white/[0.06]">
                      {lines.map((line) => {
                        const item = getItem(line.itemId);
                        return (
                          <li key={line.itemId} className="flex items-center gap-3 py-3">
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-[14px] font-medium">{item.name}</p>
                              <p className="text-[12.5px] text-fg-subtle tabular-nums">
                                {formatPrice(item.price * line.quantity)}
                              </p>
                            </div>
                            <QuantityStepper
                              name={item.name}
                              quantity={line.quantity}
                              onAdd={() => dispatch({ type: "add", itemId: item.id })}
                              onRemove={() => dispatch({ type: "remove", itemId: item.id })}
                            />
                          </li>
                        );
                      })}
                    </ul>

                    <div className="mt-2 flex items-center justify-between border-t border-white/10 pt-4">
                      <span className="text-[14px] text-fg-muted">Iš viso</span>
                      <span className="text-lg font-semibold tabular-nums">{formatPrice(total)}</span>
                    </div>

                    <fieldset className="mt-6">
                      <legend className="text-[13px] font-medium text-fg">Atsiskaitymo būdas</legend>
                      <div className="mt-2.5 grid grid-cols-2 gap-2">
                        <PaymentOption
                          value="kortele"
                          current={payment}
                          onChange={setPayment}
                          icon={<CreditCard className="size-4" aria-hidden="true" />}
                          label="Mokėti kortele"
                        />
                        <PaymentOption
                          value="grynieji"
                          current={payment}
                          onChange={setPayment}
                          icon={<Banknote className="size-4" aria-hidden="true" />}
                          label="Mokėti grynaisiais"
                        />
                      </div>
                      <p className="mt-2.5 text-[12px] leading-relaxed text-fg-subtle">
                        {payment === "kortele"
                          ? "Demonstracijoje mokėjimas tik imituojamas: kortelės duomenys neprašomi ir pinigai nenuskaitomi."
                          : "Personalas matys, kad prie šio staliuko reikia priimti atsiskaitymą grynaisiais."}
                      </p>
                    </fieldset>

                    <button
                      type="button"
                      onClick={confirm}
                      className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-white text-[14.5px] font-medium text-ink-950 transition-transform hover:-translate-y-0.5 active:translate-y-0"
                    >
                      {payment === "kortele"
                        ? `Imituoti mokėjimą · ${formatPrice(total)}`
                        : "Pateikti demonstracinį užsakymą"}
                    </button>
                  </>
                )}
              </div>
            )}

            {step === "paying" && (
              <div className="flex h-full flex-col items-center justify-center gap-4 px-8 text-center">
                <Loader2 className="size-9 animate-spin text-accent" aria-hidden="true" />
                <h3 ref={headingRef} tabIndex={-1} className="text-lg font-semibold">
                  Imituojamas mokėjimas…
                </h3>
                <p className="text-[13px] leading-relaxed text-fg-muted">
                  Tai demonstracija. Jokia tikra kortelė nenaudojama ir mokėjimas nevykdomas.
                </p>
              </div>
            )}

            {step === "done" && (
              <div className="flex h-full flex-col items-center justify-center px-7 text-center">
                <span className="relative flex size-16 items-center justify-center rounded-full bg-emerald-400/15">
                  
                  <Check className="size-7 text-emerald-300" strokeWidth={2.5} aria-hidden="true" />
                </span>
                <h3 ref={headingRef} tabIndex={-1} className="mt-6 text-xl font-semibold tracking-tight">
                  Demonstracinis užsakymas {lastOrderId ? formatOrderNumber(lastOrderId) : ""} sukurtas
                </h3>
                <p className="mt-3 text-[13.5px] leading-relaxed text-fg-muted">
                  Jį jau matote komandos ekranuose. Tikram restoranui užsakymas nebuvo išsiųstas.
                </p>
                <button
                  type="button"
                  onClick={onShowTeam}
                  className="mt-7 flex h-11 w-full items-center justify-center rounded-full bg-white text-[14px] font-medium text-ink-950"
                >
                  Žiūrėti komandos ekranus
                </button>
                <button
                  type="button"
                  onClick={() => setStep("menu")}
                  className="mt-2 flex h-11 w-full items-center justify-center rounded-full text-[14px] text-fg-muted hover:text-fg"
                >
                  Naujas užsakymas
                </button>
              </div>
            )}
          </div>

          {/* Floating cart bar */}
          {step === "menu" && count > 0 && (
            <div className="absolute inset-x-3 bottom-3">
              <button
                type="button"
                onClick={() => setStep("cart")}
                className="flex h-14 w-full items-center gap-3 rounded-2xl bg-accent-strong px-4 text-left text-white shadow-[0_18px_40px_-16px_rgba(124,92,240,0.8)] transition-transform hover:-translate-y-0.5"
              >
                <span className="relative">
                  <ShoppingBag className="size-5" aria-hidden="true" />
                  <span className="absolute -top-2 -right-2 flex size-4.5 items-center justify-center rounded-full bg-white text-[10px] font-semibold text-accent-strong">
                    {count}
                  </span>
                </span>
                <span className="flex-1 text-[14px] font-medium">Peržiūrėti krepšelį</span>
                <span className="text-[14px] font-medium tabular-nums">{formatPrice(total)}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function QuantityStepper({
  name,
  quantity,
  onAdd,
  onRemove,
}: {
  name: string;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex items-center gap-1 rounded-full bg-white/[0.07] p-0.5">
      <button
        type="button"
        onClick={onRemove}
        className="flex size-7 items-center justify-center rounded-full text-fg hover:bg-white/10"
        aria-label={`Sumažinti: ${name}`}
      >
        <Minus className="size-3.5" aria-hidden="true" />
      </button>
      <span className="w-5 text-center text-[13px] font-medium tabular-nums">
        <span className="sr-only">Kiekis: </span>
        {quantity}
      </span>
      <button
        type="button"
        onClick={onAdd}
        className="flex size-7 items-center justify-center rounded-full bg-white text-ink-950 hover:bg-white/90"
        aria-label={`Padidinti: ${name}`}
      >
        <Plus className="size-3.5" strokeWidth={2.5} aria-hidden="true" />
      </button>
    </div>
  );
}

function PaymentOption({
  value,
  current,
  onChange,
  icon,
  label,
}: {
  value: PaymentMethod;
  current: PaymentMethod;
  onChange: (value: PaymentMethod) => void;
  icon: React.ReactNode;
  label: string;
}) {
  const checked = value === current;
  return (
    <label
      className={`flex cursor-pointer flex-col gap-2 rounded-2xl border p-3 text-[13px] transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent ${
        checked
          ? "border-accent/60 bg-accent/10 text-fg"
          : "border-white/10 bg-white/[0.03] text-fg-muted hover:border-white/20"
      }`}
    >
      <input
        type="radio"
        name="demo-payment"
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="sr-only"
      />
      <span className="flex items-center justify-between">
        {icon}
        <span
          className={`flex size-4 items-center justify-center rounded-full border ${
            checked ? "border-accent bg-accent" : "border-white/25"
          }`}
        >
          {checked && <span className="size-1.5 rounded-full bg-white" />}
        </span>
      </span>
      <span className="font-medium">{label}</span>
    </label>
  );
}
