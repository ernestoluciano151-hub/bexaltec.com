'use client'
// ─── Auth helpers (localStorage mock) ────────────────────────────────────────
// TODO: Replace with Supabase auth:
//   import { createClient } from '@/lib/supabase'
//   const supabase = createClient()
//   await supabase.auth.signInWithPassword({ email, password })

import { demoUser, demoAdmin } from './mock-data'

export type UserRole = 'client' | 'admin'

export interface AuthUser {
  id: string
  name: string
  email: string
  company?: string
  phone?: string
  role: UserRole
}

const USER_KEY = 'bx_user'

export function getUser(): AuthUser | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? (JSON.parse(raw) as AuthUser) : null
  } catch {
    return null
  }
}

export function setUser(user: AuthUser) {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearUser() {
  localStorage.removeItem(USER_KEY)
}

export function loginDemo() {
  setUser(demoUser)
}

export function loginAdmin() {
  setUser(demoAdmin)
}

export function logout() {
  clearUser()
  window.location.href = '/login'
}

// Simulated login — replace with Supabase
export async function login(email: string, password: string): Promise<{ user: AuthUser | null; error: string | null }> {
  await new Promise(r => setTimeout(r, 800)) // simulate network
  if (email === 'admin@bexaltec.ao' && password === 'admin123') {
    setUser(demoAdmin)
    return { user: demoAdmin, error: null }
  }
  if (email === demoUser.email && password === 'demo123') {
    setUser(demoUser)
    return { user: demoUser, error: null }
  }
  // Accept any email/password for demo purposes
  if (email && password.length >= 6) {
    const user: AuthUser = { id: 'u_' + Date.now(), name: email.split('@')[0], email, role: 'client' }
    setUser(user)
    return { user, error: null }
  }
  return { user: null, error: 'Email ou senha inválidos.' }
}

export async function register(data: {
  name: string; email: string; password: string; company: string; phone: string
}): Promise<{ user: AuthUser | null; error: string | null }> {
  await new Promise(r => setTimeout(r, 1000))
  const user: AuthUser = {
    id: 'u_' + Date.now(), name: data.name, email: data.email,
    company: data.company, phone: data.phone, role: 'client',
  }
  setUser(user)
  return { user, error: null }
}
