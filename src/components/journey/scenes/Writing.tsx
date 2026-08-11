import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { MAT } from "../materials";
import { writingPageTexture } from "../textures";
import { journey, span, ease, lerp } from "@/lib/journey";

const SHEETS: {
  kind: "essay" | "outline" | "revision" | "feedback" | "evidence";
  pos: [number, number, number];
  rot: number;
  layer: string;
}[] = [
  { kind: "essay", pos: [-6, 1, 0], rot: 0.12, layer: "CLAIM" },
  { kind: "outline", pos: [17, 5, -14], rot: -0.3, layer: "REASON" },
  { kind: "revision", pos: [-22, -3, -22], rot: 0.34, layer: "EVIDENCE" },
  { kind: "feedback", pos: [10, -8, -34], rot: -0.16, layer: "EXPLANATION" },
  { kind: "evidence", pos: [-10, 9, -44], rot: 0.22, layer: "SOURCE" },
];

function Sheet({
  kind,
  pos,
  rot,
  layer,
  texture,
}: {
  kind: string;
  pos: [number, number, number];
  rot: number;
  layer: string;
  texture: THREE.Texture;
}) {
  const paper = useMemo(() => MAT.paper(), []);
  const champ = useMemo(() => MAT.champagne(), []);
  const ref = useRef<THREE.Group>(null);
  const [on, setOn] = useState(false);
  useFrame(() => {
    if (!ref.current) return;
    ref.current.position.z = lerp(ref.current.position.z, on ? pos[2] + 2.4 : pos[2], 0.1);
    ref.current.rotation.x = lerp(ref.current.rotation.x, on ? -0.08 : 0, 0.1);
  });
  return (
    <group>
      <group
        ref={ref}
        position={pos}
        rotation={[0, rot, 0]}
        onPointerOver={() => setOn(true)}
        onPointerOut={() => setOn(false)}
      >
        <mesh material={paper}>
          <boxGeometry args={[20, 27, 0.22]} />
        </mesh>
        <mesh position={[0, 0, 0.14]}>
          <planeGeometry args={[20, 27]} />
          <meshBasicMaterial map={texture} toneMapped={false} />
        </mesh>
        <mesh material={champ} position={[0, -13.8, 0.1]}>
          <boxGeometry args={[20, 0.1, 0.1]} />
        </mesh>
      </group>
      {on && (
        <Html position={[pos[0], pos[1] - 15.4, pos[2]]} center className="pointer-events-none">
          <div className="label-xs whitespace-nowrap text-ink">
            {kind.toUpperCase()} <span className="text-champagne">/</span> {layer}
          </div>
        </Html>
      )}
    </group>
  );
}

/** Scene 04 — an editorial studio of enormous floating sheets. */
export function Writing({ z }: { z: number }) {
  const textures = useMemo(() => SHEETS.map((s) => writingPageTexture(s.kind)), []);
  const stone = useMemo(() => MAT.stone(), []);
  const thread = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#1D3F3E", roughness: 0.9 }),
    [],
  );
  const group = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!group.current) return;
    const align = ease(span(journey.sp, 0.9, 0.99));
    group.current.children.forEach((c, i) => {
      const target = c.userData["home"] as THREE.Vector3 | undefined;
      if (!target) return;
      c.position.x = lerp(target.x, (i - 2) * 13, align);
      c.position.y = lerp(target.y, 0, align);
      c.position.z = lerp(target.z, -20, align);
      c.rotation.y = lerp(c.userData["rot"] as number, 0, align);
    });
    group.current.rotation.y = journey.spx * 0.05 * (1 - align);
  });

  return (
    <group position={[0, 0, z]}>
      <mesh material={stone} position={[0, -30, -24]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[260, 220]} />
      </mesh>
      <mesh material={thread} position={[0, 40, -40]}>
        <boxGeometry args={[200, 6, 6]} />
      </mesh>

      <group ref={group}>
        {SHEETS.map((s, i) => (
          <group
            key={s.kind}
            userData={{ home: new THREE.Vector3(...s.pos), rot: s.rot }}
            position={s.pos}
          >
            <Sheet {...s} pos={[0, 0, 0]} texture={textures[i]!} />
          </group>
        ))}
      </group>

      {/* threads between the layers */}
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={i} material={thread} position={[-18 + i * 7, 4, -16 - i * 3]} rotation={[0.2, 0, 0.4]}>
          <boxGeometry args={[0.04, 30, 0.04]} />
        </mesh>
      ))}
    </group>
  );
}
