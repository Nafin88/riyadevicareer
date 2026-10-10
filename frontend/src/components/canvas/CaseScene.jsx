"use client";
import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, OrbitControls } from "@react-three/drei";

// Interactive "celestial orrery" used for the Laxmi Astro AI case study.
const PLANETS = [
  { r: 1.5, size: 0.14, speed: 0.9, color: "#f3dc85" },
  { r: 2.2, size: 0.2, speed: 0.6, color: "#d4af37" },
  { r: 3.0, size: 0.26, speed: 0.4, color: "#ffffff" },
  { r: 3.8, size: 0.18, speed: 0.28, color: "#a78bfa" },
];

function Planet({ r, size, speed, color, offset }) {
  const ref = useRef();
  useFrame((s) => {
    const a = s.clock.elapsedTime * speed + offset;
    ref.current.position.set(Math.cos(a) * r, Math.sin(a * 0.5) * 0.25, Math.sin(a) * r);
  });
  return (
    <>
      <mesh rotation={[Math.PI / 2, 0, 0]}><ringGeometry args={[r - 0.012, r + 0.012, 96]} /><meshBasicMaterial color="#d4af37" transparent opacity={0.3} side={2} /></mesh>
      <mesh ref={ref}><sphereGeometry args={[size, 24, 24]} /><meshStandardMaterial color={color} metalness={0.8} roughness={0.25} emissive={color} emissiveIntensity={0.15} /></mesh>
    </>
  );
}

export default function CaseScene({ quality, active }) {
  return (
    <Canvas className="!absolute inset-0 cursor-grab active:cursor-grabbing" frameloop={active ? "always" : "never"} dpr={quality === "lite" ? 1 : [1, 1.5]} camera={{ position: [0, 3.5, 7.5], fov: 45 }} gl={{ antialias: quality === "full", alpha: true }}>
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 0, 0]} intensity={60} color="#ffd978" />
      <Environment resolution={64} frames={1}>
        <Lightformer form="rect" intensity={3} position={[0, 4, 3]} scale={[6, 2, 1]} />
      </Environment>
      <mesh><sphereGeometry args={[0.7, 32, 32]} /><meshStandardMaterial color="#d4af37" emissive="#d4af37" emissiveIntensity={1.4} /></mesh>
      {PLANETS.map((p, i) => <Planet key={i} {...p} offset={i * 1.7} />)}
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.8} minPolarAngle={0.6} maxPolarAngle={1.8} />
    </Canvas>
  );
}
