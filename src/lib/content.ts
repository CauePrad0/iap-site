/**
 * Acesso aos textos de conteúdo (src/content/*.json) no idioma atual.
 * Os componentes nunca importam os JSON diretamente: assim, para editar
 * textos basta mexer nos arquivos JSON.
 */
import { useTranslation } from 'react-i18next';
import type { Lang } from '../config/site';
import pt from '../content/pt.json';
import es from '../content/es.json';
import en from '../content/en.json';
import worksData from '../content/works.json';

export interface HistorySection {
  title: string;
  paragraphs: string[];
  image?: { src: string; alt: string; caption?: string };
}

export interface PageContent {
  home: { intro: string[] };
  history: { intro: string; sections: HistorySection[] };
}

export interface WorkText {
  title: string;
  summary: string;
  details: string[];
  facts: string[];
}

export interface Work {
  id: string;
  icon?: string;
  image?: string;
  hidden?: boolean;
  pt: WorkText;
  es: WorkText;
  en: WorkText;
}

const content: Record<Lang, PageContent> = { pt, es, en };
const works = worksData as Work[];

export function useLang(): Lang {
  const { i18n } = useTranslation();
  const lng = i18n.resolvedLanguage ?? i18n.language;
  return lng === 'es' || lng === 'en' ? lng : 'pt';
}

export function useContent(): PageContent {
  return content[useLang()];
}

/** Obras visíveis, com o texto no idioma atual (cai para PT se faltar tradução) */
export function useWorks() {
  const lang = useLang();
  return works
    .filter((w) => !w.hidden)
    .map((w) => ({ ...w, text: w[lang]?.title ? w[lang] : w.pt }));
}
