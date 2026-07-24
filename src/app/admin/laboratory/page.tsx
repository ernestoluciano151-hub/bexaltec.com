export default function AdminLaboratoryPage() {
  const jobs = [
    { ref: 'LAB-2025-0042', device: 'iPhone 15 Pro Max', client: 'Ana Costa', issue: 'Ecrã partido + Touch ID', status: 'Em Diagnóstico', tech: 'João M.', entry: '20 Jan', eta: '23 Jan' },
    { ref: 'LAB-2025-0041', device: 'MacBook Pro M2 14"', client: 'Tech Solutions Lda', issue: 'Não liga — placa mãe', status: 'Aguarda Peça', tech: 'Carlos F.', entry: '19 Jan', eta: '27 Jan' },
    { ref: 'LAB-2025-0040', device: 'PS5 DualSense', client: 'Pedro Alves', issue: 'Stick drift direito', status: 'Em Reparação', tech: 'Maria S.', entry: '18 Jan', eta: '22 Jan' },
    { ref: 'LAB-2025-0039', device: 'Samsung Galaxy S23', client: 'Marcos Dias', issue: 'Microfone avariado', status: 'Pronto para Levantamento', tech: 'João M.', entry: '15 Jan', eta: '—' },
    { ref: 'LAB-2025-0038', device: 'Dell XPS 15 9530', client: 'Banco Nacional Lda', issue: 'GPU artefatos visuais', status: 'Devolvido', tech: 'Carlos F.', entry: '10 Jan', eta: '—' },
  ]
  const statusColor: Record<string, string> = {
    'Em Diagnóstico': '#FFB74D', 'Aguarda Peça': '#CE93D8', 'Em Reparação': '#42A5F5',
    'Pronto para Levantamento': '#00E676', 'Devolvido': '#546E7A',
  }
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 className="font-rajdhani font-black" style={{ fontSize: 28, letterSpacing: 1, color: 'var(--text)', marginBottom: '0.25rem' }}>Laboratório</h1>
          <p style={{ fontSize: 13, color: 'var(--text2)' }}>Gestão de reparações ao nível de componentes.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          {[{ l: 'Em Progresso', n: 3, c: '#42A5F5' }, { l: 'Prontos', n: 1, c: '#00E676' }, { l: 'Aguardam Peça', n: 1, c: '#CE93D8' }].map((s, i) => (
            <div key={i} style={{ padding: '0.75rem 1.25rem', background: `${s.c}10`, border: `1px solid ${s.c}25`, borderRadius: 10, textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: s.c, fontFamily: 'var(--font-mono)' }}>{s.n}</div>
              <div style={{ fontSize: 10, color: 'var(--slate)' }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="card-base" style={{ overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 800 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['Ref.', 'Dispositivo', 'Cliente', 'Problema', 'Técnico', 'Entrada', 'ETA', 'Estado'].map(h => (
                <th key={h} style={{ padding: '0.85rem 1rem', textAlign: 'left', fontSize: 10, letterSpacing: 1, color: 'var(--slate)', textTransform: 'uppercase', fontWeight: 700 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {jobs.map((j, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '0.85rem 1rem', fontSize: 11, color: 'var(--green)', fontFamily: 'var(--font-mono)' }}>{j.ref}</td>
                <td style={{ padding: '0.85rem 1rem', fontSize: 12, fontWeight: 600, color: 'var(--silver2)' }}>{j.device}</td>
                <td style={{ padding: '0.85rem 1rem', fontSize: 12, color: 'var(--text2)' }}>{j.client}</td>
                <td style={{ padding: '0.85rem 1rem', fontSize: 11, color: 'var(--text2)', maxWidth: 160 }}>{j.issue}</td>
                <td style={{ padding: '0.85rem 1rem', fontSize: 12, color: 'var(--slate)' }}>{j.tech}</td>
                <td style={{ padding: '0.85rem 1rem', fontSize: 11, color: 'var(--slate)' }}>{j.entry}</td>
                <td style={{ padding: '0.85rem 1rem', fontSize: 11, color: 'var(--forest)' }}>{j.eta}</td>
                <td style={{ padding: '0.85rem 1rem' }}>
                  <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: `${statusColor[j.status]}14`, color: statusColor[j.status], fontWeight: 700, whiteSpace: 'nowrap' }}>{j.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
