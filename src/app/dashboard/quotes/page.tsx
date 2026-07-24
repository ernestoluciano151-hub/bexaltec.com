export default function QuotesPage() {
  const quotes = [
    { ref: 'BX-ORC-2025-1042', date: '18 Jan 2025', service: 'Infraestrutura TI', status: 'Aprovado', value: '850.000 AOA' },
    { ref: 'BX-ORC-2025-0978', date: '05 Jan 2025', service: 'Laboratório — MacBook Pro', status: 'Pendente', value: '45.000 AOA' },
    { ref: 'BX-ORC-2024-3301', date: '20 Dez 2024', service: 'CCTV & Segurança', status: 'Expirado', value: '320.000 AOA' },
  ]
  const statusColor: Record<string, string> = { Aprovado: '#00E676', Pendente: '#FFB74D', Expirado: '#EF5350' }
  return (
    <div>
      <h1 className="font-rajdhani font-black" style={{ fontSize: 28, letterSpacing: 1, color: 'var(--text)', marginBottom: '0.5rem' }}>Orçamentos</h1>
      <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: '2rem' }}>Histórico de orçamentos solicitados e estado atual.</p>
      <div className="card-base" style={{ overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Referência', 'Data', 'Serviço', 'Estado', 'Valor'].map(h => (
                <th key={h} style={{ padding: '0.85rem 1.1rem', textAlign: 'left', fontSize: 11, letterSpacing: 1, color: 'var(--slate)', textTransform: 'uppercase', fontWeight: 700 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {quotes.map((q, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '0.85rem 1.1rem', fontSize: 12, color: 'var(--green)', fontFamily: 'var(--font-mono)' }}>{q.ref}</td>
                <td style={{ padding: '0.85rem 1.1rem', fontSize: 12, color: 'var(--text2)' }}>{q.date}</td>
                <td style={{ padding: '0.85rem 1.1rem', fontSize: 12, color: 'var(--silver2)' }}>{q.service}</td>
                <td style={{ padding: '0.85rem 1.1rem' }}>
                  <span style={{ fontSize: 10, padding: '2px 10px', borderRadius: 20, background: `${statusColor[q.status]}14`, color: statusColor[q.status], fontWeight: 700 }}>{q.status}</span>
                </td>
                <td style={{ padding: '0.85rem 1.1rem', fontSize: 13, color: 'var(--silver2)', fontWeight: 600 }}>{q.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
