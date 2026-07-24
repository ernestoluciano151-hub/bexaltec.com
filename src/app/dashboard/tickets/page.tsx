// ─── Tickets Page — Server Component + Client wrapper ─────────────────────
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth-server'
import { getClientTickets } from '@/lib/queries/tickets'
import { TicketsClient } from './TicketsClient'

export default async function TicketsPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const tickets = await getClientTickets(session.id)

  return <TicketsClient tickets={tickets} sessionId={session.id} />
}
