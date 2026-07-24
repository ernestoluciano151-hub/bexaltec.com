// ─── Work Order queries (cached) ──────────────────────────────────────────
import { db } from '@/lib/db'
import { workOrders, users, companies } from '@/lib/schema'
import { eq, desc } from 'drizzle-orm'
import { withCache, CACHE_TAGS, TTL } from '@/lib/cache'

// All work orders (admin)
export const getAllWorkOrders = withCache(
  async () => {
    return db
      .select({
        id:            workOrders.id,
        ref:           workOrders.ref,
        title:         workOrders.title,
        description:   workOrders.description,
        status:        workOrders.status,
        priority:      workOrders.priority,
        value:         workOrders.value,
        scheduledAt:   workOrders.scheduledAt,
        completedAt:   workOrders.completedAt,
        createdAt:     workOrders.createdAt,
        clientName:    users.name,
        companyName:   companies.name,
        technicianId:  workOrders.technicianId,
      })
      .from(workOrders)
      .leftJoin(users, eq(workOrders.clientId, users.id))
      .leftJoin(companies, eq(workOrders.companyId, companies.id))
      .orderBy(desc(workOrders.createdAt))
      .limit(200)
  },
  ['work-orders', 'all'],
  [CACHE_TAGS.workOrders],
  TTL.SHORT,
)

// Work orders for a specific client (portal)
export const getClientWorkOrders = withCache(
  async (clientId: number) => {
    return db
      .select({
        id:          workOrders.id,
        ref:         workOrders.ref,
        title:       workOrders.title,
        status:      workOrders.status,
        priority:    workOrders.priority,
        value:       workOrders.value,
        scheduledAt: workOrders.scheduledAt,
        completedAt: workOrders.completedAt,
        createdAt:   workOrders.createdAt,
      })
      .from(workOrders)
      .where(eq(workOrders.clientId, clientId))
      .orderBy(desc(workOrders.createdAt))
  },
  ['work-orders', 'by-client'],
  [CACHE_TAGS.workOrders],
  TTL.SHORT,
)
