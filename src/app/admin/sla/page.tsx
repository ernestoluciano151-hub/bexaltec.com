export default function SlaPage() {
  const contracts = [
    { client: 'Banco Nacional Lda', plan: 'Business', slaResponse: '4h', visits: 'Semanal', uptime: '99.9%', expiry: 'Dez 2025', compliance: 98 },
    { client: 'Palácio da Justiça', plan: 'Enterprise', slaResponse: '2h', visits: 'Diária', uptime: '99.99%', expiry: 'Mar 2026', compliance: 100 },
    { client: 'Tech Solutions Lda', plan: 'Basic', slaResponse: '24h', visits: 'Mensal', uptime: '99%', expiry: 'Jun 2025', compliance: 95 },
  ]
  const complianceColor = (n: number) => n >= 98 ? '#00E676' : n >= 90 ? '#FFB74D' : '#EF5350'
  return (
    <div>
      <h1 className="font-rajdhani font-black" style={{ fontSize: 28, letterSpacing: 1, color: 'var(--text)', marginBottom: '0.5rem' }}>SLA & Contratos</h1>
      <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: '2rem' }}>Monitoramento de cumprimento de SLA por cliente.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {contracts.map((c, i) => (
          <div key={i} className="card-base" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--silver2)', marginBottom: '0.25rem' }}>{c.client}</div>
                <div style={{ fontSize: 11, color: 'var(--slate)' }}>Plano {c.plan} · Expira {c.expiry}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: complianceColor(c.compliance), fontFamily: 'var(--font-mono)', lineHeight: 1 }}>{c.compliance}%</div>
                <div style={{ fontSize: 10, color: 'var(--slate)' }}>Cumprimento SLA</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
              {[{ l: 'Resposta', v: c.slaResponse }, { l: 'Visitas', v: c.visits }, { l: 'Uptime', v: c.uptime }].map((m, j) => (
                <div key={j} style={{ textAlign: 'center', padding: '0.75rem', background: 'rgba(0,230,118,0.04)', border: '1px solid rgba(0,230,118,0.1)', borderRadius: 8 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--green)' }}>{m.v}</div>
                  <div style={{ fontSize: 10, color: 'var(--slate)', marginTop: 2 }}>{m.l}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
