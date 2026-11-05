import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

/** Atualiza o <title> e a meta description conforme a página e o idioma */
export function usePageMeta(pageTitle?: string) {
  const { t, i18n } = useTranslation();
  useEffect(() => {
    const site = t('siteName');
    document.title = pageTitle ? `${pageTitle} · ${site}` : site;
    document.querySelector('meta[name="description"]')?.setAttribute('content', t('meta.description'));
  }, [pageTitle, t, i18n.language]);
}
