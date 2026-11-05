import { useRef, useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import type { Lang } from '../config/site';
import { LANGS } from '../i18n';
import { useLang } from '../lib/content';
import { getRepo, LIMITS } from '../lib/testimonials';
import { CheckIcon } from './Icons';

type Errors = Partial<Record<'name' | 'relation' | 'message' | 'consent', string>>;

const LAST_SENT_KEY = 'iap-last-testimonial';
const MIN_INTERVAL_MS = 3 * 60 * 1000; // um envio a cada 3 minutos por navegador
const MIN_FILL_MS = 3000; // robôs costumam enviar em menos de 3 s

/**
 * Formulário de depoimento.
 * Proteção básica contra spam: campo "honeypot" invisível, tempo mínimo de
 * preenchimento, intervalo entre envios e limites de tamanho (também no banco).
 */
export default function TestimonialForm() {
  const { t } = useTranslation();
  const uiLang = useLang();
  const startedAt = useRef(Date.now());
  const successRef = useRef<HTMLDivElement>(null);
  const summaryRef = useRef<HTMLParagraphElement>(null);

  const [name, setName] = useState('');
  const [relation, setRelation] = useState('');
  const [message, setMessage] = useState('');
  const [language, setLanguage] = useState<Lang>(uiLang);
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState(''); // honeypot
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  function validate(): Errors {
    const e: Errors = {};
    const n = name.trim();
    const m = message.trim();
    if (!n) e.name = t('testimonials.errors.nameRequired');
    else if (n.length > LIMITS.nameMax) e.name = t('testimonials.errors.nameTooLong', { max: LIMITS.nameMax });
    if (relation.trim().length > LIMITS.relationMax)
      e.relation = t('testimonials.errors.relationTooLong', { max: LIMITS.relationMax });
    if (m.length < LIMITS.messageMin) e.message = t('testimonials.errors.messageTooShort', { min: LIMITS.messageMin });
    else if (m.length > LIMITS.messageMax) e.message = t('testimonials.errors.messageTooLong', { max: LIMITS.messageMax });
    if (!consent) e.consent = t('testimonials.errors.consentRequired');
    return e;
  }

  async function onSubmit(ev: FormEvent) {
    ev.preventDefault();
    setFormError('');
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) {
      setFormError(t('testimonials.errors.summary'));
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    // Robô? Finge que deu certo e não envia nada.
    if (website || Date.now() - startedAt.current < MIN_FILL_MS) {
      finish();
      return;
    }

    try {
      const last = Number(localStorage.getItem(LAST_SENT_KEY) || 0);
      if (Date.now() - last < MIN_INTERVAL_MS) {
        setFormError(t('testimonials.errors.tooSoon'));
        requestAnimationFrame(() => summaryRef.current?.focus());
        return;
      }
    } catch {
      /* sem localStorage */
    }

    setSending(true);
    try {
      const repo = await getRepo();
      await repo.submit({
        name: name.trim(),
        relation: relation.trim() || null,
        message: message.trim(),
        language,
        consent: true,
      });
      try {
        localStorage.setItem(LAST_SENT_KEY, String(Date.now()));
      } catch {
        /* ignora */
      }
      finish();
    } catch (err) {
      console.error(err);
      setFormError(t('testimonials.errors.generic'));
      requestAnimationFrame(() => summaryRef.current?.focus());
    } finally {
      setSending(false);
    }
  }

  function finish() {
    setSent(true);
    setName('');
    setRelation('');
    setMessage('');
    setConsent(false);
    requestAnimationFrame(() => successRef.current?.focus());
  }

  if (sent) {
    return (
      <div ref={successRef} tabIndex={-1} role="status" className="card px-6 py-10 text-center focus:outline-none">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sage text-white">
          <CheckIcon width={36} height={36} />
        </span>
        <h3 className="mt-4 text-3xl">{t('testimonials.form.successTitle')}</h3>
        <p className="mt-2 text-lg">{t('testimonials.form.successText')}</p>
        <button
          type="button"
          className="btn-outline mt-6"
          onClick={() => {
            setSent(false);
            startedAt.current = Date.now();
          }}
        >
          {t('testimonials.form.sendAnother')}
        </button>
      </div>
    );
  }

  const remaining = LIMITS.messageMax - message.length;
  const fieldClass = (k: keyof Errors) => `field ${errors[k] ? 'border-red-700' : ''}`;
  const ErrorText = ({ k }: { k: keyof Errors }) =>
    errors[k] ? (
      <p id={`err-${k}`} className="mt-1 font-bold text-red-800">
        {errors[k]}
      </p>
    ) : null;

  return (
    <form onSubmit={onSubmit} noValidate className="card space-y-5 px-5 py-8 sm:px-10">
      <div className="text-center">
        <h2 id="form-title" className="text-3xl sm:text-4xl">
          {t('testimonials.form.title')}
        </h2>
        <p className="mt-2 text-ink-soft">{t('testimonials.form.intro')}</p>
      </div>

      {formError && (
        <p ref={summaryRef} tabIndex={-1} role="alert" className="rounded-xl border-2 border-red-700 bg-red-50 px-4 py-3 font-bold text-red-800">
          {formError}
        </p>
      )}

      <div>
        <label htmlFor="t-name" className="field-label">
          {t('testimonials.form.name')}
        </label>
        <input
          id="t-name"
          type="text"
          autoComplete="name"
          maxLength={LIMITS.nameMax + 20}
          value={name}
          onChange={(e) => setName(e.target.value)}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'err-name' : undefined}
          className={fieldClass('name')}
          required
        />
        <ErrorText k="name" />
      </div>

      <div>
        <label htmlFor="t-relation" className="field-label">
          {t('testimonials.form.relation')} <span className="font-normal text-ink-soft">{t('testimonials.form.optional')}</span>
        </label>
        <input
          id="t-relation"
          type="text"
          maxLength={LIMITS.relationMax + 20}
          value={relation}
          onChange={(e) => setRelation(e.target.value)}
          placeholder={t('testimonials.form.relationHint')}
          aria-invalid={!!errors.relation}
          aria-describedby={errors.relation ? 'err-relation' : undefined}
          className={fieldClass('relation')}
        />
        <ErrorText k="relation" />
      </div>

      <div>
        <label htmlFor="t-message" className="field-label">
          {t('testimonials.form.message')}
        </label>
        <textarea
          id="t-message"
          rows={6}
          maxLength={LIMITS.messageMax}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          aria-invalid={!!errors.message}
          aria-describedby={`t-message-count${errors.message ? ' err-message' : ''}`}
          className={fieldClass('message')}
          required
        />
        <p id="t-message-count" className={`mt-1 text-sm ${remaining < 100 ? 'font-bold text-gold-dark' : 'text-ink-soft'}`}>
          {t('testimonials.form.charsLeft', { count: remaining })}
        </p>
        <ErrorText k="message" />
      </div>

      <div>
        <label htmlFor="t-language" className="field-label">
          {t('testimonials.form.language')}
        </label>
        <select id="t-language" value={language} onChange={(e) => setLanguage(e.target.value as Lang)} className="field">
          {LANGS.map((l) => (
            <option key={l} value={l}>
              {t(`languages.${l}`)}
            </option>
          ))}
        </select>
      </div>

      {/* Honeypot: invisível para pessoas; robôs costumam preencher */}
      <div className="sr-only-iap" aria-hidden="true">
        <label htmlFor="t-website">{t('testimonials.form.honeypot')}</label>
        <input id="t-website" type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
      </div>

      <div>
        <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-cream px-4 py-3">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            aria-invalid={!!errors.consent}
            aria-describedby={errors.consent ? 'err-consent' : undefined}
            className="mt-1 h-6 w-6 shrink-0 accent-sage"
          />
          <span>{t('testimonials.form.consent')}</span>
        </label>
        <ErrorText k="consent" />
      </div>

      <button type="submit" disabled={sending} className="btn-primary w-full text-lg sm:w-auto">
        {sending ? t('testimonials.form.sending') : t('testimonials.form.submit')}
      </button>
    </form>
  );
}
