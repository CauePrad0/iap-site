import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { site } from '../config/site';
import CoverIllustration from '../components/CoverIllustration';
import { Divider, LeafBranch } from '../components/Ornaments';
import { ArrowIcon } from '../components/Icons';
import { usePageMeta } from '../lib/usePageMeta';

/** Capa (/): tela de entrada */
export default function Cover() {
  const { t } = useTranslation();
  usePageMeta();

  return (
    <section className="relative isolate flex min-h-[calc(100dvh-62px)] items-center justify-center overflow-hidden px-4 py-12 sm:min-h-[calc(100dvh-74px)]">
      {/* Fundo: imagem configurada ou ilustração provisória */}
      {site.coverImage ? (
        <img src={site.coverImage} alt={t('cover.illustrationAlt')} className="absolute inset-0 -z-20 h-full w-full object-cover" />
      ) : (
        <CoverIllustration title={t('cover.illustrationAlt')} className="absolute inset-0 -z-20 h-full w-full" />
      )}
      {/* Véu creme para garantir a leitura do texto */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-cream/30 via-cream/55 to-cream/90" aria-hidden="true" />

      <div className="card relative w-full max-w-lg bg-paper/90 px-6 py-10 text-center backdrop-blur-sm sm:px-10">
        <LeafBranch className="pointer-events-none absolute -left-6 -top-6 w-28 sm:w-36" />
        <LeafBranch flip className="pointer-events-none absolute -right-6 -top-6 w-28 sm:w-36" />
        <p className="text-lg font-bold uppercase tracking-[0.2em] text-gold-dark">{t('cover.welcome')}</p>
        <h1 className="mt-3 text-5xl sm:text-6xl">{t('siteName')}</h1>
        <Divider className="my-5" />
        <p className="font-serif text-2xl italic text-ink-soft">{t('cover.tagline')}</p>
        <Link to="/inicio" className="btn-primary mt-8 px-10 text-xl">
          {t('cover.enter')}
          <ArrowIcon />
        </Link>
      </div>

      {/* Fotinho de vovó Ana no cantinho */}
      <figure className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8">
        <img
          src={site.anaPhoto}
          alt={t('cover.photoAlt')}
          width={120}
          height={120}
          className="h-20 w-20 rounded-full border-4 border-gold bg-paper object-cover shadow-lg sm:h-28 sm:w-28"
        />
      </figure>
    </section>
  );
}
