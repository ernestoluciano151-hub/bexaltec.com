export default function RepairStatusPage() {
  const repairs = [
    { ref: 'LAB-2025-0042', device: 'iPhone 15 Pro Max', issue: 'Ecrã partido + Touch ID', tech: 'João M.', status: 'Em Diagnóstico', progress: 25 },
    { ref: 'LAB-2025-0038', device: 'MacBook Pro M2', issue: 'Não liga — placa mãe', tech: 'Carlos F.', status: 'Aguarda Peça', progress: 50 },
    { ref: 'LAB-2025-0031', device: 'PS5 Controller', issue: 'Stick drift', tech: 'Maria S.', status: 'Em Reparação', progress: 75 },
  ]
  const statusColor: Record<string, string> = {
    'Em Diagnóstico': '#FFB74D',
    'Aguarda Peça': '#CE93D8',
    'Em Reparação': '#42A5F5',
    'Pronto': '#00E676',
  }
  return (
    <div>
      <h1 className="font-rajdhani font-black" style={{ fontSize: 28, letterSpacing: 1, color: 'var(--text)', marginBottom: '0.5rem' }}>Estado de Reparações</h1>
      <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: '2rem' }}>Acompanhe em tempo real o estado das suas reparações no laboratório.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {repairs.map((r, i) => (
          <div key={i} className="card-base" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <div style={{ fontSize: 11, color: 'var(--green)', fontFamily: 'var(--font-mono)', marginBottom: '0.25rem' }}>{r.ref}</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--silver2)' }}>{r.device}</div>
                <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: '0.2rem' }}>{r.issue}</div>
              </div>
              <span style={{ fontSize: 11, padding: '4px 12px', borderRadius: 20, background: `${statusColor[r.status]}14`, color: statusColor[r.status], fontWeight: 700 }}>{r.status}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ flex: 1, height: 4, background: 'var(--border)', borderRadius: 4 }}>
                <div style={{ width: `${r.progress}%`, height: '100%', background: statusColor[r.status], borderRadius: 4, transition: 'width 0.5s' }} />
              </div>
              <span style={{ fontSize: 11, color: 'var(--slate)', minWidth: 32 }}>{r.progress}%</span>
              <span style={{ fontSize: 11, color: 'var(--forest)' }}>Técnico: {r.tech}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
