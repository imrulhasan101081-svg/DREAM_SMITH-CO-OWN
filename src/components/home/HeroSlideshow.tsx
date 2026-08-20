'use client';

import { useState, useEffect, useCallback } from 'react';
import Image, { StaticImageData } from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

import heroAerial from '../../../public/images/chihno/hero-aerial.jpg';
import facade from '../../../public/images/chihno/facade.jpg';
import entrance from '../../../public/images/chihno/entrance.jpg';
import tower from '../../../public/images/chihno/tower.jpg';

export interface Slide {
  id: string;
  image: StaticImageData | string;
  code: string;
  title: string;
  category: string;
  alt: string;
}

const slides: Slide[] = [
  {
    id: 'aerial',
    image: heroAerial,
    code: '01',
    title: 'AERIAL VIEW',
    category: 'RUET & Kazla Frontage',
    alt: 'Aerial view of Dream Smith Chihno, Oxoy More, Kazla, Rajshahi',
  },
  {
    id: 'facade',
    image: facade,
    code: '02',
    title: 'ARCHITECTURAL FACADE',
    category: 'Modern Structured Elevation',
    alt: 'Dream Smith Chihno architectural building facade',
  },
  {
    id: 'entrance',
    image: entrance,
    code: '03',
    title: 'MAIN ENTRANCE & PLAZA',
    category: 'Commercial & Residential Gateway',
    alt: 'Dream Smith Chihno main entrance and street frontage',
  },
  {
    id: 'tower',
    image: tower,
    code: '04',
    title: '10-STOREY TOWER',
    category: 'Flagship Vertical Asset',
    alt: 'Dream Smith Chihno 10-storey landmark tower',
  },
];

const SLIDE_DURATION = 6500; // 6.5s per perspective

export default function HeroSlideshow() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, SLIDE_DURATION);

    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  return (
    <div
      className="absolute inset-0 overflow-hidden select-none pointer-events-auto"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Architectural Plates with Ken Burns Zoom */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={slides[currentIndex].id}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1.12 }}
          exit={{ opacity: 0, scale: 1.18 }}
          transition={{
            opacity: { duration: 1.6, ease: [0.16, 1, 0.3, 1] },
            scale: { duration: SLIDE_DURATION / 1000 + 1.2, ease: 'linear' },
          }}
          className="absolute inset-0 w-full h-full"
        >
          <Image
            src={slides[currentIndex].image}
            alt={slides[currentIndex].alt}
            fill
            priority
            placeholder={typeof slides[currentIndex].image !== 'string' ? 'blur' : undefined}
            sizes="100vw"
            className="object-cover object-center"
          />
        </motion.div>
      </AnimatePresence>

      {/* Multi-layered Architectural Scrims for text legibility & rich luxury atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-r from-navy-deep via-navy-deep/88 via-45% to-navy-deep/20 pointer-events-none z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/40 to-transparent pointer-events-none z-10" />
      <div className="absolute inset-0 bg-radial-vignette opacity-60 pointer-events-none z-10" />

      {/* Ambient subtle gold lighting at top-left corner */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none z-10" />

      {/* Top-Right Architectural Coordinates & Perspective Metadata */}
      <div className="absolute top-28 right-6 md:right-12 z-30 hidden lg:flex flex-col items-end gap-2">
        <div className="flex items-center gap-3 bg-navy-deep/80 backdrop-blur-md border border-gold/25 px-4 py-2 rounded-sm shadow-2xl">
          <span className="w-1.5 h-1.5 rounded-full bg-gold-bright animate-pulse" />
          <span className="font-mono text-[10px] text-ivory/80 tracking-widest uppercase">
            24°22&apos;18.4&quot;N 88°37&apos;03.8&quot;E · RAJSHAHI
          </span>
        </div>
      </div>

      {/* Architectural Slide Controller Strip (Bottom Right) */}
      <div className="absolute bottom-28 right-6 md:right-12 z-30 hidden md:flex flex-col items-end gap-3 max-w-sm">
        {/* Active Perspective Label */}
        <motion.div
          key={`label-${currentIndex}`}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="text-right"
        >
          <span className="eyebrow text-[9.5px] text-gold-bright block tracking-widest">
            {slides[currentIndex].code} / 04 · {slides[currentIndex].title}
          </span>
          <span className="text-[11.5px] text-ivory/60 font-light block mt-0.5">
            {slides[currentIndex].category}
          </span>
        </motion.div>

        {/* Minimalist Interactive Slide Tracks */}
        <div className="flex items-center gap-2.5 bg-navy-deep/75 backdrop-blur-md p-2 rounded-sm border border-ivory/10 shadow-2xl">
          {slides.map((slide, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={slide.id}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`View perspective ${slide.code}: ${slide.title}`}
                className="group relative flex flex-col items-start gap-1 py-1.5 px-2 cursor-pointer transition-all duration-300"
              >
                <div className="flex items-center gap-1.5">
                  <span
                    className={`font-mono text-[10px] tracking-wider transition-colors ${
                      isActive ? 'text-gold-bright font-semibold' : 'text-ivory/40 group-hover:text-ivory/80'
                    }`}
                  >
                    {slide.code}
                  </span>
                </div>

                {/* Progress bar line for each perspective */}
                <div className="w-10 md:w-12 h-[2px] bg-ivory/15 rounded-full overflow-hidden relative">
                  {isActive ? (
                    <motion.div
                      key={`progress-${idx}`}
                      initial={{ width: '0%' }}
                      animate={{ width: isPaused ? '100%' : '100%' }}
                      transition={{
                        duration: isPaused ? 0 : SLIDE_DURATION / 1000,
                        ease: 'linear',
                      }}
                      className="h-full bg-gradient-to-r from-gold via-gold-bright to-white"
                    />
                  ) : (
                    <div className="h-full w-0 group-hover:w-full bg-ivory/30 transition-all duration-300" />
                  )}
                </div>
              </button>
            );
          })}

          {/* Minimalist Prev/Next Arrow Buttons */}
          <div className="flex items-center gap-1 ml-1.5 pl-2 border-l border-ivory/15">
            <button
              onClick={prevSlide}
              className="w-7 h-7 flex items-center justify-center text-ivory/60 hover:text-gold-bright transition-colors rounded hover:bg-ivory/10 font-mono text-[14px]"
              aria-label="Previous Perspective"
            >
              ←
            </button>
            <button
              onClick={nextSlide}
              className="w-7 h-7 flex items-center justify-center text-ivory/60 hover:text-gold-bright transition-colors rounded hover:bg-ivory/10 font-mono text-[14px]"
              aria-label="Next Perspective"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
