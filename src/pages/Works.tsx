import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { site } from '../config/site';
import { useWorks } from '../lib/content';
import { mailto } from '../lib/mailto';
import { usePageMeta } from '../lib/usePageMeta';
import PageHeading from '../components/PageHeading';
import { HandsIcon, MailIcon, NamedIcon } from '../components/Icons';
import { FlowerCorner } from '../components/Ornaments';

/**
 * Obras (/obras). Os cartões vêm de src/content/works.json:
 * para adicionar uma obra, basta acrescentar um item lá.
 */
export default function Works() {
  const { t } = useTranslation();
  const works = useWorks();
  usePageMeta(t('works.title'));

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <PageHeading title={t('works.title')} intro={t('works.intro')} />

      {works.length === 0 ? (
        <p className="mt-8 text-center text-lg text-ink-soft">{t('works.empty')}</p>
      ) : (
        <ul className={`mt-8 grid gap-6 ${works.length > 1 ? 'md:grid-cols-2' : 'mx-auto max-w-2xl'}`}>
          {works.map((w) => (
            <li key={w.id}>
              <WorkCard image={w.image} icon={w.icon} {...w.text} />
            </li>
          ))}
        </ul>
      )}

      {/* Chamada para voluntários */}
      <section className="card relative mx-auto mt-14 max-w-3xl overflow-hidden bg-peach/30 px-6 py-10 text-center sm:px-12">
        <FlowerCorner className="pointer-events-none absolute -left-4 -top-4 w-24 opacity-80" />
        <FlowerCorner position="bottom-right" className="pointer-events-none absolute -bottom-4 -right-4 w-24 opacity-80" />
        <HandsIcon width={48} height={48} className="mx-auto text-sage-dark" />
        <h2 className="mt-3 text-3xl sm:text-4xl">{t('works.volunteerTitle')}</h2>
        <p className="mt-3 text-lg text-ink-soft">{t('works.volunteerText')}</p>
        <a
          href={mailto(site.contactEmail, t('works.volunteerEmail.subject'), t('works.volunteerEmail.body'))}
          className="btn-primary mt-6 text-center"
        >
          <MailIcon />
          {t('works.volunteerButton')}
        </a>
        <p className="mt-3 text-sm text-ink-soft">{site.contactEmail}</p>
      </section>
    </div>
  );
}

function WorkCard({
  title,
  summary,
  details,
  facts,
  image,
  icon,
}: {
  title: string;
  summary: string;
  details: string[];
  facts: string[];
  image?: string;
  icon?: string;
}) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const detailsId = `obra-${title.replace(/\W+/g, '-')}`;

  return (
    <article className="card flex h-full flex-col overflow-hidden">
      {image ? (
        <img src={image} alt="" loading="lazy" className="aspect-[16/9] w-full object-cover" />
      ) : (
        <div className="flex aspect-[16/7] items-center justify-center bg-gradient-to-br from-peach/60 via-cream to-sage-light/40" aria-hidden="true">
          <span className="flex h-24 w-24 items-center justify-center rounded-full bg-paper text-sage-dark ring-2 ring-gold/60">
            <NamedIcon name={icon} width={48} height={48} />
          </span>
        </div>
      )}
      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <h2 className="text-3xl">{title}</h2>
        <p className="mt-3 text-lg">{summary}</p>
        {facts.length > 0 && (
          <ul className="mt-4 space-y-1 border-l-4 border-gold/70 pl-4 text-ink-soft">
            {facts.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        )}
        {details.length > 0 && (
          <>
            <div id={detailsId} hidden={!open} className="prose-iap mt-4">
              {details.map((d, i) => (
                <p key={i}>{d}</p>
              ))}
            </div>
            <button
              type="button"
              aria-expanded={open}
              aria-controls={detailsId}
              onClick={() => setOpen((o) => !o)}
              className="btn-outline mt-auto self-start"
              style={{ marginTop: '1.25rem' }}
            >
              {open ? t('works.less') : t('works.more')}
            </button>
          </>
        )}
      </div>
    </article>
  );
}
