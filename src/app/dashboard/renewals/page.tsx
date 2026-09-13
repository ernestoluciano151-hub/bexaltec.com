// ─── Renovações de contrato ───────────────────────────────────────────────
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth-server'
import { getCompanyContracts } from '@/lib/queries/contracts'
import { PageHeader, EmptyState } from '@/components/ui/shared'
import { whatsappLink } from '@/lib/contact'

const TYPE_LABEL: Record<string, string> = {
  basic: 'Contrato Básico', business: 'Contrato Business', enterprise: 'Contrato Enterprise',
}

function state(daysLeft: number, autoRenew: boolean) {
  if (daysLeft < 0) return { label: 'Expirado', color: '#EF5350' }
  if (daysLeft <= 30) return { label: autoRenew ? 'Renova automaticamente' : 'Urgente', color: daysLeft <= 15 ? '#EF5350' : '#FFB74D' }
  if (daysLeft <= 90) return { label: 'Renovar em breve', color: '#FFB74D' }
  return { label: 'Ativo', color: '#00E676' }
}

export default async function RenewalsPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const contracts = session.companyId ? await getCompanyContracts(session.companyId) : []

  const enriched = contracts
    .map(c => {
      const daysLeft = Math.ceil((new Date(c.endDate).getTime() - Date.now()) / 86_400_000)
      return { ...c, daysLeft, st: state(daysLeft, c.autoRenew) }
    })
    .sort((a, b) => a.daysLeft - b.daysLeft)

  return (
    <div>
      <PageHeader
        title="Renovações"
        sub="Contratos e serviços com renovação próxima."
      />

      {enriched.length === 0 ? (
        <div className="card-base">
          <EmptyState
            ico="🔄"
            title={session.companyId ? 'Sem contratos registados' : 'A sua conta ainda não está associada a uma empresa'}
            sub={session.companyId
              ? 'Os contratos de manutenção e SLA da sua empresa aparecem aqui, com a data de renovação.'
              : 'Assim que a sua conta for associada à empresa, os contratos aparecem nesta página.'}
            action={
              <a
                href={whatsappLink('Olá Bexaltec, gostaria de falar sobre o meu contrato de manutenção.')}
                target="_blank" rel="noopener noreferrer"
                className="btn-primary" style={{ fontSize: 12, padding: '9px 18px' }}>
                Falar sobre contratos
              </a>
            }
          />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {enriched.map(c => (
            <div key={c.id} className="card-base" style={{ padding: '1.5rem', borderLeft: `3px solid ${c.st.color}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem', gap: '1rem', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--silver2)', marginBottom: '0.25rem' }}>
                    {TYPE_LABEL[c.type] ?? c.type} <span className="font-mono" style={{ fontSize: 12, color: 'var(--green)' }}>{c.ref}</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text2)' }}>
                    {c.daysLeft < 0 ? 'Expirou em ' : 'Expira em '}
                    {new Date(c.endDate).toLocaleDateString('pt-AO', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                </div>
                <span style={{ fontSize: 11, padding: '4px 12px', borderRadius: 20, background: `${c.st.color}14`, border: `1px solid ${c.st.color}33`, color: c.st.color, fontWeight: 700 }}>
                  {c.st.label}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.6rem' }}>
                  <span style={{ fontSize: 24, fontWeight: 900, color: c.st.color, fontFamily: 'var(--font-mono)' }}>
                    {Math.abs(c.daysLeft)}
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--text2)' }}>
                    {c.daysLeft < 0 ? 'dias em atraso' : 'dias restantes'}
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--text2)', marginLeft: '0.5rem' }}>
                    SLA {c.slaTarget}% · resposta {c.responseTime}h
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  {c.value != null && (
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--silver2)' }}>
                      {Number(c.value).toLocaleString('pt-AO', { maximumFractionDigits: 0 })} AOA
                    </span>
                  )}
                  <Link href="/dashboard/contracts" className="btn-secondary" style={{ fontSize: 11, padding: '6px 14px' }}>
                    Ver contrato
                  </Link>
                  <a
                    href={whatsappLink(`Olá Bexaltec, gostaria de renovar o contrato ${c.ref}.`)}
                    target="_blank" rel="noopener noreferrer"
                    className="btn-primary" style={{ fontSize: 11, padding: '6px 14px' }}>
                    Renovar
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
