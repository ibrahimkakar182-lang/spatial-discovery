import * as THREE from "three";
import { journey } from "@/lib/journey";

/**
 * Standard material whose surface becomes transparent inside a soft
 * cursor-driven sphere — the "x-ray" inspection tool.
 */
export function makeXRayMaterial(params: THREE.MeshStandardMaterialParameters) {
  const m = new THREE.MeshStandardMaterial({ ...params, transparent: true });
  m.onBeforeCompile = (shader) => {
    shader.uniforms["uReveal"] = { value: journey.reveal };
    shader.uniforms["uRadius"] = { value: journey.revealR };
    (m.userData as Record<string, unknown>)["shader"] = shader;
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nvarying vec3 vWPosX;")
      .replace(
        "#include <begin_vertex>",
        "#include <begin_vertex>\nvWPosX = (modelMatrix * vec4(transformed, 1.0)).xyz;",
      );
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        "#include <common>\nvarying vec3 vWPosX;\nuniform vec3 uReveal;\nuniform float uRadius;",
      )
      .replace(
        "#include <dithering_fragment>",
        `#include <dithering_fragment>
        float dXR = length(vWPosX.xy - uReveal.xy);
        float mXR = 1.0 - smoothstep(uRadius * 0.2, uRadius, dXR);
        gl_FragColor.a *= (1.0 - mXR * 0.95);
        gl_FragColor.rgb += vec3(0.04, 0.07, 0.06) * mXR;`,
      );
  };
  return m;
}

export function setXRayRadius(m: THREE.Material, r: number) {
  const shader = (m.userData as Record<string, { uniforms: Record<string, { value: unknown }> }>)[
    "shader"
  ];
  if (shader) shader.uniforms["uRadius"]!.value = r;
}

export const MAT = {
  satinTeal: () =>
    new THREE.MeshStandardMaterial({ color: "#0a5a58", roughness: 0.42, metalness: 0.25 }),
  deepTeal: () =>
    new THREE.MeshStandardMaterial({ color: "#1D3F3E", roughness: 0.7, metalness: 0.1 }),
  champagne: () =>
    new THREE.MeshStandardMaterial({ color: "#B99555", roughness: 0.28, metalness: 0.92 }),
  aluminium: () =>
    new THREE.MeshStandardMaterial({ color: "#CFCBC2", roughness: 0.34, metalness: 0.95 }),
  paper: () => new THREE.MeshStandardMaterial({ color: "#F7F5EF", roughness: 0.94, metalness: 0 }),
  stone: () => new THREE.MeshStandardMaterial({ color: "#C7C1B4", roughness: 0.88, metalness: 0.03 }),
  acrylic: () =>
    new THREE.MeshPhysicalMaterial({
      color: "#EDE9DE",
      roughness: 0.18,
      metalness: 0,
      transmission: 0.55,
      thickness: 1.4,
      transparent: true,
      opacity: 0.85,
    }),
  terracotta: () =>
    new THREE.MeshStandardMaterial({ color: "#C9684E", roughness: 0.62, metalness: 0.05 }),
};
