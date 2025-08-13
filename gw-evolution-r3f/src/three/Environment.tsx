import * as THREE from "three";
import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";

function makeCobbleTexture(size = 512, stones = 180) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  // Base grout color
  ctx.fillStyle = "#3a3c40";
  ctx.fillRect(0, 0, size, size);

  // Draw randomly sized rounded cobblestones with slight color variation
  for (let i = 0; i < stones; i++) {
    const cx = Math.random() * size;
    const cy = Math.random() * size;
    const rx = 12 + Math.random() * 22;
    const ry = 10 + Math.random() * 20;
    const rot = Math.random() * Math.PI;
    const lum = 0.55 + Math.random() * 0.2; // 0.55..0.75
    const col = Math.floor(lum * 255);
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);
    ctx.fillStyle = `rgb(${col},${col},${col})`;
    ctx.beginPath();
    // rounded ellipse-ish
    const steps = 16;
    for (let a = 0; a < steps; a++) {
      const t = (a / steps) * Math.PI * 2;
      const wobble = 1 + (Math.sin(t * 3 + i) * 0.12);
      const x = Math.cos(t) * rx * wobble;
      const y = Math.sin(t) * ry * wobble;
      if (a === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
    // edge shading
    const grad = ctx.createRadialGradient(0, 0, Math.min(rx, ry) * 0.2, 0, 0, Math.max(rx, ry));
    grad.addColorStop(0, "rgba(255,255,255,0.08)");
    grad.addColorStop(1, "rgba(0,0,0,0.18)");
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.restore();
  }

  // Hairline cracks
  ctx.strokeStyle = "rgba(0,0,0,0.15)";
  ctx.lineWidth = 1;
  for (let i = 0; i < 120; i++) {
    ctx.beginPath();
    ctx.moveTo(Math.random() * size, Math.random() * size);
    ctx.quadraticCurveTo(Math.random() * size, Math.random() * size, Math.random() * size, Math.random() * size);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  // Correct color space so the albedo isn't too dark (supports different three versions)
  const sRGB = (THREE as any).SRGBColorSpace ?? (THREE as any).sRGBEncoding;
  if (sRGB !== undefined) {
    (tex as any).colorSpace = sRGB;
    (tex as any).encoding = sRGB; // older three fallback
  }
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

export function DungeonFloor() {
  const { gl } = useThree();
  const map = useMemo(() => makeCobbleTexture(512, 180), []);
  // Repeat tiling
  map.repeat.set(6, 6);
  map.generateMipmaps = true;
  map.magFilter = THREE.LinearFilter;
  map.minFilter = THREE.LinearMipmapLinearFilter;
  map.anisotropy = Math.max(8, gl.capabilities.getMaxAnisotropy?.() ?? 8);
  const material = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color("#b9babd"),
    map,
    bumpMap: map,
    bumpScale: 0.05,
    roughness: 0.9,
    metalness: 0.0,
    dithering: true,
  }), [map]);

  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, 0, 0]} receiveShadow frustumCulled={false}>
      <planeGeometry args={[16, 16, 1, 1]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

export function DungeonWalls() {
  // An inward facing box to form stone-grey walls and ceiling
  return (
    <mesh position={[0, 3, 0]}>
      <boxGeometry args={[16.2, 8, 16.2, 1, 1, 1]} />
      <meshStandardMaterial color="#6f757c" roughness={1} metalness={0} side={THREE.BackSide} />
    </mesh>
  );
}

function Torch({ angle = 0, radius = 16 }: { angle?: number; radius?: number }) {
  const group = useRef<THREE.Group>(null);
  const light = useRef<THREE.PointLight>(null);
  const x = Math.cos(angle) * radius;
  const z = Math.sin(angle) * radius;
  const y = 2.2;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const flicker = 0.85 + Math.sin(t * 6 + angle) * 0.08 + Math.sin(t * 11.3 + angle * 0.5) * 0.04;
    if (light.current) light.current.intensity = 1.5 * flicker;
    if (group.current) group.current.position.y = y + Math.sin(t * 4.5 + angle) * 0.03;
  });

  return (
    <group ref={group} position={[x, y, z]}>
      {/* simple wall sconce */}
      <mesh rotation-y={-angle + Math.PI / 2} position={[0, -0.3, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.8, 8]} />
        <meshStandardMaterial color="#5a3d26" roughness={0.9} />
      </mesh>
      {/* emissive flame quad to trigger bloom */}
      <mesh position={[0, 0.1, 0]}>
        <planeGeometry args={[0.25, 0.35]} />
        <meshStandardMaterial color="#ffb347" emissive="#ff8c3a" emissiveIntensity={2.4} transparent opacity={0.9} />
      </mesh>
  <pointLight
        ref={light}
        color="#ffb347"
    intensity={1.4}
    distance={8}
        decay={2}
        castShadow={false}
      />
    </group>
  );
}

export function Torches() {
  // Six torches around the room like points on a hexagon
  const r = 7.8;
  const a = Math.PI / 3; // 60°
  return (
    <group>
      <Torch angle={0 * a} radius={r} />
      <Torch angle={1 * a} radius={r} />
      <Torch angle={2 * a} radius={r} />
      <Torch angle={3 * a} radius={r} />
      <Torch angle={4 * a} radius={r} />
      <Torch angle={5 * a} radius={r} />
    </group>
  );
}

export function Environment() {
  return (
    <group>
      <DungeonFloor />
      <DungeonWalls />
      <Torches />
    </group>
  );
}
