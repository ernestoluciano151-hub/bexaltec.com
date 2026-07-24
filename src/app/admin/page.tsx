'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { StatCard, StatusBadge, PriorityBadge, PageHeader, CardSkeleton } from '@/components/ui/shared'

interface DashKpis {
  openTickets: number
  activeRepairs: number
  totalCompanies: number
  totalClients: number
  monthRevenue: number | string
}

interface Ticket {
  id: number
  ref: string
  title: string
  status: string
  priority: string
  clientName: string | null
  clientEmail: string | null
  createdAt: string
  updatedAt: string
}

interface WorkOrder {
  id: number
  ref: string
  title: string
  status: string
  priority: string
  clientName: string | null
  companyName: string | null
}

export default function AdminDashboardPage() {
  const [kpis, setKpis] = useState<DashKpis | null>(null)
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/dashboard').then(r => r.json()),
      fetch('/api/admin/tickets').then(r => r.json()),
      fetch('/api/admin/work-orders').then(r => r.json()),
    ])
      .then(([dash, t, w]) => {
        setKpis(dash.kpis ?? null)
        setTickets((dash.tickets ?? t.tickets ?? []).slice(0, 5))
        setWorkOrders((dash.workOrders ?? w.workOrders ?? []).slice(0, 5))
      })
      .finally(() => setLoading(false))
  }, [])

  const quickActions = [
    { href: '/admin/tickets', ico: '🎫', label: 'Tickets', sub: 'Fila de suporte' },
    { href: '/admin/laboratory', ico: '🔬', label: 'Laboratório', sub: 'Reparações' },
    { href: '/admin/clients', ico: '👥', label: 'Clientes', sub: 'CRM' },
    { href: '/admin/financial', ico: '💰', label: 'Financeiro', sub: 'Faturas' },
  ]

  return (
    <div>
      <PageHeader
        supra="Área Administrativa"
        title="Dashboard CRM"
        sub={`${new Date().toLocaleDateString('pt-AO', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}`}
      />

      {/* KPI Stats */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '1rem', marginBottom: '2rem' }}>
          {Array.from({ length: 5 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : kpis && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <StatCard ico="🎫" label="Tickets Abertos" value={kpis.openTickets} color="var(--yellow, #FFC107)" sub="Requer atenção" />
          <StatCard ico="🔬" label="Reparações Ativas" value={kpis.activeRepairs} color="#42A5F5" sub="Em laboratório" />
          <StatCard ico="🏢" label="Empresas Ativas" value={kpis.totalCompanies} color="var(--green)" sub="Com contrato" />
          <StatCard ico="👥" label="Clientes" value={kpis.totalClients} color="var(--green)" sub="Utilizadores ativos" />
          <StatCard ico="💰" label="Receita do Mês" value={`${Number(kpis.monthRevenue).toLocaleString('pt-AO')} Kz`} color="var(--green)" sub="Faturas pagas (30d)" />
        </div>
      )}

      {/* Quick actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0.75rem', marginBottom: '2rem' }}>
        {quickActions.map(a => (
          <Link key={a.href} href={a.href} style={{ textDecoration: 'none' }}>
            <div className="card-base" style={{ padding: '1rem', cursor: 'pointer', transition: 'border-color 0.2s' }}>
              <div style={{ fontSize: 22, marginBottom: '0.5rem' }}>{a.ico}</div>
              <div className="font-rajdhani font-bold" style={{ fontSize: 15, color: 'var(--text)' }}>{a.label}</div>
              <div style={{ fontSize: 11, color: 'var(--slate)', marginTop: 2 }}>{a.sub}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Two columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        {/* Recent tickets */}
        <div className="card-base" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div className="font-rajdhani font-semibold" style={{ fontSize: 16, color: 'var(--text)' }}>🎫 Tickets Recentes</div>
            <Link href="/admin/tickets" style={{ fontSize: 11, color: 'var(--green)', textDecoration: 'none' }}>Ver todos →</Link>
          </div>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} style={{ height: 52, borderRadius: 8, background: 'rgba(255,255,255,0.04)' }} />
              ))}
            </div>
          ) : tickets.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--slate)', fontSize: 13 }}>Sem tickets recentes</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {tickets.map(t => (
                <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0.85rem', background: 'rgba(13,31,58,0.5)', borderRadius: 8, border: '1px solid var(--border)' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--silver2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.title}</div>
                    <div style={{ fontSize: 10, color: 'var(--slate)' }}>{t.ref} · {t.clientName ?? '—'}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.35rem', flexShrink: 0, marginLeft: '0.5rem' }}>
                    <StatusBadge status={t.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Work orders summary */}
        <div className="card-base" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div className="font-rajdhani font-semibold" style={{ fontSize: 16, color: 'var(--text)' }}>📋 Ordens de Trabalho</div>
            <Link href="/admin/work-orders" style={{ fontSize: 11, color: 'var(--green)', textDecoration: 'none' }}>Ver todas →</Link>
          </div>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} style={{ height: 52, borderRadius: 8, background: 'rgba(255,255,255,0.04)' }} />
              ))}
            </div>
          ) : workOrders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--slate)', fontSize: 13 }}>Sem ordens de trabalho</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {workOrders.map(w => (
                <div key={w.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0.85rem', background: 'rgba(13,31,58,0.5)', borderRadius: 8, border: '1px solid var(--border)' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--silver2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{w.title}</div>
                    <div style={{ fontSize: 10, color: 'var(--slate)' }}>{w.ref} · {w.companyName ?? w.clientName ?? '—'}</div>
                  </div>
                  <div style={{ flexShrink: 0, marginLeft: '0.5rem' }}>
                    <StatusBadge status={w.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
