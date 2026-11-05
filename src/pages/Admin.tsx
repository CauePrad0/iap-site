import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { getRepo, isMock, type AdminUser, type Status, type Testimonial, type TestimonialsRepo } from '../lib/testimonials';
import { formatDate } from '../lib/format';
import { useLang } from '../lib/content';
import { usePageMeta } from '../lib/usePageMeta';

const TABS: Status[] = ['pending', 'approved', 'rejected'];

/**
 * /admin — moderação de depoimentos.
 * Supabase: login com e-mail/senha (Supabase Auth) + conta listada em "admins".
 * Mock: abre direto, com aviso de que é só para desenvolvimento.
 */
export default function Admin() {
  const { t } = useTranslation();
  usePageMeta(t('admin.title'));
  const [repo, setRepo] = useState<TestimonialsRepo | null>(null);
  const [configError, setConfigError] = useState(false);
  const [user, setUser] = useState<AdminUser | null | undefined>(undefined);
  const [admin, setAdmin] = useState<boolean | undefined>(undefined);

  const refreshUser = useCallback(async (r: TestimonialsRepo) => {
    const u = await r.getUser();
    setUser(u);
    setAdmin(u ? await r.isAdmin().catch(() => false) : undefined);
  }, []);

  useEffect(() => {
    getRepo()
      .then((r) => {
        setRepo(r);
        return refreshUser(r);
      })
      .catch(() => setConfigError(true));
  }, [refreshUser]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      {/* Página de administração não deve ser indexada */}
      <meta name="robots" content="noindex" />
      <h1 className="text-4xl">{t('admin.title')}</h1>

      {isMock && (
        <p role="note" className="mt-4 rounded-xl border-2 border-gold bg-peach/50 px-4 py-3 font-bold text-ink">
          ⚠️ {t('admin.mockWarning')}
        </p>
      )}
      {configError && <p className="mt-4 rounded-xl border-2 border-red-700 bg-red-50 px-4 py-3 text-red-800">{t('admin.configMissing')}</p>}

      {repo && user === null && <LoginForm repo={repo} onDone={() => refreshUser(repo)} />}

      {repo && user && (
        <>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-ink-soft">{t('admin.signedInAs', { email: user.email })}</p>
            {!isMock && (
              <button
                type="button"
                className="btn-outline min-h-10 py-2"
                onClick={async () => {
                  await repo.signOut();
                  setUser(null);
                  setAdmin(undefined);
                }}
              >
                {t('admin.signOut')}
              </button>
            )}
          </div>
          {admin === false && <p className="mt-4 rounded-xl border-2 border-red-700 bg-red-50 px-4 py-3 text-red-800">{t('admin.notAdmin')}</p>}
          {admin && <Moderation repo={repo} />}
        </>
      )}
    </div>
  );
}

function LoginForm({ repo, onDone }: { repo: TestimonialsRepo; onDone: () => void }) {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(false);
    try {
      await repo.signIn(email, password);
      onDone();
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="card mx-auto mt-8 max-w-md space-y-4 px-6 py-8">
      <h2 className="text-3xl">{t('admin.loginTitle')}</h2>
      {error && (
        <p role="alert" className="font-bold text-red-800">
          {t('admin.loginError')}
        </p>
      )}
      <div>
        <label htmlFor="a-email" className="field-label">
          {t('admin.email')}
        </label>
        <input id="a-email" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} className="field" />
      </div>
      <div>
        <label htmlFor="a-pass" className="field-label">
          {t('admin.password')}
        </label>
        <input
          id="a-pass"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="field"
        />
      </div>
      <button type="submit" disabled={busy} className="btn-primary w-full">
        {busy ? t('admin.signingIn') : t('admin.signIn')}
      </button>
    </form>
  );
}

function Moderation({ repo }: { repo: TestimonialsRepo }) {
  const { t } = useTranslation();
  const lang = useLang();
  const [tab, setTab] = useState<Status>('pending');
  const [items, setItems] = useState<Testimonial[] | null>(null);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setItems(null);
    setError('');
    try {
      setItems(await repo.listByStatus(tab));
    } catch {
      setError(t('admin.actionError'));
      setItems([]);
    }
  }, [repo, tab, t]);

  useEffect(() => {
    load();
  }, [load]);

  async function act(fn: () => Promise<void>) {
    setError('');
    try {
      await fn();
      await load();
    } catch {
      setError(t('admin.actionError'));
    }
  }

  return (
    <section className="mt-8">
      <div role="tablist" aria-label={t('admin.title')} className="flex flex-wrap gap-2">
        {TABS.map((s) => (
          <button
            key={s}
            role="tab"
            type="button"
            aria-selected={tab === s}
            onClick={() => setTab(s)}
            className={`btn min-h-10 py-2 ${tab === s ? 'bg-sage text-white' : 'border-2 border-sage-light bg-paper text-sage-dark'}`}
          >
            {t(`admin.tabs.${s}`)}
          </button>
        ))}
        <button type="button" onClick={load} className="btn min-h-10 py-2 text-sage-dark underline">
          {t('admin.refresh')}
        </button>
      </div>

      {error && (
        <p role="alert" className="mt-4 font-bold text-red-800">
          {error}
        </p>
      )}

      <div role="tabpanel" className="mt-6" aria-busy={items === null}>
        {items === null ? (
          <p className="text-ink-soft">…</p>
        ) : items.length === 0 ? (
          <p className="text-ink-soft">{t('admin.empty')}</p>
        ) : (
          <ul className="space-y-4">
            {items.map((it) => (
              <li key={it.id} className="card px-5 py-5">
                <p className="text-sm text-ink-soft">
                  {t('admin.receivedAt', { date: formatDate(it.created_at, lang) })} · {it.language.toUpperCase()}
                </p>
                <p className="mt-1 font-bold text-sage-dark">
                  {it.name}
                  {it.relation && <span className="font-normal text-ink-soft"> — {it.relation}</span>}
                </p>
                <p lang={it.language} className="mt-2 whitespace-pre-line">
                  {it.message}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {it.status !== 'approved' && (
                    <button type="button" className="btn-primary min-h-10 py-2" onClick={() => act(() => repo.setStatus(it.id, 'approved'))}>
                      {t('admin.approve')}
                    </button>
                  )}
                  {it.status !== 'rejected' && (
                    <button type="button" className="btn-outline min-h-10 py-2" onClick={() => act(() => repo.setStatus(it.id, 'rejected'))}>
                      {t('admin.reject')}
                    </button>
                  )}
                  <button
                    type="button"
                    className="btn min-h-10 border-2 border-red-700 bg-paper py-2 text-red-800 hover:bg-red-50"
                    onClick={() => window.confirm(t('admin.confirmDelete')) && act(() => repo.remove(it.id))}
                  >
                    {t('admin.delete')}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
