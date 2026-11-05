import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getRepo, isMock, type Testimonial } from '../lib/testimonials';
import { formatDate } from '../lib/format';
import { useLang } from '../lib/content';
import { usePageMeta } from '../lib/usePageMeta';
import PageHeading from '../components/PageHeading';
import TestimonialForm from '../components/TestimonialForm';
import { QuoteIcon } from '../components/Icons';
import { Divider } from '../components/Ornaments';

/** Depoimentos (/depoimentos): lista dos aprovados + formulário */
export default function Testimonials() {
  const { t } = useTranslation();
  const lang = useLang();
  usePageMeta(t('testimonials.title'));
  const [items, setItems] = useState<Testimonial[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let alive = true;
    getRepo()
      .then((r) => r.listApproved())
      .then((list) => alive && setItems(list))
      .catch((e) => {
        console.error(e);
        if (alive) setError(true);
      });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6">
      <PageHeading title={t('testimonials.title')} intro={t('testimonials.intro')} />

      <p className="text-center">
        <a href="#formulario" className="btn-outline">
          {t('testimonials.form.title')}
        </a>
      </p>
      {isMock && <p className="mt-4 text-center text-sm text-ink-soft">{t('testimonials.mockNotice')}</p>}

      <section aria-labelledby="list-title" className="mt-10" aria-busy={items === null && !error}>
        <h2 id="list-title" className="sr-only">
          {t('testimonials.listTitle')}
        </h2>
        {error ? (
          <p className="text-center text-lg text-ink-soft">{t('testimonials.loadError')}</p>
        ) : items === null ? (
          <p className="text-center text-lg text-ink-soft">{t('testimonials.loading')}</p>
        ) : items.length === 0 ? (
          <p className="text-center text-lg text-ink-soft">{t('testimonials.empty')}</p>
        ) : (
          <ul className="space-y-6">
            {items.map((item) => (
              <li key={item.id}>
                {/* lang = idioma original: o texto não é traduzido */}
                <figure lang={item.language} className="card relative px-6 py-7 sm:px-10">
                  <QuoteIcon width={36} height={36} className="absolute right-5 top-5 text-gold" />
                  <blockquote className="whitespace-pre-line pr-8 font-serif text-xl leading-relaxed text-ink sm:text-2xl">
                    {item.message}
                  </blockquote>
                  <figcaption className="mt-4 border-t border-gold/40 pt-3">
                    <span className="block font-bold text-sage-dark">{item.name}</span>
                    {item.relation && <span className="block text-ink-soft">{item.relation}</span>}
                    <span className="mt-1 block text-sm text-ink-soft" lang={lang}>
                      {formatDate(item.created_at, lang)}
                      {item.language !== lang && ` · ${t('testimonials.writtenIn', { lang: t(`languages.${item.language}`) })}`}
                    </span>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        )}
      </section>

      <Divider className="my-12" />

      <section id="formulario" aria-labelledby="form-title" className="scroll-mt-28">
        <TestimonialForm />
      </section>
    </div>
  );
}
