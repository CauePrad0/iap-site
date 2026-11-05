import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher';
import { CloseIcon, MenuIcon } from './Icons';
import { NAV_ITEMS } from './nav';

/**
 * Header de todas as páginas.
 * Telas grandes: menu à esquerda · logo + nome no centro · idiomas à direita.
 * Celular/tablet: botão de menu à esquerda · logo no centro · idiomas à direita.
 */
export default function Header() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Fecha o menu ao trocar de página
  useEffect(() => setOpen(false), [location.pathname]);

  // Fecha com a tecla Esc e devolve o foco ao botão
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `relative whitespace-nowrap rounded-full px-3 py-2 font-bold transition-colors hover:bg-cream-dark ${
      isActive ? 'text-sage-dark after:absolute after:inset-x-3 after:-bottom-0.5 after:h-0.5 after:rounded after:bg-gold' : 'text-ink-soft'
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-gold/40 bg-cream/95 backdrop-blur supports-[backdrop-filter]:bg-cream/85">
      <a
        href="#conteudo"
        className="absolute left-3 top-3 z-50 -translate-y-24 rounded-full bg-sage px-4 py-2 font-bold text-white focus:translate-y-0"
      >
        {t('a11y.skipToContent')}
      </a>

      <div className="mx-auto grid max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-2 px-3 py-2 sm:px-6 xl:grid-cols-[1fr_auto_1fr]">
        {/* Esquerda: menu */}
        <div className="flex items-center">
          <button
            ref={buttonRef}
            type="button"
            className="inline-flex min-h-12 min-w-12 items-center justify-center rounded-full text-sage-dark hover:bg-cream-dark xl:hidden"
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? t('a11y.closeMenu') : t('a11y.openMenu')}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <CloseIcon width={28} height={28} /> : <MenuIcon width={28} height={28} />}
          </button>
          <nav aria-label={t('a11y.mainNav')} className="hidden xl:block">
            <ul className="flex items-center gap-0.5">
              {NAV_ITEMS.map((item) => (
                <li key={item.to}>
                  <NavLink to={item.to} className={linkClass}>
                    {t(item.key)}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Centro: logo + nome */}
        <Link
          to="/inicio"
          aria-label={t('a11y.home')}
          className="mx-auto flex min-w-0 items-center gap-2 rounded-2xl px-1 py-1 sm:gap-3"
        >
          <img
            src="/logo-192.jpg"
            alt=""
            width={56}
            height={56}
            className="h-11 w-11 shrink-0 rounded-full border border-gold/60 object-cover sm:h-14 sm:w-14"
          />
          <span className="font-serif text-lg font-semibold leading-tight text-sage-dark sm:text-2xl">{t('siteName')}</span>
        </Link>

        {/* Direita: idiomas */}
        <div className="flex justify-end">
          <LanguageSwitcher />
        </div>
      </div>

      {/* Menu do celular */}
      <nav
        id="menu-mobile"
        aria-label={t('a11y.mainNav')}
        className={`${open ? 'block' : 'hidden'} border-t border-gold/30 bg-cream xl:hidden`}
      >
        <ul className="mx-auto flex max-w-md flex-col gap-1 px-4 py-4">
          {NAV_ITEMS.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `block rounded-2xl px-5 py-3 text-xl font-bold ${
                    isActive ? 'bg-sage text-white' : 'text-sage-dark hover:bg-cream-dark'
                  }`
                }
              >
                {t(item.key)}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
