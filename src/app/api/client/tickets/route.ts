import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth-server'
import { getClientTickets } from '@/lib/queries/tickets'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const tickets = await getClientTickets(session.id)
  return NextResponse.json({ tickets })
}
