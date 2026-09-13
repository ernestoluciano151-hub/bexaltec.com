// ─── Histórico ────────────────────────────────────────────────────────────
// Linha do tempo construída a partir dos dados reais do cliente:
// tickets, reparações, faturas e orçamentos.

import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getSession } from '@/lib/auth-server'
import { getClientTickets } from '@/lib/queries/tickets'
import { getClientRepairs } from '@/lib/queries/repairs'
import { getClientInvoices } from '@/lib/queries/invoices'
import { getClientQuotes } from '@/lib/queries/quotes'
import { PageHeader, EmptyState } from '@/components/ui/shared'

interface Event {
  date: Date
  ico: string
  title: string
  desc: string
  tag: string
}

const kwanza = (v: string | null) =>
  v == null ? '' : `${Number(v).toLocaleString('pt-AO', { maximumFractionDigits: 0 })} AOA`

export default async function HistoryPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const [tickets, repairs, invoices, quotes] = await Promise.all([
    getClientTickets(session.id),
    getClientRepairs(session.id),
    getClientInvoices(session.id),
    getClientQuotes(session.id, session.email),
  ])

  const events: Event[] = [
    ...tickets.map(t => ({
      date: new Date(t.createdAt),
      ico: '🎫',
      title: 'Ticket aberto',
      desc: `${t.title} — ${t.ref}`,
      tag: 'Suporte',
    })),
    ...repairs.map(r => ({
      date: new Date(r.entryDate),
      ico: '🔧',
      title: 'Equipamento em reparação',
      desc: `${[r.brand, r.deviceName, r.model].filter(Boolean).join(' ')} — ${r.ref}`,
      tag: 'Laboratório',
    })),
    ...invoices.map(i => ({
      date: new Date(i.issueDate),
      ico: '🧾',
      title: i.status === 'paid' ? 'Fatura paga' : 'Fatura emitida',
      desc: `${i.ref}${i.total ? ` — ${kwanza(i.total)}` : ''}`,
      tag: 'Faturação',
    })),
    ...quotes.map(q => ({
      date: new Date(q.createdAt),
      ico: '📋',
      title: 'Pedido de orçamento',
      desc: `${q.ref}${q.services ? ` — ${q.services}` : ''}`,
      tag: 'Orçamento',
    })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime())

  // Agrupar por mês
  const groups = events.reduce<Record<string, Event[]>>((acc, e) => {
    const key = e.date.toLocaleDateString('pt-AO', { month: 'long', year: 'numeric' })
    ;(acc[key] ??= []).push(e)
    return acc
  }, {})

  return (
    <div>
      <PageHeader
        title="Histórico"
        sub="Tudo o que aconteceu na sua conta, do mais recente para o mais antigo."
      />

      {events.length === 0 ? (
        <div className="card-base">
          <EmptyState
            ico="📅"
            title="Ainda não há atividade registada"
            sub="Tickets, reparações, faturas e orçamentos aparecem aqui à medida que forem criados."
            action={<Link href="/dashboard/tickets" className="btn-primary" style={{ fontSize: 12, padding: '9px 18px' }}>Abrir o primeiro ticket</Link>}
          />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {Object.entries(groups).map(([month, items]) => (
            <div key={month}>
              <div style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--green)', fontWeight: 700, marginBottom: '0.85rem' }}>
                {month}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {items.map((e, i) => (
                  <div key={i} className="card-base" style={{ padding: '1rem 1.25rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 20 }}>{e.ico}</span>
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--silver2)' }}>{e.title}</div>
                      <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 2 }}>{e.desc}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: 10, padding: '2px 10px', borderRadius: 20, background: 'rgba(0,230,118,0.07)', border: '1px solid rgba(0,230,118,0.18)', color: 'var(--forest)', fontWeight: 700 }}>
                        {e.tag}
                      </span>
                      <span style={{ fontSize: 11, color: 'var(--text2)', whiteSpace: 'nowrap' }}>
                        {e.date.toLocaleDateString('pt-AO', { day: '2-digit', month: 'short' })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
