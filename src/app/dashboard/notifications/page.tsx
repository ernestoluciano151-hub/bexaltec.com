export default function NotificationsPage() {
  const notifs = [
    { ico: '🔧', title: 'Reparação Atualizada', desc: 'O seu iPhone 15 Pro Max entrou em fase de reparação.', time: 'Há 2 horas', read: false },
    { ico: '📋', title: 'Orçamento Aprovado', desc: 'O orçamento BX-ORC-2025-1042 foi aprovado. Entre em contacto para agendar.', time: 'Ontem 14:30', read: false },
    { ico: '🧾', title: 'Fatura Disponível', desc: 'Fatura FAT-2025-0018 disponível para download.', time: '20 Jan 2025', read: true },
    { ico: '✅', title: 'Serviço Concluído', desc: 'Instalação do switch Cisco SG350 concluída com sucesso.', time: '15 Jan 2025', read: true },
    { ico: '🔔', title: 'Contrato em Renovação', desc: 'O seu contrato de manutenção expira em 30 dias.', time: '10 Jan 2025', read: true },
  ]
  return (
    <div>
      <h1 className="font-rajdhani font-black" style={{ fontSize: 28, letterSpacing: 1, color: 'var(--text)', marginBottom: '0.5rem' }}>Notificações</h1>
      <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: '2rem' }}>Atualizações sobre os seus serviços, reparações e contratos.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {notifs.map((n, i) => (
          <div key={i} className="card-base" style={{ padding: '1rem 1.25rem', display: 'flex', gap: '1rem', alignItems: 'flex-start', background: n.read ? undefined : 'rgba(0,230,118,0.03)', borderLeft: n.read ? undefined : '2px solid rgba(0,230,118,0.4)' }}>
            <span style={{ fontSize: 20 }}>{n.ico}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--silver2)', marginBottom: '0.2rem' }}>
                {n.title}
                {!n.read && <span style={{ marginLeft: 8, fontSize: 9, padding: '1px 6px', background: 'rgba(0,230,118,0.2)', color: 'var(--green)', borderRadius: 10, fontWeight: 700 }}>NOVO</span>}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5 }}>{n.desc}</div>
              <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: '0.35rem' }}>{n.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
