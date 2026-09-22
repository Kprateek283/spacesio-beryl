#!/bin/bash
mkdir -p src/three/materials
mkdir -p src/components/three

cat << 'INNER_EOF' > src/three/materials/MaterialManager.ts
import * as THREE from 'three';
export const Materials = {
  woodFloor: new THREE.MeshStandardMaterial({ color: '#8c6b4a', roughness: 0.4, metalness: 0.1 }),
  wallpaper: new THREE.MeshStandardMaterial({ color: '#e8e5df', roughness: 0.9, metalness: 0.0 }),
  blind: new THREE.MeshStandardMaterial({ color: '#f0f0f0', roughness: 0.8, side: THREE.DoubleSide }),
  windowFrame: new THREE.MeshStandardMaterial({ color: '#222222', roughness: 0.2, metalness: 0.8 }),
  glass: new THREE.MeshPhysicalMaterial({ color: '#ffffff', transmission: 0.9, opacity: 1, transparent: true, roughness: 0.1, ior: 1.5 }),
  sofa: new THREE.MeshStandardMaterial({ color: '#d4cebe', roughness: 0.8 }),
  table: new THREE.MeshStandardMaterial({ color: '#2d2d2d', roughness: 0.3, metalness: 0.5 }),
};
INNER_EOF

cat << 'INNER_EOF' > src/components/three/Floor.tsx
import { Materials } from '@/three/materials/MaterialManager';
export function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow material={Materials.woodFloor}>
      <planeGeometry args={[20, 20]} />
    </mesh>
  );
}
INNER_EOF

cat << 'INNER_EOF' > src/components/three/Wall.tsx
import { Materials } from '@/three/materials/MaterialManager';
export function Wall() {
  return (
    <group>
      <mesh position={[0, 2, -4]} receiveShadow material={Materials.wallpaper}>
        <boxGeometry args={[10, 4, 0.2]} />
      </mesh>
      <mesh position={[-5, 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow material={Materials.wallpaper}>
        <boxGeometry args={[10, 4, 0.2]} />
      </mesh>
      <mesh position={[5, 1, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow material={Materials.wallpaper}>
        <boxGeometry args={[10, 2, 0.2]} />
      </mesh>
      <mesh position={[5, 3.5, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow material={Materials.wallpaper}>
        <boxGeometry args={[10, 1, 0.2]} />
      </mesh>
    </group>
  );
}
INNER_EOF

cat << 'INNER_EOF' > src/components/three/Window.tsx
import { Materials } from '@/three/materials/MaterialManager';
export function Window() {
  return (
    <group position={[5, 2.5, 0]} rotation={[0, -Math.PI / 2, 0]}>
      <mesh material={Materials.windowFrame} position={[0, 0, 0]}>
        <boxGeometry args={[4, 2, 0.1]} />
      </mesh>
      <mesh material={Materials.glass} position={[0, 0, 0]}>
        <boxGeometry args={[3.8, 1.8, 0.05]} />
      </mesh>
    </group>
  );
}
INNER_EOF

cat << 'INNER_EOF' > src/components/three/Blinds.tsx
import { forwardRef } from 'react';
import { Materials } from '@/three/materials/MaterialManager';
import { Group } from 'three';
export const Blinds = forwardRef<Group>((props, ref) => {
  return (
    <group ref={ref} position={[4.9, 3.5, 0]} rotation={[0, -Math.PI / 2, 0]}>
      <mesh material={Materials.blind} position={[0, -1, 0]} castShadow>
        <boxGeometry args={[4.2, 2, 0.02]} />
      </mesh>
    </group>
  );
});
Blinds.displayName = 'Blinds';
INNER_EOF

cat << 'INNER_EOF' > src/components/three/Furniture.tsx
import { Materials } from '@/three/materials/MaterialManager';
export function Furniture() {
  return (
    <group>
      <mesh position={[0, 0.4, -2]} castShadow receiveShadow material={Materials.sofa}>
        <boxGeometry args={[3, 0.8, 1]} />
      </mesh>
      <mesh position={[0, 0.3, -0.5]} castShadow receiveShadow material={Materials.table}>
        <cylinderGeometry args={[0.6, 0.6, 0.6, 32]} />
      </mesh>
      <mesh position={[-3, 1.5, -3]} castShadow material={Materials.table}>
        <cylinderGeometry args={[0.05, 0.1, 3, 16]} />
      </mesh>
    </group>
  );
}
INNER_EOF

cat << 'INNER_EOF' > src/components/three/Lighting.tsx
export function Lighting() {
  return (
    <group>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 5, 2]} intensity={1.5} castShadow shadow-mapSize={[1024, 1024]} color="#fff0dd" />
      <directionalLight position={[-5, 5, 5]} intensity={0.3} color="#d4e4ff" />
    </group>
  );
}
INNER_EOF

cat << 'INNER_EOF' > src/components/three/RoomEnvironment.tsx
import { Environment } from '@react-three/drei';
export function RoomEnvironment() {
  return <Environment preset="city" />;
}
INNER_EOF

cat << 'INNER_EOF' > src/components/three/CameraController.tsx
import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import * as THREE from 'three';

export function CameraController({ blindsRef }: { blindsRef: React.RefObject<THREE.Group> }) {
  const { camera } = useThree();
  const target = useRef(new THREE.Vector3(0, 1, 0));

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    camera.position.set(0, 1.5, 4);
    camera.lookAt(target.current);

    const tl = gsap.timeline({
      scrollTrigger: { trigger: "#hero-scroll-track", start: "top top", end: "bottom bottom", scrub: 1 }
    });

    tl.to(camera.position, { x: 0, y: 0.5, z: 2, duration: 2, ease: "power1.inOut" }, 0)
      .to(target.current, { x: 0, y: 0.0, z: 0, duration: 2, ease: "power1.inOut", onUpdate: () => camera.lookAt(target.current) }, 0);

    tl.to(camera.position, { x: -2, y: 1.5, z: 1, duration: 2, ease: "power1.inOut" }, 2)
      .to(target.current, { x: -4, y: 2, z: -2, duration: 2, ease: "power1.inOut", onUpdate: () => camera.lookAt(target.current) }, 2);

    tl.to(camera.position, { x: 1, y: 1.5, z: 1, duration: 2, ease: "power1.inOut" }, 4)
      .to(target.current, { x: 5, y: 1.5, z: -1, duration: 2, ease: "power1.inOut", onUpdate: () => camera.lookAt(target.current) }, 4);

    if (blindsRef.current) {
      tl.to(blindsRef.current.scale, { y: 0.1, duration: 1.5, ease: "power2.inOut" }, 5);
    }

    tl.to(camera.position, { x: 0, y: 1.5, z: 4.5, duration: 2, ease: "power1.inOut" }, 6.5)
      .to(target.current, { x: 0, y: 1, z: -2, duration: 2, ease: "power1.inOut", onUpdate: () => camera.lookAt(target.current) }, 6.5);

    return () => { tl.kill(); };
  }, [camera, blindsRef]);

  return null;
}
INNER_EOF

cat << 'INNER_EOF' > src/components/three/LoadingScreen.tsx
import { Html, useProgress } from '@react-three/drei';
export function LoadingScreen() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center w-screen h-screen">
        <h1 className="font-serif text-2xl tracking-widest uppercase mb-4 text-white">Spacesio Beryl</h1>
        <p className="text-sm tracking-widest uppercase text-white/70 mb-4">Preparing the Space</p>
        <div className="w-48 h-[1px] bg-white/20 relative overflow-hidden">
          <div className="absolute top-0 left-0 h-full bg-white transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </Html>
  );
}
INNER_EOF

cat << 'INNER_EOF' > src/components/three/RoomScene.tsx
import { useRef } from 'react';
import { Floor } from './Floor';
import { Wall } from './Wall';
import { Window } from './Window';
import { Blinds } from './Blinds';
import { Furniture } from './Furniture';
import { Lighting } from './Lighting';
import { RoomEnvironment } from './RoomEnvironment';
import { CameraController } from './CameraController';
import * as THREE from 'three';

export function RoomScene() {
  const blindsRef = useRef<THREE.Group>(null);
  
  return (
    <>
      <RoomEnvironment />
      <Lighting />
      <group position={[0, -1, 0]}>
        <Floor />
        <Wall />
        <Window />
        <Blinds ref={blindsRef} />
        <Furniture />
      </group>
      <CameraController blindsRef={blindsRef} />
    </>
  );
}
INNER_EOF

cat << 'INNER_EOF' > src/components/three/ImmersiveRoom.tsx
"use client";

import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { RoomScene } from './RoomScene';
import { LoadingScreen } from './LoadingScreen';
import Image from 'next/image';

export function ImmersiveRoom() {
  const [mounted, setMounted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  if (!mounted) return null;

  if (reducedMotion) {
    return (
      <div className="absolute inset-0 z-0">
        <Image src="/assets/images/landing/hero.jpg" alt="Premium architectural space" fill priority className="object-cover object-center" sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"></div>
        <div className="absolute inset-0 bg-black/20"></div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-0 bg-[#111]">
      <Canvas shadows camera={{ position: [0, 1.5, 4], fov: 45 }} gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }} dpr={[1, 2]}>
        <Suspense fallback={<LoadingScreen />}>
          <RoomScene />
        </Suspense>
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent pointer-events-none"></div>
    </div>
  );
}
INNER_EOF

chmod +x setup_phase3.sh
./setup_phase3.sh
