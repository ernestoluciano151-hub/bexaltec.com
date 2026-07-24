export default function ContractsPage() {
  const contracts = [
    { ref: 'CTR-2024-001', type: 'Manutenção TI Business', start: 'Jan 2024', end: 'Dez 2024', status: 'Ativo', value: '150.000 AOA/mês' },
    { ref: 'CTR-2024-002', type: 'Hospedagem VPS Premium', start: 'Mar 2024', end: 'Mar 2025', status: 'Ativo', value: '25.000 AOA/mês' },
    { ref: 'CTR-2023-011', type: 'Outsourcing TI Parcial', start: 'Jun 2023', end: 'Jun 2024', status: 'Expirado', value: '200.000 AOA/mês' },
  ]
  const statusColor: Record<string, string> = { Ativo: '#00E676', Expirado: '#EF5350', 'Em Renovação': '#FFB74D' }
  return (
    <div>
      <h1 className="font-rajdhani font-black" style={{ fontSize: 28, letterSpacing: 1, color: 'var(--text)', marginBottom: '0.5rem' }}>Contratos</h1>
      <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: '2rem' }}>Contratos de serviço ativos e histórico de acordos com a Bexaltec.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {contracts.map((c, i) => (
          <div key={i} className="card-base" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ fontSize: 22 }}>📄</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: 'var(--green)', fontFamily: 'var(--font-mono)', marginBottom: '0.2rem' }}>{c.ref}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--silver2)' }}>{c.type}</div>
              <div style={{ fontSize: 11, color: 'var(--slate)', marginTop: 2 }}>{c.start} → {c.end}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--silver2)', marginBottom: '0.35rem' }}>{c.value}</div>
              <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: `${statusColor[c.status]}14`, color: statusColor[c.status], fontWeight: 700 }}>{c.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
