// ─── Billing Page — Server Component + Client wrapper ─────────────────────
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth-server'
import { getClientInvoices } from '@/lib/queries/invoices'
import { InvoicesClient } from './InvoicesClient'

export default async function BillingPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const invoices = await getClientInvoices(session.id)

  return <InvoicesClient invoices={invoices} />
}
