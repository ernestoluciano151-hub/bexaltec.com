// ─── Invoice queries (cached) ─────────────────────────────────────────────
import { db } from '@/lib/db'
import { invoices, companies, users } from '@/lib/schema'
import { eq, desc, and, sum, sql } from 'drizzle-orm'
import { withCache, CACHE_TAGS, TTL } from '@/lib/cache'

// All invoices for a client (portal billing page)
export const getClientInvoices = withCache(
  async (clientId: number) => {
    return db
      .select({
        id:        invoices.id,
        ref:       invoices.ref,
        status:    invoices.status,
        amount:    invoices.amount,
        tax:       invoices.tax,
        total:     invoices.total,
        currency:  invoices.currency,
        issueDate: invoices.issueDate,
        dueDate:   invoices.dueDate,
        paidAt:    invoices.paidAt,
        notes:     invoices.notes,
      })
      .from(invoices)
      .where(eq(invoices.clientId, clientId))
      .orderBy(desc(invoices.issueDate))
  },
  ['invoices', 'by-client'],
  [CACHE_TAGS.invoices],
  TTL.SHORT,
)

// All invoices (admin)
export const getAllInvoices = withCache(
  async () => {
    return db
      .select({
        id:          invoices.id,
        ref:         invoices.ref,
        status:      invoices.status,
        amount:      invoices.amount,
        total:       invoices.total,
        currency:    invoices.currency,
        issueDate:   invoices.issueDate,
        dueDate:     invoices.dueDate,
        paidAt:      invoices.paidAt,
        companyName: companies.name,
        clientName:  users.name,
        clientEmail: users.email,
      })
      .from(invoices)
      .leftJoin(companies, eq(invoices.companyId, companies.id))
      .leftJoin(users, eq(invoices.clientId, users.id))
      .orderBy(desc(invoices.issueDate))
      .limit(500)
  },
  ['invoices', 'all'],
  [CACHE_TAGS.invoices],
  TTL.SHORT,
)

// Invoice totals summary (admin financial KPIs)
export const getInvoiceSummary = withCache(
  async () => {
    const rows = await db
      .select({
        status: invoices.status,
        total:  sql<number>`COALESCE(SUM(${invoices.total}), 0)`,
        count:  sql<number>`COUNT(*)`,
      })
      .from(invoices)
      .groupBy(invoices.status)

    return Object.fromEntries(rows.map(r => [r.status, { total: Number(r.total), count: Number(r.count) }]))
  },
  ['invoices', 'summary'],
  [CACHE_TAGS.invoices, CACHE_TAGS.dashboard],
  TTL.MEDIUM,
)
