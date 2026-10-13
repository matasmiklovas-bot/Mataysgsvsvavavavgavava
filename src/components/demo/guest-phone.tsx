"use client";

import { forwardRef, useEffect, useRef, useState, type Dispatch } from "react";
import { categories, formatOrderNumber, formatPrice, getItem, linesTotal, menu, restaurant, type Category } from "@/lib/data";
import { StatusBar } from "@/components/status-bar";
import { PaymentSheet } from "@/components/payment-sheet";
import { cartLines, guestStatus, type DemoAction, type DemoState, type Payment } from "./store";

export type PhoneScreen = "menu" | "cart" | "paying" | "done";

type GuestPhoneProps = {
  state: DemoState;
  dispatch: Dispatch<DemoAction>;
  onScreenChange: (screen: PhoneScreen, hasItems: boolean) => void;
  onSubmit: (payment: Payment) => void;
};

/** What the guest sees after scanning the QR code on table 7. */
export const GuestPhone = forwardRef<HTMLDivElement, GuestPhoneProps>(function GuestPhone(
  { state, dispatch, onScreenChange, onSubmit },
  ref,
) {
  const [screen, setScreen] = useState<PhoneScreen>("menu");
  const [category, setCategory] = useState<Category>("pagrindiniai");
  const [payment, setPayment] = useState<Payment>("kortele");
  const scrollRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  // The menu "loads" for a moment the first time the phone comes into view, as after a real scan.
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const node = screenRef.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setLoaded(true);
      return;
    }
    let timer = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        timer = window.setTimeout(() => setLoaded(true), 900);
      },
      { threshold: 0.3 },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, []);

  const lines = cartLines(state.cart);
  const count = lines.reduce((sum, line) => sum + line.quantity, 0);
  const total = linesTotal(lines);
  const order = state.guestOrderId ? state.orders.find((o) => o.id === state.guestOrderId) : undefined;

  // A submitted order always shows its live status; without one we are back at the menu.
  const current: PhoneScreen = screen === "done" && !order ? "menu" : screen;

  useEffect(() => {
    onScreenChange(current, count > 0);
  }, [current, count, onScreenChange]);

  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    scrollRef.current?.scrollTo({ top: 0 });
    headingRef.current?.focus({ preventScroll: true });
  }, [current]);

  // Card payment: a short wait, then the order is placed. No card data is involved.
  useEffect(() => {
    if (current !== "paying") return;
    const timer = window.setTimeout(() => {
      onSubmit("kortele");
      setScreen("done");
    }, 1900);
    return () => window.clearTimeout(timer);
  }, [current, onSubmit]);

  function confirm() {
    if (lines.length === 0) return;
    if (payment === "kortele") {
      setScreen("paying");
    } else {
      onSubmit("grynieji");
      setScreen("done");
    }
  }

  return (
    <div ref={ref} className="mx-auto w-full max-w-[370px]">
      <div className="rounded-[3.1rem] bg-[#2a2826] p-[3px] shadow-[0_50px_90px_-40px_rgb(0_0_0/0.65),inset_0_1px_0_rgb(255_255_255/0.18)]">
        <div className="rounded-[2.95rem] bg-black p-[10px]">
        <div ref={screenRef} className="relative flex h-[600px] flex-col overflow-hidden rounded-[2.4rem] bg-[#fffdf9] sm:h-[640px]">
          <StatusBar />

          <div className="shrink-0 border-b border-line px-5 pt-1 pb-3">
            <p className="text-[13px] text-ink-2">
              {restaurant.kind} „{restaurant.name}“
            </p>
            <p className="text-[1.45rem] leading-tight font-semibold tracking-[-0.03em]">Staliukas {state.table}</p>
          </div>

          <div ref={scrollRef} className="no-scrollbar relative min-h-0 flex-1 overflow-y-auto overscroll-contain">
            {current === "menu" && !loaded && <MenuSkeleton />}
            {current === "menu" && loaded && (
              <MenuScreen
                headingRef={headingRef}
                state={state}
                dispatch={dispatch}
                category={category}
                onCategory={setCategory}
                hasCartBar={count > 0}
              />
            )}

            {(current === "cart" || current === "paying") && (
              <div className="px-5 pt-3 pb-6">
                <button
                  type="button"
                  onClick={() => setScreen("menu")}
                  className="-ml-2 inline-flex min-h-11 items-center px-2 text-[15px] font-semibold underline underline-offset-4"
                >
                  ← Meniu
                </button>
                <h3 ref={headingRef} tabIndex={-1} className="mt-1 text-[1.5rem] font-semibold tracking-[-0.03em] focus:outline-none">
                  Jūsų užsakymas
                </h3>
                {lines.length === 0 ? (
                  <p className="mt-4 text-[15px] text-ink-2">Krepšelis tuščias. Grįžkite į meniu ir išsirinkite.</p>
                ) : (
                  <>
                    <ul className="mt-3 divide-y divide-line">
                      {lines.map((line) => {
                        const item = getItem(line.itemId);
                        return (
                          <li key={line.itemId} className="py-3.5">
                            <div className="flex items-start justify-between gap-3">
                              {item.image && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={item.image}
                                  alt=""
                                  width={48}
                                  height={48}
                                  decoding="async"
                                  className="size-12 shrink-0 rounded-xl bg-paper-2 object-cover"
                                />
                              )}
                              <div className="min-w-0 flex-1">
                                <p className="text-[15px] leading-snug font-semibold">{item.name}</p>
                                <p className="text-[14px] text-ink-2 tabular-nums">
                                  {formatPrice(item.price * line.quantity)}
                                </p>
                              </div>
                              <Stepper
                                name={item.name}
                                quantity={line.quantity}
                                onAdd={() => dispatch({ type: "add", itemId: item.id })}
                                onRemove={() => dispatch({ type: "remove", itemId: item.id })}
                              />
                            </div>
                            {item.options.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-2" role="group" aria-label={`Pastabos: ${item.name}`}>
                                {item.options.map((note) => {
                                  const on = line.notes.includes(note);
                                  return (
                                    <button
                                      key={note}
                                      type="button"
                                      aria-pressed={on}
                                      onClick={() => dispatch({ type: "toggleNote", itemId: item.id, note })}
                                      className={`min-h-9 rounded-lg border px-2.5 text-[14px] transition-colors ${
                                        on
                                          ? "border-tomato bg-tomato/10 font-semibold text-tomato-dark"
                                          : "border-line text-ink-2 hover:border-ink-2"
                                      }`}
                                    >
                                      {on ? "✓ " : "+ "}
                                      {note}
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </li>
                        );
                      })}
                    </ul>

                    <div className="flex items-baseline justify-between border-t-2 border-ink pt-3">
                      <span className="font-semibold">Iš viso</span>
                      <span className="text-[1.4rem] font-semibold tabular-nums">{formatPrice(total)}</span>
                    </div>

                    <fieldset className="mt-5">
                      <legend className="text-[15px] font-semibold">Kaip mokėsite?</legend>
                      <div className="mt-2 grid gap-2">
                        <PayOption value="kortele" current={payment} onChange={setPayment} label="Kortele dabar, telefonu" />
                        <PayOption value="grynieji" current={payment} onChange={setPayment} label="Grynaisiais padavėjui" />
                      </div>
                      <p className="mt-2 text-[13px] leading-snug text-ink-2">Kuriuos būdus rodyti svečiams, nustato restoranas.</p>
                    </fieldset>

                    <button
                      type="button"
                      onClick={confirm}
                      className="mt-5 flex h-13 w-full items-center justify-center rounded-2xl bg-tomato text-[16px] font-semibold text-white hover:bg-tomato-dark"
                    >
                      {payment === "kortele" ? `Apmokėti ${formatPrice(total)}` : "Užsakyti"}
                    </button>
                  </>
                )}
              </div>
            )}


            {current === "done" && order && (
              <div className="px-5 pt-4 pb-6">
                <p className="text-[14px] text-ink-2">Užsakymas</p>
                <h3 ref={headingRef} tabIndex={-1} className="text-[2.6rem] leading-none font-semibold tracking-[-0.04em] focus:outline-none">
                  {formatOrderNumber(order.id)}
                </h3>
                <StatusTrack status={guestStatus(order)} />
                <ul className="mt-5 space-y-1.5 border-t border-line pt-4 text-[15px]">
                  {order.lines.map((line) => (
                    <li key={line.itemId}>
                      {line.quantity}× {getItem(line.itemId).name}
                      {line.notes.length > 0 && (
                        <span className="block text-[14px] text-tomato-dark">{line.notes.join(", ")}</span>
                      )}
                    </li>
                  ))}
                </ul>
                {/* TODO: patikrinti, kaip tikroje sistemoje svečiui rodomas apmokėjimas ir grynųjų atvejis. */}
                <p className="mt-4 border-t border-line pt-4 text-[15px]">
                  {order.payment === "kortele" ? (
                    <>Apmokėta kortele · <span className="tabular-nums">{formatPrice(linesTotal(order.lines))}</span></>
                  ) : (
                    <>
                      Mokėsite grynaisiais · <span className="tabular-nums">{formatPrice(linesTotal(order.lines))}</span>.
                      Padavėjas tai jau žino.
                    </>
                  )}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    dispatch({ type: "newGuestOrder" });
                    setScreen("menu");
                  }}
                  className="mt-4 -ml-2 inline-flex min-h-11 items-center px-2 text-[15px] font-semibold underline underline-offset-4"
                >
                  Užsisakyti dar
                </button>
              </div>
            )}
          </div>

          <PaymentSheet
            active={current === "paying"}
            amount={formatPrice(total)}
            merchant={`${restaurant.kind} „${restaurant.name}“`}
            table={state.table}
            approveAfter={1000}
          />

          {current === "menu" && loaded && count > 0 && (
            <div className="absolute inset-x-3 bottom-3 animate-fade-up">
              <button
                type="button"
                onClick={() => setScreen("cart")}
                className="flex h-14 w-full items-center justify-between rounded-2xl bg-ink px-4 text-white shadow-[0_10px_24px_-10px_rgb(0_0_0/0.6)]"
              >
                <span className="text-[15px] font-semibold">
                  Krepšelis{" "}
                  <span key={count} className="ml-1 inline-block animate-pop rounded-md bg-tomato px-1.5 tabular-nums">
                    {count}
                  </span>
                </span>
                <span className="text-[15px] font-semibold tabular-nums">Peržiūrėti · {formatPrice(total)}</span>
              </button>
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
});

/** Placeholder rows while the menu is loading. */
function MenuSkeleton() {
  return (
    <div aria-busy="true" aria-label="Meniu kraunamas" className="px-5 pt-3">
      <div className="h-0.5 overflow-hidden rounded-full bg-paper-2">
        <div className="h-full w-2/3 animate-pulse rounded-full bg-tomato/70" />
      </div>
      <div className="mt-4 flex gap-2">
        {[88, 104, 72].map((w) => (
          <span key={w} className="h-9 animate-shimmer rounded-full bg-paper-2" style={{ width: w }} />
        ))}
      </div>
      <ul className="mt-2">
        {[0, 1, 2, 3].map((i) => (
          <li key={i} className="flex items-center gap-3 border-b border-line py-4" style={{ animationDelay: `${i * 90}ms` }}>
            <div className="min-w-0 flex-1 space-y-2">
              <span className="block h-3.5 w-2/3 animate-shimmer rounded bg-paper-2" />
              <span className="block h-3 w-5/6 animate-shimmer rounded bg-paper-2" />
              <span className="block h-3 w-1/4 animate-shimmer rounded bg-paper-2" />
            </div>
            <span className="size-24 shrink-0 animate-shimmer rounded-2xl bg-paper-2" />
          </li>
        ))}
      </ul>
    </div>
  );
}

function MenuScreen({
  headingRef,
  state,
  dispatch,
  category,
  onCategory,
  hasCartBar,
}: {
  headingRef: React.RefObject<HTMLHeadingElement | null>;
  state: DemoState;
  dispatch: Dispatch<DemoAction>;
  category: Category;
  onCategory: (c: Category) => void;
  hasCartBar: boolean;
}) {
  const items = menu.filter((item) => item.category === category);
  return (
    <div className={hasCartBar ? "pb-24" : "pb-6"}>
      <h3 ref={headingRef} tabIndex={-1} className="sr-only">
        Meniu
      </h3>
      {/* Category strip scrolls sideways; the faded right edge hints at more. */}
      <div className="sticky top-0 z-10 bg-[#fffdf9]/95 pt-3 pb-2 backdrop-blur-sm">
        <div
          role="group"
          aria-label="Meniu skyriai"
          className="no-scrollbar flex gap-1.5 overflow-x-auto px-5 [mask-image:linear-gradient(to_right,#000_80%,transparent)] pr-10"
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              aria-pressed={category === cat.id}
              onClick={() => onCategory(cat.id)}
              className={`min-h-10 shrink-0 rounded-full px-3.5 text-[15px] font-semibold whitespace-nowrap transition-colors ${
                category === cat.id ? "bg-ink text-white" : "text-ink-2 hover:bg-paper-2"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <ul className="divide-y divide-line px-5">
        {items.map((item) => {
          const quantity = state.cart[item.id]?.quantity ?? 0;
          return (
            <li key={item.id} className="flex items-start gap-3 py-4">
              <div className="min-w-0 flex-1">
                <p className="text-[16px] leading-snug font-semibold">{item.name}</p>
                <p className="mt-0.5 text-[14px] leading-snug text-ink-2">{item.description}</p>
                <p className="mt-1.5 text-[15px] font-semibold tabular-nums">{formatPrice(item.price)}</p>
              </div>
              {item.image ? (
                // Photo on the right with the add control sitting on its corner, as in food apps.
                <div className="relative shrink-0 pb-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt=""
                    width={96}
                    height={96}
                    loading="lazy"
                    decoding="async"
                    className="size-24 rounded-2xl bg-paper-2 object-cover"
                  />
                  <div className={`absolute bottom-0 ${quantity === 0 ? "-right-1.5" : "left-1/2 -translate-x-1/2"}`}>
                    {quantity === 0 ? (
                      <button
                        type="button"
                        onClick={() => dispatch({ type: "add", itemId: item.id })}
                        aria-label={`Pridėti: ${item.name}`}
                        className="flex size-11 items-center justify-center rounded-full bg-white text-[22px] leading-none font-semibold shadow-[0_4px_14px_-4px_rgb(0_0_0/0.35)] ring-1 ring-black/5 transition-transform active:scale-90"
                      >
                        +
                      </button>
                    ) : (
                      <Stepper
                        name={item.name}
                        quantity={quantity}
                        onAdd={() => dispatch({ type: "add", itemId: item.id })}
                        onRemove={() => dispatch({ type: "remove", itemId: item.id })}
                        floating
                      />
                    )}
                  </div>
                </div>
              ) : quantity === 0 ? (
                <button
                  type="button"
                  onClick={() => dispatch({ type: "add", itemId: item.id })}
                  aria-label={`Pridėti: ${item.name}`}
                  className="flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-ink text-[22px] leading-none font-semibold hover:bg-ink hover:text-white"
                >
                  +
                </button>
              ) : (
                <Stepper
                  name={item.name}
                  quantity={quantity}
                  onAdd={() => dispatch({ type: "add", itemId: item.id })}
                  onRemove={() => dispatch({ type: "remove", itemId: item.id })}
                />
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Stepper({
  name,
  quantity,
  onAdd,
  onRemove,
  floating = false,
}: {
  name: string;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
  /** White pill resting on a dish photo. */
  floating?: boolean;
}) {
  return (
    <div
      className={`flex shrink-0 items-center rounded-full ${
        floating ? "animate-pop bg-white shadow-[0_4px_14px_-4px_rgb(0_0_0/0.35)] ring-1 ring-black/5" : "border-2 border-ink"
      }`}
    >
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Vienu mažiau: ${name}`}
        className="flex size-10 items-center justify-center text-[20px] leading-none font-semibold"
      >
        −
      </button>
      <span className="w-6 text-center text-[15px] font-semibold tabular-nums">
        <span className="sr-only">Kiekis: </span>
        {quantity}
      </span>
      <button
        type="button"
        onClick={onAdd}
        aria-label={`Vienu daugiau: ${name}`}
        className="flex size-10 items-center justify-center text-[20px] leading-none font-semibold"
      >
        +
      </button>
    </div>
  );
}

function PayOption({
  value,
  current,
  onChange,
  label,
}: {
  value: Payment;
  current: Payment;
  onChange: (value: Payment) => void;
  label: string;
}) {
  const checked = value === current;
  return (
    <label
      className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border-2 px-3.5 text-[15px] has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-tomato ${
        checked ? "border-ink font-semibold" : "border-line text-ink-2"
      }`}
    >
      <input
        type="radio"
        name="demo-payment"
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="size-4 accent-[#1d1b18]"
      />
      {label}
    </label>
  );
}

const trackSteps = [
  { id: "priimta", label: "Priimta" },
  { id: "ruosiama", label: "Ruošiama" },
  { id: "nesama", label: "Nešama" },
] as const;

function StatusTrack({ status }: { status: ReturnType<typeof guestStatus> }) {
  const index = status === "patiekta" ? 3 : trackSteps.findIndex((s) => s.id === status);
  return (
    <div className="mt-5">
      <ol className="grid grid-cols-3 gap-1.5" aria-label="Užsakymo būsena">
        {trackSteps.map((step, i) => (
          <li key={step.id} aria-current={i === index ? "step" : undefined}>
            <span className={`block h-1.5 rounded-full ${i <= index ? "bg-tomato" : "bg-line"}`} />
            <span className={`mt-1.5 block text-[14px] ${i === index ? "font-semibold text-ink" : "text-ink-2"}`}>
              {step.label}
            </span>
          </li>
        ))}
      </ol>
      <p className="mt-3 text-[15px]" aria-live="polite">
        {status === "priimta" && "Virtuvė jau mato jūsų užsakymą."}
        {status === "ruosiama" && "Ruošiama. Atnešime prie staliuko."}
        {status === "nesama" && "Paruošta, padavėjas jau neša."}
        {status === "patiekta" && "Patiekta. Skanaus."}
      </p>
    </div>
  );
}
