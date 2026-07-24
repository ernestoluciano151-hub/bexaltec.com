export default function SchedulePage() {
  const slots = [
    { time: '08:00', tech: 'Carlos F.', client: 'Banco Nacional Lda', task: 'Visita manutenção mensal', location: 'Luanda — Ingombotas', type: 'Manutenção' },
    { time: '10:00', tech: 'António N.', client: 'Hotel Presidente', task: 'Instalação CCTV — Lobby', location: 'Luanda — Mutamba', type: 'Segurança' },
    { time: '14:00', tech: 'Carlos F.', client: 'Tech Solutions Lda', task: 'Configuração switch Cisco', location: 'Luanda — Talatona', type: 'Infraestrutura' },
    { time: '15:30', tech: 'Maria S.', client: 'Ana Costa (Particular)', task: 'Entrega iPhone reparado', location: 'Laboratório Bexaltec', type: 'Lab' },
  ]
  const typeColor: Record<string, string> = { Manutenção: '#FFB74D', Segurança: '#EF5350', Infraestrutura: '#42A5F5', Lab: '#00E676', Software: '#CE93D8' }
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 className="font-rajdhani font-black" style={{ fontSize: 28, letterSpacing: 1, color: 'var(--text)', marginBottom: '0.25rem' }}>Agenda</h1>
          <p style={{ fontSize: 13, color: 'var(--text2)' }}>Visitas e trabalhos agendados — Hoje, 22 Jan 2025</p>
        </div>
        <button className="btn-primary" style={{ fontSize: 12, padding: '8px 18px' }}>+ Novo Agendamento</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {slots.map((s, i) => (
          <div key={i} className="card-base" style={{ padding: '1.1rem 1.25rem', display: 'flex', gap: '1rem', alignItems: 'center', borderLeft: `3px solid ${typeColor[s.type]}` }}>
            <div style={{ minWidth: 50, textAlign: 'center' }}>
              <div style={{ fontSize: 15, fontWeight: 900, color: 'var(--green)', fontFamily: 'var(--font-mono)' }}>{s.time}</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--silver2)', marginBottom: '0.2rem' }}>{s.task}</div>
              <div style={{ fontSize: 11, color: 'var(--text2)' }}>👥 {s.client} · 📍 {s.location}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, background: `${typeColor[s.type]}14`, color: typeColor[s.type], fontWeight: 700 }}>{s.type}</span>
              <div style={{ fontSize: 11, color: 'var(--slate)', marginTop: '0.35rem' }}>👨‍🔧 {s.tech}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
