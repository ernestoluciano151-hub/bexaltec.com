'use server'
// ─── Admin Server Actions ─────────────────────────────────────────────────
import { revalidateTag } from 'next/cache'
import { db } from '@/lib/db'
import { companies, workOrders, invoices, notifications } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import { getSession } from '@/lib/auth-server'
import { CACHE_TAGS } from '@/lib/cache'

function generateRef(prefix: string) {
  return `${prefix}-${Date.now().toString().slice(-6)}`
}

// ── Companies ─────────────────────────────────────────────────────────────
export async function createCompany(data: {
  name: string; nif?: string; sector?: string; address?: string; city?: string; phone?: string; email?: string; website?: string; contractType?: 'basic' | 'business' | 'enterprise'
}) {
  const session = await getSession()
  if (!session || session.role !== 'admin') return { error: 'Sem permissão.' }

  try {
    const [company] = await db.insert(companies).values(data).returning()
    revalidateTag(CACHE_TAGS.companies)
    return { company, error: null }
  } catch (err) {
    console.error('[action] createCompany:', err)
    return { company: null, error: 'Erro ao criar empresa.' }
  }
}

export async function updateCompany(id: number, data: Partial<typeof companies.$inferInsert>) {
  const session = await getSession()
  if (!session || session.role !== 'admin') return { error: 'Sem permissão.' }

  try {
    await db.update(companies).set({ ...data, updatedAt: new Date() }).where(eq(companies.id, id))
    revalidateTag(CACHE_TAGS.companies)
    return { error: null }
  } catch (err) {
    console.error('[action] updateCompany:', err)
    return { error: 'Erro ao actualizar empresa.' }
  }
}

// ── Work Orders ───────────────────────────────────────────────────────────
export async function createWorkOrder(data: {
  title: string; description?: string; priority?: 'low' | 'medium' | 'high' | 'critical'; clientId?: number; companyId?: number; technicianId?: number; value?: number; scheduledAt?: Date
}) {
  const session = await getSession()
  if (!session || session.role !== 'admin') return { error: 'Sem permissão.' }

  try {
    const [wo] = await db
      .insert(workOrders)
      .values({ ref: generateRef('BX-WO'), status: 'pending', priority: 'medium', ...data })
      .returning()

    revalidateTag(CACHE_TAGS.workOrders)
    return { workOrder: wo, error: null }
  } catch (err) {
    console.error('[action] createWorkOrder:', err)
    return { workOrder: null, error: 'Erro ao criar ordem de trabalho.' }
  }
}

export async function updateWorkOrderStatus(
  id: number,
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled',
) {
  const session = await getSession()
  if (!session || session.role === 'client') return { error: 'Sem permissão.' }

  try {
    await db
      .update(workOrders)
      .set({ status, updatedAt: new Date(), completedAt: status === 'completed' ? new Date() : undefined })
      .where(eq(workOrders.id, id))

    revalidateTag(CACHE_TAGS.workOrders)
    revalidateTag(CACHE_TAGS.dashboard)
    return { error: null }
  } catch (err) {
    console.error('[action] updateWorkOrderStatus:', err)
    return { error: 'Erro ao actualizar ordem de trabalho.' }
  }
}

// ── Invoices ──────────────────────────────────────────────────────────────
export async function createInvoice(data: {
  clientId?: number; companyId?: number; amount: number; tax?: number; total: number; dueDate: Date; notes?: string; workOrderId?: number; repairJobId?: number
}) {
  const session = await getSession()
  if (!session || session.role !== 'admin') return { error: 'Sem permissão.' }

  try {
    const [invoice] = await db
      .insert(invoices)
      .values({ ref: generateRef('FT'), status: 'draft', currency: 'AOA', ...data })
      .returning()

    revalidateTag(CACHE_TAGS.invoices)
    revalidateTag(CACHE_TAGS.dashboard)
    return { invoice, error: null }
  } catch (err) {
    console.error('[action] createInvoice:', err)
    return { invoice: null, error: 'Erro ao criar fatura.' }
  }
}

export async function updateInvoiceStatus(
  id: number,
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled',
) {
  const session = await getSession()
  if (!session || session.role !== 'admin') return { error: 'Sem permissão.' }

  try {
    await db
      .update(invoices)
      .set({ status, updatedAt: new Date(), paidAt: status === 'paid' ? new Date() : undefined })
      .where(eq(invoices.id, id))

    revalidateTag(CACHE_TAGS.invoices)
    revalidateTag(CACHE_TAGS.dashboard)
    return { error: null }
  } catch (err) {
    console.error('[action] updateInvoiceStatus:', err)
    return { error: 'Erro ao actualizar fatura.' }
  }
}

// ── Notifications ─────────────────────────────────────────────────────────
export async function sendNotification(userId: number, data: { title: string; body?: string; type?: string; link?: string }) {
  try {
    await db.insert(notifications).values({ userId, type: 'info', ...data })
    revalidateTag(`notifications-${userId}` as any)
    return { error: null }
  } catch (err) {
    console.error('[action] sendNotification:', err)
    return { error: 'Erro ao enviar notificação.' }
  }
}

export async function markNotificationRead(notifId: number) {
  const session = await getSession()
  if (!session) return { error: 'Não autenticado.' }

  try {
    await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, notifId))

    revalidateTag(`notifications-${session.id}` as any)
    return { error: null }
  } catch (err) {
    return { error: 'Erro ao marcar notificação.' }
  }
}
