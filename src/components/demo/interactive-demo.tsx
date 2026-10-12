"use client";

import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { demoReducer, initialDemoState } from "./store";
import { PhoneView } from "./phone-view";
import { TeamView, type TeamTab } from "./team-view";

const steps = [
  {
    number: "01",
    title: "Nuskenuoja QR kodą",
    text: "Klientas nuskenuoja kodą, esantį ant restorano staliuko.",
  },
  {
    number: "02",
    title: "Pasirenka patiekalus",
    text: "Meniu atsidaro tiesiog telefone. Nereikia atsisiųsti programėlės.",
  },
  {
    number: "03",
    title: "Pasirenka atsiskaitymą",
    text: "Klientas gali atsiskaityti kortele arba pasirinkti atsiskaitymą grynaisiais pagal restorano nustatymus.",
  },
  {
    number: "04",
    title: "Užsakymas pasiekia komandą",
    text: "Užsakymas perduodamas virtuvės, baro ir personalo planšetėms pagal užsakymo tipą ir sistemos konfigūraciją.",
  },
];

export function InteractiveDemo() {
  const [state, dispatch] = useReducer(demoReducer, initialDemoState);
  const [tab, setTab] = useState<TeamTab>("virtuve");
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const teamRef = useRef<HTMLDivElement>(null);

  // Open with two sample orders so the team screens show a working state right away.
  const seeded = useRef(false);
  useEffect(() => {
    if (seeded.current) return;
    seeded.current = true;
    dispatch({ type: "seed", createdAt: Date.now() });
  }, []);

  const announce = useCallback((text: string) => {
    // Clear first so repeating the same message is still announced.
    setMessage("");
    window.setTimeout(() => setMessage(text), 30);
  }, []);

  const showTeam = useCallback(() => {
    const order = state.orders[0];
    if (order) setTab(order.stations.virtuve ? "virtuve" : "baras");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    teamRef.current?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    teamRef.current?.focus({ preventScroll: true });
  }, [state.orders]);

  return (
    <>
      <ol className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => {
          const reached = index <= progress;
          return (
            <li
              key={step.number}
              aria-current={index === progress ? "step" : undefined}
              className={`border-t-2 pt-4 transition-colors duration-500 ${
                reached ? "border-accent" : "border-white/10"
              }`}
            >
              <p
                className={`font-mono text-[13px] transition-colors duration-500 ${
                  reached ? "text-accent" : "text-fg-subtle"
                }`}
              >
                {step.number}
              </p>
              <h3 className="mt-2 font-display text-lg font-semibold tracking-[-0.01em]">{step.title}</h3>
              <p className="mt-1.5 text-[15px] leading-relaxed text-fg-muted">{step.text}</p>
            </li>
          );
        })}
      </ol>

      <div className="mt-14 grid grid-cols-1 items-start gap-10 lg:grid-cols-[380px_minmax(0,1fr)]">
        <div>
          <p className="mb-4 text-[13px] text-fg-subtle">Svečio telefonas — išbandykite</p>
          <PhoneView
            state={state}
            dispatch={dispatch}
            announce={announce}
            onShowTeam={showTeam}
            onProgress={setProgress}
          />
        </div>
        <div ref={teamRef} tabIndex={-1} className="scroll-mt-24 rounded-3xl focus:outline-none">
          <p className="mb-4 text-[13px] text-fg-subtle">Komandos planšetės</p>
          <TeamView state={state} dispatch={dispatch} tab={tab} onTabChange={setTab} announce={announce} />
        </div>
      </div>
      <p role="status" aria-live="polite" className="sr-only">
        {message}
      </p>
    </>
  );
}
