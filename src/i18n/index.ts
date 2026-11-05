import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import pt from './locales/pt.json';
import es from './locales/es.json';
import en from './locales/en.json';
import type { Lang } from '../config/site';

export const LANGS: Lang[] = ['pt', 'es', 'en'];
const STORAGE_KEY = 'iap-lang';

/** Código usado em <html lang> e na formatação de números/datas */
export const LOCALE: Record<Lang, string> = { pt: 'pt-BR', es: 'es', en: 'en-US' };

function readStoredLang(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && (LANGS as string[]).includes(saved)) return saved as Lang;
  } catch {
    /* localStorage indisponível (modo privado etc.) */
  }
  return 'pt'; // Português é o padrão
}

i18n.use(initReactI18next).init({
  resources: { pt: { translation: pt }, es: { translation: es }, en: { translation: en } },
  lng: readStoredLang(),
  fallbackLng: 'pt',
  interpolation: { escapeValue: false }, // o React já protege contra XSS
});

// Lembra a escolha e atualiza o idioma do documento (leitores de tela, SEO)
i18n.on('languageChanged', (lng) => {
  try {
    localStorage.setItem(STORAGE_KEY, lng);
  } catch {
    /* ignora */
  }
  document.documentElement.lang = LOCALE[lng as Lang] ?? 'pt-BR';
});
document.documentElement.lang = LOCALE[i18n.language as Lang] ?? 'pt-BR';

export default i18n;
