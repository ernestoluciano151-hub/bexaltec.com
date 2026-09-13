// ─── Quote queries (cached) ───────────────────────────────────────────────
import { db } from '@/lib/db'
import { quotes } from '@/lib/schema'
import { eq, or, desc } from 'drizzle-orm'
import { withCache, CACHE_TAGS, TTL } from '@/lib/cache'

// Orçamentos de um cliente do portal.
// Inclui os pedidos feitos antes do registo, associados pelo email.
export const getClientQuotes = withCache(
  async (clientId: number, email: string) => {
    return db
      .select({
        id:        quotes.id,
        ref:       quotes.ref,
        services:  quotes.services,
        status:    quotes.status,
        value:     quotes.value,
        budget:    quotes.budget,
        createdAt: quotes.createdAt,
      })
      .from(quotes)
      .where(or(eq(quotes.clientId, clientId), eq(quotes.email, email)))
      .orderBy(desc(quotes.createdAt))
      .limit(100)
  },
  ['quotes', 'by-client'],
  [CACHE_TAGS.quotes],
  TTL.SHORT,
)

// Todos os orçamentos (admin)
export const getAllQuotes = withCache(
  async () => {
    return db
      .select()
      .from(quotes)
      .orderBy(desc(quotes.createdAt))
      .limit(200)
  },
  ['quotes', 'all'],
  [CACHE_TAGS.quotes],
  TTL.SHORT,
)
