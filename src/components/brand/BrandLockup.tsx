import Emblem from './Emblem';

/**
 * The horizontal brand lockup: emblem + wordmark + "by AZO" badge.
 *
 * Typography is real HTML (not SVG <text>) so it uses the page's Fraunces/IBM
 * Plex Mono webfonts, stays selectable, and scales responsively.
 */

const SIZES = {
  sm: {
    emblem: 'w-8 h-8',
    rule: 'h-7',
    eyebrow: 'text-[7.5px]',
    word: 'text-[15px]',
    badge: 'text-[8px] px-1.5 py-[3px]',
    azo: 'text-[11px]',
    gap: 'gap-2.5',
  },
  md: {
    emblem: 'w-11 h-11',
    rule: 'h-9',
    eyebrow: 'text-[8.5px]',
    word: 'text-[20px]',
    badge: 'text-[9.5px] px-2 py-[3px]',
    azo: 'text-[13px]',
    gap: 'gap-3',
  },
  lg: {
    emblem: 'w-16 h-16',
    rule: 'h-14',
    eyebrow: 'text-[10px]',
    word: 'text-[30px]',
    badge: 'text-[11px] px-2.5 py-1',
    azo: 'text-[17px]',
    gap: 'gap-3.5',
  },
} as const;

export default function BrandLockup({
  size = 'md',
  variant = 'dark',
  showEyebrow = true,
  className = '',
}: {
  size?: keyof typeof SIZES;
  variant?: 'dark' | 'light';
  showEyebrow?: boolean;
  className?: string;
}) {
  const s = SIZES[size];
  const onDark = variant === 'dark';

  return (
    <span className={`inline-flex items-center select-none ${s.gap} ${className}`}>
      <Emblem className={`${s.emblem} shrink-0`} />

      <span className={`${s.rule} w-px shrink-0 ${onDark ? 'bg-gold/30' : 'bg-gold/35'}`} aria-hidden="true" />

      <span className="flex flex-col justify-center leading-none">
        {showEyebrow && (
          <span
            className={`font-mono ${s.eyebrow} tracking-[0.22em] uppercase mb-[5px] ${
              onDark ? 'text-gold-bright/75' : 'text-gold/85'
            }`}
          >
            Dream Smith Properties · Est. 2011
          </span>
        )}

        <span className="flex items-center gap-2">
          <span
            className={`font-serif ${s.word} font-semibold tracking-[-0.01em] ${
              onDark ? 'text-ivory' : 'text-navy'
            }`}
          >
            Dream Smith
          </span>

          <span className={`font-mono ${s.badge} font-bold uppercase tracking-[0.18em] bg-gold text-navy-deep`}>
            Co-Own
          </span>

          <span
            className={`font-serif italic ${s.azo} ${
              onDark ? 'text-gold-bright' : 'text-gold'
            }`}
          >
            by AZO
          </span>
        </span>
      </span>
    </span>
  );
}
