export default function DownloadsPage() {
  const docs = [
    { name: 'Relatório Mensal — Dez 2024', type: 'PDF', size: '1.2 MB', date: '05 Jan 2025', ico: '📊' },
    { name: 'Proposta Infraestrutura TI 2025', type: 'PDF', size: '3.8 MB', date: '18 Jan 2025', ico: '📋' },
    { name: 'Contrato Manutenção 2024', type: 'PDF', size: '856 KB', date: '02 Jan 2024', ico: '📄' },
    { name: 'Manual de Utilizador — VPN', type: 'PDF', size: '2.1 MB', date: '15 Mar 2024', ico: '📖' },
    { name: 'Inventário de Equipamentos', type: 'XLSX', size: '124 KB', date: '01 Dez 2024', ico: '📦' },
    { name: 'Certificado de Garantia — Switch Cisco', type: 'PDF', size: '430 KB', date: '10 Nov 2024', ico: '🛡️' },
  ]
  return (
    <div>
      <h1 className="font-rajdhani font-black" style={{ fontSize: 28, letterSpacing: 1, color: 'var(--text)', marginBottom: '0.5rem' }}>Documentos</h1>
      <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: '2rem' }}>Relatórios, propostas, manuais e certificados disponíveis para download.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {docs.map((d, i) => (
          <div key={i} className="card-base" style={{ padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: 24 }}>{d.ico}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--silver2)' }}>{d.name}</div>
              <div style={{ fontSize: 11, color: 'var(--slate)', marginTop: 2 }}>{d.type} · {d.size} · {d.date}</div>
            </div>
            <button style={{ fontSize: 11, padding: '5px 14px', borderRadius: 6, background: 'rgba(0,230,118,0.08)', border: '1px solid rgba(0,230,118,0.2)', color: 'var(--green)', cursor: 'pointer', fontFamily: 'inherit' }}>
              Baixar
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
