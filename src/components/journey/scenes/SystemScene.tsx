import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { MAT } from "../materials";
import { journey, span, ease } from "@/lib/journey";

/** Scene 05 — the four engines resolve into one architecture. */
export function System({ z }: { z: number }) {
  const paper = useMemo(() => MAT.paper(), []);
  const alu = useMemo(() => MAT.aluminium(), []);
  const teal = useMemo(() => MAT.satinTeal(), []);
  const champ = useMemo(() => MAT.champagne(), []);
  const terra = useMemo(() => MAT.terracotta(), []);
  const group = useRef<THREE.Group>(null);

  useFrame(() => {
    const t = ease(span(journey.sp, 0.9, 1));
    if (!group.current) return;
    group.current.visible = t > 0.001;
    group.current.scale.setScalar(0.6 + t * 0.4);
    group.current.rotation.y = journey.spx * 0.12 + (1 - t) * 0.4;
    group.current.children.forEach((c, i) => {
      c.position.y = (c.userData["y"] as number) + (1 - t) * (i % 2 ? 26 : -26);
    });
  });

  return (
    <group position={[0, 0, z]} ref={group}>
      <mesh material={teal} position={[0, -30, -10]} rotation={[-Math.PI / 2, 0, 0]} userData={{ y: -30 }}>
        <planeGeometry args={[320, 240]} />
      </mesh>
      {/* four artifacts on one plinth */}
      <group position={[-33, 0, 0]} userData={{ y: 0 }}>
        <mesh material={paper}>
          <boxGeometry args={[16, 22, 0.4]} />
        </mesh>
        <mesh material={champ} position={[0, -11.4, 0.3]}>
          <boxGeometry args={[16, 0.3, 0.3]} />
        </mesh>
      </group>
      <group position={[-11, 0, 0]} userData={{ y: 0 }}>
        {[8, 5.4, 3].map((r) => (
          <mesh key={r} material={alu}>
            <torusGeometry args={[r, 0.3, 12, 90]} />
          </mesh>
        ))}
      </group>
      <group position={[11, 0, 0]} userData={{ y: 0 }}>
        {Array.from({ length: 26 }).map((_, i) => (
          <mesh key={i} material={terra} position={[i * 0.6 - 7.5, Math.sin(i) * 1.2, 0]}>
            <boxGeometry args={[0.09, 16, 0.09]} />
          </mesh>
        ))}
      </group>
      <group position={[33, 0, 0]} userData={{ y: 0 }}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} material={paper} position={[i * 1.6 - 1.6, i * 0.8, -i * 1.2]} rotation={[0, i * 0.1, 0]}>
            <boxGeometry args={[13, 19, 0.3]} />
          </mesh>
        ))}
      </group>
      <mesh material={MAT.deepTeal()} position={[0, -14, 0]} userData={{ y: -14 }}>
        <boxGeometry args={[96, 3, 22]} />
      </mesh>
    </group>
  );
}
