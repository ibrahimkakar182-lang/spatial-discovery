import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { MAT } from "../materials";
import { readingPageTexture } from "../textures";
import { journey, span, ease, lerp } from "@/lib/journey";

const LAYERS = ["MAIN IDEA", "EVIDENCE", "INFERENCE", "ORGANISATION"];

function Sentence({
  position,
  width,
  layer,
}: {
  position: [number, number, number];
  width: number;
  layer: string;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const [on, setOn] = useState(false);
  const ink = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#1b2624", roughness: 0.8 }),
    [],
  );
  useFrame(() => {
    if (!ref.current) return;
    ref.current.position.z = lerp(ref.current.position.z, on ? position[2] + 1.6 : position[2], 0.12);
  });
  return (
    <group>
      <mesh
        ref={ref}
        material={ink}
        position={position}
        onPointerOver={() => setOn(true)}
        onPointerOut={() => setOn(false)}
      >
        <boxGeometry args={[width, 0.5, 0.12]} />
      </mesh>
      {on && (
        <Html
          position={[position[0] - width / 2, position[1] - 1.1, position[2]]}
          className="pointer-events-none"
        >
          <div className="label-xs whitespace-nowrap text-ivory/90">
            <span className="text-champagne">— </span>
            {layer}
          </div>
        </Html>
      )}
    </group>
  );
}

/** Scene 01 — an editorial installation: enormous academic pages in teal space. */
export function Reading({ z }: { z: number }) {
  const paper = useMemo(() => MAT.paper(), []);
  const stone = useMemo(() => MAT.stone(), []);
  const teal = useMemo(() => MAT.deepTeal(), []);
  const champ = useMemo(() => MAT.champagne(), []);
  const pages = useMemo(() => [readingPageTexture(0), readingPageTexture(1), readingPageTexture(2)], []);
  const group = useRef<THREE.Group>(null);
  const gate = useRef<THREE.Group>(null);

  useFrame(() => {
    const p = journey.sp;
    if (group.current) {
      group.current.rotation.y = journey.spx * 0.05;
      group.current.position.y = journey.spy * 1.2;
    }
    if (gate.current) {
      // the chosen sentence grows into a doorway at the end of Reading
      const t = ease(span(p, 0.36, 0.44));
      const s = 1 + t * 26;
      gate.current.scale.set(s, s, 1);
      gate.current.position.y = -t * 2;
    }
  });

  return (
    <group position={[0, 0, z]} ref={group}>
      <mesh material={teal} position={[0, -26, -14]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[220, 160]} />
      </mesh>
      <mesh material={stone} position={[-40, 0, -18]}>
        <boxGeometry args={[10, 80, 10]} />
      </mesh>
      <mesh material={stone} position={[40, 0, -30]}>
        <boxGeometry args={[10, 80, 10]} />
      </mesh>

      {pages.map((tex, i) => (
        <group key={i} position={[i === 0 ? -4 : i === 1 ? 16 : -20, i * 2 - 2, -i * 16]} rotation={[0, i === 1 ? -0.32 : 0.18, i * 0.02]}>
          <mesh material={paper} castShadow>
            <boxGeometry args={[26, 37, 0.35]} />
          </mesh>
          <mesh position={[0, 0, 0.2]}>
            <planeGeometry args={[26, 37]} />
            <meshBasicMaterial map={tex} toneMapped={false} />
          </mesh>
          {i === 0 && (
            <>
              <Sentence position={[-2, 2.4, 0.4]} width={17} layer={LAYERS[0]!} />
              <Sentence position={[-3, 0.2, 0.4]} width={15} layer={LAYERS[1]!} />
              <Sentence position={[-2.5, -2, 0.4]} width={16} layer={LAYERS[2]!} />
              <Sentence position={[-4, -4.2, 0.4]} width={13} layer={LAYERS[3]!} />
            </>
          )}
        </group>
      ))}

      {/* annotation threads */}
      {Array.from({ length: 7 }).map((_, i) => (
        <mesh key={i} material={champ} position={[-14 + i * 5, 14 - (i % 3) * 4, -4]} rotation={[0, 0, 0.5]}>
          <boxGeometry args={[0.05, 6, 0.05]} />
        </mesh>
      ))}

      {/* the sentence that becomes the doorway into Listening */}
      <group ref={gate} position={[0, 0, -34]}>
        <mesh material={paper} position={[-2.4, 0, 0]}>
          <boxGeometry args={[1.1, 4, 0.4]} />
        </mesh>
        <mesh material={paper} position={[2.4, 0, 0]}>
          <boxGeometry args={[1.1, 4, 0.4]} />
        </mesh>
        <mesh material={champ} position={[0, 2.2, 0]}>
          <boxGeometry args={[6, 0.5, 0.4]} />
        </mesh>
      </group>
    </group>
  );
}
