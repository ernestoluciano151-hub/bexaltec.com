export default function EquipmentPage() {
  const items = [
    { name: 'MacBook Pro 16" M3', sn: 'C02XK0FAJGH5', status: 'Em Uso', warranty: 'Dez 2026' },
    { name: 'iPhone 15 Pro Max', sn: 'DNPXQ3FMHG72', status: 'Em Reparação', warranty: 'Set 2025' },
    { name: 'Switch Cisco SG350-28', sn: 'FOC2248Y1AB', status: 'Em Uso', warranty: 'Mar 2027' },
    { name: 'UPS APC Smart 1500VA', sn: 'AS1706451234', status: 'Em Uso', warranty: 'Jun 2026' },
  ]
  const statusColor: Record<string, string> = { 'Em Uso': '#00E676', 'Em Reparação': '#FFB74D', 'Avariado': '#EF5350' }
  return (
    <div>
      <h1 className="font-rajdhani font-black" style={{ fontSize: 28, letterSpacing: 1, color: 'var(--text)', marginBottom: '0.5rem' }}>Equipamentos</h1>
      <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: '2rem' }}>Inventário de equipamentos registados na sua conta.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        {items.map((item, i) => (
          <div key={i} className="card-base" style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <div style={{ fontSize: 20 }}>💻</div>
              <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: `${statusColor[item.status]}14`, color: statusColor[item.status], fontWeight: 700 }}>{item.status}</span>
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--silver2)', marginBottom: '0.35rem' }}>{item.name}</div>
            <div style={{ fontSize: 11, color: 'var(--slate)', fontFamily: 'var(--font-mono)', marginBottom: '0.5rem' }}>S/N: {item.sn}</div>
            <div style={{ fontSize: 11, color: 'var(--forest)' }}>Garantia até {item.warranty}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
