import { useEffect, useState } from 'react';

interface CountUpOptions {
  duration?: number;
  decimals?: number;
  easing?: (t: number) => number;
}

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

/**
 * Animates from 0 → target when `active` becomes true.
 */
export function useCountUp(
  target: number,
  active: boolean,
  { duration = 1600, decimals = 0, easing = easeOutCubic }: CountUpOptions = {},
): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!active) {
      setValue(0);
      return;
    }

    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(target);
      return;
    }

    let frame = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const next = target * easing(progress);
      const factor = 10 ** decimals;
      setValue(Math.round(next * factor) / factor);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, target, duration, decimals, easing]);

  return value;
}
