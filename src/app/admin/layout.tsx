'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Sidebar, PortalTopBar } from '@/components/ui/Sidebar'
import { getUser } from '@/lib/auth'
import type { AuthUser } from '@/lib/auth'

const navItems = [
  { href: '/admin', label: 'Dashboard CRM', ico: '📊' },
  { href: '/admin/clients', label: 'Clientes', ico: '👥' },
  { href: '/admin/companies', label: 'Empresas', ico: '🏢' },
  { href: '/admin/tickets', label: 'Tickets', ico: '🎫' },
  { href: '/admin/services', label: 'Serviços Ativos', ico: '⚙️' },
  { href: '/admin/laboratory', label: 'Laboratório', ico: '🔬' },
  { href: '/admin/repair-queue', label: 'Fila de Reparação', ico: '🔧' },
  { href: '/admin/equipment', label: 'Equipamentos', ico: '💻' },
  { href: '/admin/technicians', label: 'Técnicos', ico: '👨‍🔧' },
  { href: '/admin/schedule', label: 'Agenda', ico: '📅' },
  { href: '/admin/work-orders', label: 'Ordens de Trabalho', ico: '📋' },
  { href: '/admin/parts', label: 'Peças & Stock', ico: '🗜️' },
  { href: '/admin/inventory', label: 'Inventário', ico: '📦' },
  { href: '/admin/sla', label: 'SLA & Contratos', ico: '📄' },
  { href: '/admin/financial', label: 'Financeiro', ico: '💰' },
  { href: '/admin/reports', label: 'Relatórios', ico: '📈' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)

  useEffect(() => {
    const u = getUser()
    if (!u) { router.push('/login'); return }
    if (u.role !== 'admin') { router.push('/dashboard'); return }
    setUser(u)
  }, [router])

  if (!user) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--navy)' }}>
      <div style={{ color: 'var(--green)', fontSize: 14 }}>A carregar...</div>
    </div>
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--navy3)' }}>
      <Sidebar user={user} navItems={navItems} variant="admin">
        <div style={{ height: 1, background: 'var(--border)', margin: '0.5rem 0.5rem' }} />
        <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.85rem', borderRadius: 8, fontSize: 12, color: 'var(--slate)', textDecoration: 'none' }}>
          <span style={{ width: 18, textAlign: 'center' }}>🧑‍💼</span>
          <span>Portal Cliente</span>
        </Link>
      </Sidebar>

      <main style={{ flex: 1, marginLeft: 240, minHeight: '100vh', background: 'var(--navy3)' }}>
        <PortalTopBar user={user} label="CRM · Bexaltec Admin" isAdmin />
        <div style={{ padding: '2rem', maxWidth: 1200, margin: '0 auto' }}>
          {children}
        </div>
      </main>
    </div>
  )
}
