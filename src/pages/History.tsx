import { useTranslation } from 'react-i18next';
import { useContent } from '../lib/content';
import { usePageMeta } from '../lib/usePageMeta';
import PageHeading from '../components/PageHeading';
import { Divider } from '../components/Ornaments';

/**
 * Nossa História (/historia).
 * O texto vem de src/content/{pt,es,en}.json → "history".
 */
export default function History() {
  const { t } = useTranslation();
  const { history } = useContent();
  usePageMeta(t('history.title'));

  return (
    <article className="mx-auto max-w-5xl px-4 sm:px-6">
      <PageHeading title={t('history.title')} intro={history.intro} />

      {history.sections.map((section, i) => (
        <section key={i} className="mt-10">
          {i > 0 && <Divider className="mb-10" />}
          <div className={`grid items-start gap-8 ${section.image ? 'md:grid-cols-[1fr_320px]' : ''}`}>
            <div className={section.image && i % 2 === 1 ? 'md:order-2' : ''}>
              <h2 className="text-3xl sm:text-4xl">{section.title}</h2>
              <div className="prose-iap mt-4">
                {section.paragraphs.map((p, j) => (
                  <p key={j}>{p}</p>
                ))}
              </div>
            </div>
            {section.image && (
              <figure className={i % 2 === 1 ? 'md:order-1' : ''}>
                <img
                  src={section.image.src}
                  alt={section.image.alt}
                  loading="lazy"
                  className="w-full rounded-3xl border-4 border-paper object-cover shadow-md ring-1 ring-gold/50"
                />
                {section.image.caption && (
                  <figcaption className="mt-2 text-center font-serif text-lg italic text-ink-soft">{section.image.caption}</figcaption>
                )}
              </figure>
            )}
          </div>
        </section>
      ))}
    </article>
  );
}
