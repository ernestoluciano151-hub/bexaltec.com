'use client'
import { adminKPIs, mockTickets, mockClients } from '@/lib/mock-data'

const kpiCards = [
  { label: 'Total Clientes', value: adminKPIs.totalClients, ico: '👥', color: '#00E676', sub: `+${adminKPIs.newThisMonth} este mês` },
  { label: 'Serviços Ativos', value: adminKPIs.activeServices, ico: '⚙️', color: '#42A5F5', sub: 'Contratos ativos' },
  { label: 'Tickets Abertos', value: adminKPIs.openTickets, ico: '🎫', color: '#FFC107', sub: 'Requer atenção' },
  { label: 'Receita Mensal', value: `${(adminKPIs.mrr / 1000000).toFixed(2)}M`, ico: '💰', color: '#00E676', sub: `+${adminKPIs.mrrGrowth}% vs mês anterior` },
  { label: 'Novos Clientes', value: adminKPIs.newThisMonth, ico: '🌱', color: '#B0BEC5', sub: 'Julho 2026' },
  { label: 'Tempo Médio Resp.', value: `${adminKPIs.avgResponseHours}h`, ico: '⚡', color: '#00C853', sub: 'SLA: 4h garantidas' },
]

const recentActivity = [
  { time: '22 Jul 14:30', text: 'Ticket BX-TKT-0041 atualizado por Pedro Alves', type: 'ticket', ico: '🔧' },
  { time: '22 Jul 11:00', text: 'Novo cliente registado: Benguela Distribuidora Lda.', type: 'client', ico: '👤' },
  { time: '21 Jul 16:45', text: 'Fatura FT 2026/0090 enviada a Sonaref Industrial', type: 'billing', ico: '🧾' },
  { time: '21 Jul 09:00', text: 'Ticket BX-TKT-0040 aberto: Configuração VPN', type: 'ticket', ico: '🎫' },
  { time: '20 Jul 08:15', text: 'Contrato renovado: Grupo Aguilar — Hospedagem VPS', type: 'service', ico: '✅' },
  { time: '19 Jul 14:00', text: 'Novo ticket urgente: Switch Sonaref offline', type: 'ticket', ico: '⚠️' },
]

const typeColor: Record<string, string> = {
  ticket: '#FFC107', client: '#00E676', billing: '#42A5F5', service: '#B0BEC5',
}

export default function AdminDashboard() {
  const openTickets = mockTickets.filter(t => ['open','in_progress'].includes(t.status))
  const recentClients = mockClients.slice(0, 5)

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ fontSize: 11, color: 'var(--forest)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: '0.25rem' }}>Área Administrativa</div>
        <h1 className="font-rajdhani font-black" style={{ fontSize: 28, color: 'var(--text)', letterSpacing: 1 }}>Dashboard CRM</h1>
        <p style={{ fontSize: 13, color: 'var(--slate)', marginTop: 4 }}>Julho 2026 · {new Date().toLocaleDateString('pt-AO', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
      </div>

      {/* KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {kpiCards.map((c, i) => (
          <div key={i} className="card-base" style={{ padding: '1.1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: 10, color: 'var(--slate)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: '0.4rem' }}>{c.label}</div>
                <div className="font-rajdhani font-black" style={{ fontSize: 32, color: c.color, lineHeight: 1, letterSpacing: 1 }}>{c.value}</div>
                <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: '0.3rem' }}>{c.sub}</div>
              </div>
              <div style={{ fontSize: 20, opacity: 0.5 }}>{c.ico}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Open tickets */}
        <div className="card-base" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div className="font-rajdhani font-semibold" style={{ fontSize: 16, color: 'var(--text)' }}>🎫 Tickets Abertos</div>
            <a href="/admin/tickets" style={{ fontSize: 11, color: 'var(--green)', textDecoration: 'none' }}>Ver todos →</a>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {openTickets.map(t => (
              <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '0.7rem 0.9rem', background: 'rgba(13,31,58,0.5)', borderRadius: 8, border: '1px solid var(--border)' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--silver2)', marginBottom: 2 }}>{t.subject}</div>
                  <div style={{ fontSize: 10, color: 'var(--slate)' }}>{t.company} · {t.ref}</div>
                </div>
                <span className={`badge ${t.priority === 'high' ? 'badge-yellow' : t.priority === 'critical' ? 'badge-red' : 'badge-blue'} ml-2`}>
                  {t.priority === 'high' ? 'Alta' : t.priority === 'critical' ? 'Crítica' : 'Média'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent clients */}
        <div className="card-base" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div className="font-rajdhani font-semibold" style={{ fontSize: 16, color: 'var(--text)' }}>👥 Clientes Ativos</div>
            <a href="/admin/clients" style={{ fontSize: 11, color: 'var(--green)', textDecoration: 'none' }}>Ver todos →</a>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {recentClients.map(client => (
              <div key={client.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.9rem', background: 'rgba(13,31,58,0.5)', borderRadius: 8, border: '1px solid var(--border)' }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: client.status === 'active' ? 'rgba(0,230,118,0.15)' : 'rgba(176,190,197,0.1)', border: `1px solid ${client.status === 'active' ? 'rgba(0,230,118,0.3)' : 'rgba(176,190,197,0.2)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: client.status === 'active' ? 'var(--green)' : 'var(--slate)', flexShrink: 0 }}>
                  {client.company.charAt(0)}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--silver2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{client.company}</div>
                  <div style={{ fontSize: 10, color: 'var(--slate)' }}>{client.services} serviços · {client.openTickets} tickets abertos</div>
                </div>
                <span className={`badge ${client.status === 'active' ? 'badge-green' : 'badge-gray'}`}>
                  {client.status === 'active' ? 'Ativo' : 'Inativo'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div className="card-base" style={{ padding: '1.25rem' }}>
        <div className="font-rajdhani font-semibold" style={{ fontSize: 16, color: 'var(--text)', marginBottom: '1.25rem' }}>📋 Atividade Recente</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {recentActivity.map((a, i) => (
            <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', padding: '0.85rem 0', borderBottom: i < recentActivity.length - 1 ? '1px solid rgba(176,190,197,0.05)' : 'none' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: `${typeColor[a.type]}15`, border: `1px solid ${typeColor[a.type]}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>
                {a.ico}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: 'var(--silver2)', marginBottom: 2 }}>{a.text}</div>
                <div style={{ fontSize: 10, color: 'var(--slate)' }}>{a.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
