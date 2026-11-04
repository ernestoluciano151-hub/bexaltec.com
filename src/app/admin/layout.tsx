// Casca do CRM. Server Component, pelo mesmo motivo do portal do cliente: a versão
// anterior autenticava num useEffect e o HTML inicial era só o loader. O middleware
// já bloqueia /admin a quem não é administrador antes de a página renderizar.
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Sidebar, PortalTopBar } from '@/components/ui/Sidebar'
import { getSession } from '@/lib/auth-server'
import type { AuthUser } from '@/lib/auth'

const navItems = [
  { href: '/admin', label: 'Dashboard CRM', ico: '📊' },
  { href: '/admin/clients', label: 'Clientes', ico: '👥' },
  { href: '/admin/companies', label: 'Empresas', ico: '🏢' },
  { href: '/admin/tickets', label: 'Tickets', ico: '🎫' },
  { href: '/admin/quotes', label: 'Orçamentos', ico: '📋' },
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

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session) redirect('/login')
  if (session.role !== 'admin') redirect('/dashboard')

  const user: AuthUser = {
    id:        session.id,
    name:      session.name,
    email:     session.email,
    role:      session.role,
    companyId: session.companyId,
  }

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
