/**
 * Variáveis de ambiente (arquivo .env). Sem .env, o site roda em modo mock.
 */
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const env = {
  useMock: (import.meta.env.VITE_USE_MOCK ?? 'true') !== 'false',
  supabaseUrl: url?.trim() || '',
  supabaseAnonKey: anonKey?.trim() || '',
};

export const supabaseConfigured = Boolean(env.supabaseUrl && env.supabaseAnonKey);
