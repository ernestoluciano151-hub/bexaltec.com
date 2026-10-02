// ─── Contactos oficiais Bexaltec — fonte única de verdade ──────────────────
// Alterar aqui reflete-se no rodapé, na página de contacto e no portal.

export const CONTACT = {
  /** Número principal, em formato E.164 (sem espaços) — usar em href tel: */
  phoneE164: '+244938457563',
  /** Número para leitura humana */
  phoneDisplay: '+244 938 457 563',
  /** Número WhatsApp sem "+" nem espaços — usado em wa.me */
  whatsapp: '244938457563',
  email: 'info@bexaltec.com',
  billingEmail: 'faturacao@bexaltec.com',
  site: 'bexaltec.com',
  siteUrl: 'https://www.bexaltec.com',
  city: 'Luanda, Angola',
  hours: 'Seg–Sex 08h–18h · Sáb 09h–13h',
  hoursShort: 'Seg–Sex 08h–18h',
} as const

/** Link de WhatsApp com mensagem pré-preenchida. */
export function whatsappLink(message?: string) {
  const base = `https://wa.me/${CONTACT.whatsapp}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}

export const telLink = `tel:${CONTACT.phoneE164}`
export const mailLink = `mailto:${CONTACT.email}`
