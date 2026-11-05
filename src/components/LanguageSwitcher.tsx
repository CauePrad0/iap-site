import { useTranslation } from 'react-i18next';
import { LANGS } from '../i18n';
import { useLang } from '../lib/content';

/** Seletor PT / ES / EN — sempre visível (também no celular) */
export default function LanguageSwitcher() {
  const { t, i18n } = useTranslation();
  const current = useLang();
  return (
    <div role="group" aria-label={t('a11y.language')} className="flex rounded-full border border-gold/60 bg-paper p-0.5">
      {LANGS.map((lng) => {
        const active = lng === current;
        return (
          <button
            key={lng}
            type="button"
            lang={lng}
            aria-pressed={active}
            aria-label={t(`languages.${lng}`)}
            title={t(`languages.${lng}`)}
            onClick={() => i18n.changeLanguage(lng)}
            className={`min-h-10 min-w-10 rounded-full px-2 text-sm font-bold uppercase tracking-wide transition-colors ${
              active ? 'bg-sage text-white' : 'text-sage-dark hover:bg-cream-dark'
            }`}
          >
            {lng}
          </button>
        );
      })}
    </div>
  );
}
