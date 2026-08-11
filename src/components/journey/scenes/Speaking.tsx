import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { MAT } from "../materials";
import { journey, span, ease, lerp } from "@/lib/journey";

const REGIONS = [
  { label: "FLUENCY", x: -14, y: 6 },
  { label: "PRONUNCIATION", x: 13, y: 8 },
  { label: "SELF-REPAIR", x: -10, y: -9 },
  { label: "DELIVERY", x: 14, y: -7 },
];

const COUNT = 240;

/** Scene 03 — speech made physical: a sculpture of hundreds of thin strands. */
export function Speaking({ z }: { z: number }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const acrylic = useMemo(() => MAT.acrylic(), []);
  const ivory = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#EDE7DA", roughness: 0.35, metalness: 0.15 }),
    [],
  );
  const terra = useMemo(() => MAT.terracotta(), []);
  const seeds = useMemo(
    () =>
      Array.from({ length: COUNT }).map(() => ({
        x: (Math.random() - 0.5) * 42,
        y: (Math.random() - 0.5) * 30,
        z: (Math.random() - 0.5) * 44,
        s: 0.6 + Math.random() * 2.2,
        o: Math.random() * Math.PI * 2,
        sp: 0.3 + Math.random() * 1.2,
      })),
    [],
  );
  const handwriting = useRef<THREE.Group>(null);
  const [probe, setProbe] = useState<number | null>(null);

  useFrame(() => {
    const p = journey.sp;
    const t = performance.now() * 0.001;
    const straighten = ease(span(p, 0.74, 0.82));
    const m = mesh.current;
    if (m) {
      for (let i = 0; i < COUNT; i++) {
        const s = seeds[i]!;
        const bend = Math.sin(t * s.sp + s.o) * (1 - straighten);
        dummy.position.set(
          lerp(s.x + bend * 2.2, (i % 30) * 1.6 - 23, straighten),
          lerp(s.y + Math.cos(t * s.sp * 0.7 + s.o) * 1.4, Math.floor(i / 30) * 2.2 - 8, straighten),
          lerp(s.z, -10, straighten),
        );
        dummy.rotation.set(bend * 0.5, s.o * 0.2, lerp(bend * 0.8, 0, straighten));
        dummy.scale.set(0.06, lerp(s.s * 3.4, 1.6, straighten), 0.06);
        dummy.updateMatrix();
        m.setMatrixAt(i, dummy.matrix);
      }
      m.instanceMatrix.needsUpdate = true;
      m.rotation.y = journey.spx * 0.12;
      m.rotation.x = -journey.spy * 0.06;
    }
    if (handwriting.current) {
      const h = ease(span(p, 0.8, 0.88));
      handwriting.current.scale.set(1 + h * 16, 1 + h * 16, 1);
      handwriting.current.position.z = -26 - h * 6;
    }
    // nearest-region probe from cursor
    let best: number | null = null;
    let bd = 0.42;
    REGIONS.forEach((r, i) => {
      const d = Math.hypot(journey.spx - r.x / 22, journey.spy - r.y / 16);
      if (d < bd) {
        bd = d;
        best = i;
      }
    });
    if (best !== probe) setProbe(best);
  });

  return (
    <group position={[0, 0, z]}>
      <mesh material={MAT.stone()} position={[0, -26, -18]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[240, 200]} />
      </mesh>
      <mesh material={acrylic} position={[-32, 0, -24]} rotation={[0, 0.4, 0]}>
        <boxGeometry args={[18, 70, 1.2]} />
      </mesh>
      <mesh material={acrylic} position={[34, 4, -30]} rotation={[0, -0.5, 0]}>
        <boxGeometry args={[18, 70, 1.2]} />
      </mesh>

      <instancedMesh ref={mesh} args={[undefined, undefined, COUNT]} material={ivory}>
        <boxGeometry args={[1, 1, 1]} />
      </instancedMesh>

      {REGIONS.map((r, i) => (
        <Html key={r.label} position={[r.x, r.y, 4]} center className="pointer-events-none">
          <div
            className="label-xs whitespace-nowrap text-ink transition-opacity duration-300"
            style={{ opacity: probe === i ? 1 : 0.12 }}
          >
            <span className="text-terracotta">◦ </span>
            {r.label}
          </div>
        </Html>
      ))}

      {/* strands resolve into handwriting, which opens into Writing */}
      <group ref={handwriting} position={[0, -2, -26]}>
        {Array.from({ length: 5 }).map((_, i) => (
          <mesh key={i} material={terra} position={[i * 2.4 - 4.8, 0, 0]} rotation={[0, 0, 0.2]}>
            <boxGeometry args={[0.3, 3.2, 0.3]} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
