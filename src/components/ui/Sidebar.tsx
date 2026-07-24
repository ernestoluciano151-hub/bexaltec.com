'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BexaltecLogo } from '@/components/Logo'
import { logout } from '@/lib/auth'
import type { AuthUser } from '@/lib/auth'

interface NavItem {
  href: string
  label: string
  ico: string
  exact?: boolean
}

interface SidebarProps {
  user: AuthUser
  navItems: NavItem[]
  variant?: 'client' | 'admin'
  topbarLabel?: string
  children?: React.ReactNode
}

export function Sidebar({ user, navItems, variant = 'client', topbarLabel, children }: SidebarProps) {
  const path = usePathname()

  const isActive = (item: NavItem) =>
    item.exact !== false ? path === item.href : path.startsWith(item.href)

  return (
    <aside style={{
      width: 240,
      background: 'var(--navy2)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      top: 0, bottom: 0, left: 0,
      zIndex: 30,
    }}>
      {/* Logo */}
      <div style={{ padding: '1.25rem 1rem', borderBottom: '1px solid var(--border)' }}>
        <Link href="/"><BexaltecLogo size={28} /></Link>
        {variant === 'admin' && (
          <div style={{ marginTop: '0.5rem', fontSize: 10, letterSpacing: 2, color: 'var(--forest)', textTransform: 'uppercase', fontWeight: 700 }}>
            Área Administrativa
          </div>
        )}
      </div>

      {/* User info */}
      <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            width: 34, height: 34, borderRadius: '50%',
            background: variant === 'admin' ? 'rgba(0,230,118,0.2)' : 'rgba(0,230,118,0.15)',
            border: variant === 'admin' ? '2px solid rgba(0,230,118,0.4)' : '1px solid rgba(0,230,118,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 700, color: 'var(--green)', flexShrink: 0,
          }}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--silver2)' }}>{user.name}</div>
            <div style={{ fontSize: 10, color: variant === 'admin' ? 'var(--forest)' : 'var(--slate)' }}>
              {variant === 'admin' ? 'Administrador' : (user.company || user.email)}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '0.75rem 0.5rem', display: 'flex', flexDirection: 'column', gap: '0.2rem', overflowY: 'auto' }}>
        {navItems.map(item => {
          const active = isActive(item)
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
              <span style={{ width: 18, textAlign: 'center', flexShrink: 0 }}>{item.ico}</span>
              <span>{item.label}</span>
            </Link>
          )
        })}

        {/* Extra slot (e.g. cross-links) */}
        {children}
      </nav>

      {/* Logout */}
      <div style={{ padding: '0.75rem 0.5rem', borderTop: '1px solid var(--border)' }}>
        <button
          onClick={() => logout()}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            padding: '0.6rem 0.85rem', borderRadius: 8, fontSize: 13,
            color: 'var(--slate)', cursor: 'pointer',
            background: 'none', border: 'none',
            width: '100%', fontFamily: 'inherit',
            transition: 'color 0.2s',
          }}>
          <span style={{ width: 18, textAlign: 'center' }}>🚪</span>
          <span>Terminar Sessão</span>
        </button>
      </div>
    </aside>
  )
}

// Shared top bar for portal layouts
interface TopBarProps {
  user: AuthUser
  label?: string
  isAdmin?: boolean
}

export function PortalTopBar({ user, label, isAdmin }: TopBarProps) {
  return (
    <div style={{
      height: 56,
      background: isAdmin ? 'rgba(10,22,40,0.97)' : 'rgba(10,22,40,0.95)',
      borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center',
      padding: '0 1.5rem', gap: '1rem',
      position: 'sticky', top: 0, zIndex: 20,
    }}>
      {label && (
        <div style={{ fontSize: 10, letterSpacing: 3, color: 'var(--forest)', textTransform: 'uppercase', fontWeight: 700 }}>
          {label}
        </div>
      )}
      <div style={{ flex: 1 }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 12, color: isAdmin ? 'var(--green)' : 'var(--text2)' }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)' }} />
        {isAdmin ? 'Sistema Online' : 'Portal Ativo'}
      </div>
      <div style={{
        width: 30, height: 30, borderRadius: '50%',
        background: 'rgba(0,230,118,0.15)', border: '1px solid rgba(0,230,118,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 12, fontWeight: 700, color: 'var(--green)',
      }}>
        {user.name.charAt(0).toUpperCase()}
      </div>
    </div>
  )
}
