"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ourLegacyData, ourLegacyHeadline } from '@/data/ourLegacy';
import Image from 'next/image';

export default function OurLegacy() {
  const t = useTranslations('HomePage.ourLegacy');
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -50px 0px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={containerRef}
      className="py-16 bg-navy text-ivory border-t border-gold/10 overflow-hidden"
    >
      <div className="max-w-[1180px] mx-auto px-8">
        <div 
          className={`flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-16 transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* Header Text */}
          <div className="shrink-0 max-w-[280px] text-center md:text-left mt-4">
            <span className="font-mono text-[10px] tracking-[0.14em] uppercase text-gold/80 mb-3 block">
              {t('eyebrow')}
            </span>
            <p className="font-serif text-[18px] leading-snug text-ivory/80">
              {ourLegacyHeadline}
            </p>
          </div>

          {/* Cards */}
          <div className="flex flex-col sm:flex-row gap-5 w-full">
            {ourLegacyData.map((project, idx) => (
              <div 
                key={project.id}
                className="flex-1 group"
                style={{ 
                  transitionDelay: `${150 + idx * 100}ms`
                }}
              >
                <div 
                  className={`aspect-[4/3] rounded overflow-hidden bg-navy-deep relative mb-4 transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                  }`}
                  style={{ transitionDelay: `${200 + idx * 150}ms` }}
                >
                  <Image
                    src={project.image}
                    alt={project.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                  />
                  <div className="absolute inset-0 border border-gold/10 rounded mix-blend-overlay pointer-events-none" />
                </div>
                
                <div 
                  className={`transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                  style={{ transitionDelay: `${350 + idx * 150}ms` }}
                >
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-serif text-[15px] text-gold-bright">{project.name}</h4>
                    <span className="font-mono text-[9px] uppercase tracking-widest text-ivory/50">
                      {project.status}
                    </span>
                  </div>
                  <div className="text-[12px] text-ivory/60 font-mono">
                    {project.location}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
