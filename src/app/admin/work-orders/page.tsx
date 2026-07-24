export default function WorkOrdersPage() {
  const orders = [
    { ref: 'OT-2025-0089', type: 'Infraestrutura', client: 'Palácio da Justiça', desc: 'Extensão rede Piso 9 — 12 pontos Cat6A', status: 'Em Execução', priority: 'Alta', value: '180.000 AOA' },
    { ref: 'OT-2025-0088', type: 'Manutenção', client: 'Banco Nacional Lda', desc: 'Visita mensal — verificação servidores e UPS', status: 'Agendado', priority: 'Normal', value: '75.000 AOA' },
    { ref: 'OT-2025-0087', type: 'Segurança', client: 'Hotel Presidente', desc: 'Instalação 8 câmeras IP Hikvision no lobby e estacionamento', status: 'Orçamentado', priority: 'Normal', value: '320.000 AOA' },
    { ref: 'OT-2025-0086', type: 'Lab', client: 'Tech Solutions Lda', desc: 'Diagnóstico de 5 portáteis Dell com defeito', status: 'Concluído', priority: 'Baixa', value: '45.000 AOA' },
  ]
  const statusColor: Record<string, string> = { 'Em Execução': '#42A5F5', Agendado: '#FFB74D', Orçamentado: '#CE93D8', Concluído: '#00E676' }
  const priorityColor: Record<string, string> = { Alta: '#EF5350', Normal: '#FFB74D', Baixa: '#00E676' }
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 className="font-rajdhani font-black" style={{ fontSize: 28, letterSpacing: 1, color: 'var(--text)', marginBottom: '0.25rem' }}>Ordens de Trabalho</h1>
          <p style={{ fontSize: 13, color: 'var(--text2)' }}>Projetos e trabalhos ativos com rastreamento completo.</p>
        </div>
        <button className="btn-primary" style={{ fontSize: 12, padding: '8px 18px' }}>+ Nova OT</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {orders.map((o, i) => (
          <div key={i} className="card-base" style={{ padding: '1.25rem 1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                  <span style={{ fontSize: 11, color: 'var(--green)', fontFamily: 'var(--font-mono)' }}>{o.ref}</span>
                  <span style={{ fontSize: 10, padding: '1px 7px', borderRadius: 10, background: `${priorityColor[o.priority]}14`, color: priorityColor[o.priority], fontWeight: 700 }}>P:{o.priority}</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--silver2)', marginBottom: '0.2rem' }}>{o.desc}</div>
                <div style={{ fontSize: 11, color: 'var(--text2)' }}>{o.client} · {o.type}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: `${statusColor[o.status]}14`, color: statusColor[o.status], fontWeight: 700 }}>{o.status}</span>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--silver2)', marginTop: '0.5rem' }}>{o.value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
