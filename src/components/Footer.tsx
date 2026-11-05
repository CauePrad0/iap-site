import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { site } from '../config/site';
import { Divider } from './Ornaments';
import { FacebookIcon, InstagramIcon, MailIcon, WhatsappIcon, YoutubeIcon } from './Icons';
import { NAV_ITEMS } from './nav';

export default function Footer() {
  const { t } = useTranslation();
  const socials = [
    { href: site.social.instagram, label: 'Instagram', Icon: InstagramIcon },
    { href: site.social.facebook, label: 'Facebook', Icon: FacebookIcon },
    { href: site.social.youtube, label: 'YouTube', Icon: YoutubeIcon },
    { href: site.social.whatsapp ? `https://wa.me/${site.social.whatsapp}` : '', label: 'WhatsApp', Icon: WhatsappIcon },
  ].filter((s) => s.href);

  return (
    <footer className="mt-16 border-t border-gold/40 bg-cream-dark/60">
      <div className="mx-auto max-w-6xl px-4 py-10 text-center sm:px-6">
        <img src="/logo-192.jpg" alt="" width={72} height={72} className="mx-auto h-18 w-18 rounded-full border border-gold/60" />
        <p className="mt-3 font-serif text-2xl font-semibold text-sage-dark">{t('siteName')}</p>
        <p className="mt-1 text-ink-soft">{t('footer.memory')}</p>
        <Divider className="my-6" />

        <nav aria-label={t('nav.menu')}>
          <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2">
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="font-bold text-sage-dark underline-offset-4 hover:underline">
                  {t(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-6 flex flex-col items-center gap-3">
          <p>
            <span className="font-bold">{t('footer.contact')}: </span>
            <a href={`mailto:${site.contactEmail}`} className="inline-flex items-center gap-1 text-sage-dark underline underline-offset-4">
              <MailIcon width={18} height={18} />
              {site.contactEmail}
            </a>
          </p>
          <p className="text-ink-soft">{site.location}</p>
          {socials.length > 0 && (
            <ul className="flex gap-2" aria-label={t('footer.followUs')}>
              {socials.map(({ href, label, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-gold/60 bg-paper text-sage-dark hover:bg-cream"
                  >
                    <Icon />
                    <span className="sr-only">
                      {label} {t('a11y.newTab')}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
        <p className="mt-8 text-sm text-ink-soft">{t('footer.rights', { year: new Date().getFullYear() })}</p>
      </div>
    </footer>
  );
}
