import { useEffect, useState, type RefObject } from 'react';

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Maps scroll position within a tall track to 0–1 progress while the
 * sticky child remains visually pinned.
 */
export function useScrollStage<T extends HTMLElement>(
  trackRef: RefObject<T | null>,
): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const track = trackRef.current;
      if (!track) return;

      const rect = track.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      if (scrollable <= 0) {
        setProgress(0);
        return;
      }

      setProgress(clamp(-rect.top / scrollable, 0, 1));
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [trackRef]);

  return progress;
}

export function scrollToStageProgress<T extends HTMLElement>(
  trackRef: RefObject<T | null>,
  progress: number,
): void {
  const track = trackRef.current;
  if (!track) return;

  const scrollable = track.offsetHeight - window.innerHeight;
  const top = track.getBoundingClientRect().top + window.scrollY;
  const target = top + clamp(progress, 0, 1) * scrollable;

  window.scrollTo({ top: target, behavior: 'smooth' });
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}
