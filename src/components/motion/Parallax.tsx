'use client';

import { useEffect, useRef, type ReactNode } from 'react';

/**
 * Scroll-linked parallax + scale.
 *
 * Reads layout once per resize and only writes transforms inside rAF, so the
 * scroll handler never triggers a synchronous reflow. The moving element is
 * expected to be oversized (see `scale`) and inside an `overflow-hidden`
 * parent, so translating it can never reveal an edge or shift the page.
 */
export default function Parallax({
  children,
  /** Total travel across a full viewport of scroll, in px. Positive = slower than scroll. */
  distance = 90,
  /** Constant upscale applied to hide the translated edges. */
  scale = 1.12,
  className = '',
}: {
  children: ReactNode;
  distance?: number;
  scale?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduced.matches) {
      el.style.transform = `scale(${scale})`;
      return;
    }

    let frame = 0;
    let top = 0;
    let height = 0;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      top = rect.top + window.scrollY;
      height = rect.height;
    };

    const apply = () => {
      frame = 0;
      const vh = window.innerHeight;
      // -1 when the element is just below the fold, +1 when just above it.
      const progress = (window.scrollY + vh - top) / (vh + height) - 0.5;
      const y = -progress * distance * 2;
      el.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0) scale(${scale})`;
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };

    const onResize = () => {
      measure();
      onScroll();
    };

    measure();
    apply();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [distance, scale]);

  return (
    <div ref={ref} className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
}
