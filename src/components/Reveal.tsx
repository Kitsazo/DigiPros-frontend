import type { CSSProperties, ReactNode } from 'react';
import { useReveal } from '../hooks/useReveal';
import './Reveal.css';

interface RevealProps {
  children: ReactNode;
  /** Animation direction. */
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade';
  /** Delay before animation, in ms. */
  delay?: number;
  /** Custom class name applied alongside the reveal classes. */
  className?: string;
  /** Optional element tag (defaults to div). */
  as?: 'div' | 'section' | 'article' | 'ul' | 'li' | 'span';
  style?: CSSProperties;
}

export default function Reveal({
  children,
  direction = 'up',
  delay = 0,
  className = '',
  as = 'div',
  style,
}: RevealProps) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const Tag = as as 'div';
  return (
    <Tag
      ref={ref}
      className={`reveal reveal-${direction} ${visible ? 'is-visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms`, ...style }}
    >
      {children}
    </Tag>
  );
}
