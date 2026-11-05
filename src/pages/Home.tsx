import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { site } from '../config/site';
import { useContent } from '../lib/content';
import { usePageMeta } from '../lib/usePageMeta';
import PageHeading from '../components/PageHeading';
import StatsBox from '../components/StatsBox';
import { ArrowIcon, BasketIcon, HeartIcon, QuoteIcon } from '../components/Icons';
import { LeafBranch } from '../components/Ornaments';

const CARDS = [
  { to: '/obras', key: 'works', Icon: BasketIcon },
  { to: '/depoimentos', key: 'testimonials', Icon: QuoteIcon },
  { to: '/doar', key: 'donate', Icon: HeartIcon },
] as const;

/** Página Inicial (/inicio) */
export default function Home() {
  const { t } = useTranslation();
  const content = useContent();
  usePageMeta(t('nav.home'));

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6">
      <PageHeading title={t('home.title')} />

      <section className="mx-auto max-w-3xl text-center">
        <div className="prose-iap">
          {content.home.intro.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
        <Link to="/historia" className="btn-outline mt-2">
          {t('home.historyButton')}
          <ArrowIcon />
        </Link>
      </section>

      <div className="mt-12">
        <StatsBox title={t('home.impactTitle')} stats={site.impactNumbers} />
      </div>

      <section aria-labelledby="cards-title" className="mt-14">
        <h2 id="cards-title" className="text-center text-3xl sm:text-4xl">
          {t('home.cardsTitle')}
        </h2>
        <ul className="mt-8 grid gap-5 md:grid-cols-3">
          {CARDS.map(({ to, key, Icon }) => (
            <li key={key}>
              <Link
                to={to}
                className="card group relative flex h-full flex-col items-center overflow-hidden px-6 py-10 text-center transition-transform hover:-translate-y-1 hover:border-gold"
              >
                <LeafBranch className="pointer-events-none absolute -right-8 -top-3 w-28 opacity-60" flip />
                <span className="flex h-20 w-20 items-center justify-center rounded-full bg-peach/70 text-sage-dark ring-2 ring-gold/50">
                  <Icon width={40} height={40} />
                </span>
                <span className="mt-5 font-serif text-3xl font-semibold text-sage-dark">{t(`home.cards.${key}.title`)}</span>
                <span className="mt-2 text-lg text-ink-soft">{t(`home.cards.${key}.text`)}</span>
                <span className="mt-5 inline-flex items-center gap-1 font-bold text-sage group-hover:gap-2">
                  <ArrowIcon aria-hidden="true" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
