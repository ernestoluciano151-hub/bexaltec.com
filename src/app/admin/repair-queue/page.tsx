export default function RepairQueuePage() {
  const queue = [
    { priority: 1, ref: 'LAB-2025-0042', device: 'iPhone 15 Pro Max', client: 'Ana Costa', sla: '3 dias', elapsed: '1 dia', urgent: true },
    { priority: 2, ref: 'LAB-2025-0041', device: 'MacBook Pro M2', client: 'Tech Solutions Lda', sla: '7 dias', elapsed: '2 dias', urgent: false },
    { priority: 3, ref: 'LAB-2025-0040', device: 'PS5 DualSense', client: 'Pedro Alves', sla: '5 dias', elapsed: '3 dias', urgent: false },
    { priority: 4, ref: 'LAB-2025-0043', device: 'iPad Pro 12.9"', client: 'Escola Nacional', sla: '7 dias', elapsed: '0 dias', urgent: false },
  ]
  return (
    <div>
      <h1 className="font-rajdhani font-black" style={{ fontSize: 28, letterSpacing: 1, color: 'var(--text)', marginBottom: '0.5rem' }}>Fila de Reparação</h1>
      <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: '2rem' }}>Ordenação por prioridade e SLA. Arraste para reordenar.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {queue.map((q, i) => (
          <div key={i} className="card-base" style={{ padding: '1.1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: q.urgent ? '3px solid #EF5350' : '3px solid var(--border)', cursor: 'grab' }}>
            <div style={{ fontSize: 18, color: 'var(--muted)', userSelect: 'none' }}>⠿</div>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: q.urgent ? 'rgba(239,83,80,0.15)' : 'rgba(0,230,118,0.08)', border: q.urgent ? '1px solid rgba(239,83,80,0.3)' : '1px solid rgba(0,230,118,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 900, color: q.urgent ? '#EF5350' : 'var(--green)' }}>
              {q.priority}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: 'var(--green)', fontFamily: 'var(--font-mono)', marginBottom: '0.15rem' }}>{q.ref}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--silver2)' }}>{q.device}</div>
              <div style={{ fontSize: 11, color: 'var(--slate)' }}>{q.client}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 11, color: 'var(--text2)' }}>SLA: {q.sla}</div>
              <div style={{ fontSize: 11, color: 'var(--forest)', marginTop: 2 }}>Decorrido: {q.elapsed}</div>
            </div>
            {q.urgent && <span style={{ fontSize: 9, padding: '2px 8px', background: 'rgba(239,83,80,0.15)', color: '#EF5350', borderRadius: 10, fontWeight: 700 }}>URGENTE</span>}
          </div>
        ))}
      </div>
    </div>
  )
}
