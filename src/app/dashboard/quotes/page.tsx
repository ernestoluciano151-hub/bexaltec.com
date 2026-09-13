// ─── Orçamentos do cliente ────────────────────────────────────────────────
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth-server'
import { getClientQuotes } from '@/lib/queries/quotes'
import { PageHeader, EmptyState } from '@/components/ui/shared'

const STATUS_LABEL: Record<string, string> = {
  new: 'Recebido', in_review: 'Em análise', sent: 'Proposta enviada',
  accepted: 'Aceite', rejected: 'Recusado', expired: 'Expirado',
}

const STATUS_COLOR: Record<string, string> = {
  new: '#42A5F5', in_review: '#FFB74D', sent: '#00E676',
  accepted: '#00C853', rejected: '#EF5350', expired: '#90A4AE',
}

export default async function QuotesPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const quotes = await getClientQuotes(session.id, session.email)

  return (
    <div>
      <PageHeader
        title="Orçamentos"
        sub="Pedidos de orçamento submetidos e estado atual."
        action={
          <Link href="/quote" className="btn-primary" style={{ fontSize: 12, padding: '9px 18px' }}>
            + Pedir Orçamento
          </Link>
        }
      />

      <div className="card-base" style={{ overflowX: 'auto' }}>
        {quotes.length === 0 ? (
          <EmptyState
            ico="📋"
            title="Ainda não pediu nenhum orçamento"
            sub="Os pedidos que submeter aparecem aqui, com a referência e o estado de cada um."
            action={<Link href="/quote" className="btn-primary" style={{ fontSize: 12, padding: '9px 18px' }}>Pedir orçamento gratuito</Link>}
          />
        ) : (
          <table className="data-table">
            <thead>
              <tr><th>Referência</th><th>Data</th><th>Serviços</th><th>Estado</th><th>Valor</th></tr>
            </thead>
            <tbody>
              {quotes.map(q => (
                <tr key={q.id}>
                  <td className="font-mono" style={{ color: 'var(--green)', whiteSpace: 'nowrap' }}>{q.ref}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>{new Date(q.createdAt).toLocaleDateString('pt-AO')}</td>
                  <td style={{ color: 'var(--silver2)', maxWidth: 320 }}>{q.services ?? '—'}</td>
                  <td>
                    <span style={{
                      fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 700,
                      background: `${STATUS_COLOR[q.status] ?? '#90A4AE'}14`,
                      border: `1px solid ${STATUS_COLOR[q.status] ?? '#90A4AE'}33`,
                      color: STATUS_COLOR[q.status] ?? '#90A4AE',
                    }}>
                      {STATUS_LABEL[q.status] ?? q.status}
                    </span>
                  </td>
                  <td style={{ color: 'var(--silver2)', fontWeight: 600, whiteSpace: 'nowrap' }}>
                    {q.value != null
                      ? `${Number(q.value).toLocaleString('pt-AO', { maximumFractionDigits: 0 })} AOA`
                      : <span style={{ color: 'var(--text2)', fontWeight: 400 }}>Por definir</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
