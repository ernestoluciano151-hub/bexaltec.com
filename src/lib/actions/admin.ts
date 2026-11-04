'use server'
// ─── Admin Server Actions ─────────────────────────────────────────────────
import { revalidateTag } from 'next/cache'
import { db } from '@/lib/db'
import { companies, users, workOrders, invoices, notifications } from '@/lib/schema'
import { eq, and, ne, sql } from 'drizzle-orm'
import { getSession } from '@/lib/auth-server'
import { CACHE_TAGS } from '@/lib/cache'
import { nextRef, blankToNull, normalizeNif, normalizeEmail, revalidatePartyViews } from '@/lib/crm'

type CompanyInput = {
  name?: string; nif?: string | null; sector?: string | null; address?: string | null; city?: string | null
  phone?: string | null; email?: string | null; website?: string | null; notes?: string | null
  contractType?: 'basic' | 'business' | 'enterprise' | '' | null; isActive?: boolean
}

/** Normaliza só os campos presentes: '' → null, NIF limpo, email em minúsculas. */
function normalizeCompany(data: CompanyInput) {
  const out: Partial<typeof companies.$inferInsert> = {}
  if ('name' in data)         out.name = blankToNull(data.name) ?? undefined
  if ('nif' in data)          out.nif = normalizeNif(data.nif)
  if ('email' in data)        out.email = normalizeEmail(data.email)
  for (const k of ['sector', 'address', 'city', 'phone', 'website', 'notes'] as const) {
    if (k in data) out[k] = blankToNull(data[k])
  }
  if ('contractType' in data) out.contractType = data.contractType || null
  if ('isActive' in data)     out.isActive = data.isActive
  return out
}

/** Devolve a mensagem de conflito, se já existir outra empresa com o mesmo NIF ou nome. */
async function companyConflict(v: { name?: string; nif?: string | null }, exceptId?: number) {
  if (v.nif) {
    const [dup] = await db.select({ id: companies.id, name: companies.name }).from(companies)
      .where(and(eq(companies.nif, v.nif), exceptId ? ne(companies.id, exceptId) : undefined)).limit(1)
    if (dup) return `Já existe uma empresa com o NIF ${v.nif}: ${dup.name}.`
  }
  if (v.name) {
    const [dup] = await db.select({ id: companies.id }).from(companies)
      .where(and(sql`lower(trim(${companies.name})) = ${v.name.toLowerCase()}`, exceptId ? ne(companies.id, exceptId) : undefined)).limit(1)
    if (dup) return `Já existe uma empresa com o nome "${v.name}".`
  }
  return null
}

// ── Companies ─────────────────────────────────────────────────────────────
export async function createCompany(data: CompanyInput & { name: string }) {
  const session = await getSession()
  if (!session || session.role !== 'admin') return { error: 'Sem permissão.' }

  const values = normalizeCompany(data)
  if (!values.name) return { company: null, error: 'Indique o nome da empresa.' }

  try {
    const conflict = await companyConflict(values)
    if (conflict) return { company: null, error: conflict }

    const [company] = await db.insert(companies).values({ ...values, name: values.name }).returning()
    revalidateTag(CACHE_TAGS.companies)
    return { company, error: null }
  } catch (err) {
    console.error('[action] createCompany:', err)
    return { company: null, error: 'Erro ao criar empresa.' }
  }
}

export async function updateCompany(id: number, data: CompanyInput) {
  const session = await getSession()
  if (!session || session.role !== 'admin') return { error: 'Sem permissão.' }

  const values = normalizeCompany(data)
  if ('name' in data && !values.name) return { error: 'Indique o nome da empresa.' }

  try {
    const conflict = await companyConflict(values, id)
    if (conflict) return { error: conflict }

    await db.update(companies).set({ ...values, updatedAt: new Date() }).where(eq(companies.id, id))
    // O nome da empresa aparece nas listas de OT, faturas, contratos, etc.
    revalidatePartyViews()
    return { error: null }
  } catch (err) {
    console.error('[action] updateCompany:', err)
    return { error: 'Erro ao actualizar empresa.' }
  }
}

// ── Partes de uma OT ou fatura ────────────────────────────────────────────
/**
 * Confirma que o cliente existe e determina a empresa: a indicada ou, na falta,
 * a do cliente. Recusa registos sem empresa e empresas que não são as do cliente.
 */
async function resolveParties(clientId: unknown, companyId: unknown) {
  const cId = Number(clientId)
  if (!Number.isInteger(cId) || cId <= 0) return { error: 'Escolha o cliente.' as const }

  const [client] = await db.select({ id: users.id, role: users.role, companyId: users.companyId })
    .from(users).where(eq(users.id, cId)).limit(1)
  if (!client || client.role !== 'client') return { error: 'Cliente não encontrado.' as const }

  const coId = companyId != null && companyId !== '' ? Number(companyId) : client.companyId
  if (!coId) return { error: 'O cliente não tem empresa associada. Associe-a no ecrã Clientes.' as const }
  if (client.companyId && client.companyId !== coId) {
    return { error: 'A empresa escolhida não é a empresa deste cliente.' as const }
  }
  const [company] = await db.select({ id: companies.id }).from(companies).where(eq(companies.id, coId)).limit(1)
  if (!company) return { error: 'Empresa não encontrada.' as const }

  return { clientId: cId, companyId: coId, error: null }
}

// ── Work Orders ───────────────────────────────────────────────────────────
export async function createWorkOrder(data: {
  title: string; description?: string; priority?: 'low' | 'medium' | 'high' | 'critical'
  clientId: number; companyId?: number | null; technicianId?: number | null
  value?: number | string; scheduledAt?: Date
}) {
  const session = await getSession()
  if (!session || session.role !== 'admin') return { error: 'Sem permissão.' }

  const title = blankToNull(data.title)
  if (!title) return { workOrder: null, error: 'Indique o título.' }

  try {
    const parties = await resolveParties(data.clientId, data.companyId)
    if (parties.error) return { workOrder: null, error: parties.error }

    let technicianId: number | null = null
    if (data.technicianId) {
      const [tech] = await db.select({ role: users.role }).from(users).where(eq(users.id, Number(data.technicianId))).limit(1)
      if (!tech || (tech.role !== 'technician' && tech.role !== 'admin')) {
        return { workOrder: null, error: 'Técnico não encontrado.' }
      }
      technicianId = Number(data.technicianId)
    }

    const [wo] = await db
      .insert(workOrders)
      .values({
        ref:          await nextRef('BX-WO'),
        status:       'pending',
        title,
        description:  blankToNull(data.description),
        priority:     data.priority ?? 'medium',
        clientId:     parties.clientId,
        companyId:    parties.companyId,
        technicianId,
        value:        data.value != null && data.value !== '' ? String(data.value) : null,
        scheduledAt:  data.scheduledAt ?? null,
      })
      .returning()

    revalidateTag(CACHE_TAGS.workOrders)
    revalidateTag(CACHE_TAGS.dashboard)
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
  clientId: number; companyId?: number | null; workOrderId?: number | null; repairJobId?: number | null
  amount: number | string; tax?: number | string; total: number | string; dueDate: Date; notes?: string
}) {
  const session = await getSession()
  if (!session || session.role !== 'admin') return { error: 'Sem permissão.' }

  const amount = Number(data.amount)
  const total  = Number(data.total)
  if (!Number.isFinite(amount) || amount <= 0) return { invoice: null, error: 'Indique o valor base.' }
  if (!Number.isFinite(total) || total <= 0)   return { invoice: null, error: 'Indique o total.' }

  try {
    const parties = await resolveParties(data.clientId, data.companyId)
    if (parties.error) return { invoice: null, error: parties.error }

    // A OT associada tem de ser do mesmo cliente e da mesma empresa.
    let workOrderId: number | null = null
    if (data.workOrderId) {
      const [wo] = await db.select({ clientId: workOrders.clientId, companyId: workOrders.companyId })
        .from(workOrders).where(eq(workOrders.id, Number(data.workOrderId))).limit(1)
      if (!wo) return { invoice: null, error: 'Ordem de trabalho não encontrada.' }
      if ((wo.clientId && wo.clientId !== parties.clientId) || (wo.companyId && wo.companyId !== parties.companyId)) {
        return { invoice: null, error: 'A ordem de trabalho escolhida pertence a outro cliente.' }
      }
      workOrderId = Number(data.workOrderId)
    }

    const [invoice] = await db
      .insert(invoices)
      .values({
        ref:         await nextRef('FT', 5),
        status:      'draft',
        currency:    'AOA',
        clientId:    parties.clientId,
        companyId:   parties.companyId,
        workOrderId,
        repairJobId: data.repairJobId ?? null,
        amount:      String(amount),
        tax:         data.tax != null && data.tax !== '' ? String(data.tax) : '0',
        total:       String(total),
        dueDate:     data.dueDate,
        notes:       blankToNull(data.notes),
      })
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
  // Toda a Server Action é exposta como endpoint HTTP público. Sem esta
  // verificação qualquer visitante poderia enviar notificações (com título,
  // texto e link arbitrários) a qualquer utilizador do portal.
  const session = await getSession()
  if (!session || session.role !== 'admin') return { error: 'Sem permissão.' }

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
    // Verificação de propriedade: só o destinatário marca a sua notificação como lida.
    // Sem o filtro por userId, qualquer utilizador autenticado podia percorrer os ids
    // e marcar como lidas as notificações dos administradores.
    const res = await db
      .update(notifications)
      .set({ isRead: true })
      .where(and(eq(notifications.id, notifId), eq(notifications.userId, session.id)))
      .returning({ id: notifications.id })

    if (res.length === 0) return { error: 'Notificação não encontrada.' }

    revalidateTag(`notifications-${session.id}` as any)
    return { error: null }
  } catch (err) {
    return { error: 'Erro ao marcar notificação.' }
  }
}
