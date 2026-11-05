/**
 * ILUSTRAÇÃO PROVISÓRIA da capa: centro de Pau Amarelo (mar, forte,
 * igrejinha, casinhas coloridas, coqueiros e jangada) em tons de aquarela.
 *
 * Para trocar por uma ilustração/foto de verdade, NÃO precisa mexer aqui:
 * coloque a imagem em public/images/ e preencha "coverImage" em
 * src/config/site.ts.
 */
import { useId } from 'react';

const HOUSES = [
  { x: 610, w: 90, h: 80, c: '#f2c9b8' },
  { x: 700, w: 80, h: 95, c: '#e9dcae' },
  { x: 780, w: 95, h: 75, c: '#bcd3c0' },
  { x: 875, w: 85, h: 90, c: '#f6dcc9' },
  { x: 1180, w: 90, h: 85, c: '#c9d9e3' },
  { x: 1270, w: 100, h: 72, c: '#f2c9b8' },
  { x: 1370, w: 85, h: 92, c: '#e9dcae' },
];

function Palm({ x, y, s = 1, flip = false }: { x: number; y: number; s?: number; flip?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <path d="M0 0 C 6 -60, 4 -120, 18 -180" stroke="#8a6a4a" strokeWidth="9" fill="none" strokeLinecap="round" />
      {[-150, -120, -60, -30, -95, 10].map((a, i) => (
        <path
          key={i}
          d="M0 0 C 30 -18, 70 -14, 100 12"
          stroke="#5c7550"
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
          opacity="0.85"
          transform={`translate(18 -180) rotate(${a + 90})`}
        />
      ))}
      <circle cx="16" cy="-172" r="7" fill="#8a6a4a" />
    </g>
  );
}

export default function CoverIllustration({ className = '', title }: { className?: string; title: string }) {
  const id = useId();
  const sky = `${id}-sky`;
  const sea = `${id}-sea`;
  const paint = `${id}-paint`;
  return (
    <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" className={className} role="img" aria-label={title}>
      <defs>
        <linearGradient id={sky} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f7e3cf" />
          <stop offset="0.55" stopColor="#f9efe0" />
          <stop offset="1" stopColor="#f8f5ec" />
        </linearGradient>
        <linearGradient id={sea} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9fc2bb" />
          <stop offset="1" stopColor="#c9ddd3" />
        </linearGradient>
        <filter id={paint}>
          <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="3" seed="8" />
          <feDisplacementMap in="SourceGraphic" scale="9" />
        </filter>
      </defs>

      <rect width="1600" height="900" fill={`url(#${sky})`} />
      <g filter={`url(#${paint})`}>
        {/* Sol e nuvens */}
        <circle cx="1240" cy="190" r="80" fill="#f4cfb4" opacity="0.8" />
        <ellipse cx="380" cy="170" rx="150" ry="34" fill="#fff" opacity="0.7" />
        <ellipse cx="1000" cy="120" rx="110" ry="26" fill="#fff" opacity="0.6" />

        {/* Mar */}
        <rect x="0" y="470" width="1600" height="170" fill={`url(#${sea})`} />
        <path d="M0 520 Q 200 505 400 520 T 800 520 T 1200 520 T 1600 520" stroke="#fff" strokeWidth="3" fill="none" opacity="0.6" />
        <path d="M0 580 Q 200 565 400 580 T 800 580 T 1200 580 T 1600 580" stroke="#fff" strokeWidth="3" fill="none" opacity="0.5" />

        {/* Jangada */}
        <g transform="translate(1000 520)">
          <path d="M-60 20 L60 20 L48 34 L-48 34 Z" fill="#8a6a4a" />
          <path d="M0 18 L0 -90 L58 10 Z" fill="#fffdf8" stroke="#d2ab6b" strokeWidth="2" />
        </g>

        {/* Forte (à esquerda) */}
        <g transform="translate(120 400)">
          <path d="M0 110 L0 40 L300 40 L300 110 Z" fill="#d9cbb0" />
          {[0, 40, 80, 120, 160, 200, 240, 280].map((x) => (
            <rect key={x} x={x} y="24" width="22" height="20" fill="#d9cbb0" />
          ))}
          <path d="M120 110 L120 76 A 30 30 0 0 1 180 76 L180 110 Z" fill="#8a7a62" opacity="0.6" />
          <rect x="250" y="-10" width="40" height="60" fill="#cdbd9f" />
        </g>

        {/* Faixa de areia / praça */}
        <path d="M0 620 Q 400 590 800 615 T 1600 605 L1600 900 L0 900 Z" fill="#f1e4c8" />

        {/* Casinhas */}
        {HOUSES.map((h, i) => (
          <g key={i} transform={`translate(${h.x} ${640 - h.h})`}>
            <rect width={h.w} height={h.h} fill={h.c} />
            <path d={`M-6 4 L${h.w / 2} -30 L${h.w + 6} 4 Z`} fill="#c98f6e" opacity="0.85" />
            <rect x={h.w / 2 - 11} y={h.h - 38} width="22" height="38" fill="#7d9670" opacity="0.8" />
            <rect x="12" y="18" width="18" height="18" fill="#fffdf8" />
            <rect x={h.w - 30} y="18" width="18" height="18" fill="#fffdf8" />
          </g>
        ))}

        {/* Igrejinha */}
        <g transform="translate(985 450)">
          <rect x="0" y="40" width="160" height="150" fill="#fffdf8" stroke="#d2ab6b" strokeWidth="3" />
          <path d="M-10 44 L80 -10 L170 44 Z" fill="#e8dcc4" />
          <rect x="55" y="-90" width="50" height="90" fill="#fffdf8" stroke="#d2ab6b" strokeWidth="3" />
          <path d="M50 -88 L80 -130 L110 -88 Z" fill="#d2ab6b" />
          <path d="M80 -160 V-128 M70 -150 H90" stroke="#8a6a2f" strokeWidth="4" />
          <path d="M60 190 V130 A 20 20 0 0 1 100 130 V190 Z" fill="#7d9670" />
          <circle cx="80" cy="80" r="14" fill="#f4cfb4" />
        </g>

        {/* Coqueiros */}
        <Palm x={520} y={660} s={1.25} />
        <Palm x={1500} y={660} s={1.1} flip />
        <Palm x={60} y={700} s={1.4} flip />

        {/* Folhagem em primeiro plano */}
        <path d="M0 900 Q 200 760 420 900 Z" fill="#a9bb9c" opacity="0.7" />
        <path d="M1200 900 Q 1420 740 1600 820 L1600 900 Z" fill="#a9bb9c" opacity="0.7" />
      </g>
    </svg>
  );
}
