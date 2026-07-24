'use server'
// ─── Ticket Server Actions ────────────────────────────────────────────────
import { revalidateTag } from 'next/cache'
import { db } from '@/lib/db'
import { tickets, ticketMessages } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import { getSession } from '@/lib/auth-server'
import { CACHE_TAGS } from '@/lib/cache'

function generateRef(prefix = 'BX-TKT') {
  return `${prefix}-${Date.now().toString().slice(-6)}`
}

export async function createTicket(data: {
  title: string
  description: string
  category: string
  priority: 'low' | 'medium' | 'high' | 'critical'
}) {
  const session = await getSession()
  if (!session) return { error: 'Não autenticado.' }

  try {
    const [ticket] = await db
      .insert(tickets)
      .values({
        ref:         generateRef(),
        title:       data.title,
        description: data.description,
        category:    data.category,
        priority:    data.priority,
        status:      'open',
        clientId:    session.id,
        companyId:   session.companyId ?? undefined,
      })
      .returning()

    revalidateTag(CACHE_TAGS.tickets)
    revalidateTag(CACHE_TAGS.dashboard)
    return { ticket, error: null }
  } catch (err) {
    console.error('[action] createTicket:', err)
    return { ticket: null, error: 'Erro ao criar ticket.' }
  }
}

export async function addTicketMessage(ticketId: number, body: string) {
  const session = await getSession()
  if (!session) return { error: 'Não autenticado.' }

  try {
    const [msg] = await db
      .insert(ticketMessages)
      .values({ ticketId, authorId: session.id, body, isInternal: false })
      .returning()

    // Update ticket updatedAt
    await db
      .update(tickets)
      .set({ updatedAt: new Date() })
      .where(eq(tickets.id, ticketId))

    revalidateTag(CACHE_TAGS.tickets)
    return { message: msg, error: null }
  } catch (err) {
    console.error('[action] addTicketMessage:', err)
    return { message: null, error: 'Erro ao enviar mensagem.' }
  }
}

export async function updateTicketStatus(
  ticketId: number,
  status: 'open' | 'in_progress' | 'waiting' | 'resolved' | 'closed',
) {
  const session = await getSession()
  if (!session || session.role === 'client') return { error: 'Sem permissão.' }

  try {
    const extra =
      status === 'resolved' ? { resolvedAt: new Date() }
      : status === 'closed'   ? { closedAt: new Date() }
      : {}

    await db
      .update(tickets)
      .set({ status, updatedAt: new Date(), ...extra })
      .where(eq(tickets.id, ticketId))

    revalidateTag(CACHE_TAGS.tickets)
    revalidateTag(CACHE_TAGS.dashboard)
    return { error: null }
  } catch (err) {
    console.error('[action] updateTicketStatus:', err)
    return { error: 'Erro ao actualizar ticket.' }
  }
}

export async function assignTicket(ticketId: number, technicianId: number) {
  const session = await getSession()
  if (!session || session.role !== 'admin') return { error: 'Sem permissão.' }

  try {
    await db
      .update(tickets)
      .set({ assignedTo: technicianId, status: 'in_progress', updatedAt: new Date() })
      .where(eq(tickets.id, ticketId))

    revalidateTag(CACHE_TAGS.tickets)
    return { error: null }
  } catch (err) {
    console.error('[action] assignTicket:', err)
    return { error: 'Erro ao atribuir técnico.' }
  }
}
