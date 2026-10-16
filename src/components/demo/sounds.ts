"use client";

import { useSyncExternalStore } from "react";

/**
 * Interface sounds for the demo devices, synthesised with Web Audio so no sound files are
 * shipped. Every sound is short and quiet, and plays only in response to something the
 * visitor did (browsers block audio before the first interaction anyway).
 *
 *   tap      soft tick for any button press on a device
 *   add      small "pop" when a dish goes into the cart
 *   remove   the same pop, falling
 *   success  two rising notes when a payment or order is confirmed
 *   ding     kitchen/bar bell when a new ticket arrives
 *   ready    two gentle bells when a ticket is ready to carry
 *   done     short low confirmation (delivered, paid in cash)
 */
export type SoundName = "tap" | "add" | "remove" | "success" | "ding" | "ready" | "done";

// ---- on/off switch shared by every device ------------------------------------------------
let enabled = true;
const listeners = new Set<() => void>();

export function setSoundEnabled(value: boolean) {
  enabled = value;
  listeners.forEach((listener) => listener());
}

export function useSoundEnabled() {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => enabled,
    () => true,
  );
}

// ---- synthesis ---------------------------------------------------------------------------
let context: AudioContext | null = null;
let master: GainNode | null = null;

function audio(): { ctx: AudioContext; out: GainNode } | null {
  if (typeof window === "undefined") return null;
  const Ctor =
    window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!context) {
    context = new Ctor();
    master = context.createGain();
    master.gain.value = 0.8;
    master.connect(context.destination);
  }
  if (context.state === "suspended") void context.resume();
  return { ctx: context, out: master! };
}

/** A sine (or triangle) note with a fast attack and exponential decay. */
function tone(
  ctx: AudioContext,
  out: AudioNode,
  { freq, at = 0, length = 0.5, peak = 0.12, type = "sine", glideTo }: {
    freq: number;
    at?: number;
    length?: number;
    peak?: number;
    type?: OscillatorType;
    glideTo?: number;
  },
) {
  const start = ctx.currentTime + 0.01 + at;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  if (glideTo) osc.frequency.exponentialRampToValueAtTime(glideTo, start + length * 0.6);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(peak, start + 0.006);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + length);
  osc.connect(gain).connect(out);
  osc.start(start);
  osc.stop(start + length + 0.05);
}

/** A very short filtered noise burst: the "tick" of a glass screen being tapped. */
function tick(ctx: AudioContext, out: AudioNode, peak = 0.22) {
  const length = 0.03;
  const buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * length), ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 6);
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 3200;
  filter.Q.value = 1.4;
  const gain = ctx.createGain();
  gain.gain.value = peak;
  source.connect(filter).connect(gain).connect(out);
  source.start(ctx.currentTime + 0.005);
}

/** A light tap of the vibration motor on phones that have one (Android); a no-op elsewhere. */
function haptic(pattern: number | number[]) {
  try {
    navigator.vibrate?.(pattern);
  } catch {
    // Not supported or not allowed yet.
  }
}

const haptics: Partial<Record<SoundName, number | number[]>> = {
  tap: 6,
  add: 10,
  remove: 6,
  success: [12, 60, 18],
  done: 10,
};

export function playSound(name: SoundName) {
  if (!enabled) return;
  const pattern = haptics[name];
  if (pattern) haptic(pattern);
  try {
    const a = audio();
    if (!a) return;
    const { ctx, out } = a;
    switch (name) {
      case "tap":
        tick(ctx, out);
        break;
      case "add":
        tick(ctx, out, 0.12);
        tone(ctx, out, { freq: 620, glideTo: 980, length: 0.16, peak: 0.09 });
        break;
      case "remove":
        tick(ctx, out, 0.12);
        tone(ctx, out, { freq: 760, glideTo: 480, length: 0.16, peak: 0.07 });
        break;
      case "success":
        tone(ctx, out, { freq: 784, length: 0.35, peak: 0.1 });
        tone(ctx, out, { freq: 1175, at: 0.11, length: 0.5, peak: 0.1 });
        break;
      case "ding":
        // Counter bell: bright fundamental plus a soft inharmonic partial.
        tone(ctx, out, { freq: 1318.5, length: 1.1, peak: 0.13 });
        tone(ctx, out, { freq: 3290, length: 0.5, peak: 0.025 });
        tone(ctx, out, { freq: 1975.5, at: 0.16, length: 1, peak: 0.1 });
        break;
      case "ready":
        tone(ctx, out, { freq: 1046.5, length: 0.6, peak: 0.1 });
        tone(ctx, out, { freq: 1568, at: 0.12, length: 0.7, peak: 0.09 });
        tone(ctx, out, { freq: 2093, at: 0.24, length: 0.8, peak: 0.06 });
        break;
      case "done":
        tick(ctx, out, 0.1);
        tone(ctx, out, { freq: 523.25, length: 0.22, peak: 0.08, type: "triangle" });
        tone(ctx, out, { freq: 659.25, at: 0.07, length: 0.3, peak: 0.07, type: "triangle" });
        break;
    }
  } catch {
    // Sound is a nice extra; never let audio errors break the demo.
  }
}
