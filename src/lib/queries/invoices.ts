// ─── Invoice queries (cached) ─────────────────────────────────────────────
import { db } from '@/lib/db'
import { invoices, companies, users } from '@/lib/schema'
import { eq, desc, and, sum, sql } from 'drizzle-orm'
import { withCache, CACHE_TAGS, TTL } from '@/lib/cache'

// Estado efetivo da fatura.
//
// O estado `overdue` nunca era atribuído por ninguém — não há tarefa agendada que o
// escreva — pelo que o cartão "Em Atraso" ficava permanentemente a zero mesmo com
// faturas vencidas há meses. Em vez de depender de um job, o vencimento é derivado
// aqui: uma fatura enviada cuja data-limite já passou está em atraso, por definição.
// Assim o portal, a listagem e os totais dizem todos a mesma coisa.
export type EffectiveInvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'

const effectiveStatus = sql<EffectiveInvoiceStatus>`
  CASE WHEN ${invoices.status} = 'sent' AND ${invoices.dueDate} < NOW()
       THEN 'overdue' ELSE ${invoices.status} END
`

// All invoices for a client (portal billing page)
export const getClientInvoices = withCache(
  async (clientId: number) => {
    return db
      .select({
        id:        invoices.id,
        ref:       invoices.ref,
        status:    effectiveStatus,
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
        status:      effectiveStatus,
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
        status: effectiveStatus,
        total:  sql<number>`COALESCE(SUM(${invoices.total}), 0)`,
        count:  sql<number>`COUNT(*)`,
      })
      .from(invoices)
      .groupBy(effectiveStatus)

    return Object.fromEntries(rows.map(r => [r.status, { total: Number(r.total), count: Number(r.count) }]))
  },
  ['invoices', 'summary'],
  [CACHE_TAGS.invoices, CACHE_TAGS.dashboard],
  TTL.MEDIUM,
)
