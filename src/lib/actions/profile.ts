'use server'
// ─── Profile / User Server Actions ────────────────────────────────────────
import { revalidateTag } from 'next/cache'
import { db } from '@/lib/db'
import { users, companies } from '@/lib/schema'
import { eq, and, ne } from 'drizzle-orm'
import { getSession } from '@/lib/auth-server'
import { hashPassword, verifyPassword } from '@/lib/auth-server'
import { CACHE_TAGS } from '@/lib/cache'
import { blankToNull, normalizeEmail, EMAIL_RE, revalidatePartyViews } from '@/lib/crm'

export async function updateProfile(data: { name: string; phone?: string }) {
  const session = await getSession()
  if (!session) return { error: 'Não autenticado.' }

  try {
    await db
      .update(users)
      .set({ name: data.name.trim(), phone: data.phone, updatedAt: new Date() })
      .where(eq(users.id, session.id))

    revalidateTag(CACHE_TAGS.users)
    return { error: null }
  } catch (err) {
    console.error('[action] updateProfile:', err)
    return { error: 'Erro ao actualizar perfil.' }
  }
}

export async function changePassword(currentPassword: string, newPassword: string) {
  const session = await getSession()
  if (!session) return { error: 'Não autenticado.' }

  if (newPassword.length < 8) return { error: 'A nova senha deve ter pelo menos 8 caracteres.' }

  try {
    const [user] = await db
      .select({ id: users.id, passwordHash: users.passwordHash })
      .from(users)
      .where(eq(users.id, session.id))
      .limit(1)

    if (!user) return { error: 'Utilizador não encontrado.' }

    const valid = await verifyPassword(currentPassword, user.passwordHash)
    if (!valid) return { error: 'Senha atual incorreta.' }

    const newHash = await hashPassword(newPassword)
    await db
      .update(users)
      .set({ passwordHash: newHash, updatedAt: new Date() })
      .where(eq(users.id, session.id))

    return { error: null }
  } catch (err) {
    console.error('[action] changePassword:', err)
    return { error: 'Erro ao alterar senha.' }
  }
}

// Admin: create/update user
export async function adminUpdateUser(userId: number, data: {
  name?: string; email?: string; phone?: string | null; isActive?: boolean; companyId?: number | string | null
}) {
  const session = await getSession()
  if (!session || session.role !== 'admin') return { error: 'Sem permissão.' }

  // Normalização: o login procura o email em minúsculas; '' nunca é gravado.
  const values: Partial<typeof users.$inferInsert> = {}
  if ('name' in data) {
    const name = blankToNull(data.name)
    if (!name) return { error: 'Indique o nome.' }
    values.name = name
  }
  if ('email' in data) {
    const email = normalizeEmail(data.email)
    if (!email || !EMAIL_RE.test(email)) return { error: 'O email indicado não é válido.' }
    values.email = email
  }
  if ('phone' in data)    values.phone = blankToNull(data.phone)
  if ('isActive' in data) values.isActive = !!data.isActive
  if ('companyId' in data) {
    const cId = data.companyId == null || data.companyId === '' ? null : Number(data.companyId)
    if (cId !== null) {
      const [co] = await db.select({ id: companies.id }).from(companies).where(eq(companies.id, cId)).limit(1)
      if (!co) return { error: 'Empresa não encontrada.' }
    }
    values.companyId = cId
  }

  try {
    if (values.email) {
      const [dup] = await db.select({ id: users.id }).from(users)
        .where(and(eq(users.email, values.email), ne(users.id, userId))).limit(1)
      if (dup) return { error: 'Este email já está associado a outro utilizador.' }
    }

    await db
      .update(users)
      .set({ ...values, updatedAt: new Date() })
      .where(eq(users.id, userId))

    // O nome do cliente aparece nas listas de OT, faturas, tickets, etc.
    revalidatePartyViews()
    return { error: null }
  } catch (err) {
    console.error('[action] adminUpdateUser:', err)
    return { error: 'Erro ao actualizar utilizador.' }
  }
}
