// ─── Client / Company queries (cached) ───────────────────────────────────
import { db } from '@/lib/db'
import { companies, users, contracts, invoices } from '@/lib/schema'
import { eq, desc, count, sql } from 'drizzle-orm'
import { withCache, CACHE_TAGS, TTL } from '@/lib/cache'

// List all companies (admin CRM)
export const getAllCompanies = withCache(
  async () => {
    return db
      .select({
        id:           companies.id,
        name:         companies.name,
        nif:          companies.nif,
        sector:       companies.sector,
        phone:        companies.phone,
        email:        companies.email,
        contractType: companies.contractType,
        revenue:      companies.revenue,
        isActive:     companies.isActive,
        createdAt:    companies.createdAt,
      })
      .from(companies)
      .where(eq(companies.isActive, true))
      .orderBy(companies.name)
  },
  ['companies', 'all'],
  [CACHE_TAGS.companies],
  TTL.LONG,
)

// Company with full detail (admin)
export const getCompanyById = withCache(
  async (id: number) => {
    const [company] = await db
      .select()
      .from(companies)
      .where(eq(companies.id, id))
      .limit(1)
    if (!company) return null

    const [userCount] = await db
      .select({ count: count() })
      .from(users)
      .where(eq(users.companyId, id))

    const [contractRows] = await db
      .select({ count: count() })
      .from(contracts)
      .where(eq(contracts.companyId, id))

    return { ...company, userCount: Number(userCount?.count ?? 0), contractCount: Number(contractRows?.count ?? 0) }
  },
  ['company', 'detail'],
  [CACHE_TAGS.companies],
  TTL.LONG,
)

// All clients (users with role=client)
export const getAllClients = withCache(
  async () => {
    return db
      .select({
        id:          users.id,
        name:        users.name,
        email:       users.email,
        phone:       users.phone,
        companyId:   users.companyId,
        companyName: companies.name,
        isActive:    users.isActive,
        lastLoginAt: users.lastLoginAt,
        createdAt:   users.createdAt,
      })
      .from(users)
      .leftJoin(companies, eq(users.companyId, companies.id))
      .where(eq(users.role, 'client'))
      .orderBy(desc(users.createdAt))
  },
  ['clients', 'all'],
  [CACHE_TAGS.users],
  TTL.MEDIUM,
)
