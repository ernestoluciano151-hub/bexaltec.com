export default function AdminEquipmentPage() {
  const repairs = [
    { ref: 'LAB-2025-0042', device: 'iPhone 15 Pro Max', client: 'Ana Costa', fault: 'Ecrã + Touch ID', category: 'iPhone', value: '45.000 AOA' },
    { ref: 'LAB-2025-0041', device: 'MacBook Pro M2', client: 'Tech Solutions Lda', fault: 'Placa mãe', category: 'MacBook', value: '120.000 AOA' },
    { ref: 'LAB-2025-0040', device: 'PS5 DualSense', client: 'Pedro Alves', fault: 'Stick drift', category: 'Consola', value: '18.000 AOA' },
    { ref: 'LAB-2025-0043', device: 'iPad Pro 12.9"', client: 'Escola Nacional', fault: 'Ecrã partido', category: 'iPad', value: '55.000 AOA' },
    { ref: 'LAB-2025-0039', device: 'Samsung Galaxy S23', client: 'Marcos Dias', fault: 'Microfone', category: 'Android', value: '22.000 AOA' },
  ]
  const catColor: Record<string, string> = { iPhone: '#00E676', MacBook: '#42A5F5', Consola: '#CE93D8', iPad: '#4DD0E1', Android: '#FFB74D' }
  return (
    <div>
      <h1 className="font-rajdhani font-black" style={{ fontSize: 28, letterSpacing: 1, color: 'var(--text)', marginBottom: '0.5rem' }}>Equipamentos em Lab</h1>
      <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: '2rem' }}>Dispositivos de clientes atualmente no laboratório para diagnóstico ou reparação.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        {repairs.map((r, i) => (
          <div key={i} className="card-base" style={{ padding: '1.25rem', borderTop: `2px solid ${catColor[r.category] ?? 'var(--green)'}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, background: `${catColor[r.category]}14`, color: catColor[r.category], fontWeight: 700 }}>{r.category}</span>
              <span style={{ fontSize: 11, color: 'var(--green)', fontFamily: 'var(--font-mono)' }}>{r.ref}</span>
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--silver2)', marginBottom: '0.25rem' }}>{r.device}</div>
            <div style={{ fontSize: 11, color: 'var(--text2)', marginBottom: '0.5rem' }}>Problema: {r.fault}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--slate)' }}>
              <span>👤 {r.client}</span>
              <span style={{ color: 'var(--silver2)', fontWeight: 600 }}>{r.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
