import { useCallback, useRef, type RefObject, type MouseEventHandler } from 'react';

interface TiltOptions {
  /** Maximum rotation in degrees. */
  max?: number;
  /** Lift in px on hover. */
  lift?: number;
  /** Optional CSS transition for smoothing. */
  transition?: string;
}

interface TiltHandlers<T extends HTMLElement> {
  ref: RefObject<T>;
  onMouseMove: MouseEventHandler<T>;
  onMouseLeave: MouseEventHandler<T>;
}

/**
 * Adds a subtle 3D tilt that follows the cursor on hover. Also writes
 * `--mx` / `--my` CSS variables (0..1) so children can react.
 */
export function useTilt<T extends HTMLElement = HTMLDivElement>(
  options: TiltOptions = {},
): TiltHandlers<T> {
  const { max = 6, lift = 2, transition = 'transform 0.18s ease' } = options;
  const ref = useRef<T>(null);

  const onMouseMove = useCallback<MouseEventHandler<T>>(
    (e) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      const rotY = (x - 0.5) * max * 2;
      const rotX = (0.5 - y) * max * 2;
      el.style.transition = transition;
      el.style.transform = `perspective(900px) rotateX(${rotX.toFixed(
        2,
      )}deg) rotateY(${rotY.toFixed(2)}deg) translateY(${-lift}px)`;
      el.style.setProperty('--mx', x.toFixed(3));
      el.style.setProperty('--my', y.toFixed(3));
    },
    [max, lift, transition],
  );

  const onMouseLeave = useCallback<MouseEventHandler<T>>(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = '';
    el.style.removeProperty('--mx');
    el.style.removeProperty('--my');
  }, []);

  return { ref, onMouseMove, onMouseLeave };
}
