import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { site } from '../config/site';
import { useLang } from '../lib/content';
import { mailto } from '../lib/mailto';
import { usePageMeta } from '../lib/usePageMeta';
import PageHeading from '../components/PageHeading';
import StatsBox from '../components/StatsBox';
import { CheckIcon, CopyIcon, HeartIcon, MailIcon } from '../components/Icons';
import { FlowerCorner } from '../components/Ornaments';

/** Doar (/doar): só exibe as informações; não há pagamento no site */
export default function Donate() {
  const { t } = useTranslation();
  const lang = useLang();
  usePageMeta(t('donate.title'));

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <PageHeading title={t('donate.title')} intro={t('donate.intro')} />

      <div className="mt-6">
        <StatsBox title={t('donate.numbersTitle')} stats={site.financialNumbers} />
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[3fr_2fr]">
        {/* PIX */}
        <section aria-labelledby="pix-title" className="card px-6 py-8 sm:px-10">
          <h2 id="pix-title" className="text-4xl">
            {t('donate.pix.title')}
          </h2>
          <p className="text-ink-soft">{t('donate.pix.subtitle')}</p>

          <div className="mt-6 grid items-center gap-6 sm:grid-cols-[1fr_auto]">
            <div>
              <p className="font-bold">{t('donate.pix.keyLabel')}</p>
              <p className="mt-1 break-all rounded-2xl border-2 border-dashed border-gold bg-cream px-4 py-3 font-mono text-xl font-bold text-sage-dark sm:text-2xl">
                {site.pix.key}
              </p>
              <CopyButton text={site.pix.key} />
              <dl className="mt-5 space-y-1">
                <Row label={t('donate.pix.keyType')} value={site.pix.keyType[lang]} />
                <Row label={t('donate.pix.holder')} value={site.pix.holder} />
                <Row label={t('donate.pix.bank')} value={site.pix.bank} />
              </dl>
            </div>
            <figure className="mx-auto text-center">
              <img
                src={site.pix.qrImage}
                alt={t('donate.pix.qrAlt')}
                width={220}
                height={220}
                loading="lazy"
                className="h-52 w-52 rounded-2xl border border-gold/60 bg-white p-2"
              />
              <figcaption className="mt-2 max-w-52 text-sm text-ink-soft">{t('donate.pix.qrHint')}</figcaption>
            </figure>
          </div>
        </section>

        {/* ZELLE */}
        <section aria-labelledby="zelle-title" className="card px-6 py-8 sm:px-10">
          <h2 id="zelle-title" className="text-4xl">
            {t('donate.zelle.title')}
          </h2>
          <p className="text-ink-soft">{t('donate.zelle.subtitle')}</p>
          <dl className="mt-6 space-y-3">
            <Row label={t('donate.zelle.recipient')} value={site.zelle.recipient} big />
            <Row label={t('donate.zelle.contact')} value={site.zelle.contact} big />
            <Row label={t('donate.zelle.bank')} value={site.zelle.bank} />
          </dl>
          <p className="mt-5 rounded-xl bg-cream px-4 py-3 text-ink-soft">{site.zelle.note[lang]}</p>
        </section>
      </div>

      {/* Doações que não são dinheiro */}
      <section className="card relative mx-auto mt-10 max-w-3xl overflow-hidden bg-peach/30 px-6 py-10 text-center sm:px-12">
        <FlowerCorner className="pointer-events-none absolute -left-4 -top-4 w-24 opacity-80" />
        <FlowerCorner position="bottom-right" className="pointer-events-none absolute -bottom-4 -right-4 w-24 opacity-80" />
        <HeartIcon width={44} height={44} className="mx-auto text-sage-dark" />
        <h2 className="mt-3 text-3xl sm:text-4xl">{t('donate.inKind.title')}</h2>
        <p className="mt-3 text-lg text-ink-soft">{t('donate.inKind.text')}</p>
        <a href={mailto(site.contactEmail, t('donate.inKind.subject'), t('donate.inKind.body'))} className="btn-primary mt-6">
          <MailIcon />
          {t('donate.inKind.button')}
        </a>
        <p className="mt-3 text-sm text-ink-soft">{site.contactEmail}</p>
      </section>
    </div>
  );
}

function Row({ label, value, big = false }: { label: string; value: string; big?: boolean }) {
  return (
    <div>
      <dt className="inline font-bold">{label}: </dt>
      <dd className={`inline break-words ${big ? 'text-lg' : ''}`}>{value}</dd>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const { t } = useTranslation();
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle');

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setState('copied');
      setTimeout(() => setState('idle'), 3000);
    } catch {
      setState('failed');
    }
  }

  return (
    <div className="mt-3">
      <button type="button" onClick={copy} className="btn-gold w-full sm:w-auto">
        {state === 'copied' ? <CheckIcon /> : <CopyIcon />}
        {state === 'copied' ? t('donate.pix.copied') : t('donate.pix.copy')}
      </button>
      <p role="status" className="mt-2 min-h-6 text-sm font-bold text-sage-dark">
        {state === 'copied' ? t('donate.pix.copied') : state === 'failed' ? t('donate.pix.copyFail') : ''}
      </p>
    </div>
  );
}
