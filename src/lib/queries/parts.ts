// ─── Parts / Stock queries (cached) ──────────────────────────────────────
import { db } from '@/lib/db'
import { parts } from '@/lib/schema'
import { lte, desc } from 'drizzle-orm'
import { withCache, CACHE_TAGS, TTL } from '@/lib/cache'

// All parts for inventory view
export const getAllParts = withCache(
  async () => {
    return db
      .select()
      .from(parts)
      .orderBy(parts.name)
  },
  ['parts', 'all'],
  [CACHE_TAGS.parts],
  TTL.MEDIUM,
)

// Parts below minimum stock (alerts)
export const getLowStockParts = withCache(
  async () => {
    return db
      .select()
      .from(parts)
      .where(lte(parts.stockQty, parts.minQty))
      .orderBy(parts.stockQty)
  },
  ['parts', 'low-stock'],
  [CACHE_TAGS.parts, CACHE_TAGS.dashboard],
  TTL.MEDIUM,
)
