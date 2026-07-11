'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Reveals its children once they scroll into view. Pure IntersectionObserver +
 * a CSS class (.io-reveal / .is-in) so reduced-motion is handled entirely in
 * CSS — reduced-motion users see content immediately, never hidden.
 */
export function Reveal({
  children,
  delay = 0,
  as: Tag = 'div',
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  as?: 'div' | 'section' | 'article' | 'li';
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || shown) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [shown]);

  // cast to a single element type so TS resolves ref/children (runtime uses the real tag)
  const Component = Tag as 'div';
  return (
    <Component
      ref={ref as React.Ref<HTMLDivElement>}
      className={`io-reveal ${shown ? 'is-in' : ''} ${className}`}
      style={{ ['--io-delay' as string]: `${delay}s` }}
    >
      {children}
    </Component>
  );
}
