'use client';

import Reveal from '@/components/motion/Reveal';

interface Pillar {
  id: string;
  titleLine1: string;
  titleLine2: string;
  icon: (props: React.SVGProps<SVGSVGElement>) => JSX.Element;
}

const pillars: Pillar[] = [
  {
    id: 'investments',
    titleLine1: 'SMART',
    titleLine2: 'INVESTMENTS',
    icon: (props) => (
      <svg
        viewBox="0 0 44 44"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      >
        {/* Baseline */}
        <line x1="6" y1="36" x2="38" y2="36" />
        {/* Bar 1 */}
        <rect x="8" y="24" width="6" height="12" rx="0.5" />
        {/* Bar 2 */}
        <rect x="18" y="16" width="6" height="20" rx="0.5" />
        {/* Bar 3 */}
        <rect x="28" y="8" width="6" height="28" rx="0.5" />
        {/* Growth Trend Arrow */}
        <path d="M8 20L18 10L28 15L38 4" />
        <polyline points="30 4 38 4 38 12" />
      </svg>
    ),
  },
  {
    id: 'security',
    titleLine1: 'SECURE',
    titleLine2: 'FUTURES',
    icon: (props) => (
      <svg
        viewBox="0 0 44 44"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      >
        {/* Shield */}
        <path d="M22 4L8 9V20C8 29.5 14 36.5 22 40C30 36.5 36 29.5 36 20V9L22 4Z" />
        {/* Checkmark */}
        <path d="M16 21L20 25L28 17" />
      </svg>
    ),
  },
  {
    id: 'properties',
    titleLine1: 'PREMIUM',
    titleLine2: 'PROPERTIES',
    icon: (props) => (
      <svg
        viewBox="0 0 44 44"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      >
        {/* Roof */}
        <path d="M6 21L22 7L38 21" />
        {/* Chimney */}
        <path d="M30 13.5V8H34V17" />
        {/* House Body */}
        <path d="M10 18V37H34V18" />
        {/* Doorway */}
        <path d="M18 37V25H26V37" />
      </svg>
    ),
  },
  {
    id: 'partnership',
    titleLine1: 'TRUSTED',
    titleLine2: 'PARTNERSHIP',
    icon: (props) => (
      <svg
        viewBox="0 0 48 48"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      >
        {/* Left Hand / Cuff */}
        <path d="M8 18L15 11L21 17L14 24L8 18Z" />
        <path d="M4 14L8 18L14 12L10 8L4 14Z" />
        {/* Right Hand / Cuff */}
        <path d="M40 18L33 11L27 17L34 24L40 18Z" />
        <path d="M44 14L40 18L34 12L38 8L44 14Z" />
        {/* Clasp / Fingers */}
        <path d="M18 20L24 26L30 20" />
        <path d="M21 27L24 30L27 27" />
        <path d="M16 24L20 28L24 32L28 28L32 24" />
        <path d="M19 31L24 36L29 31" />
      </svg>
    ),
  },
];

export default function ValuePillarsStrip({ className = '' }: { className?: string }) {
  return (
    <section
      aria-label="Institutional Value Pillars"
      className={`bg-navy-deep border-y border-gold/25 relative overflow-hidden py-9 md:py-12 ${className}`}
    >
      {/* Ambient background lighting */}
      <div 
        className="absolute inset-0 bg-gradient-to-r from-navy-deep via-navy-surface/40 to-navy-deep pointer-events-none" 
        aria-hidden="true" 
      />

      <div className="max-w-[1360px] mx-auto px-6 sm:px-8 md:px-12 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 items-center">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <Reveal
                key={pillar.id}
                delay={idx * 80}
                y={14}
                className={`flex flex-col items-center justify-center text-center px-4 py-5 md:py-2 group ${
                  idx > 0 ? 'md:border-l md:border-gold/40' : ''
                } ${
                  idx % 2 === 1 ? 'border-l border-gold/25 md:border-l-0' : ''
                } ${
                  idx >= 2 ? 'border-t border-gold/20 md:border-t-0' : ''
                }`}
              >
                {/* Gold Vector Icon with hover glow effect */}
                <div className="relative mb-4 flex items-center justify-center">
                  <div 
                    className="w-11 h-11 sm:w-12 sm:h-12 text-gold transition-all duration-300 group-hover:text-gold-bright group-hover:scale-105"
                  >
                    <Icon className="w-full h-full drop-shadow-[0_2px_8px_rgba(224,179,56,0.25)]" />
                  </div>
                </div>

                {/* Pillar Typography */}
                <div className="flex flex-col items-center">
                  <span className="font-sans font-bold text-[12px] sm:text-[13px] md:text-[14px] tracking-[0.2em] text-white group-hover:text-gold-bright transition-colors duration-300 leading-tight">
                    {pillar.titleLine1}
                  </span>
                  <span className="font-sans font-bold text-[12px] sm:text-[13px] md:text-[14px] tracking-[0.2em] text-white group-hover:text-gold-bright transition-colors duration-300 leading-tight mt-0.5">
                    {pillar.titleLine2}
                  </span>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
