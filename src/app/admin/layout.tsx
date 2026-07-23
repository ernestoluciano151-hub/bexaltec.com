'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { BexaltecLogo } from '@/components/Logo'
import { getUser, logout } from '@/lib/auth'
import type { AuthUser } from '@/lib/auth'

const navItems = [
  { href: '/admin', label: 'Dashboard', ico: '📊' },
  { href: '/admin/clients', label: 'Clientes', ico: '👥' },
  { href: '/admin/tickets', label: 'Tickets', ico: '🎫' },
  { href: '/admin/services', label: 'Serviços', ico: '⚙️' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const path = usePathname()
  const [user, setUser] = useState<AuthUser | null>(null)

  useEffect(() => {
    const u = getUser()
    if (!u) { router.push('/login'); return }
    if (u.role !== 'admin') { router.push('/dashboard'); return }
    setUser(u)
  }, [router])

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--navy)' }}>
      <div style={{ color: 'var(--green)', fontSize: 14 }}>A carregar...</div>
    </div>
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--navy3)' }}>
      <aside style={{ width: 240, background: 'var(--navy2)', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, bottom: 0, left: 0, zIndex: 30 }}
        className="hidden md:flex">
        <div style={{ padding: '1.25rem 1rem', borderBottom: '1px solid var(--border)' }}>
          <Link href="/"><BexaltecLogo size={28} /></Link>
          <div style={{ marginTop: '0.5rem', fontSize: 10, letterSpacing: 2, color: 'var(--forest)', textTransform: 'uppercase', fontWeight: 700 }}>Área Administrativa</div>
        </div>

        <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(0,230,118,0.2)', border: '2px solid rgba(0,230,118,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: 'var(--green)', flexShrink: 0 }}>
              {user.name.charAt(0)}
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--silver2)' }}>{user.name}</div>
              <div style={{ fontSize: 10, color: 'var(--forest)' }}>Administrador</div>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: '0.75rem 0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {navItems.map(item => {
            const active = path === item.href
            return (
              <Link key={item.href} href={item.href}
                style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.85rem', borderRadius: 8, fontSize: 13, color: active ? 'var(--green)' : 'var(--text2)', background: active ? 'rgba(0,230,118,0.08)' : 'transparent', border: active ? '1px solid rgba(0,230,118,0.2)' : '1px solid transparent', textDecoration: 'none', transition: 'all 0.2s' }}>
                <span>{item.ico}</span>
                <span>{item.label}</span>
              </Link>
            )
          })}

          <div style={{ height: 1, background: 'var(--border)', margin: '0.5rem 0.5rem' }} />

          <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.85rem', borderRadius: 8, fontSize: 12, color: 'var(--slate)', textDecoration: 'none' }}>
            <span>🧑‍💼</span><span>Portal Cliente</span>
          </Link>
        </nav>

        <div style={{ padding: '0.75rem 0.5rem', borderTop: '1px solid var(--border)' }}>
          <button onClick={() => logout()} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.85rem', borderRadius: 8, fontSize: 13, color: 'var(--slate)', cursor: 'pointer', background: 'none', border: 'none', width: '100%', fontFamily: 'inherit' }}>
            <span>🚪</span><span>Sair</span>
          </button>
        </div>
      </aside>

      <main style={{ flex: 1, marginLeft: 240, minHeight: '100vh', background: 'var(--navy3)' }} className="md:ml-60">
        <div style={{ height: 56, background: 'rgba(10,22,40,0.97)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', padding: '0 1.5rem', gap: '1rem', position: 'sticky', top: 0, zIndex: 20 }}>
          <div style={{ fontSize: 10, letterSpacing: 3, color: 'var(--forest)', textTransform: 'uppercase', fontWeight: 700 }}>CRM · Bexaltec Admin</div>
          <div style={{ flex: 1 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 12, color: 'var(--green)' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)' }} />
            Sistema Online
          </div>
        </div>
        <div style={{ padding: '2rem', maxWidth: 1200, margin: '0 auto' }}>
          {children}
        </div>
      </main>
    </div>
  )
}
