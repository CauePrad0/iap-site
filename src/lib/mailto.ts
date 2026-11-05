/** Monta um link "mailto:" com assunto e corpo pré-preenchidos */
export function mailto(to: string, subject: string, body: string): string {
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
