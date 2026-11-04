'use server'
// ─── Ticket Server Actions ────────────────────────────────────────────────
import { revalidateTag } from 'next/cache'
import { db } from '@/lib/db'
import { tickets, ticketMessages } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import { getSession } from '@/lib/auth-server'
import { CACHE_TAGS } from '@/lib/cache'
import { nextRef } from '@/lib/crm'

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
        ref:         await nextRef('BX-TKT'),
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

  const text = typeof body === 'string' ? body.trim() : ''
  if (!text) return { message: null, error: 'A mensagem não pode estar vazia.' }
  if (text.length > 5000) return { message: null, error: 'A mensagem é demasiado longa (máx. 5000 caracteres).' }

  try {
    // Verificação de propriedade: um cliente só escreve nos seus próprios tickets.
    // Sem isto, qualquer cliente autenticado podia inserir mensagens no ticket de
    // outra empresa invocando esta action diretamente com um ticketId arbitrário.
    const [ticket] = await db
      .select({ id: tickets.id, clientId: tickets.clientId })
      .from(tickets)
      .where(eq(tickets.id, ticketId))
      .limit(1)

    if (!ticket) return { message: null, error: 'Ticket não encontrado.' }
    if (session.role === 'client' && ticket.clientId !== session.id) {
      return { message: null, error: 'Sem permissão para responder a este ticket.' }
    }

    const [msg] = await db
      .insert(ticketMessages)
      .values({ ticketId, authorId: session.id, body: text, isInternal: false })
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
