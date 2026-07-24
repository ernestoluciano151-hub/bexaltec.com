// ─── User / Profile queries ────────────────────────────────────────────────
import { db } from '@/lib/db'
import { users, companies } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import { withCache, CACHE_TAGS, TTL } from '@/lib/cache'

// Get full user profile (no password_hash)
export const getUserProfile = withCache(
  async (userId: number) => {
    const [user] = await db
      .select({
        id:          users.id,
        name:        users.name,
        email:       users.email,
        phone:       users.phone,
        avatarUrl:   users.avatarUrl,
        role:        users.role,
        isActive:    users.isActive,
        lastLoginAt: users.lastLoginAt,
        createdAt:   users.createdAt,
        companyId:   users.companyId,
        companyName: companies.name,
        companyNif:  companies.nif,
      })
      .from(users)
      .leftJoin(companies, eq(users.companyId, companies.id))
      .where(eq(users.id, userId))
      .limit(1)
    return user ?? null
  },
  ['user', 'profile'],
  [CACHE_TAGS.users],
  TTL.MEDIUM,
)

// All users (admin)
export const getAllUsers = withCache(
  async () => {
    return db
      .select({
        id:          users.id,
        name:        users.name,
        email:       users.email,
        phone:       users.phone,
        role:        users.role,
        isActive:    users.isActive,
        lastLoginAt: users.lastLoginAt,
        createdAt:   users.createdAt,
        companyId:   users.companyId,
        companyName: companies.name,
      })
      .from(users)
      .leftJoin(companies, eq(users.companyId, companies.id))
      .orderBy(users.name)
  },
  ['users', 'all'],
  [CACHE_TAGS.users],
  TTL.MEDIUM,
)

// All technicians (for assignment dropdowns)
export const getAllTechnicians = withCache(
  async () => {
    return db
      .select({ id: users.id, name: users.name, email: users.email })
      .from(users)
      .where(eq(users.role, 'technician'))
      .orderBy(users.name)
  },
  ['technicians', 'all'],
  [CACHE_TAGS.users],
  TTL.LONG,
)
