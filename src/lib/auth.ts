'use client'
// ─── Client-side auth helpers ─────────────────────────────────────────────
// Auth state is now stored in HttpOnly cookies (set by /api/auth/login).
// This file provides the client-side interface used by layouts and components.

export type UserRole = 'client' | 'admin' | 'technician'

export interface AuthUser {
  id: number
  name: string
  email: string
  company?: string
  phone?: string
  role: UserRole
  companyId?: number | null
}

// ── Read session from cookie ──────────────────────────────────────────────
// NOTE: bx_token is HttpOnly (cannot be read by JS — intentional).
// bx_role is readable by JS for UI routing only.
// Full session validation happens server-side in middleware + API routes.

export function getUserRole(): UserRole | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(/bx_role=([^;]+)/)
  return match ? (match[1] as UserRole) : null
}

/**
 * Returns minimal user info from the session cookie.
 * For full session data (id, email, companyId), use getSession() on the server.
 */
export function getUser(): AuthUser | null {
  const role = getUserRole()
  if (!role) return null
  // Return a minimal object — layouts use this to decide routing only.
  // Full profile is loaded via API / Server Actions.
  return { id: 0, name: '', email: '', role }
}

// ── Logout ────────────────────────────────────────────────────────────────
export async function logout() {
  try {
    await fetch('/api/auth/logout', { method: 'POST' })
  } catch { /* ignore */ }
  window.location.href = '/login'
}
