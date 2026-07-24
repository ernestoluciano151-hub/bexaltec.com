export default function TechniciansPage() {
  const techs = [
    { name: 'João Manuel', role: 'Técnico Sénior — Lab', specialties: ['iPhone', 'MacBook', 'Soldadura SMD'], jobs: 3, status: 'Ocupado', availability: '14h30' },
    { name: 'Carlos Ferreira', role: 'Técnico de Infraestrutura', specialties: ['Cabeamento', 'Switches', 'Fibra'], jobs: 2, status: 'Disponível', availability: 'Agora' },
    { name: 'Maria Santos', role: 'Técnica de Lab & Mobile', specialties: ['Android', 'Tablets', 'Consolas'], jobs: 1, status: 'Em Deslocação', availability: '16h00' },
    { name: 'António Neto', role: 'Técnico de Segurança', specialties: ['CCTV', 'Controlo Acessos', 'Alarmes'], jobs: 0, status: 'Disponível', availability: 'Agora' },
  ]
  const statusColor: Record<string, string> = { Disponível: '#00E676', Ocupado: '#FFB74D', 'Em Deslocação': '#42A5F5' }
  return (
    <div>
      <h1 className="font-rajdhani font-black" style={{ fontSize: 28, letterSpacing: 1, color: 'var(--text)', marginBottom: '0.5rem' }}>Técnicos</h1>
      <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: '2rem' }}>Equipa técnica, especialidades e disponibilidade.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        {techs.map((t, i) => (
          <div key={i} className="card-base" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(0,230,118,0.12)', border: '1px solid rgba(0,230,118,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: 'var(--green)' }}>
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--silver2)' }}>{t.name}</div>
                  <div style={{ fontSize: 10, color: 'var(--slate)' }}>{t.role}</div>
                </div>
              </div>
              <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: `${statusColor[t.status]}14`, color: statusColor[t.status], fontWeight: 700 }}>{t.status}</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.85rem' }}>
              {t.specialties.map(s => (
                <span key={s} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, background: 'rgba(0,230,118,0.06)', border: '1px solid rgba(0,230,118,0.15)', color: 'var(--text2)' }}>{s}</span>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--slate)' }}>
              <span>🔧 {t.jobs} trabalhos ativos</span>
              <span>🕐 Disp. {t.availability}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
