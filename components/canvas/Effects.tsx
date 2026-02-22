'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Scanline,
  Noise,
  Vignette,
} from '@react-three/postprocessing';
import { BlendFunction, KernelSize } from 'postprocessing';
import { Vector2 } from 'three';

interface EffectsProps {
  enableBloom?: boolean;
  enableChromaticAberration?: boolean;
  enableScanlines?: boolean;
  enableNoise?: boolean;
  enableVignette?: boolean;
  glitchIntensity?: number;
}

export function Effects({
  enableBloom = true,
  enableChromaticAberration = false,
  enableScanlines = true,
  enableNoise = true,
  enableVignette = true,
  glitchIntensity = 0,
}: EffectsProps) {
  const chromaticRef = useRef<any>(null);

  useFrame((state) => {
    if (chromaticRef.current && glitchIntensity > 0) {
      const time = state.clock.elapsedTime;
      const glitch = Math.sin(time * 20) * glitchIntensity;
      chromaticRef.current.offset.x = glitch * 0.002;
      chromaticRef.current.offset.y = glitch * 0.001;
    }
  });

  // If no effects are enabled, return null
  if (!enableBloom && !enableChromaticAberration && !enableScanlines && !enableNoise && !enableVignette && glitchIntensity === 0) {
    return null;
  }

  return (
    <EffectComposer>
      <Bloom
        intensity={enableBloom ? 0.5 : 0}
        luminanceThreshold={0.2}
        luminanceSmoothing={0.9}
        kernelSize={KernelSize.MEDIUM}
      />

      <ChromaticAberration
        ref={chromaticRef}
        offset={new Vector2(
          enableChromaticAberration || glitchIntensity > 0 ? 0.0005 : 0,
          enableChromaticAberration || glitchIntensity > 0 ? 0.0005 : 0
        )}
        blendFunction={BlendFunction.NORMAL}
      />

      <Scanline
        blendFunction={BlendFunction.OVERLAY}
        density={1.2}
        opacity={enableScanlines ? 0.05 : 0}
      />

      <Noise
        blendFunction={BlendFunction.OVERLAY}
        opacity={enableNoise ? 0.02 : 0}
      />

      <Vignette
        offset={0.3}
        darkness={enableVignette ? 0.6 : 0}
        blendFunction={BlendFunction.NORMAL}
      />
    </EffectComposer>
  );
}
