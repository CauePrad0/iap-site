import type { Lang, Stat } from '../config/site';
import { LOCALE } from '../i18n';

export function formatStat(stat: Stat, lang: Lang): string {
  const locale = LOCALE[lang];
  let num: string;
  if (stat.format === 'currencyBRL' || stat.format === 'currencyUSD') {
    num = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: stat.format === 'currencyBRL' ? 'BRL' : 'USD',
      maximumFractionDigits: 0,
    }).format(stat.value);
  } else {
    num = new Intl.NumberFormat(locale).format(stat.value);
  }
  return `${stat.prefix ?? ''}${num}${stat.suffix ?? ''}`;
}

export function formatDate(iso: string, lang: Lang): string {
  return new Intl.DateTimeFormat(LOCALE[lang], { dateStyle: 'long' }).format(new Date(iso));
}
