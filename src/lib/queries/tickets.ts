// ─── Ticket queries (cached) ──────────────────────────────────────────────
import { db } from '@/lib/db'
import { tickets, ticketMessages, users } from '@/lib/schema'
import { eq, desc, and, count } from 'drizzle-orm'
import { withCache, CACHE_TAGS, TTL } from '@/lib/cache'

// List tickets for a specific client
export const getClientTickets = withCache(
  async (clientId: number) => {
    return db
      .select({
        id:        tickets.id,
        ref:       tickets.ref,
        title:     tickets.title,
        status:    tickets.status,
        priority:  tickets.priority,
        category:  tickets.category,
        createdAt: tickets.createdAt,
        updatedAt: tickets.updatedAt,
      })
      .from(tickets)
      .where(eq(tickets.clientId, clientId))
      .orderBy(desc(tickets.createdAt))
  },
  ['tickets', 'by-client'],
  [CACHE_TAGS.tickets],
  TTL.SHORT,
)

// List all tickets (admin)
export const getAllTickets = withCache(
  async () => {
    return db
      .select({
        id:        tickets.id,
        ref:       tickets.ref,
        title:     tickets.title,
        status:    tickets.status,
        priority:  tickets.priority,
        category:  tickets.category,
        clientName: users.name,
        clientEmail: users.email,
        createdAt: tickets.createdAt,
        updatedAt: tickets.updatedAt,
      })
      .from(tickets)
      .leftJoin(users, eq(tickets.clientId, users.id))
      .orderBy(desc(tickets.updatedAt))
      .limit(200)
  },
  ['tickets', 'all'],
  [CACHE_TAGS.tickets],
  TTL.SHORT,
)

// Ticket counts by status (dashboard widget)
export const getTicketCounts = withCache(
  async (clientId?: number) => {
    const condition = clientId ? eq(tickets.clientId, clientId) : undefined
    const rows = await db
      .select({ status: tickets.status, count: count() })
      .from(tickets)
      .where(condition)
      .groupBy(tickets.status)
    return Object.fromEntries(rows.map(r => [r.status, Number(r.count)]))
  },
  ['tickets', 'counts'],
  [CACHE_TAGS.tickets, CACHE_TAGS.dashboard],
  TTL.SHORT,
)

// Single ticket with messages
export const getTicketById = withCache(
  async (ticketId: number) => {
    const [ticket] = await db
      .select()
      .from(tickets)
      .where(eq(tickets.id, ticketId))
      .limit(1)
    if (!ticket) return null

    const messages = await db
      .select({
        id:         ticketMessages.id,
        body:       ticketMessages.body,
        isInternal: ticketMessages.isInternal,
        createdAt:  ticketMessages.createdAt,
        authorName: users.name,
        authorRole: users.role,
      })
      .from(ticketMessages)
      .leftJoin(users, eq(ticketMessages.authorId, users.id))
      .where(eq(ticketMessages.ticketId, ticketId))
      .orderBy(ticketMessages.createdAt)

    return { ...ticket, messages }
  },
  ['ticket', 'detail'],
  [CACHE_TAGS.tickets],
  TTL.SHORT,
)
