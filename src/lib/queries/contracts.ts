// ─── Contract queries (cached) ────────────────────────────────────────────
import { db } from '@/lib/db'
import { contracts, companies } from '@/lib/schema'
import { eq, desc, gte } from 'drizzle-orm'
import { withCache, CACHE_TAGS, TTL } from '@/lib/cache'

// All contracts (admin SLA view)
export const getAllContracts = withCache(
  async () => {
    return db
      .select({
        id:           contracts.id,
        ref:          contracts.ref,
        type:         contracts.type,
        slaTarget:    contracts.slaTarget,
        responseTime: contracts.responseTime,
        value:        contracts.value,
        startDate:    contracts.startDate,
        endDate:      contracts.endDate,
        autoRenew:    contracts.autoRenew,
        notes:        contracts.notes,
        companyName:  companies.name,
        companyId:    contracts.companyId,
      })
      .from(contracts)
      .leftJoin(companies, eq(contracts.companyId, companies.id))
      .orderBy(desc(contracts.startDate))
  },
  ['contracts', 'all'],
  [CACHE_TAGS.contracts],
  TTL.LONG,
)

// Active contracts (not expired)
export const getActiveContracts = withCache(
  async () => {
    const now = new Date()
    return db
      .select({
        id:           contracts.id,
        ref:          contracts.ref,
        type:         contracts.type,
        slaTarget:    contracts.slaTarget,
        responseTime: contracts.responseTime,
        value:        contracts.value,
        startDate:    contracts.startDate,
        endDate:      contracts.endDate,
        autoRenew:    contracts.autoRenew,
        companyName:  companies.name,
        companyId:    contracts.companyId,
      })
      .from(contracts)
      .leftJoin(companies, eq(contracts.companyId, companies.id))
      .where(gte(contracts.endDate, now))
      .orderBy(contracts.endDate)
  },
  ['contracts', 'active'],
  [CACHE_TAGS.contracts],
  TTL.LONG,
)

// Contracts for a specific company (client portal)
export const getCompanyContracts = withCache(
  async (companyId: number) => {
    return db
      .select()
      .from(contracts)
      .where(eq(contracts.companyId, companyId))
      .orderBy(desc(contracts.startDate))
  },
  ['contracts', 'by-company'],
  [CACHE_TAGS.contracts],
  TTL.LONG,
)
