/**
 * Escolhe a implementação conforme o .env:
 *   VITE_USE_MOCK=true  (padrão) → mock no navegador
 *   VITE_USE_MOCK=false          → Supabase
 * O cliente do Supabase só é baixado quando realmente usado.
 */
import { env, supabaseConfigured } from '../env';
import type { TestimonialsRepo } from './types';

export * from './types';

export const isMock = env.useMock;

let repoPromise: Promise<TestimonialsRepo> | null = null;

export function getRepo(): Promise<TestimonialsRepo> {
  if (!repoPromise) {
    if (isMock) {
      repoPromise = import('./mock').then((m) => m.mockRepo);
    } else if (!supabaseConfigured) {
      repoPromise = Promise.reject(new Error('SUPABASE_NOT_CONFIGURED'));
    } else {
      repoPromise = import('./supabase').then((m) => m.supabaseRepo);
    }
  }
  return repoPromise;
}
