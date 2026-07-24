export default function InventoryPage() {
  const items = [
    { name: 'Switch Cisco SG350-28', category: 'Rede', sn: 'FOC2248Y1AB', location: 'Armazém A', status: 'Disponível', value: '185.000 AOA' },
    { name: 'UPS APC Smart 1500VA', category: 'Energia', sn: 'AS1706451234', location: 'Armazém A', status: 'Disponível', value: '65.000 AOA' },
    { name: 'Access Point Ubiquiti U6-Pro', category: 'Wireless', sn: 'U6P-AO-001', location: 'Instalado — Banco Nacional', status: 'Em Uso', value: '45.000 AOA' },
    { name: 'Câmera Hikvision 4K DS-2CD2143G2', category: 'CCTV', sn: 'DS43G2-0012', location: 'Armazém B', status: 'Disponível', value: '38.000 AOA' },
    { name: 'Server Dell PowerEdge R350', category: 'Servidor', sn: 'DXHF3S2', location: 'Instalado — Palácio Justiça', status: 'Em Uso', value: '1.250.000 AOA' },
  ]
  const statusColor: Record<string, string> = { Disponível: '#00E676', 'Em Uso': '#42A5F5', 'Em Manutenção': '#FFB74D', Defeituoso: '#EF5350' }
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 className="font-rajdhani font-black" style={{ fontSize: 28, letterSpacing: 1, color: 'var(--text)', marginBottom: '0.25rem' }}>Inventário</h1>
          <p style={{ fontSize: 13, color: 'var(--text2)' }}>Equipamentos da empresa e ferramentas de trabalho.</p>
        </div>
        <button className="btn-primary" style={{ fontSize: 12, padding: '8px 18px' }}>+ Registar Equipamento</button>
      </div>
      <div className="card-base" style={{ overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Equipamento', 'Categoria', 'N/S', 'Localização', 'Estado', 'Valor'].map(h => (
                <th key={h} style={{ padding: '0.85rem 1rem', textAlign: 'left', fontSize: 10, letterSpacing: 1, color: 'var(--slate)', textTransform: 'uppercase', fontWeight: 700 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '0.85rem 1rem', fontSize: 13, fontWeight: 600, color: 'var(--silver2)' }}>{item.name}</td>
                <td style={{ padding: '0.85rem 1rem', fontSize: 11, color: 'var(--text2)' }}>{item.category}</td>
                <td style={{ padding: '0.85rem 1rem', fontSize: 10, color: 'var(--forest)', fontFamily: 'var(--font-mono)' }}>{item.sn}</td>
                <td style={{ padding: '0.85rem 1rem', fontSize: 11, color: 'var(--text2)' }}>{item.location}</td>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: `${statusColor[item.status]}14`, color: statusColor[item.status], fontWeight: 700 }}>{item.status}</span>
                </td>
                <td style={{ padding: '0.85rem 1rem', fontSize: 12, fontWeight: 600, color: 'var(--silver2)' }}>{item.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
