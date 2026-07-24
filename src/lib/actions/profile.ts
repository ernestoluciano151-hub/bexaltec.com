'use server'
// ─── Profile / User Server Actions ────────────────────────────────────────
import { revalidateTag } from 'next/cache'
import { db } from '@/lib/db'
import { users } from '@/lib/schema'
import { eq } from 'drizzle-orm'
import { getSession } from '@/lib/auth-server'
import { hashPassword, verifyPassword } from '@/lib/auth-server'
import { CACHE_TAGS } from '@/lib/cache'

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
  name?: string; email?: string; phone?: string; isActive?: boolean; companyId?: number | null
}) {
  const session = await getSession()
  if (!session || session.role !== 'admin') return { error: 'Sem permissão.' }

  try {
    await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, userId))

    revalidateTag(CACHE_TAGS.users)
    return { error: null }
  } catch (err) {
    console.error('[action] adminUpdateUser:', err)
    return { error: 'Erro ao actualizar utilizador.' }
  }
}
