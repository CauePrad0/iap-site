/**
 * MODO MOCK — sem backend. Os depoimentos ficam no localStorage do navegador.
 * Serve para desenvolver e demonstrar o site sem configurar o Supabase.
 */
import type { NewTestimonial, Status, Testimonial, TestimonialsRepo } from './types';

const KEY = 'iap-mock-testimonials';

const SEED: Testimonial[] = [
  {
    id: 'seed-1',
    created_at: '2025-03-10T12:00:00Z',
    name: 'Maria das Graças',
    relation: 'Vizinha de vovó Ana',
    message:
      '(Exemplo) Dona Ana nunca deixava ninguém sair da casa dela sem um prato de comida e uma palavra de carinho. Ver esse trabalho continuar é uma bênção para Pau Amarelo.',
    language: 'pt',
    status: 'approved',
  },
  {
    id: 'seed-2',
    created_at: '2025-05-02T12:00:00Z',
    name: 'Lucía Fernández',
    relation: 'Voluntaria',
    message:
      '(Ejemplo) Participar en la distribución de carne me enseñó lo que significa servir con alegría. Cada familia nos recibe como si fuéramos parte de la suya.',
    language: 'es',
    status: 'approved',
  },
  {
    id: 'seed-3',
    created_at: '2025-07-21T12:00:00Z',
    name: 'John Miller',
    relation: 'Donor',
    message:
      '(Example) I met Ana years ago and never forgot her kindness. Supporting the institution from abroad is my way of saying thank you.',
    language: 'en',
    status: 'approved',
  },
  {
    id: 'seed-4',
    created_at: '2025-09-01T12:00:00Z',
    name: 'José Carlos',
    relation: null,
    message: '(Exemplo pendente) Este depoimento aparece apenas no /admin até ser aprovado.',
    language: 'pt',
    status: 'pending',
  },
];

function load(): Testimonial[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as Testimonial[];
  } catch {
    /* ignora dados corrompidos */
  }
  return [...SEED];
}

function save(list: Testimonial[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* sem localStorage: fica só em memória nesta visita */
  }
  memory = list;
}

let memory: Testimonial[] = load();
const delay = () => new Promise((r) => setTimeout(r, 350));
const newest = (a: Testimonial, b: Testimonial) => b.created_at.localeCompare(a.created_at);

export const mockRepo: TestimonialsRepo = {
  async listApproved() {
    await delay();
    return memory.filter((t) => t.status === 'approved').sort(newest);
  },
  async submit(input: NewTestimonial) {
    await delay();
    const item: Testimonial = {
      id: crypto.randomUUID?.() ?? String(Date.now()),
      created_at: new Date().toISOString(),
      name: input.name,
      relation: input.relation,
      message: input.message,
      language: input.language,
      status: 'pending',
    };
    save([item, ...memory]);
  },
  // No mock não há login real: o /admin já abre "logado".
  async getUser() {
    return { email: 'admin@mock (desenvolvimento)' };
  },
  async signIn() {},
  async signOut() {},
  async isAdmin() {
    return true;
  },
  async listByStatus(status: Status) {
    await delay();
    return memory.filter((t) => t.status === status).sort(newest);
  },
  async setStatus(id, status) {
    save(memory.map((t) => (t.id === id ? { ...t, status } : t)));
  },
  async remove(id) {
    save(memory.filter((t) => t.id !== id));
  },
};
