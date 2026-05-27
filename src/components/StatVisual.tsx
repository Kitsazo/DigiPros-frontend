import type { CSSProperties } from 'react';
import { lerp } from '../hooks/useScrollStage';

interface VisualPreset {
  bar1: number;
  bar2: number;
  bar3: number;
  lineRotate: number;
  lineTop: number;
  ring1: number;
  ring2: number;
  ringOpacity: number;
  gridOpacity: number;
  dot1: { x: number; y: number };
  dot2: { x: number; y: number };
  dot3: { x: number; y: number };
}

const PRESETS: VisualPreset[] = [
  {
    bar1: 56,
    bar2: 130,
    bar3: 74,
    lineRotate: -8,
    lineTop: 72,
    ring1: 150,
    ring2: 92,
    ringOpacity: 0.35,
    gridOpacity: 0.7,
    dot1: { x: 72, y: 120 },
    dot2: { x: 136, y: 96 },
    dot3: { x: 206, y: 146 },
  },
  {
    bar1: 92,
    bar2: 70,
    bar3: 128,
    lineRotate: 11,
    lineTop: 72,
    ring1: 140,
    ring2: 88,
    ringOpacity: 0.25,
    gridOpacity: 0.75,
    dot1: { x: 64, y: 108 },
    dot2: { x: 148, y: 88 },
    dot3: { x: 198, y: 132 },
  },
  {
    bar1: 68,
    bar2: 98,
    bar3: 86,
    lineRotate: 0,
    lineTop: 96,
    ring1: 168,
    ring2: 104,
    ringOpacity: 0.85,
    gridOpacity: 0.55,
    dot1: { x: 226, y: 102 },
    dot2: { x: 182, y: 78 },
    dot3: { x: 148, y: 148 },
  },
  {
    bar1: 144,
    bar2: 102,
    bar3: 88,
    lineRotate: -4,
    lineTop: 84,
    ring1: 132,
    ring2: 80,
    ringOpacity: 0.4,
    gridOpacity: 0.92,
    dot1: { x: 88, y: 112 },
    dot2: { x: 156, y: 124 },
    dot3: { x: 214, y: 98 },
  },
  {
    bar1: 78,
    bar2: 118,
    bar3: 142,
    lineRotate: -18,
    lineTop: 132,
    ring1: 172,
    ring2: 112,
    ringOpacity: 0.9,
    gridOpacity: 0.65,
    dot1: { x: 98, y: 94 },
    dot2: { x: 168, y: 118 },
    dot3: { x: 228, y: 86 },
  },
  {
    bar1: 120,
    bar2: 96,
    bar3: 136,
    lineRotate: 6,
    lineTop: 68,
    ring1: 148,
    ring2: 96,
    ringOpacity: 0.5,
    gridOpacity: 0.8,
    dot1: { x: 56, y: 84 },
    dot2: { x: 124, y: 102 },
    dot3: { x: 190, y: 72 },
  },
];

function blendPreset(index: number, localT: number): VisualPreset {
  const current = PRESETS[index] ?? PRESETS[0];
  const next = PRESETS[Math.min(index + 1, PRESETS.length - 1)] ?? current;

  return {
    bar1: lerp(current.bar1, next.bar1, localT),
    bar2: lerp(current.bar2, next.bar2, localT),
    bar3: lerp(current.bar3, next.bar3, localT),
    lineRotate: lerp(current.lineRotate, next.lineRotate, localT),
    lineTop: lerp(current.lineTop, next.lineTop, localT),
    ring1: lerp(current.ring1, next.ring1, localT),
    ring2: lerp(current.ring2, next.ring2, localT),
    ringOpacity: lerp(current.ringOpacity, next.ringOpacity, localT),
    gridOpacity: lerp(current.gridOpacity, next.gridOpacity, localT),
    dot1: {
      x: lerp(current.dot1.x, next.dot1.x, localT),
      y: lerp(current.dot1.y, next.dot1.y, localT),
    },
    dot2: {
      x: lerp(current.dot2.x, next.dot2.x, localT),
      y: lerp(current.dot2.y, next.dot2.y, localT),
    },
    dot3: {
      x: lerp(current.dot3.x, next.dot3.x, localT),
      y: lerp(current.dot3.y, next.dot3.y, localT),
    },
  };
}

interface StatVisualProps {
  /** Global stage progress 0–1 */
  progress: number;
  segmentCount: number;
}

export default function StatVisual({ progress, segmentCount }: StatVisualProps) {
  const scaled = progress * segmentCount;
  const index = Math.min(Math.floor(scaled), segmentCount - 1);
  const localT = scaled - index;
  const preset = blendPreset(index, localT);

  const style = {
    '--bar-1': `${preset.bar1}px`,
    '--bar-2': `${preset.bar2}px`,
    '--bar-3': `${preset.bar3}px`,
    '--line-rotate': `${preset.lineRotate}deg`,
    '--line-top': `${preset.lineTop}px`,
    '--ring-1': `${preset.ring1}px`,
    '--ring-2': `${preset.ring2}px`,
    '--ring-opacity': String(preset.ringOpacity),
    '--grid-opacity': String(preset.gridOpacity),
    '--dot-1-x': `${preset.dot1.x}px`,
    '--dot-1-y': `${preset.dot1.y}px`,
    '--dot-2-x': `${preset.dot2.x}px`,
    '--dot-2-y': `${preset.dot2.y}px`,
    '--dot-3-x': `${preset.dot3.x}px`,
    '--dot-3-y': `${preset.dot3.y}px`,
  } as CSSProperties;

  return (
    <div className="stats-visual" style={style} aria-hidden="true">
      <div className="stats-visual-grid" />
      <div className="stats-visual-bar stats-visual-bar-1" />
      <div className="stats-visual-bar stats-visual-bar-2" />
      <div className="stats-visual-bar stats-visual-bar-3" />
      <div className="stats-visual-line" />
      <div className="stats-visual-ring stats-visual-ring-1" />
      <div className="stats-visual-ring stats-visual-ring-2" />
      <div className="stats-visual-dot stats-visual-dot-1" />
      <div className="stats-visual-dot stats-visual-dot-2" />
      <div className="stats-visual-dot stats-visual-dot-3" />
    </div>
  );
}
