/**
 * The "ding" a kitchen tablet makes when a new ticket arrives, synthesised with Web Audio
 * so no sound file is needed. Browsers only allow it after the visitor has interacted
 * with the page, which is always the case here: it plays in response to their order.
 */
let context: AudioContext | null = null;

export function playChime() {
  if (typeof window === "undefined") return;
  const AudioCtor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtor) return;
  try {
    context ??= new AudioCtor();
    if (context.state === "suspended") void context.resume();
    const start = context.currentTime + 0.02;
    // Two soft bell tones, a fifth apart.
    [
      { freq: 1046.5, at: 0 },
      { freq: 1568, at: 0.14 },
    ].forEach(({ freq, at }) => {
      const osc = context!.createOscillator();
      const gain = context!.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.0001, start + at);
      gain.gain.exponentialRampToValueAtTime(0.18, start + at + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + at + 0.9);
      osc.connect(gain).connect(context!.destination);
      osc.start(start + at);
      osc.stop(start + at + 1);
    });
  } catch {
    // Sound is a nice extra; ignore any audio errors.
  }
}
