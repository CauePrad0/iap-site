import type { Lang } from '../../config/site';

export type Status = 'pending' | 'approved' | 'rejected';

export interface Testimonial {
  id: string;
  created_at: string;
  name: string;
  relation: string | null;
  message: string;
  /** Idioma em que o depoimento foi escrito (ele é exibido sempre nesse idioma) */
  language: Lang;
  status: Status;
}

export interface NewTestimonial {
  name: string;
  relation: string | null;
  message: string;
  language: Lang;
  consent: true;
}

/** Limites — iguais às restrições (CHECK) da tabela no Supabase */
export const LIMITS = {
  nameMax: 80,
  relationMax: 120,
  messageMin: 20,
  messageMax: 2000,
};

export interface AdminUser {
  email: string;
}

/** Tudo que as páginas precisam; implementado pelo mock e pelo Supabase */
export interface TestimonialsRepo {
  listApproved(): Promise<Testimonial[]>;
  submit(input: NewTestimonial): Promise<void>;

  // Administração
  getUser(): Promise<AdminUser | null>;
  signIn(email: string, password: string): Promise<void>;
  signOut(): Promise<void>;
  isAdmin(): Promise<boolean>;
  listByStatus(status: Status): Promise<Testimonial[]>;
  setStatus(id: string, status: Status): Promise<void>;
  remove(id: string): Promise<void>;
}
