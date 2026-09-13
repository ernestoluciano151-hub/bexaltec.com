// ─── Documentos ───────────────────────────────────────────────────────────
// Ainda não existe armazenamento de documentos no sistema. Até existir, esta
// página indica os canais reais em vez de listar ficheiros que não existem.

import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth-server'
import { getClientInvoices } from '@/lib/queries/invoices'
import { PageHeader, EmptyState } from '@/components/ui/shared'
import { CONTACT, mailLink } from '@/lib/contact'

export default async function DownloadsPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const invoices = await getClientInvoices(session.id)

  return (
    <div>
      <PageHeader
        title="Documentos"
        sub="Faturas, propostas, relatórios e certificados associados à sua conta."
      />

      <div className="card-base" style={{ padding: '1.5rem', marginBottom: '1rem' }}>
        <div className="font-rajdhani font-semibold" style={{ fontSize: 16, color: 'var(--text)', marginBottom: '0.75rem' }}>
          Faturação
        </div>
        {invoices.length === 0 ? (
          <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.7 }}>
            Ainda não há faturas emitidas para a sua conta.
          </p>
        ) : (
          <>
            <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.7, marginBottom: '1rem' }}>
              Tem {invoices.length} fatura(s) registada(s). Consulte-as na área de faturação.
            </p>
            <Link href="/dashboard/billing" className="btn-primary" style={{ fontSize: 12, padding: '9px 18px' }}>
              Ir para Faturação
            </Link>
          </>
        )}
      </div>

      <div className="card-base">
        <EmptyState
          ico="📁"
          title="Repositório de documentos em preparação"
          sub={`Propostas, relatórios técnicos e certificados de garantia ainda não estão disponíveis para download automático. Peça-os à equipa por email (${CONTACT.email}) e enviamos no próprio dia útil.`}
          action={
            <a href={mailLink} className="btn-primary" style={{ fontSize: 12, padding: '9px 18px' }}>
              Pedir documentos por email
            </a>
          }
        />
      </div>
    </div>
  )
}
