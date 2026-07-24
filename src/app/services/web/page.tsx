import type { Metadata } from 'next'
import Link from 'next/link'
import { NavBar } from '@/components/ui/NavBar'
import { Footer } from '@/components/ui/Footer'
import { ArrowRight, Globe, CheckCircle2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Website & Hospedagem — Bexaltec · Sites Profissionais Angola',
  description: 'Websites corporativos, e-commerce, hospedagem VPS e email @empresa.ao para empresas em Angola. Design profissional, SEO e SSL incluídos.',
  keywords: 'website Angola, e-commerce Angola, hospedagem VPS Angola, email corporativo Angola, domínio ao',
}

const COLOR = '#80DEEA'

const packages = [
  {
    name: 'Presença Web', desc: 'Para micro e pequenas empresas',
    items: ['Website institucional até 5 páginas', 'Design responsivo (mobile-first)', 'SSL gratuito incluído', 'Email @empresa.ao (5 caixas)', 'Hospedagem 1 ano incluída', 'Google Analytics configurado'],
  },
  {
    name: 'Corporativo', desc: 'Para empresas em crescimento', highlight: true,
    items: ['Website até 15 páginas', 'Blog ou área de notícias', 'Formulário de contacto avançado', 'Email @empresa.ao (20 caixas)', 'VPS gerido 12 meses', 'SEO on-page completo', 'Google My Business'],
  },
  {
    name: 'E-commerce', desc: 'Para vender online',
    items: ['Loja online completa', 'Integração MULTICAIXA Express', 'Gestão de stock e pedidos', 'Painel de administração', 'Domínio .ao incluído', 'Relatórios de vendas', 'Suporte técnico 12 meses'],
  },
]

export default function WebPage() {
  return (
    <div style={{ background: 'var(--navy)', minHeight: '100vh' }}>
      <NavBar />

      <div style={{ padding: '100px 2rem 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: 12, color: 'var(--slate)' }}>
          <Link href="/" style={{ color: 'var(--slate)', textDecoration: 'none' }}>Início</Link>
          <span>›</span>
          <Link href="/services" style={{ color: 'var(--slate)', textDecoration: 'none' }}>Serviços</Link>
          <span>›</span>
          <span style={{ color: COLOR }}>Web & Hosting</span>
        </div>
      </div>

      <section style={{ padding: '2rem 2rem 5rem', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 30% 40%, rgba(128,222,234,0.05) 0%, transparent 60%)`, pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.25rem' }}>
                <div style={{ width: 44, height: 44, borderRadius: 11, background: `rgba(128,222,234,0.12)`, border: `1px solid rgba(128,222,234,0.25)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Globe size={22} color={COLOR} />
                </div>
                <span style={{ fontSize: 10, letterSpacing: 2, color: COLOR, fontWeight: 700, textTransform: 'uppercase' }}>Website & Hospedagem</span>
              </div>
              <h1 className="font-rajdhani font-black" style={{ fontSize: 'clamp(30px,5vw,52px)', letterSpacing: 2, color: 'var(--text)', lineHeight: 1.05, marginBottom: '1rem' }}>
                A SUA EMPRESA<br />
                <span style={{ color: COLOR }}>NA INTERNET</span>
              </h1>
              <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.85, marginBottom: '1.5rem' }}>
                Websites profissionais, e-commerce com pagamento MULTICAIXA e hospedagem gerida em Angola — tudo incluído, sem surpresas.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <Link href="/quote" className="btn-primary" style={{ fontSize: 13, padding: '11px 22px' }}>
                  Ver Pacotes <ArrowRight size={14} />
                </Link>
                <Link href="/contact" className="btn-secondary" style={{ fontSize: 13, padding: '11px 22px' }}>
                  Contactar
                </Link>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {[
                { n: '50+', l: 'Sites Entregues' },
                { n: '.ao', l: 'Domínios Registados' },
                { n: 'VPS', l: 'Hospedagem Gerida' },
                { n: 'SSL', l: 'Certificados Incluídos' },
              ].map((s, i) => (
                <div key={i} style={{ padding: '1.5rem', background: `rgba(128,222,234,0.04)`, border: `1px solid rgba(128,222,234,0.14)`, borderRadius: 14, textAlign: 'center' }}>
                  <div className="font-rajdhani font-black" style={{ fontSize: 32, color: COLOR, lineHeight: 1 }}>{s.n}</div>
                  <div style={{ fontSize: 11, color: 'var(--slate)', marginTop: 6 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Packages */}
      <section style={{ padding: '3rem 2rem 6rem', background: 'linear-gradient(135deg, rgba(13,32,68,0.6) 0%, rgba(10,22,40,0.95) 100%)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: COLOR, textTransform: 'uppercase', marginBottom: '0.6rem', textAlign: 'center' }}>Pacotes</div>
          <h2 className="font-rajdhani font-black" style={{ fontSize: 'clamp(24px,4vw,36px)', letterSpacing: 1, color: 'var(--text)', marginBottom: '2.5rem', textAlign: 'center' }}>
            Escolha o Seu Plano Web
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
            {packages.map((pkg, i) => (
              <div key={i} className="card-base" style={{
                padding: '2rem',
                border: pkg.highlight ? `1px solid ${COLOR}40` : '1px solid var(--border)',
                background: pkg.highlight ? `rgba(128,222,234,0.04)` : undefined,
              }}>
                {pkg.highlight && (
                  <div style={{ fontSize: 9, padding: '2px 10px', background: `${COLOR}20`, color: COLOR, borderRadius: 20, display: 'inline-block', marginBottom: '0.75rem', fontWeight: 700, letterSpacing: 1 }}>
                    MAIS POPULAR
                  </div>
                )}
                <h3 className="font-rajdhani font-bold" style={{ fontSize: 20, color: pkg.highlight ? COLOR : 'var(--silver2)', marginBottom: '0.25rem' }}>{pkg.name}</h3>
                <div style={{ fontSize: 11, color: 'var(--slate)', marginBottom: '1.25rem' }}>{pkg.desc}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                  {pkg.items.map((item, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <CheckCircle2 size={12} color={COLOR} style={{ flexShrink: 0, opacity: pkg.highlight ? 1 : 0.6 }} />
                      <span style={{ fontSize: 12, color: 'var(--text2)' }}>{item}</span>
                    </div>
                  ))}
                </div>
                <Link href="/quote" className={pkg.highlight ? 'btn-primary' : 'btn-secondary'} style={{ fontSize: 12, padding: '10px', width: '100%', justifyContent: 'center', display: 'flex' }}>
                  Pedir Orçamento
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '5rem 2rem', background: 'var(--navy3)', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
          <h2 className="font-rajdhani font-black" style={{ fontSize: 'clamp(24px,4vw,38px)', letterSpacing: 1, color: 'var(--text)', marginBottom: '0.75rem' }}>
            Online em 30 Dias
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.75, marginBottom: '2rem' }}>
            Orçamento gratuito. Entregamos o seu site em até 30 dias úteis.
          </p>
          <Link href="/quote" className="btn-primary" style={{ fontSize: 14, padding: '13px 28px' }}>
            Começar Agora ↗
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
