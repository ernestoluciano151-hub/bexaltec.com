import Link from 'next/link'

export default function ReportsPage() {
  const reports = [
    { ico: '📊', name: 'Relatório Mensal — Jan 2025', desc: 'KPIs, receita, tickets, reparações e SLA compliance', date: '01 Fev 2025', status: 'Gerado' },
    { ico: '🔬', name: 'Relatório de Laboratório — Jan 2025', desc: 'Volume de reparações, tempo médio, receita e satisfação', date: '01 Fev 2025', status: 'Pendente' },
    { ico: '🛡️', name: 'Relatório SLA — Q4 2024', desc: 'Cumprimento de SLA por cliente, incidentes e uptime', date: '10 Jan 2025', status: 'Gerado' },
    { ico: '💰', name: 'Relatório Financeiro — 2024', desc: 'Receita anual, despesas, margem e previsão 2025', date: '05 Jan 2025', status: 'Gerado' },
    { ico: '👥', name: 'Relatório de Clientes — Q4 2024', desc: 'Novos clientes, churn, NPS e lifetime value', date: '08 Jan 2025', status: 'Gerado' },
  ]
  const statusColor: Record<string, string> = { Gerado: '#00E676', Pendente: '#FFB74D' }

  const kpis = [
    { l: 'Receita Jan', v: '850K AOA', delta: '+12% vs Dez' },
    { l: 'Tickets Abertos', v: '7', delta: '-3 vs semana ant.' },
    { l: 'Reparações', v: '12', delta: '5 em progresso' },
    { l: 'SLA Cumprimento', v: '97.8%', delta: '+1.2% vs mês ant.' },
    { l: 'Clientes Ativos', v: '60', delta: '+2 novos este mês' },
    { l: 'NPS Score', v: '82', delta: 'Excelente' },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 className="font-rajdhani font-black" style={{ fontSize: 28, letterSpacing: 1, color: 'var(--text)', marginBottom: '0.25rem' }}>Relatórios</h1>
          <p style={{ fontSize: 13, color: 'var(--text2)' }}>Relatórios executivos e operacionais do negócio.</p>
        </div>
        <button className="btn-primary" style={{ fontSize: 12, padding: '8px 18px' }}>+ Gerar Relatório</button>
      </div>

      {/* Summary KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.85rem', marginBottom: '2rem' }}>
        {kpis.map((k, i) => (
          <div key={i} className="card-base" style={{ padding: '1rem 1.25rem' }}>
            <div style={{ fontSize: 10, color: 'var(--slate)', marginBottom: '0.35rem' }}>{k.l}</div>
            <div className="font-rajdhani font-black" style={{ fontSize: 24, color: 'var(--green)', lineHeight: 1 }}>{k.v}</div>
            <div style={{ fontSize: 10, color: 'var(--forest)', marginTop: '0.3rem' }}>{k.delta}</div>
          </div>
        ))}
      </div>

      {/* Reports list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {reports.map((r, i) => (
          <div key={i} className="card-base" style={{ padding: '1.1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: 22 }}>{r.ico}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--silver2)', marginBottom: '0.2rem' }}>{r.name}</div>
              <div style={{ fontSize: 11, color: 'var(--text2)' }}>{r.desc}</div>
              <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: '0.2rem' }}>Gerado em {r.date}</div>
            </div>
            <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, background: `${statusColor[r.status]}14`, color: statusColor[r.status], fontWeight: 700 }}>{r.status}</span>
            <button style={{ fontSize: 11, padding: '5px 14px', borderRadius: 6, background: 'rgba(0,230,118,0.08)', border: '1px solid rgba(0,230,118,0.2)', color: 'var(--green)', cursor: 'pointer', fontFamily: 'inherit' }}>
              Baixar PDF
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
