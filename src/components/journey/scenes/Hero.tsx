import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { MAT, makeXRayMaterial, setXRayRadius } from "../materials";
import { journey, span, ease } from "@/lib/journey";
import { readingPageTexture } from "../textures";

/**
 * Scene 00 — a physical installation room. Enormous slabs, a sculptural
 * TOEFL26PLUS monogram, and four miniature engine environments hidden behind it.
 */
export function Hero() {
  const skin = useMemo(
    () => makeXRayMaterial({ color: "#12817c", roughness: 0.34, metalness: 0.45 }),
    [],
  );
  const edge = useMemo(() => MAT.champagne(), []);
  const slab = useMemo(() => MAT.deepTeal(), []);
  const paper = useMemo(() => MAT.paper(), []);
  const alu = useMemo(() => MAT.aluminium(), []);
  const terra = useMemo(() => MAT.terracotta(), []);
  const page = useMemo(() => readingPageTexture(0), []);

  const group = useRef<THREE.Group>(null);
  const hidden = useRef<THREE.Group>(null);
  const ringA = useRef<THREE.Mesh>(null);
  const strands = useRef<THREE.Group>(null);

  useFrame((_, dt) => {
    const p = journey.sp;
    const g = group.current;
    if (g) {
      g.rotation.y = journey.spx * 0.1;
      g.rotation.x = -journey.spy * 0.05;
      // the monogram opens up as the camera pushes into it
      const open = ease(span(p, 0.1, 0.22));
      g.children.forEach((c, i) => {
        c.position.x = c.userData["x"] + open * (i % 2 ? 5.5 : -5.5);
      });
    }
    if (hidden.current) {
      hidden.current.rotation.y = journey.spx * 0.16;
      hidden.current.children.forEach((c, i) => {
        c.position.y = c.userData["y"] + Math.sin(performance.now() * 0.0004 + i) * 0.5;
      });
    }
    if (ringA.current) ringA.current.rotation.z += dt * 0.08;
    if (strands.current) {
      strands.current.children.forEach((c, i) => {
        c.scale.y = 1 + Math.sin(performance.now() * 0.0012 + i * 0.6) * 0.25;
      });
    }
    setXRayRadius(skin, journey.revealR);
  });

  const Slab = ({
    pos,
    size,
    rot = [0, 0, 0] as [number, number, number],
  }: {
    pos: [number, number, number];
    size: [number, number, number];
    rot?: [number, number, number];
  }) => (
    <group position={pos} rotation={rot} userData={{ x: pos[0] }}>
      <mesh material={skin} castShadow>
        <boxGeometry args={size} />
      </mesh>
      <mesh material={edge} position={[0, 0, size[2] / 2 + 0.02]}>
        <boxGeometry args={[size[0] * 0.985, 0.34, 0.08]} />
      </mesh>
    </group>
  );

  return (
    <group>
      {/* architectural room */}
      <mesh material={slab} position={[0, -22, -34]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[240, 200]} />
      </mesh>
      <mesh material={slab} position={[-44, 6, -40]}>
        <boxGeometry args={[26, 90, 8]} />
      </mesh>
      <mesh material={slab} position={[46, 2, -52]}>
        <boxGeometry args={[34, 110, 8]} />
      </mesh>
      <mesh material={slab} position={[0, 34, -60]}>
        <boxGeometry args={[160, 12, 8]} />
      </mesh>

      {/* hidden engine environments — only visible through the x-ray */}
      <group ref={hidden} position={[0, 0, -11]} scale={0.72}>
        <group position={[-13, 4, 0]} userData={{ y: 4 }}>
          <mesh material={paper} rotation={[0, 0.22, 0.03]}>
            <planeGeometry args={[11, 15]} />
          </mesh>
          <mesh position={[0, 0, 0.06]} rotation={[0, 0.22, 0.03]}>
            <planeGeometry args={[11, 15]} />
            <meshBasicMaterial map={page} toneMapped={false} />
          </mesh>
        </group>
        <group position={[12, 6, -2]} userData={{ y: 6 }}>
          <mesh ref={ringA} material={alu}>
            <torusGeometry args={[6, 0.28, 12, 90]} />
          </mesh>
          <mesh material={alu} scale={0.6}>
            <torusGeometry args={[6, 0.2, 12, 90]} />
          </mesh>
        </group>
        <group ref={strands} position={[-4, -10, -3]} userData={{ y: -10 }}>
          {Array.from({ length: 22 }).map((_, i) => (
            <mesh key={i} material={terra} position={[i * 0.5 - 5.5, 0, Math.sin(i) * 0.6]}>
              <boxGeometry args={[0.08, 7, 0.08]} />
            </mesh>
          ))}
        </group>
        <group position={[15, -9, 1]} userData={{ y: -9 }}>
          <mesh material={paper} rotation={[0, -0.3, -0.06]}>
            <planeGeometry args={[9, 12]} />
          </mesh>
          <mesh material={edge} position={[0, -6.4, 0.2]}>
            <boxGeometry args={[9, 0.14, 0.14]} />
          </mesh>
        </group>
      </group>

      {/* the monogram: a physical T / 26 / + composition */}
      <group ref={group} position={[0, 0, 2]}>
        <Slab pos={[-13, 0, 0]} size={[6, 40, 5]} />
        <Slab pos={[-13, 16, 3]} size={[30, 6, 5]} />
        <Slab pos={[9, -6, 0]} size={[5, 26, 5]} />
        <Slab pos={[16, -18, 1]} size={[18, 5, 5]} />
        <Slab pos={[24, 12, -1]} size={[16, 5, 5]} />
        <Slab pos={[24, 12, -1]} size={[5, 16, 5]} rot={[0, 0, 0]} />
      </group>

      {/* suspended objects */}
      <mesh material={edge} position={[-26, -14, 8]} rotation={[0.4, 0.2, 0.1]}>
        <torusGeometry args={[3.4, 0.16, 10, 60]} />
      </mesh>
      <mesh material={MAT.stone()} position={[28, 20, 6]} rotation={[0.2, 0.5, 0]}>
        <boxGeometry args={[4, 6, 0.4]} />
      </mesh>
    </group>
  );
}
