/**
 * CONFIGURAÇÃO CENTRAL DO SITE
 * ---------------------------------------------------------------
 * Tudo que costuma mudar (contatos, Pix, Zelle, números, redes sociais)
 * está aqui. Edite os valores e salve: o site atualiza sozinho.
 *
 * Textos com tradução usam o formato { pt: '...', es: '...', en: '...' }.
 * Valores marcados com [PREENCHER] são placeholders.
 */

export type Lang = 'pt' | 'es' | 'en';
export type Localized = Record<Lang, string>;

export interface Stat {
  /** Número exibido. Use número puro (ex.: 1200), sem pontos. */
  value: number;
  /** 'number' (padrão), 'currencyBRL' (R$) ou 'currencyUSD' (US$) */
  format?: 'number' | 'currencyBRL' | 'currencyUSD';
  /** Texto curto antes/depois do número (ex.: '+', ' kg') */
  prefix?: string;
  suffix?: string;
  label: Localized;
}

export const site = {
  /** E-mail que recebe voluntários e doações de itens (botões "mailto") */
  contactEmail: 'contato@exemplo.org',

  /** Endereço / cidade exibido no rodapé */
  location: 'Pau Amarelo, Paulista – PE, Brasil',

  /**
   * Imagem da capa. Deixe null para usar a ilustração SVG provisória
   * (src/components/CoverIllustration.tsx). Para trocar, coloque a imagem em
   * public/images/ e escreva o caminho, ex.: '/images/capa-pau-amarelo.jpg'
   */
  coverImage: null as string | null,

  /** Foto pequena de vovó Ana na capa */
  anaPhoto: '/images/ana.jpg',

  /** Números de impacto (página Inicial). Recomendado: 3 ou 4. */
  impactNumbers: [
    { value: 120, prefix: '+', label: { pt: 'famílias atendidas', es: 'familias atendidas', en: 'families served' } },
    { value: 1500, suffix: ' kg', label: { pt: 'de carne distribuídos', es: 'de carne distribuidos', en: 'of meat distributed' } },
    { value: 40, label: { pt: 'voluntários', es: 'voluntarios', en: 'volunteers' } },
    { value: 3, label: { pt: 'anos de atuação', es: 'años de actividad', en: 'years of work' } },
  ] satisfies Stat[],

  /** Números financeiros (página Doar) */
  financialNumbers: [
    { value: 25000, format: 'currencyBRL', label: { pt: 'arrecadados em 2025', es: 'recaudados en 2025', en: 'raised in 2025' } },
    { value: 100, suffix: '%', label: { pt: 'das doações vão para as obras', es: 'de las donaciones va a las obras', en: 'of donations go to our projects' } },
    { value: 35, format: 'currencyBRL', label: { pt: 'alimentam uma família por uma semana', es: 'alimentan a una familia por una semana', en: 'feed a family for a week' } },
  ] satisfies Stat[],

  pix: {
    key: '[PREENCHER-chave-pix]',
    /** Tipo da chave: CNPJ, CPF, e-mail, telefone ou aleatória */
    keyType: { pt: 'CNPJ', es: 'CNPJ', en: 'CNPJ (Brazilian tax ID)' } as Localized,
    holder: 'Instituição Ana Prado',
    bank: '[PREENCHER banco]',
    qrImage: '/images/qrcode-pix.png',
  },

  zelle: {
    recipient: '[PREENCHER nome do titular]',
    /** E-mail ou telefone cadastrado no Zelle */
    contact: '[PREENCHER e-mail ou telefone Zelle]',
    bank: '[PREENCHER banco nos EUA]',
    note: {
      pt: 'No campo de mensagem, escreva "Doação IAP".',
      es: 'En el campo de mensaje, escriba "Donación IAP".',
      en: 'In the memo field, write "IAP Donation".',
    } as Localized,
  },

  /** Redes sociais: deixe '' (vazio) para esconder o ícone */
  social: {
    instagram: 'https://instagram.com/[PREENCHER]',
    facebook: '',
    youtube: '',
    /** Somente números com DDI, ex.: '5581999999999' */
    whatsapp: '',
  },
};
