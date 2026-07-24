// ─── Repair job queries (cached) ─────────────────────────────────────────
import { db } from '@/lib/db'
import { repairJobs, users } from '@/lib/schema'
import { eq, desc } from 'drizzle-orm'
import { withCache, CACHE_TAGS, TTL } from '@/lib/cache'

// All repairs (admin lab view)
export const getAllRepairs = withCache(
  async () => {
    return db
      .select({
        id:           repairJobs.id,
        ref:          repairJobs.ref,
        deviceName:   repairJobs.deviceName,
        brand:        repairJobs.brand,
        model:        repairJobs.model,
        issue:        repairJobs.issue,
        status:       repairJobs.status,
        priority:     repairJobs.priority,
        entryDate:    repairJobs.entryDate,
        eta:          repairJobs.eta,
        totalCost:    repairJobs.totalCost,
        clientName:   users.name,
        clientEmail:  users.email,
      })
      .from(repairJobs)
      .leftJoin(users, eq(repairJobs.clientId, users.id))
      .orderBy(desc(repairJobs.entryDate))
      .limit(100)
  },
  ['repairs', 'all'],
  [CACHE_TAGS.repairs],
  TTL.SHORT,
)

// Repairs for a specific client (portal)
export const getClientRepairs = withCache(
  async (clientId: number) => {
    return db
      .select({
        id:         repairJobs.id,
        ref:        repairJobs.ref,
        deviceName: repairJobs.deviceName,
        brand:      repairJobs.brand,
        model:      repairJobs.model,
        issue:      repairJobs.issue,
        status:     repairJobs.status,
        priority:   repairJobs.priority,
        entryDate:  repairJobs.entryDate,
        eta:        repairJobs.eta,
        totalCost:  repairJobs.totalCost,
      })
      .from(repairJobs)
      .where(eq(repairJobs.clientId, clientId))
      .orderBy(desc(repairJobs.entryDate))
  },
  ['repairs', 'by-client'],
  [CACHE_TAGS.repairs],
  TTL.SHORT,
)
