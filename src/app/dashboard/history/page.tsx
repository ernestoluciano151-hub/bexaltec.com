export default function HistoryPage() {
  const events = [
    { date: 'Jan 2025', events: [
      { ico: '🔧', title: 'Reparação iniciada', desc: 'iPhone 15 Pro Max — LAB-2025-0042', tag: 'Laboratório' },
      { ico: '📋', title: 'Orçamento aprovado', desc: 'Infraestrutura TI — BX-ORC-2025-1042', tag: 'Orçamento' },
    ]},
    { date: 'Dez 2024', events: [
      { ico: '✅', title: 'Projeto entregue', desc: 'Cabeamento estruturado Cat6A — Piso 3', tag: 'Infraestrutura' },
      { ico: '🧾', title: 'Fatura emitida', desc: 'FAT-2024-0089 — 850.000 AOA', tag: 'Faturação' },
    ]},
    { date: 'Nov 2024', events: [
      { ico: '📄', title: 'Contrato renovado', desc: 'Manutenção TI Business — 12 meses', tag: 'Contrato' },
      { ico: '⚙️', title: 'Switch instalado', desc: 'Cisco SG350-28 configurado', tag: 'Infraestrutura' },
    ]},
  ]
  const tagColor: Record<string, string> = { Laboratório: '#00E676', Orçamento: '#FFB74D', Infraestrutura: '#42A5F5', Faturação: '#CE93D8', Contrato: '#A5D6A7' }
  return (
    <div>
      <h1 className="font-rajdhani font-black" style={{ fontSize: 28, letterSpacing: 1, color: 'var(--text)', marginBottom: '0.5rem' }}>Histórico</h1>
      <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: '2rem' }}>Linha do tempo de todas as interações com a Bexaltec.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {events.map((month, i) => (
          <div key={i}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: 'var(--slate)', textTransform: 'uppercase', marginBottom: '0.85rem' }}>{month.date}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {month.events.map((e, j) => (
                <div key={j} className="card-base" style={{ padding: '0.9rem 1.1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontSize: 18 }}>{e.ico}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--silver2)' }}>{e.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 2 }}>{e.desc}</div>
                  </div>
                  <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, background: `${tagColor[e.tag] ?? 'var(--green)'}14`, color: tagColor[e.tag] ?? 'var(--green)' }}>{e.tag}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
