import type { Metadata } from 'next'
import Link from 'next/link'
import { NavBar } from '@/components/ui/NavBar'
import { Footer } from '@/components/ui/Footer'
import { ArrowRight, Code2, CheckCircle2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Software & Desenvolvimento — Bexaltec · Aplicações Web e Mobile Angola',
  description: 'Desenvolvimento de software, aplicações web e mobile, ERP, CRM, IA e automação de processos para empresas em Angola.',
  keywords: 'desenvolvimento software Angola, aplicação web Angola, app mobile Angola, ERP Angola, automação processos Angola',
}

const COLOR = '#F48FB1'

const stack = [
  { title: 'Aplicações Web', items: ['Next.js & React', 'Vue.js & Nuxt', 'Node.js & Express', 'APIs REST & GraphQL', 'PWA — Progressive Web Apps'] },
  { title: 'Aplicações Mobile', items: ['React Native (iOS & Android)', 'Flutter multiplataforma', 'Notificações push', 'Pagamentos integrados', 'Deploy App Store & Play Store'] },
  { title: 'ERP & CRM', items: ['Odoo ERP customizado', 'CRM Zoho/HubSpot', 'Gestão escolar/hospitalar', 'Sistemas de gestão de stock', 'Faturação eletrónica'] },
  { title: 'Integrações & API', items: ['Integração com bancos angolanos', 'API MULTICAIXA Express', 'Integração ERP ↔ E-commerce', 'Webhooks e automações', 'Middleware ETL'] },
  { title: 'IA & Automação', items: ['Chatbots com IA', 'RPA — Robotic Process Automation', 'OCR e processamento documental', 'Análise preditiva', 'Machine Learning empresarial'] },
  { title: 'Qualidade & DevOps', items: ['Testes automatizados', 'CI/CD pipelines', 'Docker & Kubernetes', 'Monitoramento e alertas', 'Documentação técnica completa'] },
]

export default function SoftwarePage() {
  return (
    <div style={{ background: 'var(--navy)', minHeight: '100vh' }}>
      <NavBar />

      <div style={{ padding: '100px 2rem 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: 12, color: 'var(--slate)' }}>
          <Link href="/" style={{ color: 'var(--slate)', textDecoration: 'none' }}>Início</Link>
          <span>›</span>
          <Link href="/services" style={{ color: 'var(--slate)', textDecoration: 'none' }}>Serviços</Link>
          <span>›</span>
          <span style={{ color: COLOR }}>Software & Dev</span>
        </div>
      </div>

      <section style={{ padding: '2rem 2rem 5rem', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 30% 40%, rgba(244,143,177,0.05) 0%, transparent 60%)`, pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.25rem' }}>
                <div style={{ width: 44, height: 44, borderRadius: 11, background: `rgba(244,143,177,0.12)`, border: `1px solid rgba(244,143,177,0.25)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Code2 size={22} color={COLOR} />
                </div>
                <span style={{ fontSize: 10, letterSpacing: 2, color: COLOR, fontWeight: 700, textTransform: 'uppercase' }}>Software & Desenvolvimento</span>
              </div>
              <h1 className="font-rajdhani font-black" style={{ fontSize: 'clamp(30px,5vw,52px)', letterSpacing: 2, color: 'var(--text)', lineHeight: 1.05, marginBottom: '1rem' }}>
                SOFTWARE QUE<br />
                <span style={{ color: COLOR }}>FUNCIONA DE VERDADE</span>
              </h1>
              <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.85, marginBottom: '1.5rem' }}>
                Desenvolvemos aplicações web, mobile e sistemas empresariais adaptados à realidade angolana — com integração bancária local, suporte offline e design profissional.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <Link href="/quote" className="btn-primary" style={{ fontSize: 13, padding: '11px 22px' }}>
                  Começar Projeto <ArrowRight size={14} />
                </Link>
                <Link href="/contact" className="btn-secondary" style={{ fontSize: 13, padding: '11px 22px' }}>
                  Falar com Dev
                </Link>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {[
                { n: '30+', l: 'Apps Entregues' },
                { n: 'React', l: 'Next.js · Flutter' },
                { n: 'API', l: 'MULTICAIXA Integrado' },
                { n: '100%', l: 'Código Proprietário' },
              ].map((s, i) => (
                <div key={i} style={{ padding: '1.5rem', background: `rgba(244,143,177,0.04)`, border: `1px solid rgba(244,143,177,0.14)`, borderRadius: 14, textAlign: 'center' }}>
                  <div className="font-rajdhani font-black" style={{ fontSize: s.n.length > 5 ? 20 : 30, color: COLOR, lineHeight: 1 }}>{s.n}</div>
                  <div style={{ fontSize: 11, color: 'var(--slate)', marginTop: 6 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '3rem 2rem 6rem', background: 'linear-gradient(135deg, rgba(13,32,68,0.6) 0%, rgba(10,22,40,0.95) 100%)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: COLOR, textTransform: 'uppercase', marginBottom: '0.6rem' }}>Stack Tecnológico</div>
          <h2 className="font-rajdhani font-black" style={{ fontSize: 'clamp(24px,4vw,36px)', letterSpacing: 1, color: 'var(--text)', marginBottom: '2.5rem' }}>
            Tecnologia Moderna, Resultados Reais
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.1rem' }}>
            {stack.map((s, i) => (
              <div key={i} className="card-base" style={{ padding: '1.75rem', borderTop: `2px solid ${COLOR}40` }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: COLOR, marginBottom: '1rem' }}>{s.title}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  {s.items.map((item, j) => (
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
            A Sua Ideia, em Código
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.75, marginBottom: '2rem' }}>
            Reunião técnica gratuita para detalhar o seu projeto.
          </p>
          <Link href="/quote" className="btn-primary" style={{ fontSize: 14, padding: '13px 28px' }}>
            Orçar Projeto ↗
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
