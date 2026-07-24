export default function FinancialPage() {
  const months = ['Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez', 'Jan']
  const revenue = [620, 580, 710, 840, 760, 920, 850]
  const maxRev = Math.max(...revenue)

  const invoices = [
    { ref: 'FAT-2025-0021', client: 'Palácio da Justiça', value: '350.000 AOA', date: '22 Jan 2025', status: 'Pago' },
    { ref: 'FAT-2025-0020', client: 'Banco Nacional Lda', value: '150.000 AOA', date: '01 Jan 2025', status: 'Pendente' },
    { ref: 'FAT-2025-0019', client: 'Tech Solutions Lda', value: '85.000 AOA', date: '15 Jan 2025', status: 'Pago' },
    { ref: 'FAT-2024-0089', client: 'Hotel Presidente', value: '320.000 AOA', date: '20 Dez 2024', status: 'Em Atraso' },
  ]
  const statusColor: Record<string, string> = { Pago: '#00E676', Pendente: '#FFB74D', 'Em Atraso': '#EF5350' }

  return (
    <div>
      <h1 className="font-rajdhani font-black" style={{ fontSize: 28, letterSpacing: 1, color: 'var(--text)', marginBottom: '0.5rem' }}>Financeiro</h1>
      <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: '2rem' }}>Receita, faturas e indicadores financeiros do período.</p>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { l: 'Receita Jan 2025', v: '850.000 AOA', trend: '+12%', c: '#00E676' },
          { l: 'Faturas Pendentes', v: '150.000 AOA', trend: '1 fatura', c: '#FFB74D' },
          { l: 'Em Atraso', v: '320.000 AOA', trend: '1 fatura', c: '#EF5350' },
          { l: 'Contratos Ativos', v: '450.000 AOA/m', trend: '3 clientes', c: '#42A5F5' },
        ].map((kpi, i) => (
          <div key={i} className="card-base" style={{ padding: '1.25rem', borderTop: `2px solid ${kpi.c}` }}>
            <div style={{ fontSize: 11, color: 'var(--slate)', marginBottom: '0.5rem' }}>{kpi.l}</div>
            <div className="font-rajdhani font-black" style={{ fontSize: 20, color: kpi.c, lineHeight: 1, marginBottom: '0.35rem' }}>{kpi.v}</div>
            <div style={{ fontSize: 10, color: 'var(--muted)' }}>{kpi.trend}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="card-base" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--silver2)', marginBottom: '1.25rem' }}>Receita Mensal (×1.000 AOA)</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.75rem', height: 120 }}>
          {months.map((m, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' }}>
              <div style={{ fontSize: 9, color: 'var(--forest)' }}>{revenue[i]}</div>
              <div style={{
                width: '100%',
                height: `${(revenue[i] / maxRev) * 100}px`,
                background: i === months.length - 1 ? 'var(--green)' : 'rgba(0,230,118,0.25)',
                borderRadius: '4px 4px 0 0',
                transition: 'height 0.5s',
              }} />
              <div style={{ fontSize: 10, color: 'var(--slate)' }}>{m}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Invoices */}
      <div className="card-base" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', fontSize: 12, fontWeight: 600, color: 'var(--silver2)' }}>Faturas Recentes</div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            {invoices.map((inv, i) => (
              <tr key={i} style={{ borderBottom: i < invoices.length - 1 ? '1px solid var(--border)' : undefined }}>
                <td style={{ padding: '0.85rem 1.25rem', fontSize: 11, color: 'var(--green)', fontFamily: 'var(--font-mono)' }}>{inv.ref}</td>
                <td style={{ padding: '0.85rem 1.25rem', fontSize: 12, color: 'var(--silver2)' }}>{inv.client}</td>
                <td style={{ padding: '0.85rem 1.25rem', fontSize: 12, color: 'var(--text2)' }}>{inv.date}</td>
                <td style={{ padding: '0.85rem 1.25rem', fontSize: 13, fontWeight: 700, color: 'var(--silver2)' }}>{inv.value}</td>
                <td style={{ padding: '0.85rem 1.25rem' }}>
                  <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: `${statusColor[inv.status]}14`, color: statusColor[inv.status], fontWeight: 700 }}>{inv.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
