// ─── Falar com o Suporte ──────────────────────────────────────────────────
// Substitui o antigo "chat" que guardava as mensagens apenas no browser e
// nunca as entregava a ninguém. Todos os canais desta página são reais.

import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth-server'
import { getClientTickets } from '@/lib/queries/tickets'
import { PageHeader, StatusBadge } from '@/components/ui/shared'
import { CONTACT, whatsappLink, telLink, mailLink } from '@/lib/contact'

export default async function SupportPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const tickets = await getClientTickets(session.id)
  const openTickets = tickets.filter(t => t.status !== 'closed' && t.status !== 'resolved').slice(0, 4)

  const waMessage = `Olá Bexaltec, sou ${session.name} e preciso de apoio técnico.`

  const channels = [
    {
      ico: '🎫',
      title: 'Abrir um ticket de suporte',
      desc: 'O canal recomendado. Fica registado, com histórico e prazo de resposta associado ao seu contrato.',
      cta: 'Abrir ticket',
      href: '/dashboard/tickets',
      internal: true,
      primary: true,
    },
    {
      ico: '💬',
      title: 'WhatsApp',
      desc: `${CONTACT.phoneDisplay} · ${CONTACT.hoursShort}. Para questões rápidas e acompanhamento de reparações.`,
      cta: 'Abrir WhatsApp',
      href: whatsappLink(waMessage),
      internal: false,
      primary: false,
    },
    {
      ico: '📞',
      title: 'Telefone',
      desc: `${CONTACT.phoneDisplay} · ${CONTACT.hours}. Apoio prioritário para clientes com contrato.`,
      cta: 'Ligar agora',
      href: telLink,
      internal: false,
      primary: false,
    },
    {
      ico: '📧',
      title: 'Email',
      desc: `${CONTACT.email}. Para envio de documentação, propostas e faturação.`,
      cta: 'Enviar email',
      href: mailLink,
      internal: false,
      primary: false,
    },
  ]

  return (
    <div>
      <PageHeader
        title="Falar com o Suporte"
        sub="Escolha o canal mais adequado — todos chegam à equipa técnica da Bexaltec."
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {channels.map(c => (
          <div
            key={c.title}
            className="card-base"
            style={{
              padding: '1.5rem',
              display: 'flex', flexDirection: 'column', gap: '0.85rem',
              border: c.primary ? '1px solid rgba(0,230,118,0.25)' : undefined,
              background: c.primary ? 'rgba(0,230,118,0.04)' : undefined,
            }}>
            <div style={{ fontSize: 28 }}>{c.ico}</div>
            <div style={{ flex: 1 }}>
              <div className="font-rajdhani font-bold" style={{ fontSize: 16, color: 'var(--text)', marginBottom: '0.35rem' }}>
                {c.title}
              </div>
              <p style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.65 }}>{c.desc}</p>
            </div>
            {c.internal ? (
              <Link href={c.href} className={c.primary ? 'btn-primary' : 'btn-secondary'} style={{ fontSize: 12, padding: '9px 16px', justifyContent: 'center' }}>
                {c.cta}
              </Link>
            ) : (
              <a
                href={c.href}
                target={c.href.startsWith('http') ? '_blank' : undefined}
                rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="btn-secondary"
                style={{ fontSize: 12, padding: '9px 16px', justifyContent: 'center' }}>
                {c.cta}
              </a>
            )}
          </div>
        ))}
      </div>

      <div className="card-base" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', gap: '1rem', flexWrap: 'wrap' }}>
          <div className="font-rajdhani font-semibold" style={{ fontSize: 16, color: 'var(--text)' }}>
            Os seus pedidos em aberto
          </div>
          <Link href="/dashboard/tickets" style={{ fontSize: 12, color: 'var(--green)', textDecoration: 'none' }}>
            Ver todos os tickets →
          </Link>
        </div>

        {openTickets.length === 0 ? (
          <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.7 }}>
            Não tem pedidos em aberto. Se precisar de assistência, abra um ticket — é o canal com prazo de resposta garantido.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {openTickets.map(t => (
              <Link
                key={t.id}
                href="/dashboard/tickets"
                className="card-base"
                style={{
                  padding: '0.85rem 1rem', background: 'rgba(13,31,58,0.5)', textDecoration: 'none',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap',
                }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--silver2)', marginBottom: 2 }}>{t.title}</div>
                  <div style={{ fontSize: 10, color: 'var(--text2)' }}>
                    <span className="font-mono">{t.ref}</span>
                    {t.category ? ` · ${t.category}` : ''}
                  </div>
                </div>
                <StatusBadge status={t.status} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
