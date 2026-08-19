'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useTransition } from 'react';

export default function LocaleSwitcher({ className = '' }: { className?: string }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const toggleLocale = (nextLocale: 'en' | 'bn') => {
    if (nextLocale === locale) return;
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <div className={`inline-flex items-center gap-1 p-0.5 rounded-sm bg-navy-deep/80 border border-gold/25 text-[11px] font-mono tracking-wider ${className}`}>
      <button
        type="button"
        disabled={isPending}
        onClick={() => toggleLocale('en')}
        className={`px-2 py-0.5 rounded-xs transition-all ${
          locale === 'en'
            ? 'bg-gold text-navy-deep font-semibold shadow-xs'
            : 'text-ivory/60 hover:text-ivory'
        }`}
        aria-label="Switch language to English"
      >
        EN
      </button>
      <span className="text-gold/30 text-[10px]" aria-hidden="true">|</span>
      <button
        type="button"
        disabled={isPending}
        onClick={() => toggleLocale('bn')}
        className={`px-2 py-0.5 rounded-xs transition-all font-sans ${
          locale === 'bn'
            ? 'bg-gold text-navy-deep font-semibold shadow-xs'
            : 'text-ivory/60 hover:text-ivory'
        }`}
        aria-label="বাংলা ভাষায় পরিবর্তন করুন"
      >
        বাংলা
      </button>
    </div>
  );
}
