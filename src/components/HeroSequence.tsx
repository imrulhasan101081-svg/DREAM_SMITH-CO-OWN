"use client";

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';

interface HeroSequenceProps {
  totalShares: number;
  project: any;
}

export default function HeroSequence({ totalShares, project }: HeroSequenceProps) {
  const t = useTranslations('HomePage.hero');
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Parallax calculations
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacityText = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scaleImage = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const yCard = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);

  // Stagger variants for the text content
  const textContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const textItem = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const } }
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-[90vh] md:min-h-[85vh] flex items-center overflow-hidden bg-navy-deep text-ivory"
    >
      {/* Background Image with Parallax & Scale */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y: yBg, scale: scaleImage }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-navy-deep via-navy-deep/90 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-transparent to-transparent z-10" />
        <Image
          src="/images/chinnoh/e928590c-a2d0-4b44-8b59-a1599be59f9f.jpeg"
          alt="Chihno Render"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-40 mix-blend-overlay"
        />
      </motion.div>

      <div className="max-w-[1180px] mx-auto px-8 w-full relative z-20 pt-24 pb-20">
        <div className="grid md:grid-cols-[1.2fr_0.8fr] gap-14 items-center">

          {/* Left Column: Typography */}
          <motion.div
            variants={textContainer}
            initial="hidden"
            animate="show"
            style={{ opacity: opacityText }}
          >
            <motion.div variants={textItem} className="inline-flex items-center gap-2.5 font-mono text-[11px] tracking-[0.2em] text-gold uppercase mb-8 before:content-[''] before:w-[30px] before:h-px before:bg-gold">
              {t('eyebrow')}
            </motion.div>

            <motion.h1 variants={textItem} className="font-serif font-normal text-[clamp(42px,5.5vw,72px)] leading-[1.05] tracking-[-0.02em] mb-7">
              {t('titleLine1')} <br />
              <em className="italic font-normal text-gold-bright">{t('titleLine2')}</em>
            </motion.h1>

            <motion.p variants={textItem} className="text-[17px] text-ivory/80 max-w-[500px] mb-10 leading-relaxed font-light">
              {t('subtitle')}
            </motion.p>

            <motion.div variants={textItem} className="flex gap-4 flex-wrap mb-16">
              <Link href="/apply" className="bg-gold text-navy-deep px-8 py-4 text-[14.5px] font-semibold tracking-wide rounded-sm transition-all hover:bg-gold-bright hover:-translate-y-px shadow-lg shadow-gold/20">
                {t('reserveShare')}
              </Link>
              <Link href="/#how" className="border border-ivory/20 text-ivory px-8 py-4 text-[14.5px] font-medium tracking-wide rounded-sm transition-all hover:border-gold-bright hover:text-gold-bright hover:bg-ivory/5 backdrop-blur-sm">
                {t('seeHowItWorks')}
              </Link>
            </motion.div>

            <motion.div variants={textItem} className="flex gap-10 flex-wrap pt-8 border-t border-ivory/10">
              <div>
                <b className="block font-serif text-[28px] font-medium text-gold-bright mb-1">৳4,00,000</b>
                <span className="text-[11.5px] text-ivory/50 font-mono tracking-wider">{t('statPricePerShare')}</span>
              </div>
              <div>
                <b className="block font-serif text-[28px] font-medium text-gold-bright mb-1">36 MONTHS</b>
                <span className="text-[11.5px] text-ivory/50 font-mono tracking-wider">{t('statTerm')}</span>
              </div>
              <div>
                <b className="block font-serif text-[28px] font-medium text-gold-bright mb-1">12.5%</b>
                <span className="text-[11.5px] text-ivory/50 font-mono tracking-wider">{t('statReturn')}</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: 3D Certificate Card Parallax */}
          <motion.div
            style={{ y: yCard }}
            initial={{ opacity: 0, x: 40, rotateY: 15 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] as const, delay: 0.6 }}
            className="max-w-[380px] md:max-w-none mx-auto perspective-1000 hidden md:block"
          >
            <div className="bg-gradient-to-br from-[#FBF8F0] to-[#F3EDDC] border border-gold rounded text-ink p-8 pb-7 relative shadow-2xl rotate-1 transform-style-3d hover:rotate-0 hover:scale-[1.02] transition-transform duration-700 ease-out before:content-[''] before:absolute before:inset-2 before:border before:border-gold/50 before:rounded-sm before:pointer-events-none">
              <div className="absolute -top-3.5 right-5 bg-sage text-white font-mono text-[10px] px-3 py-1.5 rounded-full tracking-wide shadow-md">
                ● {t('cert.liveVerified')}
              </div>
              <div className="flex justify-between items-start mb-5">
                <div className="font-mono text-[10px] text-gold tracking-widest mt-1">{t('cert.certNo')}</div>
                <div className="w-12 h-12 rounded-full border-[1.5px] border-gold p-1 flex items-center justify-center shrink-0 overflow-hidden bg-navy shadow-sm">
                  <Image
                    src="/images/logo/official-logo-icon.png"
                    alt="Official Seal"
                    width={38}
                    height={38}
                    className="object-contain"
                  />
                </div>
              </div>
              <div className="font-serif text-[12px] tracking-[0.16em] uppercase text-navy text-center mb-1">{t('cert.companyName')}</div>
              <div className="font-serif italic text-[22px] text-center text-gold mb-6">{t('cert.certificateTitle')}</div>
              <div className="flex justify-between text-[11.5px] py-2.5 border-b border-dashed border-navy/15"><span className="text-ink/50 font-mono tracking-wide">{t('cert.holderLabel')}</span><span className="font-semibold font-serif">A. Rahman</span></div>
              <div className="flex justify-between text-[11.5px] py-2.5 border-b border-dashed border-navy/15"><span className="text-ink/50 font-mono tracking-wide">{t('cert.projectLabel')}</span><span className="font-semibold font-serif">Chihno, Oxoy More</span></div>
              <div className="flex justify-between text-[11.5px] py-2.5 border-b border-dashed border-navy/15"><span className="text-ink/50 font-mono tracking-wide">{t('cert.shareLabel')}</span><span className="font-semibold font-serif">{t('cert.shareValue')}</span></div>
              <div className="flex justify-between text-[11.5px] py-2.5 border-b border-dashed border-navy/15"><span className="text-ink/50 font-mono tracking-wide">{t('cert.maturesLabel')}</span><span className="font-semibold font-serif">14 Aug 2029</span></div>
              <div className="flex justify-between text-[11.5px] py-2.5"><span className="text-ink/50 font-mono tracking-wide">{t('cert.buybackLabel')}</span><span className="font-semibold font-serif text-gold-bright">৳5,50,000</span></div>

              <div className="flex justify-between items-center mt-6">
                <div className="w-[50px] h-[50px] bg-navy grid grid-cols-4 grid-rows-4 gap-[2px] p-1.5 rounded-sm">
                  {Array.from({length: 16}).map((_, i) => (
                    <div key={i} className={i % 2 === 0 ? "bg-transparent" : "bg-ivory"} />
                  ))}
                </div>
                <div className="text-right">
                  <div className="font-serif italic text-[14px] text-navy">Md. Golam Dastagir</div>
                  <div className="text-[9.5px] text-ink/50 font-mono tracking-wide">{t('cert.mdTitle')}</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
