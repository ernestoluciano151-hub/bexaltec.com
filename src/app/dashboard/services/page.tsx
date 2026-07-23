'use client'
import { mockServices } from '@/lib/mock-data'
import type { ServiceStatus } from '@/lib/mock-data'

const statusBadge: Record<ServiceStatus, string> = { active: 'badge-green', suspended: 'badge-yellow', expired: 'badge-red' }
const statusLabel: Record<ServiceStatus, string> = { active: 'Ativo', suspended: 'Suspenso', expired: 'Expirado' }

export default function ServicesPage() {
  const myServices = mockServices.filter(s => s.clientId === 'c1')

  const daysUntil = (date: string) => {
    const diff = new Date(date).getTime() - Date.now()
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ fontSize: 11, color: 'var(--slate)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: '0.25rem' }}>Portal do Cliente</div>
        <h1 className="font-rajdhani font-black" style={{ fontSize: 28, color: 'var(--text)', letterSpacing: 1 }}>Os Meus Serviços</h1>
        <p style={{ fontSize: 13, color: 'var(--slate)', marginTop: 4 }}>{myServices.filter(s => s.status === 'active').length} serviços ativos</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {myServices.map(service => {
          const days = daysUntil(service.endDate)
          const progressPct = Math.max(0, Math.min(100, 100 - (days / 365) * 100))

          return (
            <div key={service.id} className="card-base card-glow" style={{ padding: '1.5rem', transition: 'all 0.25s' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                    <div className="font-rajdhani font-bold" style={{ fontSize: 17, color: 'var(--text)' }}>{service.name}</div>
                    <span className={`badge ${statusBadge[service.status]}`}>{statusLabel[service.status]}</span>
                    <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, background: 'rgba(66,165,245,0.07)', border: '1px solid rgba(66,165,245,0.18)', color: '#42A5F5' }}>{service.category}</span>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--slate)', lineHeight: 1.6, marginBottom: '1rem', maxWidth: 600 }}>{service.description}</p>

                  {/* Progress bar */}
                  <div style={{ marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                      <span style={{ fontSize: 10, color: 'var(--slate)' }}>Período do contrato</span>
                      <span style={{ fontSize: 10, color: days < 90 ? '#FFC107' : 'var(--slate)' }}>
                        {days > 0 ? `${days} dias restantes` : 'Expirado'}
                      </span>
                    </div>
                    <div style={{ height: 4, background: 'rgba(176,190,197,0.1)', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${progressPct}%`, background: days < 90 ? '#FFC107' : 'var(--green)', borderRadius: 4, transition: 'width 1s ease' }} />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                    {[
                      ['Início', new Date(service.startDate).toLocaleDateString('pt-AO')],
                      ['Término', new Date(service.endDate).toLocaleDateString('pt-AO')],
                    ].map(([k, v]) => (
                      <div key={k}>
                        <div style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: 1, textTransform: 'uppercase' }}>{k}</div>
                        <div style={{ fontSize: 12, color: 'var(--silver2)', marginTop: 2 }}>{v}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 10, color: 'var(--slate)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>Valor Mensal</div>
                  <div className="font-rajdhani font-black" style={{ fontSize: 22, color: 'var(--green)', letterSpacing: 1 }}>
                    {service.monthlyValue.toLocaleString('pt-AO')} <span style={{ fontSize: 12, color: 'var(--slate)' }}>Kz</span>
                  </div>
                  {days < 90 && days > 0 && (
                    <button className="btn-primary mt-3 text-xs py-1.5 px-3">Renovar ↗</button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Upgrade CTA */}
      <div style={{ marginTop: '2rem', background: 'var(--glow)', border: '1px solid var(--border-g)', borderRadius: 14, padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="font-rajdhani font-semibold" style={{ fontSize: 17, color: 'var(--text)', marginBottom: '0.25rem' }}>Precisa de mais serviços?</div>
          <div style={{ fontSize: 13, color: 'var(--slate)' }}>Solicite um orçamento para novos serviços ou upgrades dos atuais.</div>
        </div>
        <a href="/#orcamento" className="btn-primary" style={{ fontSize: 13 }}>Solicitar Orçamento ↗</a>
      </div>
    </div>
  )
}
