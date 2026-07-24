// ─── Contracts Page — Server Component ────────────────────────────────────
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth-server'
import { getCompanyContracts } from '@/lib/queries/contracts'
import { PageHeader, EmptyState } from '@/components/ui/shared'

const CONTRACT_TYPE_LABELS: Record<string, string> = {
  basic: 'Basic', business: 'Business', enterprise: 'Enterprise',
}
const CONTRACT_TYPE_BADGE: Record<string, string> = {
  basic: 'badge-gray', business: 'badge-blue', enterprise: 'badge-green',
}

export default async function ContractsPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  if (!session.companyId) {
    return (
      <div>
        <PageHeader
          title="Contratos"
          sub="Contratos de serviço ativos e histórico de acordos com a Bexaltec."
        />
        <EmptyState
          ico="📄"
          title="Sem contratos associados"
          sub="A sua conta não está associada a uma empresa com contratos. Contacte-nos para mais informações."
        />
      </div>
    )
  }

  const contracts = await getCompanyContracts(session.companyId)

  return (
    <div>
      <PageHeader
        title="Contratos"
        sub={`${contracts.length} contratos associados à sua empresa.`}
      />

      {contracts.length === 0 ? (
        <EmptyState
          ico="📄"
          title="Sem contratos"
          sub="Não existem contratos registados para a sua empresa de momento."
        />
      ) : (
        <div className="card-base" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Referência', 'Tipo', 'SLA Alvo', 'T. Resposta', 'Valor', 'Início', 'Fim', 'Auto-renovar'].map(h => (
                    <th key={h} style={{ padding: '0.85rem 1rem', textAlign: 'left', fontSize: 10, color: 'var(--slate)', letterSpacing: 1, textTransform: 'uppercase', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {contracts.map(c => {
                  const now = new Date()
                  const isActive = new Date(c.endDate) >= now && new Date(c.startDate) <= now
                  const isExpired = new Date(c.endDate) < now
                  return (
                    <tr key={c.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span className="font-mono" style={{ fontSize: 12, color: 'var(--green)' }}>{c.ref}</span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span className={`badge ${CONTRACT_TYPE_BADGE[c.type] ?? 'badge-gray'}`}>
                          {CONTRACT_TYPE_LABELS[c.type] ?? c.type}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', fontSize: 13, color: 'var(--green)', fontWeight: 600 }}>
                        {c.slaTarget ?? '—'}%
                      </td>
                      <td style={{ padding: '0.85rem 1rem', fontSize: 12, color: 'var(--text2)' }}>
                        {c.responseTime != null ? `${c.responseTime}h` : '—'}
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        {c.value
                          ? <span className="font-rajdhani font-semibold" style={{ fontSize: 13, color: 'var(--text)' }}>{Number(c.value).toLocaleString('pt-AO')} <span style={{ fontSize: 10, color: 'var(--slate)' }}>Kz</span></span>
                          : <span style={{ color: 'var(--muted)' }}>—</span>}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', fontSize: 12, color: 'var(--text2)', whiteSpace: 'nowrap' }}>
                        {new Date(c.startDate).toLocaleDateString('pt-AO')}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', fontSize: 12, whiteSpace: 'nowrap', color: isExpired ? '#EF5350' : 'var(--text2)' }}>
                        {new Date(c.endDate).toLocaleDateString('pt-AO')}
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span className={`badge ${c.autoRenew ? 'badge-green' : 'badge-gray'}`}>
                          {c.autoRenew ? 'Sim' : 'Não'}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
