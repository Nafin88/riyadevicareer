"use client";
import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, Lightformer, Line, OrbitControls, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { usePointer } from "./usePointer";

const GOLD = "#d4af37";
const DARK = "#17171b";

const gold = <meshStandardMaterial color={GOLD} metalness={1} roughness={0.22} />;
const dark = <meshStandardMaterial color={DARK} metalness={0.7} roughness={0.35} />;

/** Tilts its children toward the cursor for cheap, convincing parallax. */
function Tilt({ pointer, children, amount = 0.35 }) {
  const g = useRef();
  useFrame((_, dt) => {
    g.current.rotation.y = THREE.MathUtils.damp(g.current.rotation.y, pointer.current.x * amount, 4, dt);
    g.current.rotation.x = THREE.MathUtils.damp(g.current.rotation.x, -pointer.current.y * amount * 0.6, 4, dt);
  });
  return <group ref={g}>{children}</group>;
}

/* ---------- Web Development: browser window with content blocks ---------- */
function Browser() {
  const blocks = [[-0.9, 0.35, 1.1, 0.7], [0.55, 0.45, 1.3, 0.35], [0.55, -0.05, 1.3, 0.35], [-0.9, -0.55, 1.1, 0.5], [0.55, -0.6, 1.3, 0.35]];
  return (
    <Float speed={1.6} rotationIntensity={0.2} floatIntensity={0.6}>
      <RoundedBox args={[3.4, 2.4, 0.14]} radius={0.08} smoothness={4}>{dark}</RoundedBox>
      <mesh position={[0, 1.0, 0.08]}><boxGeometry args={[3.4, 0.34, 0.04]} />{gold}</mesh>
      {[-1.45, -1.25, -1.05].map((x, i) => <mesh key={i} position={[x, 1.0, 0.12]}><sphereGeometry args={[0.055, 12, 12]} /><meshBasicMaterial color={["#ff5f57", "#febc2e", "#28c840"][i]} /></mesh>)}
      {blocks.map(([x, y, w, h], i) => (
        <mesh key={i} position={[x, y - 0.1, 0.09 + i * 0.012]}><boxGeometry args={[w, h, 0.03]} /><meshStandardMaterial color={i % 2 ? "#2a2a31" : GOLD} metalness={0.5} roughness={0.4} /></mesh>
      ))}
    </Float>
  );
}

/* ---------- App Development: phone with orbiting app tiles ---------- */
function Phone() {
  const tiles = useRef();
  useFrame((_, dt) => { tiles.current.rotation.y += dt * 0.6; });
  return (
    <Float speed={1.4} floatIntensity={0.5}>
      <RoundedBox args={[1.35, 2.7, 0.16]} radius={0.17} smoothness={4}>{dark}</RoundedBox>
      <mesh position={[0, 0, 0.09]}><planeGeometry args={[1.18, 2.5]} /><meshStandardMaterial color="#0b0b0e" emissive="#241c05" emissiveIntensity={0.8} /></mesh>
      {[0.8, 0.2, -0.4].map((y, i) => <mesh key={i} position={[0, y, 0.1]}><planeGeometry args={[0.95, 0.42]} /><meshStandardMaterial color={i === 0 ? GOLD : "#2a2a31"} metalness={0.4} roughness={0.5} /></mesh>)}
      <mesh position={[0, -1.0, 0.1]}><circleGeometry args={[0.16, 24]} /><meshBasicMaterial color={GOLD} /></mesh>
      <group ref={tiles}>
        {[0, 1, 2, 3].map((i) => {
          const a = (i / 4) * Math.PI * 2;
          return <RoundedBox key={i} args={[0.42, 0.42, 0.1]} radius={0.1} position={[Math.cos(a) * 1.7, Math.sin(a * 2) * 0.5, Math.sin(a) * 1.7]}>{i % 2 ? gold : dark}</RoundedBox>;
        })}
      </group>
    </Float>
  );
}

/* ---------- Digital Marketing: animated growth bars + trend line ---------- */
function Growth() {
  const bars = useRef();
  const h = [0.5, 0.75, 0.65, 1.1, 1.5, 2.0];
  useFrame((s) => {
    const t = s.clock.elapsedTime;
    bars.current.children.forEach((m, i) => {
      const k = 0.78 + 0.22 * Math.sin(t * 1.3 + i * 0.7);
      m.scale.y = THREE.MathUtils.lerp(m.scale.y, h[i] * k, 0.1);
      m.position.y = (m.scale.y * 1) / 2 - 1;
    });
  });
  const line = h.map((v, i) => new THREE.Vector3(-1.35 + i * 0.54, v - 0.85, 0.35));
  return (
    <Float speed={1.2} floatIntensity={0.4}>
      <group ref={bars}>
        {h.map((_, i) => <mesh key={i} position={[-1.35 + i * 0.54, 0, 0]}><boxGeometry args={[0.36, 1, 0.36]} />{i === h.length - 1 ? gold : <meshStandardMaterial color="#3a3a42" metalness={0.8} roughness={0.3} />}</mesh>)}
      </group>
      <Line points={line} color="#fff3c4" lineWidth={2.5} />
      <mesh position={[1.45, 1.2, 0.35]} rotation={[0, 0, -0.5]}><coneGeometry args={[0.14, 0.34, 16]} />{gold}</mesh>
      <mesh position={[0, -1.03, 0]}><boxGeometry args={[3.6, 0.05, 0.7]} />{dark}</mesh>
    </Float>
  );
}

/* ---------- AR / VR: immersive room with rotating portals ---------- */
function Immersive() {
  const rings = useRef();
  useFrame((s, dt) => {
    rings.current.children.forEach((r, i) => { r.rotation.x += dt * (0.4 + i * 0.25); r.rotation.y += dt * (0.3 + i * 0.15); });
  });
  return (
    <Float speed={1.3} floatIntensity={0.3}>
      <mesh><boxGeometry args={[3.2, 3.2, 3.2]} /><meshBasicMaterial color={GOLD} wireframe transparent opacity={0.28} /></mesh>
      <group ref={rings}>
        {[0.55, 0.95, 1.35].map((r, i) => <mesh key={i}><torusGeometry args={[r, 0.025 + i * 0.006, 12, 80]} />{gold}</mesh>)}
      </group>
      <mesh><icosahedronGeometry args={[0.32, 1]} /><meshStandardMaterial color="#fff3c4" emissive={GOLD} emissiveIntensity={1.6} /></mesh>
    </Float>
  );
}

/* ---------- 3D Modeling: drag-to-rotate torus knot ---------- */
function Model({ quality }) {
  return (
    <mesh>
      <torusKnotGeometry args={[0.85, 0.3, quality === "lite" ? 120 : 260, quality === "lite" ? 16 : 40]} />
      <meshStandardMaterial color={GOLD} metalness={0.85} roughness={0.28} envMapIntensity={1.2} emissive="#5a4208" emissiveIntensity={0.6} />
    </mesh>
  );
}

/* ---------- UI/UX: floating interface panels ---------- */
function Interface() {
  const panels = [
    { p: [-0.6, 0.55, 0.3], s: [1.9, 1.2], c: DARK, z: 0.18 },
    { p: [0.9, -0.5, 0.9], s: [1.4, 0.9], c: GOLD, z: 0.14 },
    { p: [-1.0, -0.85, -0.3], s: [1.1, 0.7], c: "#2a2a31", z: 0.12 },
    { p: [1.2, 0.9, -0.6], s: [0.9, 0.9], c: "#2a2a31", z: 0.12 },
  ];
  return (
    <>
      {panels.map((pn, i) => (
        <Float key={i} speed={1.2 + i * 0.3} floatIntensity={0.9} rotationIntensity={0.25}>
          <group position={pn.p}>
            <RoundedBox args={[pn.s[0], pn.s[1], 0.07]} radius={0.07} smoothness={4}><meshStandardMaterial color={pn.c} metalness={pn.c === GOLD ? 1 : 0.6} roughness={0.3} /></RoundedBox>
            <mesh position={[-pn.s[0] / 2 + 0.28, pn.s[1] / 2 - 0.2, 0.05]}><boxGeometry args={[0.35, 0.07, 0.02]} /><meshBasicMaterial color={pn.c === GOLD ? "#000" : GOLD} /></mesh>
            <mesh position={[0, -0.05, 0.05]}><boxGeometry args={[pn.s[0] * 0.75, 0.05, 0.02]} /><meshBasicMaterial color={pn.c === GOLD ? "#00000066" : "#ffffff30"} transparent /></mesh>
          </group>
        </Float>
      ))}
    </>
  );
}

const SCENES = { browser: Browser, phone: Phone, growth: Growth, immersive: Immersive, model: Model, interface: Interface };

export default function ServiceScene({ kind = "browser", quality, active, className = "" }) {
  const pointer = usePointer();
  const Scene = SCENES[kind] || Browser;
  const draggable = kind === "model";
  return (
    <Canvas
      className={`!absolute inset-0 ${className}`}
      frameloop={active ? "always" : "never"}
      dpr={quality === "lite" ? 1 : [1, 1.6]}
      camera={{ position: [0, 0, 6.2], fov: 40 }}
      gl={{ antialias: quality === "full", alpha: true, powerPreference: "high-performance" }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[4, 4, 4]} intensity={35} color="#fff1c2" />
      <pointLight position={[-4, -2, 3]} intensity={14} color={GOLD} />
      <Environment resolution={64} frames={1}>
        <Lightformer form="rect" intensity={4} position={[0, 3, 3]} scale={[6, 2, 1]} />
        <Lightformer form="rect" intensity={2} position={[-4, 0, 2]} scale={[2, 5, 1]} color="#ffd978" />
        {/* warm fill so metal surfaces never reflect pure black */}
        <Lightformer form="rect" intensity={1.4} position={[0, 0, -6]} scale={[24, 12, 1]} color="#a3822a" />
        <Lightformer form="rect" intensity={1.2} position={[0, -4, 2]} scale={[12, 2, 1]} color="#c9a43a" />
      </Environment>
      {draggable ? (
        <>
          <Scene quality={quality} />
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1.6} />
        </>
      ) : (
        <Tilt pointer={pointer} amount={0.5}><Scene quality={quality} /></Tilt>
      )}
    </Canvas>
  );
}
