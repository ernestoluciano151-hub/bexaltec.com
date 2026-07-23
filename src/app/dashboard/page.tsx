'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getUser } from '@/lib/auth'
import type { AuthUser } from '@/lib/auth'
import { mockTickets, mockServices, mockInvoices } from '@/lib/mock-data'

export default function DashboardOverview() {
  const [user, setUser] = useState<AuthUser | null>(null)

  useEffect(() => { setUser(getUser()) }, [])

  const myTickets = mockTickets.filter(t => t.clientId === 'c1')
  const myServices = mockServices.filter(s => s.clientId === 'c1')
  const myInvoices = mockInvoices.filter(i => i.clientId === 'c1')
  const openTickets = myTickets.filter(t => t.status === 'open' || t.status === 'in_progress')
  const pendingInvoices = myInvoices.filter(i => i.status === 'pending')
  const totalPending = pendingInvoices.reduce((a, i) => a + i.amount, 0)

  const statCards = [
    { ico: '⚙️', label: 'Serviços Ativos', value: myServices.filter(s => s.status === 'active').length, color: '#00E676', sub: 'Contratos ativos' },
    { ico: '🎫', label: 'Tickets Abertos', value: openTickets.length, color: '#FFC107', sub: openTickets.length > 0 ? 'Requer atenção' : 'Tudo resolvido ✓' },
    { ico: '🧾', label: 'Faturas Pendentes', value: pendingInvoices.length, color: '#42A5F5', sub: `${totalPending.toLocaleString('pt-AO')} Kz` },
    { ico: '📅', label: 'Próximo Vencimento', value: '31 Jul', color: '#B0BEC5', sub: '2026 · Vigilância CCTV' },
  ]

  const recentActivity = [
    { time: '22 Jul 14:30', ico: '🔧', text: 'Ticket BX-TKT-0041 atualizado — em progresso', color: '#FFC107' },
    { time: '20 Jul 09:15', ico: '🎫', text: 'Novo ticket aberto: Switch com falhas intermitentes', color: '#00E676' },
    { time: '12 Jul 00:00', ico: '✅', text: 'Fatura FT 2026/0089 paga — Suporte Infraestrutura', color: '#00E676' },
    { time: '01 Jul 00:00', ico: '🧾', text: 'Fatura FT 2026/0090 emitida — Vigilância CCTV', color: '#42A5F5' },
    { time: '21 Jun 10:00', ico: '✔️', text: 'Ticket BX-TKT-0038 resolvido — Câmera IP', color: '#90A4AE' },
  ]

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ fontSize: 11, color: 'var(--slate)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: '0.25rem' }}>Portal do Cliente</div>
        <h1 className="font-rajdhani font-black" style={{ fontSize: 28, color: 'var(--text)', letterSpacing: 1 }}>
          Bem-vindo, {user?.name?.split(' ')[0] ?? 'Cliente'} 👋
        </h1>
        <p style={{ fontSize: 13, color: 'var(--slate)', marginTop: 4 }}>{user?.company} · Luanda, Angola</p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {statCards.map((c, i) => (
          <div key={i} className="card-base" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--slate)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: '0.5rem' }}>{c.label}</div>
                <div className="font-rajdhani font-black" style={{ fontSize: 34, color: c.color, lineHeight: 1 }}>{c.value}</div>
                <div style={{ fontSize: 11, color: 'var(--slate)', marginTop: '0.25rem' }}>{c.sub}</div>
              </div>
              <div style={{ fontSize: 22, opacity: 0.6 }}>{c.ico}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1.5rem' }}>
        {/* Recent tickets */}
        <div className="card-base" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div className="font-rajdhani font-semibold" style={{ fontSize: 16, color: 'var(--text)' }}>Os Meus Tickets</div>
            <Link href="/dashboard/tickets" className="btn-primary text-xs py-1.5 px-3" style={{ fontSize: 11 }}>Ver todos</Link>
          </div>
          {myTickets.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--slate)', fontSize: 13 }}>Sem tickets abertos</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {myTickets.slice(0, 4).map(ticket => (
                <div key={ticket.id} className="card-base" style={{ padding: '0.85rem 1rem', background: 'rgba(13,31,58,0.5)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--silver2)', marginBottom: 2 }}>{ticket.subject}</div>
                      <div style={{ fontSize: 10, color: 'var(--slate)' }}>{ticket.ref} · {ticket.category}</div>
                    </div>
                    <span className={`badge ${ticket.status === 'open' ? 'badge-yellow' : ticket.status === 'in_progress' ? 'badge-blue' : ticket.status === 'resolved' ? 'badge-green' : 'badge-gray'}`}>
                      {ticket.status === 'open' ? 'Aberto' : ticket.status === 'in_progress' ? 'Em Progresso' : ticket.status === 'resolved' ? 'Resolvido' : 'Fechado'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
          <button className="btn-primary w-full justify-center mt-4" style={{ fontSize: 12 }}
            onClick={() => window.location.href = '/dashboard/tickets'}>
            + Abrir Novo Ticket
          </button>
        </div>

        {/* Recent activity + quick actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Quick actions */}
          <div className="card-base" style={{ padding: '1.25rem' }}>
            <div className="font-rajdhani font-semibold" style={{ fontSize: 16, color: 'var(--text)', marginBottom: '1rem' }}>Ações Rápidas</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                { href: '/dashboard/tickets', ico: '🎫', label: 'Abrir Ticket de Suporte' },
                { href: '/dashboard/services', ico: '⚙️', label: 'Ver Serviços Contratados' },
                { href: '/dashboard/billing', ico: '🧾', label: 'Descarregar Faturas' },
                { href: '/#orcamento', ico: '📋', label: 'Solicitar Novo Serviço' },
              ].map(a => (
                <Link key={a.href} href={a.href}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.65rem 0.85rem', borderRadius: 8, fontSize: 12, color: 'var(--text2)', textDecoration: 'none', border: '1px solid var(--border)', transition: 'all 0.2s' }}
                  className="hover:border-green2 hover:text-silver2">
                  <span style={{ fontSize: 16 }}>{a.ico}</span>
                  {a.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Recent activity */}
          <div className="card-base" style={{ padding: '1.25rem' }}>
            <div className="font-rajdhani font-semibold" style={{ fontSize: 16, color: 'var(--text)', marginBottom: '1rem' }}>Atividade Recente</div>
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
          </div>
        </div>
      </div>
    </div>
  )
}
