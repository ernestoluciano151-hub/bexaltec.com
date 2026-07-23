'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { BexaltecLogo } from '@/components/Logo'
import { getUser, logout } from '@/lib/auth'
import type { AuthUser } from '@/lib/auth'

const navItems = [
  { href: '/dashboard', label: 'Visão Geral', ico: '📊' },
  { href: '/dashboard/tickets', label: 'Tickets', ico: '🎫' },
  { href: '/dashboard/services', label: 'Os Meus Serviços', ico: '⚙️' },
  { href: '/dashboard/billing', label: 'Faturação', ico: '🧾' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const path = usePathname()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const u = getUser()
    if (!u) { router.push('/login'); return }
    if (u.role === 'admin') { router.push('/admin'); return }
    setUser(u)
  }, [router])

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--navy)' }}>
      <div style={{ color: 'var(--green)', fontSize: 14 }}>A carregar...</div>
    </div>
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--navy3)' }}>
      {/* Sidebar */}
      <aside style={{
        width: 240, background: 'var(--navy2)', borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, bottom: 0, left: 0, zIndex: 30,
        transform: sidebarOpen ? 'translateX(0)' : undefined,
      }} className="hidden md:flex">
        <div style={{ padding: '1.25rem 1rem', borderBottom: '1px solid var(--border)' }}>
          <Link href="/"><BexaltecLogo size={28} /></Link>
        </div>

        {/* User info */}
        <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(0,230,118,0.15)', border: '1px solid rgba(0,230,118,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: 'var(--green)', marginBottom: '0.5rem' }}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--silver2)' }}>{user.name}</div>
          <div style={{ fontSize: 11, color: 'var(--slate)' }}>{user.company || user.email}</div>
        </div>

        <nav style={{ flex: 1, padding: '0.75rem 0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {navItems.map(item => {
            const active = path === item.href
            return (
              <Link key={item.href} href={item.href}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.6rem 0.85rem', borderRadius: 8, fontSize: 13,
                  color: active ? 'var(--green)' : 'var(--text2)',
                  background: active ? 'rgba(0,230,118,0.08)' : 'transparent',
                  border: active ? '1px solid rgba(0,230,118,0.2)' : '1px solid transparent',
                  textDecoration: 'none', transition: 'all 0.2s',
                }}>
                <span>{item.ico}</span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div style={{ padding: '0.75rem 0.5rem', borderTop: '1px solid var(--border)' }}>
          <button onClick={() => logout()}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.85rem', borderRadius: 8, fontSize: 13, color: 'var(--slate)', cursor: 'pointer', background: 'none', border: 'none', width: '100%', fontFamily: 'inherit' }}>
            <span>🚪</span><span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, marginLeft: 240, minHeight: '100vh', background: 'var(--navy3)' }} className="md:ml-60">
        {/* Top bar */}
        <div style={{ height: 56, background: 'rgba(10,22,40,0.95)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', padding: '0 1.5rem', gap: '1rem', position: 'sticky', top: 0, zIndex: 20 }}>
          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 12, color: 'var(--text2)' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', animation: 'pulse 2s infinite' }} />
            Portal Ativo
          </div>
          <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(0,230,118,0.15)', border: '1px solid rgba(0,230,118,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: 'var(--green)' }}>
            {user.name.charAt(0)}
          </div>
        </div>
        <div style={{ padding: '2rem', maxWidth: 1100, margin: '0 auto' }}>
          {children}
        </div>
      </main>
    </div>
  )
}
