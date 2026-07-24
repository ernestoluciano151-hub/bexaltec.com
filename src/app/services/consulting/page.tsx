import type { Metadata } from 'next'
import Link from 'next/link'
import { NavBar } from '@/components/ui/NavBar'
import { Footer } from '@/components/ui/Footer'
import { ArrowRight, Building2, CheckCircle2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Consultoria TI — Bexaltec · Estratégia e Transformação Digital Angola',
  description: 'Consultoria TI estratégica, projetos turnkey, ERP, CRM e transformação digital para empresas e instituições em Angola.',
  keywords: 'consultoria TI Angola, transformação digital Angola, ERP Angola, CRM Angola, projetos turnkey Angola',
}

const COLOR = '#A5D6A7'

const areas = [
  { title: 'Planeamento Estratégico TI', items: ['Diagnóstico do ambiente atual', 'Roadmap de modernização', 'Arquitetura de soluções', 'Análise custo-benefício', 'Gestão de projetos TI'] },
  { title: 'Projetos Turnkey', items: ['Gestão end-to-end', 'Especificações técnicas', 'Seleção de fornecedores', 'Implementação e testes', 'Formação e go-live'] },
  { title: 'ERP & CRM', items: ['Odoo ERP implementação', 'Microsoft Dynamics', 'Zoho CRM', 'Integração de sistemas', 'Migração de dados'] },
  { title: 'Transformação Digital', items: ['Automação de processos (RPA)', 'Desmaterialização documental', 'Portal do colaborador', 'Mobilidade empresarial', 'Business Intelligence'] },
]

export default function ConsultingPage() {
  return (
    <div style={{ background: 'var(--navy)', minHeight: '100vh' }}>
      <NavBar />

      <div style={{ padding: '100px 2rem 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: 12, color: 'var(--slate)' }}>
          <Link href="/" style={{ color: 'var(--slate)', textDecoration: 'none' }}>Início</Link>
          <span>›</span>
          <Link href="/services" style={{ color: 'var(--slate)', textDecoration: 'none' }}>Serviços</Link>
          <span>›</span>
          <span style={{ color: COLOR }}>Consultoria TI</span>
        </div>
      </div>

      <section style={{ padding: '2rem 2rem 5rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.25rem' }}>
                <div style={{ width: 44, height: 44, borderRadius: 11, background: `rgba(165,214,167,0.12)`, border: `1px solid rgba(165,214,167,0.25)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Building2 size={22} color={COLOR} />
                </div>
                <span style={{ fontSize: 10, letterSpacing: 2, color: COLOR, fontWeight: 700, textTransform: 'uppercase' }}>Consultoria TI</span>
              </div>
              <h1 className="font-rajdhani font-black" style={{ fontSize: 'clamp(30px,5vw,52px)', letterSpacing: 2, color: 'var(--text)', lineHeight: 1.05, marginBottom: '1rem' }}>
                TECNOLOGIA<br />
                <span style={{ color: COLOR }}>COMO ESTRATÉGIA</span>
              </h1>
              <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.85, marginBottom: '1.5rem' }}>
                Não apenas implementamos tecnologia — ajudamos a sua organização a usá-la como vantagem competitiva. Consultoria estratégica, projetos turnkey e transformação digital.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <Link href="/quote" className="btn-primary" style={{ fontSize: 13, padding: '11px 22px' }}>
                  Marcar Reunião <ArrowRight size={14} />
                </Link>
                <Link href="/contact" className="btn-secondary" style={{ fontSize: 13, padding: '11px 22px' }}>
                  Contactar
                </Link>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {[
                { n: '120+', l: 'Projetos Entregues' },
                { n: '6+', l: 'Anos de Experiência' },
                { n: '11', l: 'CAEs Registadas' },
                { n: '100%', l: 'Projetos Turnkey' },
              ].map((s, i) => (
                <div key={i} style={{ padding: '1.5rem', background: `rgba(165,214,167,0.04)`, border: `1px solid rgba(165,214,167,0.14)`, borderRadius: 14, textAlign: 'center' }}>
                  <div className="font-rajdhani font-black" style={{ fontSize: 34, color: COLOR, lineHeight: 1 }}>{s.n}</div>
                  <div style={{ fontSize: 11, color: 'var(--slate)', marginTop: 6 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '3rem 2rem 6rem', background: 'linear-gradient(135deg, rgba(13,32,68,0.6) 0%, rgba(10,22,40,0.95) 100%)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: COLOR, textTransform: 'uppercase', marginBottom: '0.6rem' }}>Áreas de Atuação</div>
          <h2 className="font-rajdhani font-black" style={{ fontSize: 'clamp(24px,4vw,36px)', letterSpacing: 1, color: 'var(--text)', marginBottom: '2.5rem' }}>
            Consultoria 360°
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.1rem' }}>
            {areas.map((area, i) => (
              <div key={i} className="card-base" style={{ padding: '1.75rem', borderTop: `2px solid ${COLOR}40` }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: COLOR, marginBottom: '1rem' }}>{area.title}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  {area.items.map((item, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <CheckCircle2 size={12} color={COLOR} style={{ flexShrink: 0, opacity: 0.7 }} />
                      <span style={{ fontSize: 12, color: 'var(--text2)' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '5rem 2rem', background: 'var(--navy3)', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
          <h2 className="font-rajdhani font-black" style={{ fontSize: 'clamp(24px,4vw,38px)', letterSpacing: 1, color: 'var(--text)', marginBottom: '0.75rem' }}>
            Pronto para Transformar a Sua Empresa?
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.75, marginBottom: '2rem' }}>
            Reunião de diagnóstico gratuita, sem compromisso.
          </p>
          <Link href="/quote" className="btn-primary" style={{ fontSize: 14, padding: '13px 28px' }}>
            Marcar Reunião Gratuita ↗
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
