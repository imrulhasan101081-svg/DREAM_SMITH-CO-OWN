'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import HeroSlideshow from './HeroSlideshow';
import Reveal from '@/components/motion/Reveal';

interface HeroContentProps {
  tEyebrow: string;
  tTitleLine1: string;
  tTitleLine2: string;
  tSubtitle: string;
  tReserveShare: string;
  tSeeHowItWorks: string;
  stats: {
    price: string;
    priceLabel: string;
    term: string;
    termLabel: string;
    termSuffix: string;
    returnRate: string;
    returnLabel: string;
    remaining: string;
    remainingLabel: string;
  };
}

export default function HeroContent({
  tEyebrow,
  tTitleLine1,
  tTitleLine2,
  tSubtitle,
  tReserveShare,
  tSeeHowItWorks,
  stats,
}: HeroContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  // Smooth scroll parallax transitions
  const contentY = useTransform(scrollYProgress, [0, 1], ['0px', '90px']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const statsY = useTransform(scrollYProgress, [0, 1], ['0px', '45px']);

  return (
    <section
      ref={containerRef}
      className="relative bg-navy-deep text-ivory overflow-hidden min-h-[94vh] flex flex-col justify-end"
    >
      {/* Background Architectural Slideshow */}
      <HeroSlideshow />

      {/* Structural Architectural Grid Lines — Fine 12-column hairlines */}
      <div
        className="absolute inset-0 hidden lg:grid grid-cols-12 max-w-[1360px] mx-auto px-8 md:px-12 pointer-events-none z-10"
        aria-hidden="true"
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="border-l border-ivory/[0.04] last:border-r" />
        ))}
      </div>

      {/* Foreground Hero Narrative */}
      <div className="relative z-20 max-w-[1360px] mx-auto px-6 md:px-12 pt-32 pb-16 md:pt-40 md:pb-20 w-full flex flex-col justify-end flex-1">
        <motion.div style={{ y: contentY, opacity: contentOpacity }} className="max-w-[860px]">
          
          {/* Institutional Scrolling Ticker Strip */}
          <Reveal y={14}>
            <div className="flex items-center gap-0 mb-8 overflow-hidden">
              {/* Status Badge — always visible, anchored left */}
              <div className="flex-shrink-0 flex items-center gap-2.5 bg-navy-surface/90 backdrop-blur-md border border-gold/40 px-3.5 py-1.5 rounded-sm z-10 mr-4">
                <span className="relative flex h-2 w-2" aria-hidden="true">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-bright opacity-60" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-bright" />
                </span>
                <span className="eyebrow text-[11px] text-gold-bright tracking-[0.24em] font-bold whitespace-nowrap">
                  OFFERING OPEN // TRANCHE 01 — RAJSHAHI
                </span>
              </div>

              {/* Scrolling ticker */}
              <div className="flex-1 overflow-hidden relative" aria-hidden="true">
                {/* Fade edges */}
                <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-navy-deep/80 to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-navy-deep/80 to-transparent z-10 pointer-events-none" />

                <div className="flex animate-hero-ticker whitespace-nowrap" style={{ animationDuration: '28s' }}>
                  {/* Duplicate items for seamless loop */}
                  {[0, 1].map((pass) => (
                    <div key={pass} className="flex items-center gap-0 flex-shrink-0">
                      {[
                        { icon: '⬡', label: 'FREEHOLD LAND TITLE ESCROW' },
                        { icon: '◈', label: 'DUAL-KEY BANK TRUST' },
                        { icon: '▣', label: '274 CO-OWN SHARES TOTAL' },
                        { icon: '◉', label: 'NOTARIZED STAMP AGREEMENT' },
                        { icon: '⬡', label: 'SUB-REGISTRY RAJSHAHI' },
                        { icon: '◈', label: '37.5% GUARANTEED YIELD' },
                        { icon: '▣', label: '36-MONTH BUYBACK COVENANT' },
                        { icon: '◉', label: 'RAJUK APPROVED STRUCTURE' },
                        { icon: '⬡', label: 'AZO GROUP CERTIFIED' },
                        { icon: '◈', label: '100 SQ.FT. PER SHARE' },
                        { icon: '▣', label: 'SHA-256 DEED HASH LEDGER' },
                        { icon: '◉', label: 'G+9 RESIDENTIAL COMPLEX' },
                      ].map((item) => (
                        <span
                          key={`${pass}-${item.label}`}
                          className="inline-flex items-center gap-2.5 px-5 font-mono text-[10px] tracking-[0.18em] text-ivory/55 uppercase border-r border-gold/15 last:border-r-0 leading-none py-1.5"
                        >
                          <span className="text-gold/60 text-[8px]">{item.icon}</span>
                          {item.label}
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          {/* Master Display Headline */}
          <h1 className="font-serif font-normal text-[clamp(44px,7.5vw,94px)] leading-[0.96] tracking-[-0.03em] text-balance">
            <Reveal as="span" className="block text-ivory drop-shadow-sm" y={32} delay={60}>
              {tTitleLine1}
            </Reveal>
            <Reveal as="span" className="block italic text-gold-gradient font-light mt-1" y={32} delay={140}>
              {tTitleLine2}
            </Reveal>
          </h1>

          {/* Subtitle / Value Proposition */}
          <Reveal delay={240} y={20}>
            <p className="mt-8 max-w-[620px] text-[16px] md:text-[17.5px] leading-[1.7] text-ivory/75 font-light text-balance">
              {tSubtitle}
            </p>
          </Reveal>

          {/* Primary Action Buttons */}
          <Reveal delay={340} y={20}>
            <div className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6 max-w-[500px] sm:max-w-none">
              <Link
                href="/apply"
                className="btn-gold px-9 py-4 text-[13.5px] font-semibold tracking-wider uppercase group text-center justify-center shadow-lg"
              >
                <span>{tReserveShare}</span>
                <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
              <Link
                href="/verify"
                className="inline-flex items-center justify-center gap-2 text-ivory/70 hover:text-gold-bright text-[13px] font-mono tracking-wider transition-colors duration-300 py-3"
              >
                <span>VERIFY DEED REGISTRY</span>
                <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </Reveal>
        </motion.div>

        {/* High-Precision Institutional Stat Rail */}
        <motion.div
          style={{ y: statsY }}
          className="mt-14 md:mt-24 border-t border-ivory/15 pt-8 bg-gradient-to-r from-navy-deep/60 via-navy-deep/40 to-transparent backdrop-blur-sm -mx-6 px-6 md:-mx-12 md:px-12"
        >
          <dl className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 sm:gap-x-8 gap-y-6 lg:gap-y-0 max-w-[1360px] mx-auto">
            {[
              { v: stats.price, k: stats.priceLabel, sub: 'Notarized Stamp Agreement' },
              { v: stats.term, k: stats.termLabel, suffix: stats.termSuffix, sub: '30 Mo Build + 6 Mo Settlement' },
              { v: stats.returnRate, k: stats.returnLabel, sub: 'Guaranteed Buy-Back Contract' },
              { v: stats.remaining, k: stats.remainingLabel, sub: 'Real-time Project Ledger' },
            ].map((stat, i) => (
              <Reveal
                key={stat.k}
                delay={100 * i}
                y={18}
                className={`py-2 lg:py-0 lg:px-8 first:lg:pl-0 ${
                  i > 0 ? 'lg:border-l border-ivory/15' : ''
                }`}
              >
                <dd className="font-serif text-[clamp(28px,3.2vw,40px)] leading-tight text-gold-gradient figures font-normal py-0.5">
                  {stat.v}
                  {stat.suffix && (
                    <span className="font-mono text-[12px] ml-1.5 text-gold-bright align-top font-medium tracking-wider">
                      {stat.suffix}
                    </span>
                  )}
                </dd>
                <dt className="eyebrow text-[10.5px] text-ivory/85 mt-2.5 tracking-[0.2em] font-bold">
                  {stat.k}
                </dt>
                <span className="block text-[11.5px] text-ivory/65 font-normal mt-1">
                  {stat.sub}
                </span>
              </Reveal>
            ))}
          </dl>
        </motion.div>
      </div>
    </section>
  );
}
