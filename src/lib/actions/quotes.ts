'use server'
// ─── Pedidos de Orçamento — Server Actions ────────────────────────────────
// Esta action é pública (o formulário /quote é acessível sem sessão), por isso
// valida e limita tudo o que recebe antes de escrever na base de dados.

import { revalidateTag } from 'next/cache'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { quotes, users, notifications } from '@/lib/schema'
import { getSession } from '@/lib/auth-server'
import { CACHE_TAGS } from '@/lib/cache'

export interface QuoteInput {
  name: string
  email: string
  phone?: string
  company?: string
  province?: string
  services?: string[]
  budget?: string
  deadline?: string
  message?: string
}

export interface QuoteResult {
  ref: string | null
  error: string | null
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

/** Corta e normaliza; devolve undefined para strings vazias. */
function clean(v: unknown, max: number): string | undefined {
  if (typeof v !== 'string') return undefined
  const t = v.trim().slice(0, max)
  return t.length ? t : undefined
}

function generateRef() {
  const year = new Date().getFullYear()
  const rand = Math.floor(Math.random() * 900000) + 100000
  return `BX-ORC-${year}-${rand}`
}

export async function createQuote(input: QuoteInput): Promise<QuoteResult> {
  // ── Validação ───────────────────────────────────────────────────────────
  const name  = clean(input.name, 120)
  const email = clean(input.email, 160)?.toLowerCase()

  if (!name)  return { ref: null, error: 'Indique o seu nome.' }
  if (!email) return { ref: null, error: 'Indique o seu email.' }
  if (!EMAIL_RE.test(email)) return { ref: null, error: 'O email indicado não é válido.' }

  const services = Array.isArray(input.services)
    ? input.services.filter(s => typeof s === 'string').slice(0, 20).join(', ').slice(0, 500)
    : undefined

  // Se o pedido vier de dentro do portal, associamos ao utilizador.
  const session = await getSession()

  try {
    // Referência única — em caso de colisão (improvável) tenta de novo.
    let ref = generateRef()
    for (let attempt = 0; attempt < 3; attempt++) {
      const [taken] = await db.select({ id: quotes.id }).from(quotes).where(eq(quotes.ref, ref)).limit(1)
      if (!taken) break
      ref = generateRef()
    }

    const [quote] = await db
      .insert(quotes)
      .values({
        ref,
        clientId: session?.id ?? null,
        name,
        email,
        phone:    clean(input.phone, 40),
        company:  clean(input.company, 160),
        province: clean(input.province, 60),
        services,
        budget:   clean(input.budget, 60),
        deadline: clean(input.deadline, 60),
        message:  clean(input.message, 4000),
        status:   'new',
      })
      .returning({ ref: quotes.ref })

    // Avisar os administradores dentro do portal.
    try {
      const admins = await db.select({ id: users.id }).from(users).where(eq(users.role, 'admin'))
      if (admins.length) {
        await db.insert(notifications).values(
          admins.map(a => ({
            userId: a.id,
            title:  `Novo pedido de orçamento — ${quote.ref}`,
            body:   `${name}${input.company ? ` (${clean(input.company, 160)})` : ''}${services ? ` · ${services}` : ''}`,
            type:   'quote',
            link:   '/admin/quotes',
          })),
        )
        admins.forEach(a => revalidateTag(`notifications-${a.id}` as never))
      }
    } catch (notifyErr) {
      // Uma falha a notificar não pode perder o pedido do cliente.
      console.error('[action] createQuote → notificação admin:', notifyErr)
    }

    revalidateTag(CACHE_TAGS.quotes)
    return { ref: quote.ref, error: null }
  } catch (err) {
    console.error('[action] createQuote:', err)
    return { ref: null, error: 'Não foi possível registar o pedido. Tente novamente ou contacte-nos por WhatsApp.' }
  }
}

/** Admin: alterar o estado de um orçamento. */
export async function updateQuoteStatus(
  id: number,
  status: 'new' | 'in_review' | 'sent' | 'accepted' | 'rejected' | 'expired',
) {
  const session = await getSession()
  if (!session || session.role !== 'admin') return { error: 'Sem permissão.' }

  try {
    await db.update(quotes).set({ status, updatedAt: new Date() }).where(eq(quotes.id, id))
    revalidateTag(CACHE_TAGS.quotes)
    return { error: null }
  } catch (err) {
    console.error('[action] updateQuoteStatus:', err)
    return { error: 'Erro ao actualizar o orçamento.' }
  }
}
