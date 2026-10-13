"use client";
import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { TECH } from "@/data/tech";

const GOLD = "#d4af37";

function Constellation({ quality }) {
  const group = useRef();
  const R = 2.6;
  const { items, lines } = useMemo(() => {
    const n = TECH.length;
    const golden = Math.PI * (3 - Math.sqrt(5));
    const items = TECH.map((t, i) => {
      const y = 1 - (i / (n - 1)) * 2;
      const rad = Math.sqrt(1 - y * y);
      return { ...t, pos: new THREE.Vector3(Math.cos(golden * i) * rad * R, y * R, Math.sin(golden * i) * rad * R) };
    });
    const pos = [];
    items.forEach((a, i) => items.forEach((b, j) => { if (j > i && a.pos.distanceTo(b.pos) < 2.6) pos.push(...a.pos.toArray(), ...b.pos.toArray()); }));
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
    return { items, lines: g };
  }, []);

  useFrame((_, dt) => { group.current.rotation.y += dt * 0.12; });

  return (
    <group ref={group}>
      <mesh><icosahedronGeometry args={[R, 2]} /><meshBasicMaterial color={GOLD} wireframe transparent opacity={0.06} /></mesh>
      <lineSegments geometry={lines}><lineBasicMaterial color={GOLD} transparent opacity={0.28} /></lineSegments>
      <mesh><sphereGeometry args={[0.35, 24, 24]} /><meshStandardMaterial color={GOLD} emissive={GOLD} emissiveIntensity={1.2} metalness={0.8} roughness={0.2} /></mesh>
      {items.map((t) => (
        <group key={t.name} position={t.pos}>
          <mesh><sphereGeometry args={[0.07, 12, 12]} /><meshBasicMaterial color="#fff3c4" /></mesh>
          <Html center distanceFactor={quality === "lite" ? 9 : 8} zIndexRange={[10, 0]} style={{ pointerEvents: "none" }}>
            <span className="whitespace-nowrap rounded-full border border-gold/40 bg-black/70 px-3 py-1 text-xs font-medium text-gold-light backdrop-blur-sm">{t.name}</span>
          </Html>
        </group>
      ))}
    </group>
  );
}

export default function TechSphere({ quality, active }) {
  return (
    <Canvas
      className="absolute! inset-0 cursor-grab active:cursor-grabbing"
      frameloop={active ? "always" : "never"}
      dpr={quality === "lite" ? 1 : [1, 1.5]}
      camera={{ position: [0, 0, 8.5], fov: 45 }}
      gl={{ antialias: quality === "full", alpha: true }}
    >
      <ambientLight intensity={0.6} />
      <pointLight position={[3, 3, 5]} intensity={30} />
      <Constellation quality={quality} />
      <OrbitControls enableZoom={false} enablePan={false} rotateSpeed={0.6} />
    </Canvas>
  );
}
