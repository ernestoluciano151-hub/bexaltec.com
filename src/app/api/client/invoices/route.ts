import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth-server'
import { getClientInvoices } from '@/lib/queries/invoices'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const invoices = await getClientInvoices(session.id)
  return NextResponse.json({ invoices })
}
