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
          
          {/* Eyebrow & Institutional Trust Tag */}
          <Reveal y={14}>
            <div className="flex flex-wrap items-center gap-3.5 mb-8">
              <div className="flex items-center gap-3 bg-navy-surface/80 backdrop-blur-md border border-gold/30 px-3.5 py-1.5 rounded-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-gold-bright animate-pulse" aria-hidden="true" />
                <span className="eyebrow text-[10px] text-gold-bright font-mono tracking-widest uppercase">
                  {tEyebrow}
                </span>
              </div>
              <span className="hidden sm:inline-block w-8 h-px bg-gold/40" aria-hidden="true" />
              <span className="hidden sm:inline-block font-mono text-[10px] text-ivory/50 tracking-widest uppercase">
                FRACTIONAL CO-OWNERSHIP PROGRAMME
              </span>
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
            <div className="mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4 max-w-[440px] sm:max-w-none">
              <Link
                href="/apply"
                className="btn-gold px-9 py-4 text-[14px] font-semibold tracking-wider uppercase group text-center justify-center"
              >
                <span>{tReserveShare}</span>
                <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
              <Link
                href="/how-it-works"
                className="btn-outline px-8 py-4 text-[14px] tracking-wide text-center justify-center"
              >
                {tSeeHowItWorks}
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
                <dd className="font-serif text-[clamp(28px,3.2vw,40px)] leading-none text-gold-gradient figures font-normal">
                  {stat.v}
                  {stat.suffix && (
                    <span className="font-mono text-[12px] ml-1.5 text-gold/80 align-top font-medium tracking-wider">
                      {stat.suffix}
                    </span>
                  )}
                </dd>
                <dt className="eyebrow text-[9.5px] text-ivory/60 mt-3 tracking-wider font-mono">
                  {stat.k}
                </dt>
                <span className="block text-[11px] text-ivory/35 font-light mt-1">
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
