'use client';

import { useState } from 'react';

/**
 * The contact email as a big mailto link, plus a small copy button so a visitor
 * can grab the address without launching a mail client they may not want.
 */
export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable — the mailto link still works */
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
      <a
        href={`mailto:${email}`}
        className="font-display inline-block text-2xl font-bold tracking-tight text-starlight transition-colors [overflow-wrap:anywhere] hover:text-gold-bright sm:text-4xl lg:text-5xl"
      >
        {email}
      </a>
      <button
        type="button"
        onClick={copy}
        className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/12 px-4 py-2 font-mono text-[13px] text-stardust transition-colors hover:border-gold hover:text-gold-bright"
      >
        {copied ? (
          <>
            <span className="text-aurora" aria-hidden="true">
              ✓
            </span>
            copied
          </>
        ) : (
          <>
            <span aria-hidden="true">⧉</span>
            copy
          </>
        )}
      </button>
    </div>
  );
}
