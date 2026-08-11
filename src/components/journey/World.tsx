import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, AdaptiveDpr, Preload } from "@react-three/drei";
import * as THREE from "three";
import { journey, lerp, subscribeProgress } from "@/lib/journey";
import { Hero } from "./scenes/Hero";
import { Reading } from "./scenes/Reading";
import { Listening } from "./scenes/Listening";
import { Speaking } from "./scenes/Speaking";
import { Writing } from "./scenes/Writing";
import { System } from "./scenes/SystemScene";

export const Z = {
  reading: -70,
  listening: -150,
  speaking: -240,
  writing: -320,
  system: -520,
};

type Key = { p: number; pos: [number, number, number]; look: [number, number, number] };

const KEYS: Key[] = [
  { p: 0, pos: [0, 0, 34], look: [0, 0, 0] },
  { p: 0.1, pos: [0, 1, 24], look: [0, 0, -4] },
  { p: 0.16, pos: [0, 0, 10], look: [0, 0, -12] },
  { p: 0.2, pos: [0, 0, -6], look: [0, 0, -24] },
  { p: 0.26, pos: [0, 0, -40], look: [0, 0, -70] },
  { p: 0.32, pos: [6, 2, -58], look: [0, 0, -80] },
  { p: 0.38, pos: [-4, -1, -78], look: [0, -1, -100] },
  { p: 0.44, pos: [0, 0, -106], look: [0, 0, -132] },
  { p: 0.5, pos: [0, 0, -134], look: [0, 0, -162] },
  { p: 0.56, pos: [3, 1, -158], look: [0, 0, -188] },
  { p: 0.62, pos: [0, 0, -196], look: [0, 0, -222] },
  { p: 0.68, pos: [-4, 2, -216], look: [0, 0, -242] },
  { p: 0.74, pos: [4, -2, -238], look: [0, 0, -264] },
  { p: 0.8, pos: [0, 0, -262], look: [0, 0, -292] },
  { p: 0.86, pos: [0, 0, -294], look: [0, 0, -318] },
  { p: 0.92, pos: [3, 1, -320], look: [0, 0, -344] },
  { p: 0.96, pos: [0, 8, -358], look: [0, 0, -470] },
  { p: 1, pos: [0, 22, -382], look: [0, -4, -520] },
];

const FOG: { p: number; c: THREE.Color }[] = [
  { p: 0, c: new THREE.Color("#006666") },
  { p: 0.26, c: new THREE.Color("#0b4f4d") },
  { p: 0.42, c: new THREE.Color("#1D3F3E") },
  { p: 0.52, c: new THREE.Color("#6f7a76") },
  { p: 0.68, c: new THREE.Color("#a8a294") },
  { p: 0.84, c: new THREE.Color("#C7C1B4") },
  { p: 0.95, c: new THREE.Color("#00615f") },
  { p: 1, c: new THREE.Color("#006666") },
];

function sample(list: Key[], p: number) {
  let a = list[0]!;
  let b = list[list.length - 1]!;
  for (let i = 0; i < list.length - 1; i++) {
    if (p >= list[i]!.p && p <= list[i + 1]!.p) {
      a = list[i]!;
      b = list[i + 1]!;
      break;
    }
  }
  const t = b.p === a.p ? 0 : (p - a.p) / (b.p - a.p);
  const s = t * t * (3 - 2 * t);
  return {
    pos: [lerp(a.pos[0], b.pos[0], s), lerp(a.pos[1], b.pos[1], s), lerp(a.pos[2], b.pos[2], s)] as const,
    look: [
      lerp(a.look[0], b.look[0], s),
      lerp(a.look[1], b.look[1], s),
      lerp(a.look[2], b.look[2], s),
    ] as const,
  };
}

function fogColor(p: number, out: THREE.Color) {
  for (let i = 0; i < FOG.length - 1; i++) {
    const a = FOG[i]!;
    const b = FOG[i + 1]!;
    if (p >= a.p && p <= b.p) {
      const t = (p - a.p) / (b.p - a.p);
      out.copy(a.c).lerp(b.c, t);
      return;
    }
  }
  out.copy(FOG[FOG.length - 1]!.c);
}

/** Mounts a world only while the camera is near it — keeps draw calls and DOM labels scoped. */
function Gate({ from, to, children }: { from: number; to: number; children: React.ReactNode }) {
  const [on, setOn] = useState(journey.p >= from && journey.p <= to);
  useEffect(
    () =>
      subscribeProgress((p) => {
        const next = p >= from && p <= to;
        setOn((prev) => (prev === next ? prev : next));
      }),
    [from, to],
  );
  return on ? <>{children}</> : null;
}

function Rig() {
  const { camera, scene } = useThree();
  const target = useMemo(() => new THREE.Vector3(), []);
  const col = useMemo(() => new THREE.Color("#006666"), []);
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), -2), []);
  const ray = useMemo(() => new THREE.Raycaster(), []);
  const hit = useMemo(() => new THREE.Vector3(), []);
  const ndc = useMemo(() => new THREE.Vector2(), []);
  const fog = useMemo(() => new THREE.Fog("#006666", 24, 132), []);

  useFrame((_, dt) => {
    const k = Math.min(1, dt * 4.5);
    journey.sp = lerp(journey.sp, journey.p, k);
    journey.spx = lerp(journey.spx, journey.px, k * 0.8);
    journey.spy = lerp(journey.spy, journey.py, k * 0.8);

    const { pos, look } = sample(KEYS, journey.sp);
    const drift = 1 - Math.min(1, journey.sp * 3);
    camera.position.set(
      pos[0] + journey.spx * (1.6 + drift * 2.4),
      pos[1] - journey.spy * (1.2 + drift * 1.8),
      pos[2],
    );
    target.set(look[0] + journey.spx * 2, look[1] - journey.spy * 1.5, look[2]);
    camera.lookAt(target);
    camera.rotation.z = journey.spx * 0.012;

    fogColor(journey.sp, col);
    fog.color.copy(col);
    scene.fog = fog;
    scene.background = col;

    // cursor inspection point for the x-ray reveal (hero only)
    ndc.set(journey.px, -journey.py);
    ray.setFromCamera(ndc, camera);
    if (ray.ray.intersectPlane(plane, hit)) journey.reveal.copy(hit);
    journey.revealR = lerp(journey.revealR, journey.sp < 0.18 ? 10 : 0.001, 0.06);
  });
  return null;
}

export function World() {
  const dpr = useRef<[number, number]>([1, journey.mobile ? 1.3 : 1.8]);
  return (
    <Canvas
      dpr={dpr.current}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{ fov: 42, near: 0.5, far: 900, position: [0, 0, 34] }}
      style={{ position: "absolute", inset: 0 }}
    >
      <Rig />
      <ambientLight intensity={0.7} />
      <directionalLight position={[18, 30, 22]} intensity={1.5} color="#FFF6E6" />
      <directionalLight position={[-22, -8, 10]} intensity={0.5} color="#8FD6CF" />
      <Suspense fallback={null}>
        <Environment resolution={128}>
          <Lightformer intensity={2.2} position={[0, 12, 8]} scale={[24, 8, 1]} color="#FFF7E8" />
          <Lightformer intensity={1.1} position={[-14, 0, 6]} scale={[10, 18, 1]} color="#9FD8D2" />
          <Lightformer intensity={0.9} position={[14, -4, 4]} scale={[10, 14, 1]} color="#E9D9B4" />
        </Environment>
        <Gate from={0} to={0.3}>
          <Hero />
        </Gate>
        <Gate from={0.14} to={0.5}>
          <Reading z={Z.reading} />
        </Gate>
        <Gate from={0.36} to={0.7}>
          <Listening z={Z.listening} />
        </Gate>
        <Gate from={0.58} to={0.86}>
          <Speaking z={Z.speaking} />
        </Gate>
        <Gate from={0.78} to={1.01}>
          <Writing z={Z.writing} />
        </Gate>
        <Gate from={0.9} to={1.01}>
          <System z={Z.system} />
        </Gate>
        <Preload all />
      </Suspense>
      <AdaptiveDpr pixelated={false} />
    </Canvas>
  );
}
