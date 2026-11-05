/** Ícones simples em linha (decorativos; o texto ao lado dá o significado) */
import type { SVGProps } from 'react';

type P = SVGProps<SVGSVGElement>;
const base = (p: P) => ({
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  ...p,
});

export const MenuIcon = (p: P) => <svg {...base(p)}><path d="M4 7h16M4 12h16M4 17h16" /></svg>;
export const CloseIcon = (p: P) => <svg {...base(p)}><path d="M6 6l12 12M18 6L6 18" /></svg>;
export const HeartIcon = (p: P) => (
  <svg {...base(p)}><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" /></svg>
);
export const HandsIcon = (p: P) => (
  <svg {...base(p)}><path d="M7 11V6.5a1.5 1.5 0 0 1 3 0V11M10 10V5a1.5 1.5 0 0 1 3 0v5M13 10V6a1.5 1.5 0 0 1 3 0v6M16 9.5a1.5 1.5 0 0 1 3 0V14a7 7 0 0 1-7 7h-1a6 6 0 0 1-5-2.7L4 15a1.5 1.5 0 0 1 2.4-1.8L7 14" /></svg>
);
export const QuoteIcon = (p: P) => (
  <svg {...base(p)}><path d="M9 7H5v6h4l-2 4M19 7h-4v6h4l-2 4" /></svg>
);
export const BookIcon = (p: P) => (
  <svg {...base(p)}><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zM4 19V5M8 7h7" /></svg>
);
export const BasketIcon = (p: P) => (
  <svg {...base(p)}><path d="M3 10h18l-2 10H5zM7 10l4-6M17 10l-4-6M9 14v3M12 14v3M15 14v3" /></svg>
);
export const CookieIcon = (p: P) => (
  <svg {...base(p)}><circle cx="12" cy="12" r="9" /><path d="M9 9h.01M14 8h.01M15 13h.01M9 14h.01M12 16h.01" strokeWidth="2.6" /></svg>
);
export const CopyIcon = (p: P) => (
  <svg {...base(p)}><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" /></svg>
);
export const CheckIcon = (p: P) => <svg {...base(p)}><path d="M5 12l5 5L20 7" /></svg>;
export const MailIcon = (p: P) => (
  <svg {...base(p)}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></svg>
);
export const ArrowIcon = (p: P) => <svg {...base(p)}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
export const InstagramIcon = (p: P) => (
  <svg {...base(p)}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><path d="M17.5 6.5h.01" strokeWidth="2.6" /></svg>
);
export const FacebookIcon = (p: P) => (
  <svg {...base(p)}><path d="M14 8h3V4h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V8z" /></svg>
);
export const YoutubeIcon = (p: P) => (
  <svg {...base(p)}><rect x="2.5" y="5.5" width="19" height="13" rx="4" /><path d="M10 9.5v5l4.5-2.5z" /></svg>
);
export const WhatsappIcon = (p: P) => (
  <svg {...base(p)}><path d="M4 20l1.3-3.9A8 8 0 1 1 8 19.1z" /><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5l1-1.5-2-1-1 .8a4 4 0 0 1-1.8-1.8l.8-1-1-2z" /></svg>
);

/** Ícone por nome (usado em works.json → "icon") */
export function NamedIcon({ name, ...p }: { name?: string } & P) {
  switch (name) {
    case 'cookie':
      return <CookieIcon {...p} />;
    case 'book':
      return <BookIcon {...p} />;
    case 'hands':
      return <HandsIcon {...p} />;
    case 'heart':
      return <HeartIcon {...p} />;
    default:
      return <BasketIcon {...p} />;
  }
}
