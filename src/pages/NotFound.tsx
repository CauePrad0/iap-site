import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PageHeading from '../components/PageHeading';
import { usePageMeta } from '../lib/usePageMeta';

export default function NotFound() {
  const { t } = useTranslation();
  usePageMeta(t('notFound.title'));
  return (
    <div className="mx-auto max-w-3xl px-4 pb-10 text-center">
      <PageHeading title={t('notFound.title')} intro={t('notFound.text')} />
      <Link to="/inicio" className="btn-primary mt-4">
        {t('notFound.back')}
      </Link>
    </div>
  );
}
