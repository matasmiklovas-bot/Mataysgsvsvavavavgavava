"use client";

import { useCallback, useReducer, useRef, useState } from "react";
import { demoReducer, initialDemoState } from "./store";
import { PhoneView } from "./phone-view";
import { TeamView, type TeamTab } from "./team-view";

export function InteractiveDemo() {
  const [state, dispatch] = useReducer(demoReducer, initialDemoState);
  const [tab, setTab] = useState<TeamTab>("virtuve");
  const [message, setMessage] = useState("");
  const teamRef = useRef<HTMLDivElement>(null);

  const announce = useCallback((text: string) => {
    // Clear first so repeating the same message is still announced.
    setMessage("");
    window.setTimeout(() => setMessage(text), 30);
  }, []);

  const showTeam = useCallback(() => {
    const order = state.orders[0];
    // Show whichever station received the newest order first.
    if (order) setTab(order.stations.virtuve ? "virtuve" : "baras");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    teamRef.current?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    teamRef.current?.focus({ preventScroll: true });
  }, [state.orders]);

  return (
    <>
      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[380px_minmax(0,1fr)] lg:gap-10">
        <div>
          <p className="mb-4 text-center text-[13px] font-medium tracking-wide text-fg-subtle uppercase lg:text-left">
            Kliento telefonas
          </p>
          <PhoneView state={state} dispatch={dispatch} announce={announce} onShowTeam={showTeam} />
        </div>
        <div ref={teamRef} tabIndex={-1} className="scroll-mt-28 rounded-[1.75rem] focus:outline-none">
          <p className="mb-4 text-center text-[13px] font-medium tracking-wide text-fg-subtle uppercase lg:text-left">
            Komandos planšetės
          </p>
          <TeamView state={state} dispatch={dispatch} tab={tab} onTabChange={setTab} announce={announce} />
        </div>
      </div>
      <p role="status" aria-live="polite" className="sr-only">
        {message}
      </p>
    </>
  );
}
