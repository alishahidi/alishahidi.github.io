/**
 * The persistent Star, rendered as the hero centerpiece:
 * a breathing gold Sun with layered corona and dashed orbit rings, with
 * small bodies riding the rings. Pure CSS/SVG so it renders statically and
 * animates without JS — the same star that sits at the center of /explore.
 */
export function HeroSun({ className = '' }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none relative aspect-square w-full ${className}`}
    >
      {/* orbit rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg viewBox="-210 -130 420 260" className="h-auto w-full">
          {[74, 116, 162, 205].map((rx, i) => (
            <ellipse
              key={i}
              cx="0"
              cy="0"
              rx={rx}
              ry={rx * 0.34}
              fill="none"
              stroke="#FDB813"
              strokeOpacity={0.5 - i * 0.09}
              strokeWidth={1.1 - i * 0.15}
              strokeDasharray="2 7"
              className={i % 2 === 0 ? 'orbit-spin' : 'orbit-spin-rev'}
              style={{
                ['--orbit-dur' as string]: `${42 + i * 14}s`,
                transformBox: 'fill-box',
                transformOrigin: 'center',
              }}
            />
          ))}
          {/* small bodies riding the rings */}
          <circle cx="116" cy="0" r="3.2" fill="#9D7BFF">
            <animate attributeName="opacity" values="0.6;1;0.6" dur="3.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="-162" cy="0" r="2.6" fill="#48DFE3" />
          <circle cx="0" cy="-70" r="2.4" fill="#57D9A3" />
          <circle cx="74" cy="0" r="2.2" fill="#FFC24B" />
        </svg>
      </div>

      {/* soft corona halo — breathes on a slower, offset phase */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="sun-breathe h-52 w-52 rounded-full sm:h-64 sm:w-64"
          style={{
            ['--orbit-dur' as string]: '6s',
            animationDuration: '6s',
            background:
              'radial-gradient(circle, rgba(253,184,19,0.45) 0%, rgba(255,140,0,0.16) 42%, transparent 70%)',
            filter: 'blur(6px)',
          }}
        />
      </div>

      {/* slow-rotating flare rays */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="orbit-spin h-44 w-44 rounded-full sm:h-56 sm:w-56"
          style={{
            ['--orbit-dur' as string]: '120s',
            mixBlendMode: 'screen',
            background:
              'conic-gradient(from 0deg, transparent, rgba(255,224,138,0.10), transparent 25%, rgba(255,224,138,0.08), transparent 50%, rgba(255,224,138,0.10), transparent 75%, rgba(255,224,138,0.08), transparent)',
          }}
        />
      </div>

      {/* the star's photosphere — softened terminator, no hard edge */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="sun-breathe relative">
          <div
            className="h-28 w-28 rounded-full sm:h-36 sm:w-36"
            style={{
              background:
                'radial-gradient(circle at 38% 34%, #FFF3CE 0%, #FFE08A 22%, #FDB813 48%, #FF8C00 76%, rgba(232,118,11,0.82) 100%)',
              boxShadow:
                '0 0 50px 12px rgba(253,184,19,0.55), 0 0 130px 36px rgba(253,184,19,0.30), 0 0 260px 96px rgba(253,184,19,0.12)',
            }}
          />
        </div>
      </div>
    </div>
  );
}
