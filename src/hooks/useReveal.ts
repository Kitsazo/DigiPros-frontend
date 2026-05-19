import { useEffect, useRef, useState, type RefObject } from 'react';

interface RevealOptions {
  threshold?: number;
  rootMargin?: string;
  /** Reveal once and stop observing (default true). */
  once?: boolean;
}

/**
 * Returns a ref + a `visible` boolean. Attach the ref to whatever element
 * you want to fade/slide in once it enters the viewport.
 */
export function useReveal<T extends Element = HTMLElement>(
  opts: RevealOptions = {},
): { ref: RefObject<T>; visible: boolean } {
  const { threshold = 0.15, rootMargin = '0px 0px -80px 0px', once = true } = opts;
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            if (once) obs.unobserve(entry.target);
          } else if (!once) {
            setVisible(false);
          }
        }
      },
      { threshold, rootMargin },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, visible };
}
