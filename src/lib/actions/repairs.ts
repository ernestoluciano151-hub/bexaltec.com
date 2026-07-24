'use server'
// ─── Repair Job Server Actions ────────────────────────────────────────────
import { revalidateTag } from 'next/cache'
import { db } from '@/lib/db'
import { repairJobs } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import { getSession } from '@/lib/auth-server'
import { CACHE_TAGS } from '@/lib/cache'

function generateRef() {
  return `BX-REP-${Date.now().toString().slice(-6)}`
}

export async function createRepair(data: {
  deviceName: string
  brand?: string
  model?: string
  serial?: string
  issue: string
  priority?: 'low' | 'medium' | 'high' | 'critical'
}) {
  const session = await getSession()
  if (!session) return { error: 'Não autenticado.' }

  try {
    const [repair] = await db
      .insert(repairJobs)
      .values({
        ref:        generateRef(),
        deviceName: data.deviceName,
        brand:      data.brand,
        model:      data.model,
        serial:     data.serial,
        issue:      data.issue,
        priority:   data.priority ?? 'medium',
        status:     'intake',
        clientId:   session.id,
        companyId:  session.companyId ?? undefined,
      })
      .returning()

    revalidateTag(CACHE_TAGS.repairs)
    revalidateTag(CACHE_TAGS.dashboard)
    return { repair, error: null }
  } catch (err) {
    console.error('[action] createRepair:', err)
    return { repair: null, error: 'Erro ao criar reparação.' }
  }
}

export async function updateRepairStatus(
  repairId: number,
  status: 'intake' | 'diagnosis' | 'waiting_parts' | 'in_repair' | 'testing' | 'ready' | 'delivered' | 'cancelled',
  extra?: { diagnosis?: string; resolution?: string; laborCost?: number | string; partsCost?: number | string; totalCost?: number | string; eta?: Date },
) {
  const session = await getSession()
  if (!session || session.role === 'client') return { error: 'Sem permissão.' }

  const { laborCost, partsCost, totalCost, ...extraRest } = extra ?? {}
  try {
    await db
      .update(repairJobs)
      .set({
        status,
        updatedAt:   new Date(),
        deliveredAt: status === 'delivered' ? new Date() : undefined,
        ...extraRest,
        laborCost:   laborCost != null ? String(laborCost) : undefined,
        partsCost:   partsCost != null ? String(partsCost) : undefined,
        totalCost:   totalCost != null ? String(totalCost) : undefined,
      })
      .where(eq(repairJobs.id, repairId))

    revalidateTag(CACHE_TAGS.repairs)
    revalidateTag(CACHE_TAGS.dashboard)
    return { error: null }
  } catch (err) {
    console.error('[action] updateRepairStatus:', err)
    return { error: 'Erro ao actualizar reparação.' }
  }
}
