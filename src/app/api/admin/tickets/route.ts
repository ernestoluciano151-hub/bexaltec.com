import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth-server'
import { getAllTickets, getTicketCounts } from '@/lib/queries/tickets'

export async function GET() {
  const session = await getSession()
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const [tickets, counts] = await Promise.all([getAllTickets(), getTicketCounts()])
  return NextResponse.json({ tickets, counts })
}
