import Link from 'next/link'

export default function RenewalsPage() {
  const renewals = [
    { name: 'Contrato Manutenção TI Business', expiry: '31 Dez 2025', daysLeft: 342, status: 'Ativo', value: '150.000 AOA/mês' },
    { name: 'Hospedagem VPS Premium', expiry: '15 Mar 2025', daysLeft: 52, status: 'Renovar em Breve', value: '25.000 AOA/mês' },
    { name: 'Domínio empresa.ao', expiry: '01 Fev 2025', daysLeft: 10, status: 'Urgente', value: '15.000 AOA/ano' },
  ]
  const statusColor: Record<string, string> = { Ativo: '#00E676', 'Renovar em Breve': '#FFB74D', Urgente: '#EF5350' }
  return (
    <div>
      <h1 className="font-rajdhani font-black" style={{ fontSize: 28, letterSpacing: 1, color: 'var(--text)', marginBottom: '0.5rem' }}>Renovações</h1>
      <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: '2rem' }}>Contratos e serviços com renovação próxima.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {renewals.map((r, i) => (
          <div key={i} className="card-base" style={{ padding: '1.5rem', borderLeft: `3px solid ${statusColor[r.status]}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--silver2)', marginBottom: '0.25rem' }}>{r.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text2)' }}>Expira em {r.expiry}</div>
              </div>
              <span style={{ fontSize: 11, padding: '4px 12px', borderRadius: 20, background: `${statusColor[r.status]}14`, color: statusColor[r.status], fontWeight: 700 }}>{r.status}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: 24, fontWeight: 900, color: statusColor[r.status], fontFamily: 'var(--font-mono)' }}>{r.daysLeft}</span>
                <span style={{ fontSize: 11, color: 'var(--slate)' }}>dias restantes</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--silver2)' }}>{r.value}</span>
                <Link href="/contact" className="btn-primary" style={{ fontSize: 11, padding: '6px 14px' }}>Renovar</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
