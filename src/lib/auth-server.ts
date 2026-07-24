// ─── Server-side Auth — Bexaltec ──────────────────────────────────────────
// Handles: password hashing, JWT signing/verification, session cookies.
// All functions run server-side only (Node.js / Edge runtime).

import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { db } from './db'
import { users } from './schema'
import { eq } from 'drizzle-orm'
import type { User } from './schema'

// ── Config ────────────────────────────────────────────────────────────────
const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'bexaltec-dev-secret-change-in-production-min-32-chars'
)
const ALGORITHM = 'HS256'
const SESSION_DURATION = 60 * 60 * 24 * 7 // 7 days in seconds

export interface SessionPayload {
  id: number
  name: string
  email: string
  role: 'client' | 'admin' | 'technician'
  companyId: number | null
}

// ── Password helpers (bcrypt via dynamic import for edge compat) ───────────
export async function hashPassword(plain: string): Promise<string> {
  const bcrypt = await import('bcryptjs')
  return bcrypt.hash(plain, 12)
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  const bcrypt = await import('bcryptjs')
  return bcrypt.compare(plain, hash)
}

// ── JWT ───────────────────────────────────────────────────────────────────
export async function signToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: ALGORITHM })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION}s`)
    .sign(SECRET)
}

export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET)
    return payload as unknown as SessionPayload
  } catch {
    return null
  }
}

// ── Session cookie helpers ─────────────────────────────────────────────────
export async function setSessionCookies(user: Pick<User, 'id' | 'name' | 'email' | 'role' | 'companyId'>) {
  const payload: SessionPayload = {
    id:        user.id,
    name:      user.name,
    email:     user.email,
    role:      user.role,
    companyId: user.companyId,
  }

  const token = await signToken(payload)
  const cookieStore = await cookies()

  // HttpOnly prevents JS access (XSS protection)
  cookieStore.set('bx_token', token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge:   SESSION_DURATION,
    path:     '/',
  })

  // Non-httpOnly: readable by middleware for role routing (value is low-sensitivity)
  cookieStore.set('bx_role', user.role, {
    httpOnly: false,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge:   SESSION_DURATION,
    path:     '/',
  })
}

export async function clearSessionCookies() {
  const cookieStore = await cookies()
  cookieStore.delete('bx_token')
  cookieStore.delete('bx_role')
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('bx_token')?.value
  if (!token) return null
  return verifyToken(token)
}

// ── Auth operations ───────────────────────────────────────────────────────
export async function loginWithCredentials(email: string, password: string): Promise<{
  user: SessionPayload | null
  error: string | null
}> {
  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase().trim()))
      .limit(1)

    if (!user || !user.isActive) {
      return { user: null, error: 'Email ou senha inválidos.' }
    }

    const valid = await verifyPassword(password, user.passwordHash)
    if (!valid) {
      return { user: null, error: 'Email ou senha inválidos.' }
    }

    // Update last login
    await db
      .update(users)
      .set({ lastLoginAt: new Date() })
      .where(eq(users.id, user.id))

    await setSessionCookies(user)

    return {
      user: {
        id:        user.id,
        name:      user.name,
        email:     user.email,
        role:      user.role,
        companyId: user.companyId,
      },
      error: null,
    }
  } catch (err) {
    console.error('[auth] login error:', err)
    return { user: null, error: 'Erro interno. Tente novamente.' }
  }
}

export async function registerUser(data: {
  name: string
  email: string
  password: string
  company?: string
  phone?: string
}): Promise<{ user: SessionPayload | null; error: string | null }> {
  try {
    // Check duplicate email
    const [existing] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, data.email.toLowerCase().trim()))
      .limit(1)

    if (existing) {
      return { user: null, error: 'Este email já está registado.' }
    }

    const passwordHash = await hashPassword(data.password)

    const [newUser] = await db
      .insert(users)
      .values({
        name:         data.name.trim(),
        email:        data.email.toLowerCase().trim(),
        passwordHash,
        role:         'client',
        phone:        data.phone,
        companyId:    null,
      })
      .returning()

    await setSessionCookies(newUser)

    return {
      user: {
        id:        newUser.id,
        name:      newUser.name,
        email:     newUser.email,
        role:      newUser.role,
        companyId: newUser.companyId,
      },
      error: null,
    }
  } catch (err) {
    console.error('[auth] register error:', err)
    return { user: null, error: 'Erro ao criar conta. Tente novamente.' }
  }
}
