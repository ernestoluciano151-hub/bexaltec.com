import type { Metadata } from 'next'
import Link from 'next/link'
import { NavBar } from '@/components/ui/NavBar'
import { Footer } from '@/components/ui/Footer'

export const metadata: Metadata = {
  title: 'Contacto — Bexaltec · Luanda, Angola',
  description: 'Entre em contacto com a Bexaltec. Email, telefone, WhatsApp Business e morada em Luanda, Angola. Resposta em 24 horas.',
}

export default function ContactPage() {
  return (
    <div style={{ background: 'var(--navy)', minHeight: '100vh' }}>
      <NavBar />

      <section style={{ padding: '120px 2rem 5rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="section-badge">Contacto</div>
          <h1 className="font-rajdhani font-black" style={{ fontSize: 'clamp(32px,5vw,56px)', letterSpacing: 2, color: 'var(--text)', lineHeight: 1, marginBottom: '1rem' }}>
            FALE CONNOSCO
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.75, maxWidth: 480, marginBottom: '3rem' }}>
            Estamos disponíveis para responder às suas questões e elaborar propostas personalizadas. Resposta garantida em até 24 horas.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'start' }}>
            {/* Contact info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { ico: '📧', title: 'Email', value: 'info@bexaltec.ao', sub: 'Resposta em até 24 horas' },
                { ico: '📱', title: 'Telefone & WhatsApp', value: '+244 9XX XXX XXX', sub: 'Segunda a Sexta, 08h–18h' },
                { ico: '📍', title: 'Morada', value: 'Luanda, Angola', sub: 'Visitas técnicas em todo o território nacional' },
                { ico: '🕐', title: 'Horário', value: 'Seg–Sex 08h–18h', sub: 'Sábado 09h–13h · Emergências 24/7' },
              ].map((c, i) => (
                <div key={i} className="card-base card-glow" style={{ padding: '1.25rem 1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start', transition: 'all 0.25s' }}>
                  <div style={{ fontSize: 24 }}>{c.ico}</div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: 'var(--green)', textTransform: 'uppercase', marginBottom: 4 }}>{c.title}</div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--silver2)', marginBottom: 3 }}>{c.value}</div>
                    <div style={{ fontSize: 11, color: 'var(--slate)' }}>{c.sub}</div>
                  </div>
                </div>
              ))}

              {/* Quick links */}
              <div className="card-base" style={{ padding: '1.5rem', background: 'rgba(0,230,118,0.04)', border: '1px solid rgba(0,230,118,0.15)' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--silver2)', marginBottom: '0.75rem' }}>Atalhos Rápidos</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <Link href="/quote" style={{ fontSize: 13, color: 'var(--green)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>↗ Pedir Orçamento Gratuito</Link>
                  <Link href="/services/laboratory" style={{ fontSize: 13, color: 'var(--text2)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>→ Entregar dispositivo para reparação</Link>
                  <Link href="/services/infrastructure" style={{ fontSize: 13, color: 'var(--text2)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>→ Solicitar estudo de infraestrutura</Link>
                  <Link href="/login" style={{ fontSize: 13, color: 'var(--text2)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>→ Aceder ao portal do cliente</Link>
                </div>
              </div>
            </div>

            {/* Map placeholder + mini form */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Map placeholder */}
              <div style={{ width: '100%', aspectRatio: '4/3', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                <div style={{ fontSize: 36, opacity: 0.25 }}>🗺️</div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--silver2)', marginBottom: 4 }}>Luanda, Angola</div>
                  <div style={{ fontSize: 11, color: 'var(--slate)' }}>Mapa a ser integrado (Google Maps / Apple Maps)</div>
                </div>
              </div>

              {/* Social presence */}
              <div className="card-base" style={{ padding: '1.25rem 1.5rem' }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--silver2)', marginBottom: '0.85rem' }}>Redes Sociais</div>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  {[
                    { label: 'WhatsApp', href: '#', color: '#25D366' },
                    { label: 'LinkedIn', href: '#', color: '#0A66C2' },
                    { label: 'Facebook', href: '#', color: '#1877F2' },
                    { label: 'Instagram', href: '#', color: '#E4405F' },
                  ].map((s, i) => (
                    <a key={i} href={s.href} style={{
                      fontSize: 12, padding: '6px 14px', borderRadius: 6,
                      background: `${s.color}12`, border: `1px solid ${s.color}25`,
                      color: s.color, textDecoration: 'none', fontWeight: 500,
                    }}>
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
