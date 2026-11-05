/**
 * MODO SUPABASE — depoimentos na tabela "testimonials".
 * As regras de segurança (quem lê/insere/aprova) ficam no banco, via
 * Row Level Security: veja supabase/migrations/.
 */
import { createClient } from '@supabase/supabase-js';
import { env } from '../env';
import type { Status, Testimonial, TestimonialsRepo } from './types';

const supabase = createClient(env.supabaseUrl, env.supabaseAnonKey);
const COLUMNS = 'id, created_at, name, relation, message, language, status';

function check<T>(res: { data: T; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message);
  return res.data;
}

export const supabaseRepo: TestimonialsRepo = {
  async listApproved() {
    const res = await supabase
      .from('testimonials')
      .select(COLUMNS)
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(200);
    return check(res) as Testimonial[];
  },

  async submit(input) {
    // O status fica 'pending' pelo valor padrão da tabela (o público nem tem
    // permissão de preencher essa coluna). Sem ".select()": o público não
    // pode ler depoimentos pendentes.
    const res = await supabase.from('testimonials').insert(input);
    check(res);
  },

  async getUser() {
    const { data } = await supabase.auth.getSession();
    const email = data.session?.user.email;
    return email ? { email } : null;
  },

  async signIn(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
  },

  async signOut() {
    await supabase.auth.signOut();
  },

  async isAdmin() {
    const res = await supabase.rpc('is_admin');
    return Boolean(check(res));
  },

  async listByStatus(status: Status) {
    const res = await supabase
      .from('testimonials')
      .select(COLUMNS)
      .eq('status', status)
      .order('created_at', { ascending: false });
    return check(res) as Testimonial[];
  },

  async setStatus(id, status) {
    check(await supabase.from('testimonials').update({ status, reviewed_at: new Date().toISOString() }).eq('id', id));
  },

  async remove(id) {
    check(await supabase.from('testimonials').delete().eq('id', id));
  },
};
