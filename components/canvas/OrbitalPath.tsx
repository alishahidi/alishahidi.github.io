'use client';

import { useMemo } from 'react';
import { Line } from '@react-three/drei';
import { generateOrbitPoints } from '@/lib/orbital/mechanics';

interface OrbitalPathProps {
  radius: number;
  tilt?: number;
  color?: string;
  opacity?: number;
  lineWidth?: number;
  focused?: boolean;
}

export function OrbitalPath({
  radius,
  tilt = 0,
  color = '#ffffff',
  opacity = 0.2,
  lineWidth = 1,
  focused = false,
}: OrbitalPathProps) {
  const points = useMemo(
    () => generateOrbitPoints(radius, 256, tilt),
    [radius, tilt]
  );

  return (
    <group>
      {/* Main orbit line */}
      <Line
        points={points}
        color={color}
        lineWidth={focused ? lineWidth * 2 : lineWidth}
        transparent
        opacity={focused ? opacity * 2.5 : opacity}
        dashed={!focused}
        dashSize={focused ? 0 : 1.5}
        gapSize={focused ? 0 : 1}
      />
      {/* Glow line (slightly wider, more transparent) */}
      {focused && (
        <Line
          points={points}
          color={color}
          lineWidth={lineWidth * 4}
          transparent
          opacity={opacity * 0.4}
        />
      )}
    </group>
  );
}
