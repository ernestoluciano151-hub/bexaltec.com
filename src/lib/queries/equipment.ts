// ─── Equipment queries (cached) ───────────────────────────────────────────
import { db } from '@/lib/db'
import { equipment, companies, users } from '@/lib/schema'
import { eq, desc } from 'drizzle-orm'
import { withCache, CACHE_TAGS, TTL } from '@/lib/cache'

// All equipment (admin)
export const getAllEquipment = withCache(
  async () => {
    return db
      .select({
        id:            equipment.id,
        name:          equipment.name,
        serial:        equipment.serial,
        category:      equipment.category,
        brand:         equipment.brand,
        model:         equipment.model,
        location:      equipment.location,
        status:        equipment.status,
        warrantyUntil: equipment.warrantyUntil,
        purchasedAt:   equipment.purchasedAt,
        notes:         equipment.notes,
        clientName:    users.name,
        companyName:   companies.name,
      })
      .from(equipment)
      .leftJoin(users, eq(equipment.clientId, users.id))
      .leftJoin(companies, eq(equipment.companyId, companies.id))
      .orderBy(equipment.name)
      .limit(500)
  },
  ['equipment', 'all'],
  [CACHE_TAGS.equipment],
  TTL.MEDIUM,
)

// Equipment for a specific client (portal)
export const getClientEquipment = withCache(
  async (clientId: number) => {
    return db
      .select({
        id:            equipment.id,
        name:          equipment.name,
        serial:        equipment.serial,
        category:      equipment.category,
        brand:         equipment.brand,
        model:         equipment.model,
        location:      equipment.location,
        status:        equipment.status,
        warrantyUntil: equipment.warrantyUntil,
        purchasedAt:   equipment.purchasedAt,
        notes:         equipment.notes,
      })
      .from(equipment)
      .where(eq(equipment.clientId, clientId))
      .orderBy(equipment.name)
  },
  ['equipment', 'by-client'],
  [CACHE_TAGS.equipment],
  TTL.MEDIUM,
)
