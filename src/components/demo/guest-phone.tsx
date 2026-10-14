"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type ReactNode,
  type RefObject,
} from "react";
import {
  categories,
  formatOrderNumber,
  formatPrice,
  getItem,
  linesTotal,
  menu,
  restaurant,
  type Category,
  type MenuItem,
} from "@/lib/data";
import { StatusBar } from "@/components/status-bar";
import { PaymentSheet } from "@/components/payment-sheet";
import { playSound } from "./sounds";
import { cartLines, guestStatus, type DemoAction, type DemoState, type Payment } from "./store";

export type PhoneScreen = "menu" | "cart" | "paying" | "done";

type GuestPhoneProps = {
  state: DemoState;
  dispatch: Dispatch<DemoAction>;
  onScreenChange: (screen: PhoneScreen, hasItems: boolean) => void;
  onSubmit: (payment: Payment) => void;
};

// The phone screen's own background: a warm white, a touch lighter than the page.
const screenBg = "bg-[#fffdf9]";

function reducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** What the guest sees after scanning the QR code on table 7. */
export const GuestPhone = forwardRef<HTMLDivElement, GuestPhoneProps>(function GuestPhone(
  { state, dispatch, onScreenChange, onSubmit },
  ref,
) {
  const [screen, setScreen] = useState<PhoneScreen>("menu");
  // Entrance animation of the screen being shown: push from the right, back from the left.
  const [enter, setEnter] = useState("");
  const [category, setCategory] = useState<Category>(categories[0].id);
  const [payment, setPayment] = useState<Payment>("kortele");
  const [dishId, setDishId] = useState<string | null>(null);
  const returnFocusTo = useRef<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const cartBarRef = useRef<HTMLButtonElement>(null);

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
  // Paying is the cart with the card sheet over it, not a screen of its own.
  const screenKey = current === "paying" ? "cart" : current;
  const sheetOpen = current === "menu" && dishId !== null;

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
  }, [screenKey]);

  // Kept in a ref so a new onSubmit identity (e.g. another table's order arriving) doesn't
  // restart the payment wait.
  const onSubmitRef = useRef(onSubmit);
  useEffect(() => {
    onSubmitRef.current = onSubmit;
  }, [onSubmit]);

  // Card payment: a short wait, then the order is placed. No card data is involved.
  useEffect(() => {
    if (current !== "paying") return;
    const timer = window.setTimeout(() => {
      onSubmitRef.current("kortele");
      setEnter("animate-scale-in");
      setScreen("done");
    }, 1900);
    return () => window.clearTimeout(timer);
  }, [current]);

  // The cart bar gives a small nudge whenever its count changes.
  const prevCount = useRef(count);
  useEffect(() => {
    const prev = prevCount.current;
    prevCount.current = count;
    if (prev === 0 || count === 0 || prev === count || reducedMotion()) return;
    cartBarRef.current?.animate(
      [{ transform: "scale(1)" }, { transform: "scale(1.035)" }, { transform: "scale(1)" }],
      { duration: 300, easing: "cubic-bezier(0.2, 0.7, 0.2, 1)" },
    );
  }, [count]);

  // Back from the dish sheet: focus returns to the row that opened it.
  useEffect(() => {
    if (dishId !== null || !returnFocusTo.current) return;
    document.getElementById(`guest-dish-${returnFocusTo.current}`)?.focus({ preventScroll: true });
    returnFocusTo.current = null;
  }, [dishId]);

  const onApproved = useCallback(() => playSound("success"), []);
  const closeDish = useCallback(() => setDishId(null), []);

  function go(next: PhoneScreen, animation: string) {
    setEnter(animation);
    setScreen(next);
  }

  function openDish(id: string) {
    playSound("tap");
    returnFocusTo.current = id;
    setDishId(id);
  }

  function confirm() {
    if (lines.length === 0) return;
    if (payment === "kortele") {
      playSound("tap");
      setScreen("paying");
    } else {
      playSound("success");
      onSubmit("grynieji");
      go("done", "animate-scale-in");
    }
  }

  const add = (itemId: string) => dispatch({ type: "add", itemId });
  const remove = (itemId: string) => dispatch({ type: "remove", itemId });

  return (
    <div ref={ref} className="mx-auto w-full max-w-[370px]">
      <div className="rounded-[3.1rem] bg-[#2a2826] p-[3px] shadow-[0_50px_90px_-40px_rgb(0_0_0/0.65),inset_0_1px_0_rgb(255_255_255/0.18)]">
        <div className="rounded-[2.95rem] bg-black p-[10px]">
          <div
            ref={screenRef}
            className={`relative flex h-[600px] flex-col overflow-hidden rounded-[2.4rem] ${screenBg} text-ink sm:h-[640px]`}
          >
            <StatusBar />

            <div
              className={`relative shrink-0 border-b px-5 pt-1 pb-3 ${
                current === "menu" ? "border-transparent" : "border-line"
              }`}
            >
              <p className="text-[13px] text-ink-2">
                {restaurant.kind} „{restaurant.name}“
              </p>
              <p className="text-[1.45rem] leading-tight font-semibold tracking-[-0.03em]">Staliukas {state.table}</p>
              {current === "menu" && !loaded && (
                <span aria-hidden="true" className="absolute inset-x-0 -bottom-px h-0.5 overflow-hidden">
                  <span className="block h-full w-2/5 animate-indeterminate rounded-full bg-tomato" />
                </span>
              )}
            </div>

            <div
              ref={scrollRef}
              inert={sheetOpen || current === "paying"}
              className="no-scrollbar relative min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain"
            >
              <div key={screenKey} className={enter}>
                {current === "menu" && !loaded && <MenuSkeleton />}
                {current === "menu" && loaded && (
                  <MenuScreen
                    headingRef={headingRef}
                    scrollRef={scrollRef}
                    state={state}
                    category={category}
                    onCategory={setCategory}
                    onAdd={add}
                    onRemove={remove}
                    onOpen={openDish}
                    hasCartBar={count > 0}
                  />
                )}

                {screenKey === "cart" && (
                  <div className="px-5 pt-2 pb-6">
                    <button
                      type="button"
                      onClick={() => {
                        playSound("tap");
                        go("menu", "animate-slide-in-left");
                      }}
                      className="-ml-2.5 inline-flex h-11 cursor-pointer items-center gap-0.5 rounded-xl pr-3 pl-1 text-[16px] font-medium transition hover:bg-paper active:scale-[0.97]"
                    >
                      <Glyph className="size-5" strokeWidth={2.2}>
                        <path d="M15 5l-7 7 7 7" />
                      </Glyph>
                      Meniu
                    </button>
                    <h3
                      ref={headingRef}
                      tabIndex={-1}
                      className="mt-1 text-[1.6rem] leading-tight font-semibold tracking-[-0.03em] focus:outline-none"
                    >
                      Jūsų užsakymas
                    </h3>

                    {lines.length === 0 ? (
                      <p className="mt-3 text-[15px] leading-snug text-ink-2">
                        Krepšelis tuščias. Grįžkite į meniu ir išsirinkite.
                      </p>
                    ) : (
                      <>
                        <ul className="mt-2 divide-y divide-line">
                          {lines.map((line) => {
                            const item = getItem(line.itemId);
                            return (
                              <li key={line.itemId} className="py-4">
                                <div className="flex items-center gap-3">
                                  <DishImage src={item.image} size={56} className="size-14 shrink-0 rounded-xl" />
                                  <div className="min-w-0 flex-1">
                                    <p className="text-[15px] leading-snug font-semibold">{item.name}</p>
                                    <p className="mt-0.5 text-[14px] text-ink-2 tabular-nums">
                                      {formatPrice(item.price * line.quantity)}
                                    </p>
                                  </div>
                                  <Stepper
                                    name={item.name}
                                    quantity={line.quantity}
                                    onAdd={() => add(item.id)}
                                    onRemove={() => remove(item.id)}
                                  />
                                </div>
                                {item.options.length > 0 && (
                                  <div
                                    className="mt-3 flex flex-wrap gap-1.5 pl-[68px]"
                                    role="group"
                                    aria-label={`Pastabos: ${item.name}`}
                                  >
                                    {item.options.map((note) => (
                                      <NoteChip
                                        key={note}
                                        note={note}
                                        on={line.notes.includes(note)}
                                        onToggle={() => dispatch({ type: "toggleNote", itemId: item.id, note })}
                                      />
                                    ))}
                                  </div>
                                )}
                              </li>
                            );
                          })}
                        </ul>

                        <div className="flex items-baseline justify-between border-t border-line pt-4">
                          <span className="text-[16px] font-semibold">Iš viso</span>
                          <span className="text-[1.4rem] font-semibold tracking-[-0.02em] tabular-nums">
                            {formatPrice(total)}
                          </span>
                        </div>

                        <fieldset className="mt-6">
                          <legend className="text-[16px] font-semibold">Kaip mokėsite?</legend>
                          <div className="mt-2.5 grid gap-2">
                            <PayOption
                              value="kortele"
                              current={payment}
                              onChange={setPayment}
                              label="Kortele dabar, telefonu"
                              icon={
                                <>
                                  <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
                                  <path d="M3 10h18M7 15h3" />
                                </>
                              }
                            />
                            <PayOption
                              value="grynieji"
                              current={payment}
                              onChange={setPayment}
                              label="Grynaisiais padavėjui"
                              icon={
                                <>
                                  <rect x="2.5" y="6" width="19" height="12" rx="2" />
                                  <circle cx="12" cy="12" r="2.5" />
                                </>
                              }
                            />
                          </div>
                          <p className="mt-2.5 text-[13px] leading-snug text-ink-2">
                            Kuriuos būdus rodyti svečiams, nustato restoranas.
                          </p>
                        </fieldset>
                      </>
                    )}
                  </div>
                )}

                {current === "done" && order && (
                  <div className="px-5 pt-6 pb-6">
                    <div className="flex flex-col items-center text-center">
                      <span className="flex size-14 animate-scale-in items-center justify-center rounded-full bg-ready text-white">
                        <Glyph className="size-7" strokeWidth={2.6}>
                          <path d="M5 12.5l4.5 4.5L19 7.5" pathLength="1" className="animate-check [stroke-dasharray:1]" />
                        </Glyph>
                      </span>
                      <p className="mt-3 text-[15px] text-ink-2">Užsakymas priimtas</p>
                      <h3
                        ref={headingRef}
                        tabIndex={-1}
                        className="mt-1 text-[2.6rem] leading-none font-semibold tracking-[-0.04em] tabular-nums focus:outline-none"
                      >
                        {formatOrderNumber(order.id)}
                      </h3>
                    </div>

                    <StatusTrack status={guestStatus(order)} />

                    <div className="mt-6 rounded-2xl bg-paper px-4">
                      <ul className="divide-y divide-line">
                        {order.lines.map((line) => {
                          const item = getItem(line.itemId);
                          return (
                            <li key={line.itemId} className="flex items-center gap-3 py-3">
                              <DishImage src={item.image} size={40} className="size-10 shrink-0 rounded-lg" />
                              <div className="min-w-0 flex-1 text-[15px] leading-snug">
                                <p>
                                  <span className="tabular-nums">{line.quantity}×</span> {item.name}
                                </p>
                                {line.notes.length > 0 && (
                                  <p className="text-[13px] text-tomato-dark">{line.notes.join(", ")}</p>
                                )}
                              </div>
                              <span className="shrink-0 text-[14px] text-ink-2 tabular-nums">
                                {formatPrice(item.price * line.quantity)}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                      {/* TODO: patikrinti, kaip tikroje sistemoje svečiui rodomas apmokėjimas ir grynųjų atvejis. */}
                      <p className="border-t border-line py-3 text-[14px] leading-snug">
                        {order.payment === "kortele" ? (
                          <>
                            Apmokėta kortele ·{" "}
                            <span className="font-semibold tabular-nums">{formatPrice(linesTotal(order.lines))}</span>
                          </>
                        ) : (
                          <>
                            Mokėsite grynaisiais ·{" "}
                            <span className="font-semibold tabular-nums">{formatPrice(linesTotal(order.lines))}</span>.
                            Padavėjas tai jau žino.
                          </>
                        )}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        playSound("tap");
                        dispatch({ type: "newGuestOrder" });
                        go("menu", "animate-fade-in");
                      }}
                      className="mt-4 flex h-12 w-full cursor-pointer items-center justify-center rounded-2xl border border-line text-[15px] font-semibold transition hover:bg-paper active:scale-[0.98]"
                    >
                      Užsisakyti dar
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* The main action stays pinned to the bottom of the screen, like in a real app. */}
            {screenKey === "cart" && lines.length > 0 && (
              <div
                inert={current === "paying"}
                className={`shrink-0 animate-fade-in border-t border-line px-4 pt-3 pb-5 ${screenBg}`}
              >
                <button
                  type="button"
                  onClick={confirm}
                  className="flex h-13 w-full cursor-pointer items-center justify-center rounded-2xl bg-tomato text-[16px] font-semibold text-white tabular-nums transition hover:bg-tomato-dark active:scale-[0.98]"
                >
                  {payment === "kortele" ? `Apmokėti ${formatPrice(total)}` : "Užsakyti"}
                </button>
              </div>
            )}

            {current === "menu" && loaded && count > 0 && (
              <div inert={sheetOpen} className="absolute inset-x-3 bottom-3 z-10 animate-fade-up">
                <button
                  ref={cartBarRef}
                  type="button"
                  onClick={() => {
                    playSound("tap");
                    go("cart", "animate-slide-in-right");
                  }}
                  className="flex h-14 w-full cursor-pointer items-center gap-3 rounded-2xl bg-ink pr-4 pl-3 text-white shadow-[0_8px_20px_-12px_rgb(0_0_0/0.6)] transition hover:bg-black active:scale-[0.98]"
                >
                  <span
                    key={count}
                    className="flex h-7 min-w-7 animate-pop items-center justify-center rounded-lg bg-tomato px-1.5 text-[14px] font-semibold tabular-nums"
                  >
                    {count}
                  </span>
                  <span className="text-[15px] font-semibold">Krepšelis</span>
                  <span className="ml-auto text-[15px] font-semibold tabular-nums">{formatPrice(total)}</span>
                </button>
              </div>
            )}

            {sheetOpen && dishId && (
              <DishSheet key={dishId} itemId={dishId} state={state} dispatch={dispatch} onClosed={closeDish} />
            )}

            <PaymentSheet
              active={current === "paying"}
              amount={formatPrice(total)}
              merchant={`${restaurant.kind} „${restaurant.name}“`}
              table={state.table}
              approveAfter={1000}
              onApproved={onApproved}
              autoFocus
            />
          </div>
        </div>
      </div>
    </div>
  );
});

/* ---------------------------------------------------------------------------------------- */
/* Menu                                                                                      */
/* ---------------------------------------------------------------------------------------- */

// Shared by the menu and its skeleton so nothing moves when the content arrives.
const barClass = `sticky top-0 z-10 border-b border-line pt-1.5 pb-0.5 ${screenBg}`;
const stripClass = "no-scrollbar relative flex gap-1.5 overflow-x-auto px-5 py-1.5";
const sectionTitleClass = "pt-6 pb-1 text-[1.125rem] leading-7 font-semibold tracking-[-0.02em]";
const rowClass = "flex w-full items-start gap-4 py-4 text-left";
const photoBox = "relative shrink-0 pb-3";

/** Placeholder with exactly the menu's geometry while it is loading. */
function MenuSkeleton() {
  return (
    <div aria-busy="true">
      <p className="sr-only">Meniu kraunamas</p>
      <div aria-hidden="true" className={barClass}>
        <div className={stripClass}>
          {[178, 116, 92, 88].map((w) => (
            <span key={w} className="h-10 shrink-0 animate-shimmer rounded-full bg-paper-2" style={{ width: w }} />
          ))}
        </div>
      </div>
      <div aria-hidden="true" className="px-5">
        {[0, 1].map((section) => (
          <div key={section}>
            <div className="pt-6 pb-1">
              <div className="flex h-7 items-center">
                <span className="h-4 w-36 animate-shimmer rounded-md bg-paper-2" />
              </div>
            </div>
            <ul className="divide-y divide-line">
              {[0, 1].map((row) => (
                <li key={row} className={rowClass}>
                  <span
                    className="min-w-0 flex-1 animate-shimmer pt-0.5"
                    style={{ animationDelay: `${(section * 2 + row) * 120}ms` }}
                  >
                    <span className="block h-4 w-3/5 rounded-md bg-paper-2" />
                    <span className="mt-3 block h-3 w-11/12 rounded-md bg-paper-2" />
                    <span className="mt-2 block h-3 w-2/3 rounded-md bg-paper-2" />
                    <span className="mt-3.5 block h-3.5 w-14 rounded-md bg-paper-2" />
                  </span>
                  <span className={photoBox}>
                    <span
                      className="block size-24 animate-shimmer rounded-2xl bg-paper-2"
                      style={{ animationDelay: `${(section * 2 + row) * 120}ms` }}
                    />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function MenuScreen({
  headingRef,
  scrollRef,
  state,
  category,
  onCategory,
  onAdd,
  onRemove,
  onOpen,
  hasCartBar,
}: {
  headingRef: RefObject<HTMLHeadingElement | null>;
  scrollRef: RefObject<HTMLDivElement | null>;
  state: DemoState;
  category: Category;
  onCategory: (c: Category) => void;
  onAdd: (itemId: string) => void;
  onRemove: (itemId: string) => void;
  onOpen: (itemId: string) => void;
  hasCartBar: boolean;
}) {
  const barRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const sections = useRef<Partial<Record<Category, HTMLElement | null>>>({});
  // While a chip-triggered scroll runs, the scroll position must not overrule the chip.
  const jumping = useRef(false);
  const jumpTimer = useRef(0);

  // One scrolling list with all sections, as in real ordering apps: the chips follow the
  // scroll and jump to a section. Everything is reachable with a mouse wheel alone.
  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (jumping.current) return;
        const line = root.getBoundingClientRect().top + (barRef.current?.offsetHeight ?? 0) + 24;
        let active = categories[0].id;
        for (const cat of categories) {
          const top = sections.current[cat.id]?.getBoundingClientRect().top;
          if (top !== undefined && top <= line) active = cat.id;
        }
        if (root.scrollTop > 0 && root.scrollTop + root.clientHeight >= root.scrollHeight - 4) {
          active = categories[categories.length - 1].id;
        }
        onCategory(active);
      });
    };
    root.addEventListener("scroll", onScroll, { passive: true });
    // Coming back to the menu starts at the top: let the chips agree with that.
    onScroll();
    return () => {
      root.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
      window.clearTimeout(jumpTimer.current);
    };
  }, [scrollRef, onCategory]);

  // Keep the current chip in view in the strip.
  useEffect(() => {
    const strip = stripRef.current;
    const chip = strip?.querySelector<HTMLElement>(`[data-cat="${category}"]`);
    if (!strip || !chip) return;
    const left = chip.offsetLeft - (strip.clientWidth - chip.offsetWidth) / 2;
    strip.scrollTo({ left: Math.max(0, left), behavior: reducedMotion() ? "auto" : "smooth" });
  }, [category]);

  function jump(cat: Category) {
    playSound("tap");
    onCategory(cat);
    const root = scrollRef.current;
    const section = sections.current[cat];
    if (!root || !section) return;
    const top =
      root.scrollTop +
      section.getBoundingClientRect().top -
      root.getBoundingClientRect().top -
      (barRef.current?.offsetHeight ?? 0);
    jumping.current = true;
    window.clearTimeout(jumpTimer.current);
    jumpTimer.current = window.setTimeout(() => (jumping.current = false), 800);
    root.scrollTo({ top: Math.max(0, top), behavior: reducedMotion() ? "auto" : "smooth" });
  }

  return (
    <div className={hasCartBar ? "pb-24" : "pb-6"}>
      <h3 ref={headingRef} tabIndex={-1} className="sr-only">
        Meniu
      </h3>
      <div ref={barRef} className={barClass}>
        <div ref={stripRef} role="group" aria-label="Meniu skyriai" className={stripClass}>
          {categories.map((cat) => {
            const on = category === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                data-cat={cat.id}
                aria-pressed={on}
                onClick={() => jump(cat.id)}
                className={`h-10 shrink-0 cursor-pointer rounded-full px-3.5 text-[15px] font-semibold whitespace-nowrap transition focus-visible:outline-offset-1 active:scale-[0.96] ${
                  on ? "bg-ink text-white" : "text-ink-2 hover:bg-paper-2 hover:text-ink"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-5">
        {categories.map((cat) => (
          <section
            key={cat.id}
            ref={(node) => {
              sections.current[cat.id] = node;
            }}
            aria-labelledby={`guest-section-${cat.id}`}
          >
            <h4 id={`guest-section-${cat.id}`} className={sectionTitleClass}>
              {cat.label}
            </h4>
            <ul className="divide-y divide-line">
              {menu
                .filter((item) => item.category === cat.id)
                .map((item) => (
                  <DishRow
                    key={item.id}
                    item={item}
                    quantity={state.cart[item.id]?.quantity ?? 0}
                    onAdd={onAdd}
                    onRemove={onRemove}
                    onOpen={onOpen}
                  />
                ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

function DishRow({
  item,
  quantity,
  onAdd,
  onRemove,
  onOpen,
}: {
  item: MenuItem;
  quantity: number;
  onAdd: (itemId: string) => void;
  onRemove: (itemId: string) => void;
  onOpen: (itemId: string) => void;
}) {
  const controlRef = useRef<HTMLDivElement>(null);
  // When "+" turns into a stepper (or back), keyboard focus follows to the new control.
  const hadFocus = useRef(false);
  const inCart = quantity > 0;
  useEffect(() => {
    if (!hadFocus.current) return;
    hadFocus.current = false;
    controlRef.current
      ?.querySelector<HTMLButtonElement>(inCart ? "[data-step='add']" : "button")
      ?.focus({ preventScroll: true });
  }, [inCart]);

  return (
    <li className="relative">
      {/* The row opens the dish; the add control below is a separate sibling button. */}
      <button
        id={`guest-dish-${item.id}`}
        type="button"
        aria-label={item.name}
        aria-describedby={`guest-dish-${item.id}-info`}
        onClick={() => onOpen(item.id)}
        className={`group ${rowClass} cursor-pointer transition active:scale-[0.985]`}
      >
        <span className="min-w-0 flex-1">
          <span className="block text-[16px] leading-snug font-semibold">{item.name}</span>
          <span id={`guest-dish-${item.id}-info`} className="block">
            <span className="mt-0.5 block text-[14px] leading-snug text-ink-2">{item.description}</span>
            <span className="mt-1.5 block text-[15px] font-semibold tabular-nums">{formatPrice(item.price)}</span>
          </span>
        </span>
        <span className={photoBox}>
          <DishImage
            src={item.image}
            size={96}
            lazy
            className="size-24 rounded-2xl transition-opacity group-hover:opacity-90"
          />
        </span>
      </button>

      <div
        ref={controlRef}
        onClickCapture={() => {
          hadFocus.current = !!controlRef.current?.contains(document.activeElement);
        }}
        className={`absolute right-0 bottom-4 flex w-24 ${inCart ? "justify-center" : "justify-end"}`}
      >
        {inCart ? (
          <Stepper
            name={item.name}
            quantity={quantity}
            onAdd={() => onAdd(item.id)}
            onRemove={() => onRemove(item.id)}
            variant="float"
          />
        ) : (
          <button
            type="button"
            onClick={() => {
              playSound("add");
              onAdd(item.id);
            }}
            aria-label={`Pridėti: ${item.name}`}
            className="-mr-1.5 flex size-11 animate-scale-in cursor-pointer items-center justify-center rounded-full bg-white text-ink shadow-[0_2px_8px_-2px_rgb(0_0_0/0.3)] ring-1 ring-black/5 transition hover:bg-paper active:scale-[0.92]"
          >
            <Glyph className="size-5" strokeWidth={2.2}>
              <path d="M12 5v14M5 12h14" />
            </Glyph>
          </button>
        )}
      </div>
    </li>
  );
}

/* ---------------------------------------------------------------------------------------- */
/* Dish detail sheet                                                                         */
/* ---------------------------------------------------------------------------------------- */

function DishSheet({
  itemId,
  state,
  dispatch,
  onClosed,
}: {
  itemId: string;
  state: DemoState;
  dispatch: Dispatch<DemoAction>;
  onClosed: () => void;
}) {
  const item = getItem(itemId);
  const line = state.cart[itemId];
  const quantity = line?.quantity ?? 0;
  // Notes picked before the dish is in the cart; they go in together with it.
  const [draft, setDraft] = useState<string[]>([]);
  const [closing, setClosing] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const notes = line ? line.notes : draft;

  useEffect(() => {
    dialogRef.current?.focus({ preventScroll: true });
  }, []);

  // Safety net in case the closing animation never reports its end (e.g. the tab is hidden).
  useEffect(() => {
    if (!closing) return;
    const timer = window.setTimeout(onClosed, 450);
    return () => window.clearTimeout(timer);
  }, [closing, onClosed]);

  function close(sound = true) {
    if (closing) return;
    if (sound) playSound("tap");
    setClosing(true);
  }

  function toggle(note: string) {
    if (line) dispatch({ type: "toggleNote", itemId, note });
    else setDraft((d) => (d.includes(note) ? d.filter((n) => n !== note) : [...d, note]));
  }

  function addToCart() {
    playSound("add");
    dispatch({ type: "add", itemId });
    for (const note of draft) dispatch({ type: "toggleNote", itemId, note });
    close(false);
  }

  return (
    <div className="absolute inset-0 z-30 flex flex-col justify-end">
      <div
        aria-hidden="true"
        onClick={() => close()}
        className={`absolute inset-0 bg-black/30 ${closing ? "opacity-0 transition-opacity duration-200" : "animate-fade-in"}`}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-labelledby="guest-dish-sheet-title"
        tabIndex={-1}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            e.stopPropagation();
            close();
          }
        }}
        onAnimationEnd={(e) => {
          if (closing && e.target === e.currentTarget) onClosed();
        }}
        className={`relative flex max-h-[calc(100%-2.75rem)] flex-col rounded-t-[1.75rem] outline-none ${screenBg} ${
          closing ? "animate-sheet-down" : "animate-sheet-up"
        }`}
      >
        <span aria-hidden="true" className="mx-auto mt-2 block h-[5px] w-9 shrink-0 rounded-full bg-line" />
        <div className="no-scrollbar min-h-0 overflow-y-auto overscroll-contain px-4 pt-3">
          <div className="relative">
            <DishImage src={item.image} size={640} className="aspect-[4/3] w-full rounded-2xl" />
            <button
              type="button"
              aria-label="Uždaryti"
              onClick={() => close()}
              className="absolute top-2.5 right-2.5 flex size-10 cursor-pointer items-center justify-center rounded-full bg-white/90 text-ink transition hover:bg-white active:scale-[0.92]"
            >
              <Glyph className="size-[18px]" strokeWidth={2.4}>
                <path d="M6 6l12 12M18 6L6 18" />
              </Glyph>
            </button>
          </div>
          <div className="mt-4 flex items-baseline justify-between gap-3 px-0.5">
            <h4 id="guest-dish-sheet-title" className="text-[1.3rem] leading-tight font-semibold tracking-[-0.02em]">
              {item.name}
            </h4>
            <p className="shrink-0 text-[17px] font-semibold tabular-nums">{formatPrice(item.price)}</p>
          </div>
          <p className="mt-1 px-0.5 text-[15px] leading-snug text-ink-2">{item.description}</p>
          {item.options.length > 0 && (
            <div className="mt-4 px-0.5">
              <p id="guest-dish-sheet-notes" className="text-[13px] font-semibold text-ink-2">
                Pastabos
              </p>
              <div role="group" aria-labelledby="guest-dish-sheet-notes" className="mt-2 flex flex-wrap gap-1.5">
                {item.options.map((note) => (
                  <NoteChip key={note} note={note} on={notes.includes(note)} onToggle={() => toggle(note)} />
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="shrink-0 px-4 pt-4 pb-5">
          {quantity === 0 ? (
            <button
              type="button"
              onClick={addToCart}
              className="flex h-13 w-full cursor-pointer items-center justify-center rounded-2xl bg-tomato text-[16px] font-semibold text-white tabular-nums transition hover:bg-tomato-dark active:scale-[0.98]"
            >
              Į krepšelį · {formatPrice(item.price)}
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <Stepper
                name={item.name}
                quantity={quantity}
                onAdd={() => dispatch({ type: "add", itemId })}
                onRemove={() => dispatch({ type: "remove", itemId })}
                variant="large"
              />
              <button
                type="button"
                onClick={() => close()}
                className="flex h-13 flex-1 cursor-pointer items-center justify-center rounded-2xl bg-ink text-[16px] font-semibold text-white transition hover:bg-black active:scale-[0.98]"
              >
                Gerai
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------------------- */
/* Small parts                                                                               */
/* ---------------------------------------------------------------------------------------- */

/** Dish photo on a quiet placeholder; it fades in once loaded (instantly if already cached). */
function DishImage({
  src,
  size,
  className,
  lazy = false,
}: {
  src?: string;
  size: number;
  className: string;
  lazy?: boolean;
}) {
  const [shown, setShown] = useState<"wait" | "fade" | "now">("wait");
  const cached = useCallback((img: HTMLImageElement | null) => {
    if (img?.complete && img.naturalWidth > 0) setShown((s) => (s === "wait" ? "now" : s));
  }, []);
  return (
    <span className={`block overflow-hidden bg-paper-2 ${className}`}>
      {src && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={cached}
          src={src}
          alt=""
          width={size}
          height={size}
          loading={lazy ? "lazy" : undefined}
          decoding="async"
          onLoad={() => setShown((s) => (s === "wait" ? "fade" : s))}
          className={`size-full object-cover ${shown === "wait" ? "opacity-0" : shown === "fade" ? "animate-img-in" : ""}`}
        />
      )}
    </span>
  );
}

function Stepper({
  name,
  quantity,
  onAdd,
  onRemove,
  variant = "plain",
}: {
  name: string;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
  /** float: white pill resting on a dish photo; large: in the dish sheet. */
  variant?: "plain" | "float" | "large";
}) {
  const box =
    variant === "float"
      ? "animate-scale-in bg-white shadow-[0_2px_8px_-2px_rgb(0_0_0/0.3)] ring-1 ring-black/5"
      : "bg-paper";
  const button = `flex ${variant === "large" ? "size-13" : "size-10"} cursor-pointer items-center justify-center rounded-full transition hover:bg-black/5 active:scale-[0.92]`;
  return (
    <div className={`flex shrink-0 items-center rounded-full ${box}`}>
      <button
        type="button"
        data-step="remove"
        onClick={() => {
          playSound("remove");
          onRemove();
        }}
        aria-label={`Vienu mažiau: ${name}`}
        className={button}
      >
        <Glyph className="size-4" strokeWidth={2.4}>
          <path d="M5 12h14" />
        </Glyph>
      </button>
      <span
        className={`text-center font-semibold tabular-nums ${variant === "large" ? "min-w-7 text-[17px]" : "min-w-6 text-[15px]"}`}
      >
        <span className="sr-only">Kiekis: </span>
        <span key={quantity} className="inline-block animate-fade-in">
          {quantity}
        </span>
      </span>
      <button
        type="button"
        data-step="add"
        onClick={() => {
          playSound("add");
          onAdd();
        }}
        aria-label={`Vienu daugiau: ${name}`}
        className={button}
      >
        <Glyph className="size-4" strokeWidth={2.4}>
          <path d="M12 5v14M5 12h14" />
        </Glyph>
      </button>
    </div>
  );
}

function NoteChip({ note, on, onToggle }: { note: string; on: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={() => {
        playSound("tap");
        onToggle();
      }}
      className={`inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-full border px-3.5 text-[14px] transition active:scale-[0.96] ${
        on ? "border-tomato bg-tomato/10 font-semibold text-tomato-dark" : "border-line text-ink-2 hover:border-ink-2 hover:text-ink"
      }`}
    >
      {on && (
        <Glyph className="-ml-0.5 size-3.5 animate-scale-in" strokeWidth={3}>
          <path d="M5 12.5l4.5 4.5L19 7.5" />
        </Glyph>
      )}
      <span>{on ? note : `+ ${note}`}</span>
    </button>
  );
}

function PayOption({
  value,
  current,
  onChange,
  label,
  icon,
}: {
  value: Payment;
  current: Payment;
  onChange: (value: Payment) => void;
  label: string;
  icon: ReactNode;
}) {
  const checked = value === current;
  return (
    <label
      className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-2xl border px-4 text-[15px] transition active:scale-[0.99] has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-tomato-bright ${
        checked ? "border-ink ring-1 ring-ink" : "border-line hover:border-ink-2"
      }`}
    >
      <input
        type="radio"
        name="demo-payment"
        value={value}
        checked={checked}
        onChange={() => {
          playSound("tap");
          onChange(value);
        }}
        className="sr-only"
      />
      <Glyph className={`size-[22px] shrink-0 ${checked ? "text-ink" : "text-ink-2"}`} strokeWidth={1.7}>
        {icon}
      </Glyph>
      <span className={`flex-1 ${checked ? "font-semibold" : ""}`}>{label}</span>
      <span
        aria-hidden="true"
        className={`flex size-[22px] shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
          checked ? "border-ink bg-ink" : "border-line"
        }`}
      >
        {checked && <span className="size-2 animate-scale-in rounded-full bg-white" />}
      </span>
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
    <div className="mt-6">
      <ol className="grid grid-cols-3 gap-1.5" aria-label="Užsakymo būsena">
        {trackSteps.map((step, i) => (
          <li key={step.id} aria-current={i === index ? "step" : undefined}>
            <span className="block h-1.5 overflow-hidden rounded-full bg-line">
              {/* Each segment fills once, when the order reaches that step. */}
              {i <= index && <span className="block h-full origin-left animate-progress rounded-full bg-ready" />}
            </span>
            <span
              className={`mt-2 block text-[13px] transition-colors duration-300 ${
                i === index ? "font-semibold text-ink" : i < index ? "text-ink" : "text-ink-2"
              }`}
            >
              {step.label}
            </span>
          </li>
        ))}
      </ol>
      <p className="mt-4 text-center text-[15px]" aria-live="polite">
        <span key={status} className="inline-block animate-fade-up">
          {status === "priimta" && "Virtuvė jau mato jūsų užsakymą."}
          {status === "ruosiama" && "Ruošiama. Atnešime prie staliuko."}
          {status === "nesama" && "Paruošta, padavėjas jau neša."}
          {status === "patiekta" && "Patiekta. Skanaus."}
        </span>
      </p>
    </div>
  );
}

/** Line icon on a 24 px grid, drawn with the current text colour. */
function Glyph({ children, className, strokeWidth = 2 }: { children: ReactNode; className: string; strokeWidth?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}
