import * as THREE from "three";

/** Global, non-React journey state. Read inside useFrame, written by scroll/pointer. */
export const journey = {
  /** 0..1 across the whole cinematic sequence */
  p: 0,
  /** smoothed progress */
  sp: 0,
  /** scroll velocity, -1..1-ish */
  vel: 0,
  /** normalized pointer, -1..1 */
  px: 0,
  py: 0,
  /** smoothed pointer */
  spx: 0,
  spy: 0,
  /** world-space point the cursor is inspecting (drives the x-ray reveal) */
  reveal: new THREE.Vector3(0, 0, 4),
  /** reveal radius in world units, grows on hover intent */
  revealR: 9,
  mobile: false,
  reduced: false,
};

export type SceneKey = "hero" | "reading" | "listening" | "speaking" | "writing" | "system";

export const CHAPTERS: { key: SceneKey; index: string; name: string; from: number; to: number }[] = [
  { key: "hero", index: "00", name: "THRESHOLD", from: 0, to: 0.2 },
  { key: "reading", index: "01", name: "READING", from: 0.2, to: 0.42 },
  { key: "listening", index: "02", name: "LISTENING", from: 0.42, to: 0.62 },
  { key: "speaking", index: "03", name: "SPEAKING", from: 0.62, to: 0.8 },
  { key: "writing", index: "04", name: "WRITING", from: 0.8, to: 0.93 },
  { key: "system", index: "05", name: "THE SYSTEM", from: 0.93, to: 1.01 },
];

export function chapterAt(p: number) {
  return CHAPTERS.find((c) => p >= c.from && p < c.to) ?? CHAPTERS[CHAPTERS.length - 1]!;
}

type Listener = (p: number) => void;
const listeners = new Set<Listener>();

export function setProgress(v: number) {
  const next = Math.min(1, Math.max(0, v));
  journey.vel = next - journey.p;
  journey.p = next;
  listeners.forEach((l) => l(next));
}

export function subscribeProgress(l: Listener) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
/** local progress inside a range */
export const span = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));
export const ease = (t: number) => t * t * (3 - 2 * t);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
