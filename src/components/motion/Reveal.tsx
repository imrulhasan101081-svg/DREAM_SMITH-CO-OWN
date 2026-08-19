'use client';

import { useEffect, useRef, type ElementType, type ReactNode } from 'react';

/**
 * Scroll-triggered reveal.
 *
 * The hidden state lives in CSS behind `html.js` (set by a blocking script in
 * the layout), so without JS everything renders visible rather than blank, and
 * there's no flash-then-hide during hydration. Motion is opacity + transform
 * only — never layout properties — so revealing costs no reflow and can't shift
 * the page.
 */
export default function Reveal({
  children,
  as: Tag = 'div',
  delay = 0,
  y = 28,
  scale,
  className = '',
  once = true,
}: {
  children: ReactNode;
  as?: ElementType;
  /** Stagger offset in ms. */
  delay?: number;
  /** Travel distance in px. */
  y?: number;
  /** Optional starting scale, e.g. 1.04 for imagery. */
  scale?: number;
  className?: string;
  once?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('is-visible');
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            if (once) io.unobserve(entry.target);
          } else if (!once) {
            entry.target.classList.remove('is-visible');
          }
        }
      },
      // Fire slightly before the element reaches the fold so the motion reads
      // as the page settling, not as a delayed pop.
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [once]);

  return (
    <Tag
      ref={ref}
      data-reveal=""
      className={className}
      style={
        {
          '--reveal-delay': `${delay}ms`,
          '--reveal-y': `${y}px`,
          ...(scale ? { '--reveal-s': scale } : {}),
        } as React.CSSProperties
      }
    >
      {children}
    </Tag>
  );
}
