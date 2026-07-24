// ─── Services Page — Server Component ─────────────────────────────────────
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getSession } from '@/lib/auth-server'
import { PageHeader, EmptyState } from '@/components/ui/shared'

export default async function ServicesPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  return (
    <div>
      <PageHeader
        title="Os Meus Serviços"
        sub="Serviços contratados com a Bexaltec"
      />

      <EmptyState
        ico="⚙️"
        title="Os seus serviços contratados serão listados aqui"
        sub="Assim que tiver serviços ativos, poderá acompanhá-los nesta página."
        action={
          <Link href="/contact" className="btn-primary" style={{ fontSize: 13, display: 'inline-flex' }}>
            Contacte-nos ↗
          </Link>
        }
      />

      <div style={{ marginTop: '2rem', background: 'var(--glow)', border: '1px solid var(--border-g)', borderRadius: 14, padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div className="font-rajdhani font-semibold" style={{ fontSize: 17, color: 'var(--text)', marginBottom: '0.25rem' }}>Precisa de novos serviços?</div>
          <div style={{ fontSize: 13, color: 'var(--slate)' }}>Solicite um orçamento para serviços de TI, segurança eletrónica, suporte ou outros.</div>
        </div>
        <Link href="/contact" className="btn-primary" style={{ fontSize: 13 }}>Solicitar Orçamento ↗</Link>
      </div>
    </div>
  )
}
