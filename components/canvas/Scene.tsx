'use client';

import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { SolarSystem } from './SolarSystem';
import { Particles, Stars } from './Particles';
import { CameraController } from './CameraController';

interface SceneProps {
  glitchIntensity?: number;
}

function SceneContent() {
  return (
    <>
      {/* Ambient light — fill so dark sides of planets are still visible */}
      <ambientLight intensity={0.25} />

      {/* Fog — fade distant objects gracefully, pushed back so stars stay visible */}
      <fog attach="fog" args={['#060814', 220, 520]} />

      {/* Background elements */}
      <Stars count={4200} />
      <Particles count={80} spread={50} />

      {/* Solar System */}
      <SolarSystem />

      {/* Camera controls with planet tracking */}
      <CameraController minDistance={5} maxDistance={350} />
    </>
  );
}

export function Scene({ glitchIntensity = 0 }: SceneProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div
      className="fixed inset-0 bg-[#060814]"
      role="img"
      aria-label="Interactive 3D solar system: Ali Shahidi's career, where companies are planets, skills are moons, and projects are stations. A keyboard-accessible list of every body follows."
    >
      <Canvas
        camera={{
          position: [0, 40, 90],
          fov: 55,
          near: 0.1,
          far: 600,
        }}
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
        onCreated={() => setIsLoaded(true)}
        flat
      >
        <color attach="background" args={['#060814']} />

        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>

      {/* Loading indicator */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#060814]">
          <div className="text-[#FDB813] font-mono text-lg animate-pulse">
            Initializing solar system...
          </div>
        </div>
      )}
    </div>
  );
}
