import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { MAT } from "../materials";
import { transcriptTexture } from "../textures";
import { journey, span, ease } from "@/lib/journey";

const MARKS = ["EMPHASIS", "TRANSITION", "CONTRAST", "EXAMPLE", "KEY INFORMATION"];

function Panel({
  angle,
  radius,
  z,
  label,
}: {
  angle: number;
  radius: number;
  z: number;
  label: string;
}) {
  const [on, setOn] = useState(false);
  const mat = useMemo(() => MAT.aluminium(), []);
  const ref = useRef<THREE.Mesh>(null);
  useFrame(() => {
    if (!ref.current) return;
    const t = (ref.current.material as THREE.MeshStandardMaterial);
    t.roughness += ((on ? 0.12 : 0.34) - t.roughness) * 0.1;
    ref.current.scale.z += ((on ? 1.7 : 1) - ref.current.scale.z) * 0.1;
  });
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;
  return (
    <group position={[x, y, z]} rotation={[0, 0, angle - Math.PI / 2]}>
      <mesh
        ref={ref}
        material={mat}
        onPointerOver={() => setOn(true)}
        onPointerOut={() => setOn(false)}
      >
        <boxGeometry args={[5.5, 0.5, 2.4]} />
      </mesh>
      {on && (
        <Html position={[0, 1.6, 0]} center className="pointer-events-none">
          <div className="label-xs whitespace-nowrap text-ivory">{label}</div>
        </Html>
      )}
    </group>
  );
}

/** Scene 02 — a physical acoustic chamber of concentric metal rings. */
export function Listening({ z }: { z: number }) {
  const alu = useMemo(() => MAT.aluminium(), []);
  const warm = useMemo(
    () => new THREE.MeshStandardMaterial({ color: "#EFEADF", roughness: 0.55, metalness: 0.2 }),
    [],
  );
  const teal = useMemo(() => MAT.satinTeal(), []);
  const transcript = useMemo(() => transcriptTexture(), []);
  const rings = useRef<THREE.Group>(null);
  const portal = useRef<THREE.Mesh>(null);
  const script = useRef<THREE.Group>(null);

  useFrame((_, dt) => {
    const p = journey.sp;
    if (rings.current) {
      rings.current.children.forEach((c, i) => {
        c.rotation.z += dt * (0.05 + i * 0.012) * (i % 2 ? -1 : 1);
      });
      rings.current.rotation.x = journey.spy * 0.06;
      rings.current.rotation.y = journey.spx * 0.08;
    }
    if (script.current) {
      const t = ease(span(p, 0.5, 0.58));
      script.current.position.y = -6 + t * 5;
      script.current.scale.setScalar(0.4 + t * 0.9);
    }
    if (portal.current) {
      const t = ease(span(p, 0.56, 0.64));
      portal.current.scale.setScalar(0.4 + t * 9);
    }
  });

  return (
    <group position={[0, 0, z]}>
      <mesh material={teal} position={[0, -30, -20]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[240, 200]} />
      </mesh>
      <group ref={rings}>
        {[26, 20, 15, 11].map((r, i) => (
          <mesh key={r} material={i % 2 ? alu : warm} position={[0, 0, -i * 15]}>
            <torusGeometry args={[r, 0.6 - i * 0.08, 14, 140]} />
          </mesh>
        ))}
      </group>

      {/* curved acoustic panels on the outer ring */}
      {Array.from({ length: 10 }).map((_, i) => (
        <Panel
          key={i}
          angle={(i / 10) * Math.PI * 2}
          radius={22}
          z={-4}
          label={MARKS[i % MARKS.length]!}
        />
      ))}

      {/* a speech fragment made physical */}
      <group ref={script} position={[0, -6, -26]}>
        <mesh>
          <planeGeometry args={[24, 12]} />
          <meshBasicMaterial map={transcript} transparent toneMapped={false} />
        </mesh>
      </group>

      {/* the sound event that becomes the portal into Speaking */}
      <mesh ref={portal} material={alu} position={[0, 0, -56]}>
        <torusGeometry args={[4, 0.5, 14, 120]} />
      </mesh>
      <mesh position={[0, 0, -58]} material={warm}>
        <circleGeometry args={[3.4, 60]} />
      </mesh>
    </group>
  );
}
