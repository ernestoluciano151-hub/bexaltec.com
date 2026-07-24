export default function PartsPage() {
  const parts = [
    { ref: 'PC-ECRÃ-IP15PM', name: 'Ecrã iPhone 15 Pro Max OLED', category: 'iPhone', stock: 2, min: 1, price: '45.000 AOA', status: 'OK' },
    { ref: 'PC-BAT-IP14', name: 'Bateria iPhone 14 Original', category: 'iPhone', stock: 0, min: 2, price: '18.000 AOA', status: 'Sem Stock' },
    { ref: 'PC-KB-MB16M3', name: 'Teclado MacBook Pro 16" M3 PT', category: 'MacBook', stock: 1, min: 1, price: '95.000 AOA', status: 'Baixo' },
    { ref: 'PC-STICK-PS5', name: 'Módulo stick analógico PS5', category: 'Consola', stock: 8, min: 3, price: '4.500 AOA', status: 'OK' },
    { ref: 'PC-SSD-M2-1TB', name: 'SSD NVMe M.2 1TB Samsung 990 Pro', category: 'Storage', stock: 3, min: 2, price: '85.000 AOA', status: 'OK' },
    { ref: 'PC-RAM-DDR5-16', name: 'RAM DDR5 16GB 5600MHz', category: 'Memória', stock: 0, min: 4, price: '42.000 AOA', status: 'Sem Stock' },
  ]
  const statusColor: Record<string, string> = { OK: '#00E676', Baixo: '#FFB74D', 'Sem Stock': '#EF5350' }
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 className="font-rajdhani font-black" style={{ fontSize: 28, letterSpacing: 1, color: 'var(--text)', marginBottom: '0.25rem' }}>Peças & Stock</h1>
          <p style={{ fontSize: 13, color: 'var(--text2)' }}>Gestão de componentes e peças do laboratório.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {[{ l: 'Sem Stock', n: 2, c: '#EF5350' }, { l: 'Stock Baixo', n: 1, c: '#FFB74D' }].map((s, i) => (
            <div key={i} style={{ padding: '0.65rem 1rem', background: `${s.c}10`, border: `1px solid ${s.c}25`, borderRadius: 8, fontSize: 11, color: s.c, fontWeight: 700 }}>
              ⚠️ {s.n} {s.l}
            </div>
          ))}
          <button className="btn-primary" style={{ fontSize: 12, padding: '8px 18px' }}>+ Adicionar Peça</button>
        </div>
      </div>
      <div className="card-base" style={{ overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Ref.', 'Peça', 'Categoria', 'Stock', 'Mín.', 'Preço', 'Estado'].map(h => (
                <th key={h} style={{ padding: '0.85rem 1rem', textAlign: 'left', fontSize: 10, letterSpacing: 1, color: 'var(--slate)', textTransform: 'uppercase', fontWeight: 700 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {parts.map((p, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '0.85rem 1rem', fontSize: 10, color: 'var(--forest)', fontFamily: 'var(--font-mono)' }}>{p.ref}</td>
                <td style={{ padding: '0.85rem 1rem', fontSize: 12, fontWeight: 600, color: 'var(--silver2)' }}>{p.name}</td>
                <td style={{ padding: '0.85rem 1rem', fontSize: 11, color: 'var(--text2)' }}>{p.category}</td>
                <td style={{ padding: '0.85rem 1rem', fontSize: 13, fontWeight: 700, color: statusColor[p.status], textAlign: 'center' }}>{p.stock}</td>
                <td style={{ padding: '0.85rem 1rem', fontSize: 11, color: 'var(--muted)', textAlign: 'center' }}>{p.min}</td>
                <td style={{ padding: '0.85rem 1rem', fontSize: 12, color: 'var(--silver2)' }}>{p.price}</td>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: `${statusColor[p.status]}14`, color: statusColor[p.status], fontWeight: 700 }}>{p.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
