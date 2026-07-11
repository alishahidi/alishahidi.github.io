'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const LINKS = [
  { href: '#about', label: 'about' },
  { href: '#experience', label: 'experience' },
  { href: '#work', label: 'work' },
  { href: '#stack', label: 'stack' },
  { href: '#contact', label: 'contact' },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // firm the bar after a little scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // lock body scroll while the mobile sheet is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b backdrop-blur-xl transition-colors duration-300 ${
        scrolled ? 'border-white/10 bg-void/85' : 'border-white/5 bg-void/60'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-gold shadow-[0_0_12px_2px_rgba(253,184,19,0.6)]" />
          <span className="font-display text-[15px] font-semibold text-starlight">
            Ali Shahidi
          </span>
        </Link>

        <div className="flex items-center gap-5 sm:gap-8">
          <div className="hidden items-center gap-7 md:flex">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="link-sweep font-mono text-[13px] text-stardust transition-colors hover:text-starlight"
              >
                {l.label}
              </a>
            ))}
          </div>

          <Link
            href="/resume"
            className="rounded-full border border-gold/50 px-4 py-1.5 font-mono text-[13px] text-gold-bright transition-colors hover:bg-gold hover:text-void"
          >
            résumé
          </Link>

          {/* hamburger — mobile only */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="grid h-9 w-9 place-items-center rounded-md border border-white/12 text-starlight md:hidden"
          >
            <span className="relative block h-3 w-4" aria-hidden="true">
              <span
                className={`absolute left-0 block h-0.5 w-4 bg-current transition-transform duration-300 ${
                  open ? 'top-1.5 rotate-45' : 'top-0'
                }`}
              />
              <span
                className={`absolute left-0 top-1.5 block h-0.5 w-4 bg-current transition-opacity duration-200 ${
                  open ? 'opacity-0' : 'opacity-100'
                }`}
              />
              <span
                className={`absolute left-0 block h-0.5 w-4 bg-current transition-transform duration-300 ${
                  open ? 'top-1.5 -rotate-45' : 'top-3'
                }`}
              />
            </span>
          </button>
        </div>
      </nav>

      {/* full-screen cosmic sheet */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 top-16 z-40 origin-top bg-void/95 backdrop-blur-xl transition-all duration-300 md:hidden ${
          open ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      >
        <ul className="flex flex-col gap-1 px-6 py-6">
          {LINKS.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="flex min-h-[52px] items-center border-b border-white/5 font-mono text-lg text-starlight"
              >
                <span className="text-gold-bright">~/</span>
                {l.label}
              </a>
            </li>
          ))}
          <li className="mt-4">
            <Link
              href="/explore"
              onClick={() => setOpen(false)}
              className="flex min-h-[52px] items-center gap-2 font-mono text-lg text-gold-bright"
            >
              <span className="inline-block h-2 w-2 rounded-full bg-gold shadow-[0_0_10px_2px_rgba(253,184,19,0.6)]" />
              enter the universe →
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
