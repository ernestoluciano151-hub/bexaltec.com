// ─── Dashboard summary queries (cached) ──────────────────────────────────
import { db } from '@/lib/db'
import { tickets, repairJobs, companies, users, invoices, workOrders } from '@/lib/schema'
import { eq, count, sql, and, gte } from 'drizzle-orm'
import { withCache, CACHE_TAGS, TTL } from '@/lib/cache'

// Admin CRM dashboard summary
export const getAdminDashboard = withCache(
  async () => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

    const [[openTickets], [activeRepairs], [totalCompanies], [totalClients], [monthRevenue]] =
      await Promise.all([
        db.select({ count: count() }).from(tickets).where(eq(tickets.status, 'open')),
        db.select({ count: count() }).from(repairJobs).where(
          sql`${repairJobs.status} NOT IN ('delivered', 'cancelled')`
        ),
        db.select({ count: count() }).from(companies).where(eq(companies.isActive, true)),
        db.select({ count: count() }).from(users).where(
          and(eq(users.role, 'client'), eq(users.isActive, true))
        ),
        db.select({ total: sql<number>`COALESCE(SUM(${invoices.total}), 0)` })
          .from(invoices)
          .where(
            and(eq(invoices.status, 'paid'), gte(invoices.paidAt, thirtyDaysAgo))
          ),
      ])

    return {
      openTickets:    Number(openTickets?.count ?? 0),
      activeRepairs:  Number(activeRepairs?.count ?? 0),
      totalCompanies: Number(totalCompanies?.count ?? 0),
      totalClients:   Number(totalClients?.count ?? 0),
      monthRevenue:   Number(monthRevenue?.total ?? 0),
    }
  },
  ['dashboard', 'admin-summary'],
  [CACHE_TAGS.dashboard, CACHE_TAGS.tickets, CACHE_TAGS.repairs, CACHE_TAGS.invoices],
  TTL.MEDIUM,
)

// Client portal dashboard summary
export const getClientDashboard = withCache(
  async (clientId: number) => {
    const [[openTickets], [activeRepairs], [pendingInvoices]] = await Promise.all([
      db.select({ count: count() })
        .from(tickets)
        .where(and(eq(tickets.clientId, clientId), eq(tickets.status, 'open'))),
      db.select({ count: count() })
        .from(repairJobs)
        .where(
          and(
            eq(repairJobs.clientId, clientId),
            sql`${repairJobs.status} NOT IN ('delivered', 'cancelled')`
          )
        ),
      db.select({ count: count() })
        .from(invoices)
        .where(
          and(eq(invoices.clientId, clientId), eq(invoices.status, 'sent'))
        ),
    ])

    return {
      openTickets:     Number(openTickets?.count ?? 0),
      activeRepairs:   Number(activeRepairs?.count ?? 0),
      pendingInvoices: Number(pendingInvoices?.count ?? 0),
    }
  },
  ['dashboard', 'client-summary'],
  [CACHE_TAGS.dashboard],
  TTL.SHORT,
)

// Notifications for a user
export const getUserNotifications = (userId: number) =>
  withCache(
    async () => {
      const { notifications } = await import('@/lib/schema')
      return db
        .select()
        .from(notifications)
        .where(eq(notifications.userId, userId))
        .orderBy(sql`${notifications.createdAt} DESC`)
        .limit(30)
    },
    ['notifications', String(userId)],
    [`notifications-${userId}` as any],
    TTL.SHORT,
  )()
