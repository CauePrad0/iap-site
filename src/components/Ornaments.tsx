/**
 * Ornamentos em estilo aquarela (ramos de folhas, flores e linhas douradas),
 * inspirados no logo e no convite floral de vovó Ana.
 * São decorativos: todos têm aria-hidden.
 */
import { useId } from 'react';

const SAGE = '#7d9670';
const SAGE_DARK = '#5c7550';
const BLUSH = '#eeb8a4';
const PEACH = '#f4cfb4';
const GOLD = '#d2ab6b';

/** Filtro que deixa as bordas levemente irregulares, como tinta aquarela */
function WatercolorFilter({ id }: { id: string }) {
  return (
    <filter id={id} x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="3" />
      <feDisplacementMap in="SourceGraphic" scale="3" />
    </filter>
  );
}

function Leaf({ x, y, rot, color, size = 1 }: { x: number; y: number; rot: number; color: string; size?: number }) {
  return (
    <path
      d="M0 0 C 8 -10, 26 -12, 38 0 C 26 12, 8 10, 0 0 Z"
      transform={`translate(${x} ${y}) rotate(${rot}) scale(${size})`}
      fill={color}
      fillOpacity={0.72}
    />
  );
}

/** Ramo de folhas como o do logo. Use flip para espelhar. */
export function LeafBranch({ className = '', flip = false }: { className?: string; flip?: boolean }) {
  const f = useId();
  return (
    <svg viewBox="0 0 160 70" className={className} aria-hidden="true" style={flip ? { transform: 'scaleX(-1)' } : undefined}>
      <defs>
        <WatercolorFilter id={f} />
      </defs>
      <g filter={`url(#${f})`}>
        <path d="M6 60 C 40 52, 90 38, 152 10" stroke={SAGE_DARK} strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <Leaf x={30} y={53} rot={-150} color={SAGE} />
        <Leaf x={34} y={52} rot={30} color={PEACH} size={0.9} />
        <Leaf x={68} y={42} rot={-140} color={BLUSH} size={0.9} />
        <Leaf x={72} y={41} rot={40} color={SAGE} />
        <Leaf x={106} y={29} rot={-130} color={SAGE} size={0.85} />
        <Leaf x={110} y={27} rot={45} color={PEACH} size={0.8} />
        <Leaf x={140} y={15} rot={-20} color={SAGE} size={0.7} />
      </g>
    </svg>
  );
}

function Flower({ x, y, r, color }: { x: number; y: number; r: number; color: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} cx="0" cy={-r} rx={r * 0.62} ry={r} fill={color} fillOpacity={0.55} transform={`rotate(${a})`} />
      ))}
      <circle r={r * 0.35} fill={GOLD} fillOpacity={0.9} />
    </g>
  );
}

/** Buquê para cantos. position define o canto (gira o desenho). */
export function FlowerCorner({
  className = '',
  position = 'top-left',
}: {
  className?: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}) {
  const f = useId();
  const transform = {
    'top-left': undefined,
    'top-right': 'scaleX(-1)',
    'bottom-left': 'scaleY(-1)',
    'bottom-right': 'scale(-1,-1)',
  }[position];
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true" style={transform ? { transform } : undefined}>
      <defs>
        <WatercolorFilter id={f} />
      </defs>
      <g filter={`url(#${f})`}>
        <path d="M0 120 C 40 100, 70 70, 96 0" stroke={SAGE_DARK} strokeWidth="1.4" fill="none" />
        <path d="M0 160 C 60 150, 110 120, 170 60" stroke={SAGE_DARK} strokeWidth="1.4" fill="none" />
        <Leaf x={40} y={98} rot={-120} color={SAGE} size={1.1} />
        <Leaf x={62} y={70} rot={-100} color={PEACH} />
        <Leaf x={80} y={36} rot={-80} color={SAGE} size={0.9} />
        <Leaf x={70} y={140} rot={-170} color={SAGE} />
        <Leaf x={112} y={115} rot={-40} color={BLUSH} />
        <Leaf x={140} y={88} rot={-150} color={SAGE} size={0.9} />
        <Flower x={22} y={28} r={16} color={BLUSH} />
        <Flower x={52} y={16} r={9} color={PEACH} />
        <circle cx="120" cy="20" r="3" fill={GOLD} fillOpacity="0.8" />
        <circle cx="16" cy="76" r="2.5" fill={GOLD} fillOpacity="0.8" />
      </g>
    </svg>
  );
}

/** Divisor: linha dourada — raminho — linha dourada (como no logo) */
export function Divider({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`} aria-hidden="true">
      <span className="h-px w-16 bg-gold sm:w-24" />
      <svg viewBox="0 0 60 24" className="h-5 w-12">
        <path d="M4 12 H56" stroke={GOLD} strokeWidth="1" />
        <Leaf x={30} y={12} rot={-140} color={SAGE} size={0.55} />
        <Leaf x={30} y={12} rot={-40} color={SAGE} size={0.55} />
        <Leaf x={30} y={12} rot={140} color={PEACH} size={0.5} />
        <Leaf x={30} y={12} rot={40} color={PEACH} size={0.5} />
        <circle cx="30" cy="12" r="2.4" fill={GOLD} />
      </svg>
      <span className="h-px w-16 bg-gold sm:w-24" />
    </div>
  );
}
