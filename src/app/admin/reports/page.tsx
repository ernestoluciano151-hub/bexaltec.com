'use client'
import { PageHeader } from '@/components/ui/shared'

const REPORT_CARDS = [
  {
    ico: '🎫',
    title: 'Relatório de Tickets',
    desc: 'Volume de tickets por período, tempos de resposta, categorias mais frequentes e resolução por técnico.',
  },
  {
    ico: '💰',
    title: 'Relatório Financeiro',
    desc: 'Receita mensal, faturas emitidas e pagas, pendências, previsão de faturação e evolução anual.',
  },
  {
    ico: '🔬',
    title: 'Relatório de Reparações',
    desc: 'Volume de reparações, tempos médios, custos de mão de obra e peças, dispositivos mais reparados.',
  },
  {
    ico: '📄',
    title: 'Relatório de SLA',
    desc: 'Cumprimento de SLA por cliente, incidentes fora do prazo, uptime reportado e penalizações aplicáveis.',
  },
]

export default function ReportsAdminPage() {
  return (
    <div>
      <PageHeader
        supra="CRM Admin"
        title="Relatórios"
        sub="Geração de relatórios operacionais e executivos"
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: '1.25rem' }}>
        {REPORT_CARDS.map(card => (
          <div key={card.title} className="card-base" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ fontSize: 32 }}>{card.ico}</div>
            <div>
              <div className="font-rajdhani font-bold" style={{ fontSize: 17, color: 'var(--text)', marginBottom: '0.4rem' }}>{card.title}</div>
              <p style={{ fontSize: 12, color: 'var(--slate)', lineHeight: 1.6 }}>{card.desc}</p>
            </div>
            <div>
              <button
                disabled
                title="Funcionalidade em desenvolvimento"
                style={{
                  fontSize: 12, padding: '8px 18px', borderRadius: 8,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid var(--border)',
                  color: 'var(--slate)',
                  cursor: 'not-allowed',
                  fontFamily: 'inherit',
                  opacity: 0.6,
                }}
              >
                Gerar Relatório — Em breve
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
