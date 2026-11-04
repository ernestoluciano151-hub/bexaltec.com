// ─── Auxiliares partilhados do CRM — Bexaltec ──────────────────────────────
// Numeração sequencial, normalização de dados e limite de tentativas.
// Só corre no servidor (usa a base de dados e os cabeçalhos do pedido).
// Ver AUDITORIA_CRM_2026-11.md, secção 3.3, e a migração 0003.

import { headers } from 'next/headers'
import { revalidateTag } from 'next/cache'
import { CACHE_TAGS } from '@/lib/cache'
import { sql, and, eq, gte, lt } from 'drizzle-orm'
import { db } from '@/lib/db'
import { refSequences, rateEvents } from '@/lib/schema'

// ── Numeração ─────────────────────────────────────────────────────────────
/**
 * Próxima referência da série, por ano: nextRef('BX-WO') → 'BX-WO-2026-0001'.
 * O incremento é uma única instrução (INSERT … ON CONFLICT … RETURNING),
 * por isso dois pedidos simultâneos nunca recebem o mesmo número.
 * Todas as colunas ref têm 20 caracteres: prefixo + ano + 4 dígitos cabe.
 */
export async function nextRef(prefix: string, digits = 4): Promise<string> {
  const year = new Date().getFullYear()
  const key = `${prefix}-${year}`
  const [row] = await db
    .insert(refSequences)
    .values({ key, value: 1 })
    .onConflictDoUpdate({
      target: refSequences.key,
      set: { value: sql`${refSequences.value} + 1`, updatedAt: new Date() },
    })
    .returning({ value: refSequences.value })
  return `${key}-${String(row.value).padStart(digits, '0')}`
}

// ── Caches ────────────────────────────────────────────────────────────────
/**
 * O nome de uma empresa ou de um cliente aparece, por junção, nas listas de
 * OT, faturas, tickets, reparações, equipamento e contratos. Cada uma tem a
 * sua cache; ao mudar a empresa ou o cliente limpam-se todas.
 */
export function revalidatePartyViews() {
  for (const tag of [
    CACHE_TAGS.users, CACHE_TAGS.companies, CACHE_TAGS.tickets, CACHE_TAGS.repairs,
    CACHE_TAGS.equipment, CACHE_TAGS.workOrders, CACHE_TAGS.contracts,
    CACHE_TAGS.invoices, CACHE_TAGS.dashboard,
  ]) revalidateTag(tag)
}

// ── Normalização ──────────────────────────────────────────────────────────
/** Corta espaços; string vazia → null (para não ocupar restrições UNIQUE). */
export function blankToNull(v: unknown): string | null {
  if (typeof v !== 'string') return null
  const t = v.trim()
  return t.length ? t : null
}

/** NIF só com algarismos e letras, em maiúsculas; vazio → null. */
export function normalizeNif(v: unknown): string | null {
  const t = blankToNull(v)
  if (!t) return null
  const n = t.replace(/[^0-9A-Za-z]/g, '').toUpperCase()
  return n.length ? n : null
}

/** Email em minúsculas e sem espaços; vazio → null. */
export function normalizeEmail(v: unknown): string | null {
  const t = blankToNull(v)
  return t ? t.toLowerCase() : null
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

// ── Limite de tentativas ──────────────────────────────────────────────────
/** IP do cliente (na Vercel, x-forwarded-for é definido pela plataforma). */
export async function clientIp(): Promise<string> {
  const h = await headers()
  const fwd = h.get('x-forwarded-for')
  return (fwd?.split(',')[0] ?? h.get('x-real-ip') ?? 'unknown').trim().slice(0, 64) || 'unknown'
}

/** Quantas tentativas houve nesta janela (minutos) para este bucket/chave. */
export async function countRecent(bucket: string, key: string, windowMin: number): Promise<number> {
  const since = new Date(Date.now() - windowMin * 60_000)
  const [row] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(rateEvents)
    .where(and(eq(rateEvents.bucket, bucket), eq(rateEvents.key, key.slice(0, 200)), gte(rateEvents.createdAt, since)))
  return row?.n ?? 0
}

/** Regista uma tentativa. De vez em quando limpa registos com mais de 1 dia. */
export async function recordEvent(bucket: string, key: string): Promise<void> {
  await db.insert(rateEvents).values({ bucket, key: key.slice(0, 200) })
  if (Math.random() < 0.02) {
    await db.delete(rateEvents).where(lt(rateEvents.createdAt, new Date(Date.now() - 86_400_000)))
  }
}

/**
 * Verifica e regista numa só chamada: devolve true se ainda está dentro do limite.
 * Se a tabela não existir (migração por aplicar) não bloqueia — regista o erro.
 */
export async function withinLimit(bucket: string, key: string, max: number, windowMin: number): Promise<boolean> {
  try {
    if ((await countRecent(bucket, key, windowMin)) >= max) return false
    await recordEvent(bucket, key)
    return true
  } catch (err) {
    console.error(`[rate] ${bucket}:`, err)
    return true
  }
}
