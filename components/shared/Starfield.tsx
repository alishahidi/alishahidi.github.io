'use client';

import { useEffect, useRef } from 'react';

/**
 * The shared sky. A single fixed starfield rendered behind every page so the
 * homepage and the /explore universe read as one continuous cosmos.
 * Three parallax depth layers drift and twinkle slowly; honors reduced motion
 * by drawing a single static star map.
 */

interface Star {
  x: number;
  y: number;
  r: number;
  base: number; // base opacity
  tw: number; // twinkle phase
  twSpeed: number;
  depth: number; // 0 far .. 1 near (parallax factor)
  color: string;
}

const STAR_COLORS = ['#EAF0FF', '#EAF0FF', '#EAF0FF', '#9AA5CC', '#9D7BFF', '#FDB813'];

// deterministic PRNG so SSR and layers stay stable across reloads
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let stars: Star[] = [];
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0;
    let height = 0;
    let scrollY = window.scrollY;

    const build = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const rand = mulberry32(20260710);
      // density scales with viewport area, capped for perf
      const count = Math.min(240, Math.floor((width * height) / 7000));
      stars = Array.from({ length: count }, () => {
        const depth = rand();
        return {
          x: rand() * width,
          y: rand() * (height * 1.6), // extra height so scroll parallax has material
          r: depth * 1.3 + 0.35,
          base: 0.25 + rand() * 0.6,
          tw: rand() * Math.PI * 2,
          twSpeed: 0.6 + rand() * 1.4,
          depth,
          color: STAR_COLORS[Math.floor(rand() * STAR_COLORS.length)],
        };
      });
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height);
      for (const s of stars) {
        const parY = -scrollY * (0.04 + s.depth * 0.12);
        let y = s.y + parY;
        // wrap within a 1.6x band
        const band = height * 1.6;
        y = ((y % band) + band) % band;
        if (y > height + 4) continue;
        const twinkle = reduce ? 1 : 0.65 + 0.35 * Math.sin(t * 0.001 * s.twSpeed + s.tw);
        ctx.globalAlpha = Math.max(0, Math.min(1, s.base * twinkle));
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x, y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    let raf = 0;
    let start = 0;
    const loop = (ts: number) => {
      if (!start) start = ts;
      draw(ts - start);
      raf = requestAnimationFrame(loop);
    };

    build();
    if (reduce) {
      draw(0);
    } else {
      raf = requestAnimationFrame(loop);
    }

    const onScroll = () => {
      scrollY = window.scrollY;
      if (reduce) draw(0);
    };
    const onResize = () => {
      build();
      if (reduce) draw(0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="site-starfield pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse 120% 90% at 50% -10%, #0B1024 0%, #070B1A 45%, #050712 70%, #03040A 100%)',
      }}
    >
      {/* nebula depth glows */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(38rem 30rem at 78% 12%, rgba(157,123,255,0.10), transparent 70%), radial-gradient(34rem 28rem at 15% 85%, rgba(72,223,227,0.07), transparent 70%)',
        }}
      />
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  );
}
