import { useEffect, useState } from 'react';

interface TypewriterOptions {
  /** ms per character while typing in. */
  typeSpeed?: number;
  /** ms per character while erasing. */
  eraseSpeed?: number;
  /** ms to hold the word fully typed before starting to erase. */
  holdMs?: number;
  /** ms to wait between words once fully erased. */
  pauseMs?: number;
}

/**
 * Cycles through an array of words with a typewriter effect.
 * Returns the currently-rendered substring.
 */
export function useTypewriter(
  words: string[],
  options: TypewriterOptions = {},
): string {
  const { typeSpeed = 70, eraseSpeed = 36, holdMs = 1600, pauseMs = 300 } =
    options;

  const [index, setIndex] = useState<number>(0);
  const [text, setText] = useState<string>('');
  const [erasing, setErasing] = useState<boolean>(false);

  useEffect(() => {
    if (words.length === 0) return undefined;
    const target = words[index % words.length] ?? '';

    if (!erasing && text === target) {
      const t = window.setTimeout(() => setErasing(true), holdMs);
      return () => window.clearTimeout(t);
    }
    if (erasing && text === '') {
      const t = window.setTimeout(() => {
        setErasing(false);
        setIndex((i) => (i + 1) % words.length);
      }, pauseMs);
      return () => window.clearTimeout(t);
    }

    const t = window.setTimeout(
      () => {
        setText((curr) => {
          if (erasing) return curr.slice(0, -1);
          return target.slice(0, curr.length + 1);
        });
      },
      erasing ? eraseSpeed : typeSpeed,
    );
    return () => window.clearTimeout(t);
  }, [text, erasing, index, words, typeSpeed, eraseSpeed, holdMs, pauseMs]);

  return text;
}
