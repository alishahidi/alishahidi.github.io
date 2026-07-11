'use client';

import { useState, useCallback, useEffect, Component, ReactNode, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { AchievementPopup } from '@/components/overlays/AchievementPopup';
import { GlitchOverlay } from '@/components/overlays/GlitchOverlay';
import { MatrixRain } from '@/components/shared/MatrixRain';
import { HUD } from '@/components/ui/HUD';
import { Terminal } from '@/components/ui/Terminal';
import { NodeDetail } from '@/components/ui/NodeDetail';
import { MiniMap } from '@/components/ui/MiniMap';
import { Tooltip } from '@/components/ui/Tooltip';
import { Legend } from '@/components/ui/Legend';
import { useKeyboard, useKonamiCode } from '@/hooks/useKeyboard';
import { useGraphStore } from '@/stores/graphStore';

// Error boundary for the solar-system scene
class SceneErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 bg-[#060814] flex items-center justify-center">
          <div className="text-[#EAF0FF] font-mono text-center p-8">
            <h2 className="text-xl mb-4 text-[#FF6B6B]">Scene Error</h2>
            <p className="text-sm opacity-70">{this.state.error?.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 border border-[#FF6B6B] rounded hover:bg-[#FF6B6B]/20"
            >
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Dynamically import Scene to avoid SSR issues with Three.js
const Scene = dynamic(
  () => import('@/components/canvas/Scene').then((mod) => mod.Scene),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 bg-[#060814] flex items-center justify-center">
        <div className="text-[#48DFE3] font-mono text-lg animate-pulse">
          Loading consciousness...
        </div>
      </div>
    ),
  }
);

function ExploreContent() {
  const searchParams = useSearchParams();
  const nodeParam = searchParams.get('node');

  const [matrixEnabled, setMatrixEnabled] = useState(true);
  const [glitchActive, setGlitchActive] = useState(false);
  const [glitchIntensity, setGlitchIntensity] = useState(0);

  const setFocusedNode = useGraphStore((state) => state.setFocusedNode);
  const getNode = useGraphStore((state) => state.getNode);

  // Keyboard shortcuts
  useKeyboard({ enabled: true });

  // Handle URL node parameter - auto-focus the node
  useEffect(() => {
    if (nodeParam) {
      const node = getNode(nodeParam);
      if (node) {
        // Small delay to ensure scene is ready
        setTimeout(() => {
          setFocusedNode(nodeParam);
        }, 500);
      }
    }
  }, [nodeParam, setFocusedNode, getNode]);

  // Konami code easter egg
  useKonamiCode(() => {
    setGlitchActive(true);
    setGlitchIntensity(1);
    setTimeout(() => {
      setGlitchActive(false);
      setGlitchIntensity(0);
    }, 2000);
  });

  // Handle glitch trigger from terminal
  const handleGlitch = useCallback(() => {
    setGlitchActive(true);
    setGlitchIntensity(0.5);
    setTimeout(() => {
      setGlitchActive(false);
      setGlitchIntensity(0);
    }, 1000);
  }, []);

  // Handle theme change from terminal
  const handleThemeChange = useCallback((theme: string) => {
    console.log('Theme changed to:', theme);
  }, []);

  // Handle matrix rain toggle
  const handleMatrixToggle = useCallback(() => {
    setMatrixEnabled((prev) => !prev);
  }, []);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#060814]">
      {/* Matrix rain background */}
      <MatrixRain enabled={matrixEnabled} opacity={0.05} />

      {/* Solar system scene */}
      <SceneErrorBoundary>
        <Scene glitchIntensity={glitchIntensity} />
      </SceneErrorBoundary>

      {/* UI Overlays */}
      <HUD />
      <NodeDetail />
      <MiniMap />
      <Legend />
      <Tooltip />
      <Terminal
        onGlitch={handleGlitch}
        onThemeChange={handleThemeChange}
        onMatrixToggle={handleMatrixToggle}
      />

      {/* Achievement popup */}
      <AchievementPopup />

      {/* Glitch overlay */}
      <GlitchOverlay
        active={glitchActive}
        onComplete={() => setGlitchActive(false)}
      />

      {/* Back to the main site */}
      <Link
        href="/"
        className="fixed bottom-4 left-4 z-50 font-mono text-xs text-[#FDB813]/70 hover:text-[#FDB813] border border-[#FDB813]/40 hover:border-[#FDB813] rounded px-3 py-1.5 bg-[#060814]/60 backdrop-blur-sm transition-colors"
      >
        ← exit to alishahidi.net
      </Link>
    </main>
  );
}

// Wrapper with Suspense for useSearchParams
export default function Explore() {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 bg-[#060814] flex items-center justify-center">
          <div className="text-[#48DFE3] font-mono text-lg animate-pulse">
            Loading...
          </div>
        </div>
      }
    >
      <ExploreContent />
    </Suspense>
  );
}
