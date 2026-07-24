import Link from 'next/link'
import { NavBar } from '@/components/ui/NavBar'
import { Footer } from '@/components/ui/Footer'

export default function NotFound() {
  return (
    <div style={{ background: 'var(--navy)', minHeight: '100vh' }}>
      <NavBar />
      <section style={{ padding: '140px 2rem 8rem', textAlign: 'center' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(80px,15vw,140px)', fontWeight: 900, color: 'rgba(0,230,118,0.08)', lineHeight: 1, marginBottom: '-1.5rem' }}>
            404
          </div>
          <div className="section-badge" style={{ justifyContent: 'center' }}>Página Não Encontrada</div>
          <h1 className="font-rajdhani font-black" style={{ fontSize: 'clamp(28px,5vw,42px)', letterSpacing: 2, color: 'var(--text)', lineHeight: 1, margin: '1rem 0 0.75rem' }}>
            ESTA PÁGINA NÃO EXISTE
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.75, marginBottom: '2.5rem' }}>
            O endereço que tentou aceder não foi encontrado. Pode ter sido movido, eliminado ou o URL está incorreto.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/" className="btn-primary" style={{ fontSize: 13, padding: '11px 24px' }}>
              ← Voltar ao Início
            </Link>
            <Link href="/services" className="btn-secondary" style={{ fontSize: 13, padding: '11px 24px' }}>
              Ver Serviços
            </Link>
            <Link href="/contact" className="btn-secondary" style={{ fontSize: 13, padding: '11px 24px' }}>
              Contacto
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
