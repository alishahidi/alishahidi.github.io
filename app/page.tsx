'use client';

import { useState, useCallback, useEffect, Component, ReactNode, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { WelcomeScreen } from '@/components/overlays/WelcomeScreen';
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

// Error boundary for 3D scene
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
        <div className="fixed inset-0 bg-black flex items-center justify-center">
          <div className="text-red-500 font-mono text-center p-8">
            <h2 className="text-xl mb-4">Scene Error</h2>
            <p className="text-sm opacity-70">{this.state.error?.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 border border-red-500 rounded hover:bg-red-500/20"
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
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="text-[#00ff41] font-mono text-lg animate-pulse">
          Loading consciousness...
        </div>
      </div>
    ),
  }
);

function HomeContent() {
  const searchParams = useSearchParams();
  const nodeParam = searchParams.get('node');

  const [showWelcome, setShowWelcome] = useState(!nodeParam); // Skip welcome if node param exists
  const [matrixEnabled, setMatrixEnabled] = useState(true);
  const [glitchActive, setGlitchActive] = useState(false);
  const [glitchIntensity, setGlitchIntensity] = useState(0);

  const setFocusedNode = useGraphStore((state) => state.setFocusedNode);
  const getNode = useGraphStore((state) => state.getNode);

  // Keyboard shortcuts
  useKeyboard({ enabled: !showWelcome });

  // Handle URL node parameter - auto-focus the node
  useEffect(() => {
    if (nodeParam && !showWelcome) {
      const node = getNode(nodeParam);
      if (node) {
        // Small delay to ensure scene is ready
        setTimeout(() => {
          setFocusedNode(nodeParam);
        }, 500);
      }
    }
  }, [nodeParam, showWelcome, setFocusedNode, getNode]);

  // Konami code easter egg
  useKonamiCode(() => {
    setGlitchActive(true);
    setGlitchIntensity(1);
    setTimeout(() => {
      setGlitchActive(false);
      setGlitchIntensity(0);
    }, 2000);
  });

  // Handle welcome screen completion
  const handleWelcomeComplete = useCallback(() => {
    setShowWelcome(false);
  }, []);

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
    // Could implement different color themes here
    console.log('Theme changed to:', theme);
  }, []);

  // Handle matrix rain toggle
  const handleMatrixToggle = useCallback(() => {
    setMatrixEnabled((prev) => !prev);
  }, []);

  // Handle enter key during welcome
  useEffect(() => {
    if (!showWelcome) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleWelcomeComplete();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showWelcome, handleWelcomeComplete]);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-black">
      {/* Matrix rain background */}
      <MatrixRain enabled={matrixEnabled && !showWelcome} opacity={0.05} />

      {/* 3D Scene */}
      {!showWelcome && (
        <SceneErrorBoundary>
          <Scene glitchIntensity={glitchIntensity} />
        </SceneErrorBoundary>
      )}

      {/* UI Overlays */}
      {!showWelcome && (
        <>
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
        </>
      )}

      {/* Welcome screen */}
      {showWelcome && <WelcomeScreen onComplete={handleWelcomeComplete} />}

      {/* Achievement popup */}
      <AchievementPopup />

      {/* Glitch overlay */}
      <GlitchOverlay
        active={glitchActive}
        onComplete={() => setGlitchActive(false)}
      />
    </main>
  );
}

// Wrapper with Suspense for useSearchParams
export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="fixed inset-0 bg-black flex items-center justify-center">
          <div className="text-[#00ff41] font-mono text-lg animate-pulse">
            Loading...
          </div>
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  );
}
