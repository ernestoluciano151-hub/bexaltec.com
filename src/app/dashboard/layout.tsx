// Casca do portal do cliente.
//
// Server Component de propósito. A versão anterior era 'use client' e fazia a
// autenticação num useEffect, pelo que o HTML inicial de qualquer página do portal
// era apenas "A carregar..." — o conteúdo só entrava depois da hidratação. Era
// também redundante: o middleware já verifica criptograficamente o token antes de
// a página renderizar.
//
// Resolve ao mesmo tempo o nome vazio na barra lateral: a sessão traz o nome real,
// em vez do objeto mínimo que getUser() devolvia a partir do cookie de papel.

import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Sidebar, PortalTopBar } from '@/components/ui/Sidebar'
import { getSession } from '@/lib/auth-server'
import type { AuthUser } from '@/lib/auth'

const navItems = [
  { href: '/dashboard', label: 'Visão Geral', ico: '📊' },
  { href: '/dashboard/tickets', label: 'Tickets de Suporte', ico: '🎫' },
  { href: '/dashboard/repair-status', label: 'Estado de Reparações', ico: '🔧' },
  { href: '/dashboard/equipment', label: 'Equipamentos', ico: '💻' },
  { href: '/dashboard/quotes', label: 'Orçamentos', ico: '📋' },
  { href: '/dashboard/contracts', label: 'Contratos', ico: '📄' },
  { href: '/dashboard/renewals', label: 'Renovações', ico: '🔁' },
  { href: '/dashboard/billing', label: 'Faturação', ico: '🧾' },
  { href: '/dashboard/downloads', label: 'Documentos', ico: '📁' },
  { href: '/dashboard/chat', label: 'Falar com o Suporte', ico: '💬' },
  { href: '/dashboard/notifications', label: 'Notificações', ico: '🔔' },
  { href: '/dashboard/history', label: 'Histórico', ico: '📅' },
  { href: '/dashboard/profile', label: 'O Meu Perfil', ico: '👤' },
]

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session) redirect('/login')
  if (session.role === 'admin') redirect('/admin')

  const user: AuthUser = {
    id:        session.id,
    name:      session.name,
    email:     session.email,
    role:      session.role,
    companyId: session.companyId,
  }

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
