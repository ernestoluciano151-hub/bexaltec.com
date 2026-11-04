// ─── Envio de email ───────────────────────────────────────────────────────
//
// Camada única de envio. Usa a API HTTP do Resend — não precisa de dependência
// npm nem de porta SMTP aberta, o que é o que funciona de forma fiável em
// serverless (a Vercel bloqueia ligações SMTP de saída).
//
// REGRA DE HONESTIDADE: esta camada nunca finge. Se não estiver configurada, ou
// se o envio falhar, devolve `sent: false` com o motivo. Quem chama tem de
// refletir isso no que diz ao utilizador — nunca escrever "enviámos um email"
// sem ter a confirmação de que foi enviado.
//
// Configuração necessária (Vercel → Settings → Environment Variables):
//   RESEND_API_KEY   chave da conta Resend
//   MAIL_FROM        remetente verificado, ex.: "Bexaltec <site@bexaltec.com>"
//   MAIL_TO          destino interno (omisso: info@bexaltec.com)

import { CONTACT } from './contact'

const RESEND_ENDPOINT = 'https://api.resend.com/emails'

export const MAIL_TO = process.env.MAIL_TO?.trim() || CONTACT.email
const MAIL_FROM = process.env.MAIL_FROM?.trim() || ''
const API_KEY = process.env.RESEND_API_KEY?.trim() || ''

export type SendResult =
  | { sent: true; id: string | null }
  | { sent: false; reason: 'not_configured' | 'provider_error' | 'network_error'; detail?: string }

export function isMailConfigured(): boolean {
  return Boolean(API_KEY && MAIL_FROM)
}

export interface MailInput {
  to?: string | string[]
  subject: string
  html: string
  text: string
  /** Email do remetente original, para que responder no Outlook vá direto a ele. */
  replyTo?: string
}

export async function sendMail(input: MailInput): Promise<SendResult> {
  if (!isMailConfigured()) {
    console.warn(
      '[email] Envio ignorado: falta RESEND_API_KEY e/ou MAIL_FROM nas variáveis de ambiente. ' +
      'O registo foi gravado na base de dados, mas não saiu email.',
    )
    return { sent: false, reason: 'not_configured' }
  }

  const to = input.to ?? MAIL_TO

  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from:     MAIL_FROM,
        to:       Array.isArray(to) ? to : [to],
        subject:  input.subject,
        html:     input.html,
        text:     input.text,
        ...(input.replyTo ? { reply_to: input.replyTo } : {}),
      }),
      cache: 'no-store',
    })

    if (!res.ok) {
      const detail = await res.text().catch(() => '')
      console.error('[email] O fornecedor recusou o envio:', res.status, detail.slice(0, 500))
      return { sent: false, reason: 'provider_error', detail: `HTTP ${res.status}` }
    }

    const data = await res.json().catch(() => ({}))
    return { sent: true, id: (data as { id?: string }).id ?? null }
  } catch (err) {
    console.error('[email] Falha de rede ao enviar:', err)
    return { sent: false, reason: 'network_error' }
  }
}

// ── Composição ────────────────────────────────────────────────────────────

const esc = (v: unknown) =>
  String(v ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]!))

export interface QuoteMailData {
  ref: string
  name: string
  email: string
  phone?: string
  company?: string
  province?: string
  services?: string
  budget?: string
  deadline?: string
  message?: string
  fromPortal: boolean
}

/** Email interno com um pedido de orçamento. Só campos realmente preenchidos. */
export function buildQuoteMail(q: QuoteMailData): { subject: string; html: string; text: string } {
  const linhas: Array<[string, string | undefined]> = [
    ['Nome',        q.name],
    ['Email',       q.email],
    ['Telefone',    q.phone],
    ['Empresa',     q.company],
    ['Província',   q.province],
    ['Serviços',    q.services],
    ['Dimensão',    q.budget],
    ['Cargo',       q.deadline],
  ]
  const preenchidas = linhas.filter(([, v]) => v)

  const subject = `Pedido de orçamento ${q.ref} — ${q.name}${q.company ? ` (${q.company})` : ''}`

  const text = [
    `Pedido de orçamento ${q.ref}`,
    q.fromPortal ? 'Submetido por um cliente com sessão iniciada no portal.' : 'Submetido pelo formulário público do site.',
    '',
    ...preenchidas.map(([k, v]) => `${k}: ${v}`),
    ...(q.message ? ['', 'Mensagem:', q.message] : []),
    '',
    `Ver no portal: ${CONTACT.siteUrl}/admin/quotes`,
    'Responder a este email responde diretamente ao cliente.',
  ].join('\n')

  const html = `<!DOCTYPE html><html lang="pt-AO"><body style="margin:0;padding:0;background:#EEF2F5;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#EEF2F5;"><tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:600px;background:#FFFFFF;border-radius:4px;overflow:hidden;font-family:Arial,Helvetica,sans-serif;">
  <tr><td style="background:#0A1628;padding:20px 28px;">
    <div style="font-size:10px;letter-spacing:2.2px;text-transform:uppercase;color:#00E676;font-weight:bold;">Pedido de orçamento</div>
    <div style="font-size:22px;font-weight:bold;color:#FFFFFF;margin-top:4px;">${esc(q.ref)}</div>
  </td></tr>
  <tr><td style="height:3px;background:#00C853;line-height:3px;font-size:0;">&nbsp;</td></tr>
  <tr><td style="padding:22px 28px 0;">
    <p style="margin:0 0 16px;font-size:13px;line-height:20px;color:#6B7C89;">
      ${q.fromPortal ? 'Submetido por um cliente com sessão iniciada no portal.' : 'Submetido pelo formulário público do site.'}
    </p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:14px;">
      ${preenchidas.map(([k, v]) => `<tr>
        <td style="padding:7px 14px 7px 0;color:#6B7C89;font-size:12px;white-space:nowrap;vertical-align:top;width:92px;">${esc(k)}</td>
        <td style="padding:7px 0;color:#101D2B;line-height:20px;">${esc(v)}</td>
      </tr>`).join('')}
    </table>
  </td></tr>
  ${q.message ? `<tr><td style="padding:18px 28px 0;">
    <div style="font-size:10px;letter-spacing:1.6px;text-transform:uppercase;color:#00796B;font-weight:bold;margin-bottom:6px;">Mensagem</div>
    <div style="background:#F1F5F8;border-left:3px solid #00C853;border-radius:2px;padding:14px 16px;font-size:14px;line-height:22px;color:#41525F;white-space:pre-wrap;">${esc(q.message)}</div>
  </td></tr>` : ''}
  <tr><td style="padding:22px 28px 26px;">
    <a href="${CONTACT.siteUrl}/admin/quotes" style="display:inline-block;background:#00C853;color:#FFFFFF;text-decoration:none;font-size:13px;font-weight:bold;padding:12px 22px;border-radius:3px;">Abrir no portal &rarr;</a>
    <p style="margin:14px 0 0;font-size:12px;line-height:19px;color:#6B7C89;">Responder a este email responde diretamente a ${esc(q.email)}.</p>
  </td></tr>
</table></td></tr></table></body></html>`

  return { subject, html, text }
}
