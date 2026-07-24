'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Sidebar, PortalTopBar } from '@/components/ui/Sidebar'
import { getUser } from '@/lib/auth'
import type { AuthUser } from '@/lib/auth'

const navItems = [
  { href: '/dashboard', label: 'Visão Geral', ico: '📊' },
  { href: '/dashboard/tickets', label: 'Tickets de Suporte', ico: '🎫' },
  { href: '/dashboard/services', label: 'Os Meus Serviços', ico: '⚙️' },
  { href: '/dashboard/repair-status', label: 'Estado de Reparações', ico: '🔧' },
  { href: '/dashboard/equipment', label: 'Equipamentos', ico: '💻' },
  { href: '/dashboard/quotes', label: 'Orçamentos', ico: '📋' },
  { href: '/dashboard/contracts', label: 'Contratos', ico: '📄' },
  { href: '/dashboard/billing', label: 'Faturação', ico: '🧾' },
  { href: '/dashboard/downloads', label: 'Documentos', ico: '📁' },
  { href: '/dashboard/chat', label: 'Chat de Suporte', ico: '💬' },
  { href: '/dashboard/notifications', label: 'Notificações', ico: '🔔' },
  { href: '/dashboard/history', label: 'Histórico', ico: '📅' },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)

  useEffect(() => {
    const u = getUser()
    if (!u) { router.push('/login'); return }
    if (u.role === 'admin') { router.push('/admin'); return }
    setUser(u)
  }, [router])

  if (!user) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--navy)' }}>
      <div style={{ color: 'var(--green)', fontSize: 14 }}>A carregar...</div>
    </div>
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--navy3)' }}>
      <Sidebar user={user} navItems={navItems} variant="client">
        <div style={{ height: 1, background: 'var(--border)', margin: '0.5rem 0.5rem' }} />
        <Link href="/quote" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.85rem', borderRadius: 8, fontSize: 12, color: 'var(--green)', textDecoration: 'none' }}>
          <span style={{ width: 18, textAlign: 'center' }}>↗</span>
          <span>Pedir Orçamento</span>
        </Link>
      </Sidebar>

      <main style={{ flex: 1, marginLeft: 240, minHeight: '100vh', background: 'var(--navy3)' }}>
        <PortalTopBar user={user} />
        <div style={{ padding: '2rem', maxWidth: 1100, margin: '0 auto' }}>
          {children}
        </div>
      </main>
    </div>
  )
}
