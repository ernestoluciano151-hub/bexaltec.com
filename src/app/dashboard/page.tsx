// ─── Dashboard Home — Server Component ────────────────────────────────────
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getSession } from '@/lib/auth-server'
import { getClientDashboard } from '@/lib/queries/dashboard'
import { getClientTickets } from '@/lib/queries/tickets'
import { StatCard, StatusBadge, PriorityBadge, PageHeader } from '@/components/ui/shared'

export default async function DashboardPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const [dash, tickets] = await Promise.all([
    getClientDashboard(session.id),
    getClientTickets(session.id),
  ])

  const recentTickets = tickets.slice(0, 5)

  const recentActivity = recentTickets.map(t => ({
    color: t.status === 'open' ? '#FFC107' : t.status === 'in_progress' ? '#42A5F5' : t.status === 'resolved' ? '#00E676' : '#90A4AE',
    text: `Ticket ${t.ref} — ${t.title}`,
    time: new Date(t.updatedAt).toLocaleDateString('pt-AO'),
  }))

  return (
    <div>
      <PageHeader
        title={`Bem-vindo, ${session.name.split(' ')[0]}`}
        sub="Portal do Cliente · Luanda, Angola"
      />

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <StatCard ico="🎫" label="Tickets Abertos" value={dash.openTickets} color="var(--green)"
          sub={dash.openTickets > 0 ? 'Requer atenção' : 'Tudo resolvido'} />
        <StatCard ico="🔧" label="Reparações Ativas" value={dash.activeRepairs} color="#42A5F5"
          sub="Em progresso" />
        <StatCard ico="🧾" label="Faturas Pendentes" value={dash.pendingInvoices} color="#FFC107"
          sub="Aguardam pagamento" />
        <StatCard ico="📅" label="Próximo Serviço" value="—" color="var(--slate)"
          sub="Sem data agendada" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1.5rem' }}>
        {/* Recent tickets */}
        <div className="card-base" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div className="font-rajdhani font-semibold" style={{ fontSize: 16, color: 'var(--text)' }}>Os Meus Tickets</div>
            <Link href="/dashboard/tickets" className="btn-primary" style={{ fontSize: 11, padding: '6px 12px' }}>Ver todos</Link>
          </div>
          {recentTickets.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--slate)', fontSize: 13 }}>Sem tickets abertos</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {recentTickets.map(ticket => (
                <div key={ticket.id} className="card-base" style={{ padding: '0.85rem 1rem', background: 'rgba(13,31,58,0.5)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--silver2)', marginBottom: 2 }}>{ticket.title}</div>
                      <div style={{ fontSize: 10, color: 'var(--slate)' }}>
                        <span className="font-mono">{ticket.ref}</span>
                        {ticket.category ? ` · ${ticket.category}` : ''}
                      </div>
                    </div>
                    <StatusBadge status={ticket.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
          <Link href="/dashboard/tickets" className="btn-primary" style={{ display: 'block', textAlign: 'center', marginTop: '1rem', fontSize: 12 }}>
            + Abrir Novo Ticket
          </Link>
        </div>

        {/* Quick actions + recent activity */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="card-base" style={{ padding: '1.25rem' }}>
            <div className="font-rajdhani font-semibold" style={{ fontSize: 16, color: 'var(--text)', marginBottom: '1rem' }}>Ações Rápidas</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                { href: '/dashboard/tickets', ico: '🎫', label: 'Abrir Ticket de Suporte' },
                { href: '/dashboard/services', ico: '⚙️', label: 'Ver Serviços Contratados' },
                { href: '/dashboard/billing', ico: '🧾', label: 'Descarregar Faturas' },
                { href: '/dashboard/repair-status', ico: '🔧', label: 'Estado das Reparações' },
              ].map(a => (
                <Link key={a.href} href={a.href}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.65rem 0.85rem', borderRadius: 8, fontSize: 12, color: 'var(--text2)', textDecoration: 'none', border: '1px solid var(--border)', transition: 'all 0.2s' }}>
                  <span style={{ fontSize: 16 }}>{a.ico}</span>
                  {a.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="card-base" style={{ padding: '1.25rem' }}>
            <div className="font-rajdhani font-semibold" style={{ fontSize: 16, color: 'var(--text)', marginBottom: '1rem' }}>Atividade Recente</div>
            {recentActivity.length === 0 ? (
              <div style={{ fontSize: 13, color: 'var(--slate)', textAlign: 'center', padding: '1rem 0' }}>Sem atividade recente</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {recentActivity.map((a, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.65rem', alignItems: 'flex-start' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: a.color, flexShrink: 0, marginTop: 4 }} />
                    <div>
                      <div style={{ fontSize: 11, color: 'var(--text2)', lineHeight: 1.4 }}>{a.text}</div>
                      <div style={{ fontSize: 10, color: 'var(--slate)', marginTop: 2 }}>{a.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
