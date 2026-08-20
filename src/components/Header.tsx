'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';

import LocaleSwitcher from '@/components/LocaleSwitcher';

const NAV = [
  { href: '/how-it-works', key: 'nav.howItWorks' },
  { href: '/projects/chihno', key: 'nav.project' },
  { href: '/security', key: 'nav.security' },
  { href: '/cares', key: 'nav.cares' },
  { href: '/verify', key: 'nav.verify' },
] as const;

export default function Header() {
  const [open, setOpen] = useState(false);
  const [condensed, setCondensed] = useState(false);
  const t = useTranslations('Header');

  // Condense the bar once the hero starts leaving. Passive listener reading a
  // single scalar — no layout reads, so this never costs a reflow.
  useEffect(() => {
    const onScroll = () => setCondensed(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock the page while the mobile drawer owns the screen.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <header
        className={`sticky top-0 z-50 border-b transition-[background-color,border-color,padding] duration-500 ${
          condensed
            ? 'bg-navy-deep/95 backdrop-blur-md border-gold/20 py-2'
            : 'bg-navy border-transparent py-3'
        }`}
      >
        <nav className="flex items-center justify-between gap-6 px-6 md:px-10 max-w-[1320px] mx-auto">
          <Link href="/" aria-label="Dream Smith Co-Own — home" className="flex items-center shrink-0 py-1 transition-opacity hover:opacity-90">
            <Image
              src="/images/logo/official-logo-full.png"
              alt="Dream Smith Co-Own"
              width={220}
              height={73}
              priority
              className="h-10 md:h-12 w-auto object-contain"
            />
          </Link>

          <div className="hidden lg:flex gap-8 items-center">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="nav-link text-ivory/70 text-[13px] tracking-wide hover:text-ivory"
              >
                {t(item.key)}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <LocaleSwitcher />
            <Link href="/portal" className="nav-link text-ivory/60 text-[13px] hover:text-ivory">
              {t('portalLink')}
            </Link>
            <Link href="/apply" className="btn-gold px-5 py-2.5 text-[13px]">
              {t('reserveShare')}
            </Link>
          </div>

          <div className="flex items-center gap-3 lg:hidden">
            <LocaleSwitcher />
            <button
              onClick={() => setOpen((v) => !v)}
              className="text-ivory p-2 -mr-2"
              aria-label={t('toggleMenuAria')}
              aria-expanded={open}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                {open ? (
                  <path strokeLinecap="square" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="square" d="M3 6h18M3 12h18M3 18h18" />
                )}
              </svg>
            </button>
          </div>
        </nav>
      </header>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden flex flex-col bg-navy-deep/98 backdrop-blur-xl pt-16 px-8 pb-12 overflow-y-auto animate-fade-in">
          <div className="flex items-center justify-between pb-6 mb-4 border-b border-gold/15">
            <Link href="/" onClick={() => setOpen(false)} className="flex items-center shrink-0">
              <Image
                src="/images/logo/official-logo-full.png"
                alt="Dream Smith Co-Own"
                width={180}
                height={60}
                priority
                className="h-9 w-auto object-contain"
              />
            </Link>
            <button
              onClick={() => setOpen(false)}
              className="text-ivory/70 hover:text-ivory p-2 -mr-2 transition-colors"
              aria-label="Close menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <path strokeLinecap="square" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex flex-col">
            {NAV.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="font-serif text-ivory text-[20px] py-4 border-b border-gold/15 flex items-baseline gap-4 hover:text-gold-bright transition-colors"
              >
                <span className="eyebrow text-gold/50 text-[10px]">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {t(item.key)}
              </Link>
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-3">
            <Link href="/apply" onClick={() => setOpen(false)} className="btn-gold w-full py-4 text-[15px]">
              {t('reserveShare')}
            </Link>
            <Link href="/portal" onClick={() => setOpen(false)} className="btn-outline w-full py-4 text-[14px]">
              {t('portalLinkMobile')}
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
