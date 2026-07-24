// ─── Next.js Cache Layer — Bexaltec ─────────────────────────────────────────
// Wraps unstable_cache with typed helpers and revalidation tags.
// Each entity group has its own tag so mutations only bust relevant caches.
//
// Usage (Server Component or Server Action):
//   import { cached } from '@/lib/cache'
//   const tickets = await cached.tickets.list(userId)
//   revalidateTag('tickets') // after mutation

import { unstable_cache } from 'next/cache'
import { revalidateTag } from 'next/cache'

// ── Cache tag constants ────────────────────────────────────────────────────
export const CACHE_TAGS = {
  users:      'users',
  companies:  'companies',
  tickets:    'tickets',
  repairs:    'repairs',
  equipment:  'equipment',
  parts:      'parts',
  workOrders: 'work-orders',
  contracts:  'contracts',
  invoices:   'invoices',
  notifications: 'notifications',
  dashboard:  'dashboard',
} as const

export type CacheTag = (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS]

// ── Default TTL values (seconds) ──────────────────────────────────────────
const TTL = {
  SHORT:  30,        // 30 s — real-time-ish (ticket status, notifications)
  MEDIUM: 60 * 2,   // 2 min — portal data (dashboard counts, service list)
  LONG:   60 * 10,  // 10 min — stable data (companies, contracts, parts)
  DAY:    60 * 60 * 24, // 24 h — reference data (schema lookups)
} as const

// ── Generic cache factory ──────────────────────────────────────────────────
/**
 * Wraps an async function with Next.js data cache.
 * @param fn       The async function to cache
 * @param keyParts Stable key segments (combined with fn args)
 * @param tags     Cache tags for on-demand revalidation
 * @param revalidate TTL in seconds
 */
export function withCache<TArgs extends unknown[], TReturn>(
  fn: (...args: TArgs) => Promise<TReturn>,
  keyParts: string[],
  tags: CacheTag[],
  revalidate: number = TTL.MEDIUM,
) {
  return (...args: TArgs): Promise<TReturn> => {
    const cacheKey = [...keyParts, ...args.map(String)]
    return unstable_cache(
      () => fn(...args),
      cacheKey,
      { tags, revalidate },
    )()
  }
}

// ── Invalidation helpers ───────────────────────────────────────────────────
/** Call after any write operation to bust the relevant cache. */
export const invalidate = {
  users:      () => revalidateTag(CACHE_TAGS.users),
  companies:  () => revalidateTag(CACHE_TAGS.companies),
  tickets:    () => { revalidateTag(CACHE_TAGS.tickets); revalidateTag(CACHE_TAGS.dashboard) },
  repairs:    () => { revalidateTag(CACHE_TAGS.repairs);  revalidateTag(CACHE_TAGS.dashboard) },
  equipment:  () => revalidateTag(CACHE_TAGS.equipment),
  parts:      () => revalidateTag(CACHE_TAGS.parts),
  workOrders: () => { revalidateTag(CACHE_TAGS.workOrders); revalidateTag(CACHE_TAGS.dashboard) },
  contracts:  () => revalidateTag(CACHE_TAGS.contracts),
  invoices:   () => { revalidateTag(CACHE_TAGS.invoices); revalidateTag(CACHE_TAGS.dashboard) },
  notifications: (userId: number) => revalidateTag(`${CACHE_TAGS.notifications}-${userId}`),
  all:        () => Object.values(CACHE_TAGS).forEach(tag => revalidateTag(tag)),
}

// ── TTL export for use in query files ─────────────────────────────────────
export { TTL }
