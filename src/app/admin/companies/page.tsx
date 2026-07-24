export default function CompaniesPage() {
  const companies = [
    { name: 'Palácio da Justiça', sector: 'Gov. Pública', contacts: 2, contracts: 3, revenue: '850.000 AOA', status: 'Ativo' },
    { name: 'Tribunal Constitucional', sector: 'Gov. Pública', contacts: 1, contracts: 2, revenue: '620.000 AOA', status: 'Ativo' },
    { name: 'Banco Nacional Lda', sector: 'Banca', contacts: 3, contracts: 1, revenue: '150.000 AOA/m', status: 'Ativo' },
    { name: 'Tech Solutions Lda', sector: 'TI', contacts: 2, contracts: 2, revenue: '200.000 AOA', status: 'Ativo' },
    { name: 'Hotel Presidente', sector: 'Hotelaria', contacts: 1, contracts: 1, revenue: '320.000 AOA', status: 'Orçamento' },
  ]
  const statusColor: Record<string, string> = { Ativo: '#00E676', Orçamento: '#FFB74D', Inativo: '#EF5350' }
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 className="font-rajdhani font-black" style={{ fontSize: 28, letterSpacing: 1, color: 'var(--text)', marginBottom: '0.25rem' }}>Empresas</h1>
          <p style={{ fontSize: 13, color: 'var(--text2)' }}>Clientes empresariais, contratos e receita total.</p>
        </div>
        <button className="btn-primary" style={{ fontSize: 12, padding: '8px 18px' }}>+ Nova Empresa</button>
      </div>
      <div className="card-base" style={{ overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Empresa', 'Setor', 'Contactos', 'Contratos', 'Receita', 'Estado'].map(h => (
                <th key={h} style={{ padding: '0.85rem 1.1rem', textAlign: 'left', fontSize: 10, letterSpacing: 1, color: 'var(--slate)', textTransform: 'uppercase', fontWeight: 700 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {companies.map((c, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--border)', cursor: 'pointer' }}>
                <td style={{ padding: '0.85rem 1.1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(0,230,118,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: 'var(--green)' }}>{c.name.charAt(0)}</div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--silver2)' }}>{c.name}</span>
                  </div>
                </td>
                <td style={{ padding: '0.85rem 1.1rem', fontSize: 12, color: 'var(--text2)' }}>{c.sector}</td>
                <td style={{ padding: '0.85rem 1.1rem', fontSize: 12, color: 'var(--slate)', textAlign: 'center' }}>{c.contacts}</td>
                <td style={{ padding: '0.85rem 1.1rem', fontSize: 12, color: 'var(--slate)', textAlign: 'center' }}>{c.contracts}</td>
                <td style={{ padding: '0.85rem 1.1rem', fontSize: 13, fontWeight: 600, color: 'var(--silver2)' }}>{c.revenue}</td>
                <td style={{ padding: '0.85rem 1.1rem' }}>
                  <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: `${statusColor[c.status]}14`, color: statusColor[c.status], fontWeight: 700 }}>{c.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
