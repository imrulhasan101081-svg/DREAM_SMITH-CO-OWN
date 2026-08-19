'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('ErrorPage');

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen bg-navy text-ivory flex items-center justify-center px-8">
      <div className="max-w-[520px] text-center">
        <span className="font-mono text-[12px] tracking-[0.2em] uppercase text-gold mb-6 block">
          {t('eyebrow')}
        </span>
        <h1 className="font-serif font-normal text-[clamp(32px,4.5vw,48px)] leading-[1.1] tracking-[-0.01em] mb-6">
          {t('title')}
        </h1>
        <p className="text-[16px] text-ivory/60 leading-relaxed mb-10">
          {t('description')}
        </p>
        <button
          onClick={() => reset()}
          className="inline-block bg-gold text-navy-deep px-8 py-3.5 text-[14.5px] font-semibold tracking-wide rounded-sm transition-colors hover:bg-gold-bright"
        >
          {t('retry')}
        </button>
      </div>
    </main>
  );
}
