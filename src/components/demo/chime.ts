import { playSound } from "./sounds";

/** Kitchen/bar bell for a new ticket. Kept for existing callers; see sounds.ts. */
export function playChime() {
  playSound("ding");
}
