import { useMemo } from "react";
import * as THREE from "three";
import { EffectComposer, Bloom, Vignette, SMAA } from "@react-three/postprocessing";
import { Points, PointMaterial } from "@react-three/drei";
import { useThree } from "@react-three/fiber";

function ParticlesBackdrop({ count = 400 }: { count?: number }) {
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      // Distribute in a slab behind the scene (negative Z), above ground
      const x = (Math.random() * 2 - 1) * 10; // [-10, 10]
      const y = 0.6 + Math.random() * 6.5;    // [0.6, 7.1]
      const z = -4 - Math.random() * 8;       // [-4, -12]
      arr[i * 3 + 0] = x;
      arr[i * 3 + 1] = y;
      arr[i * 3 + 2] = z;
    }
    return arr;
  }, [count]);

  return (
    <Points positions={positions} stride={3} frustumCulled>
      <PointMaterial
        transparent
        color="#ffffff"
        size={0.03}
        sizeAttenuation
        opacity={0.08}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

export function Effects() {
  // Keep bloom conservative to avoid washing out UI colors
  const { gl } = useThree();
  const multisampling = (gl.capabilities as any)?.isWebGL2 ? 2 : 0;
  return (
    <>
      <ParticlesBackdrop />
      <EffectComposer multisampling={multisampling}>
        <SMAA />
        <Bloom luminanceThreshold={0.8} luminanceSmoothing={0.2} intensity={0.2} mipmapBlur />
        <Vignette eskil={false} offset={0.2} darkness={0.5} />
      </EffectComposer>
    </>
  );
}
