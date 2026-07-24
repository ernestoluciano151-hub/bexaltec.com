import type { Metadata } from 'next'
import Link from 'next/link'
import { NavBar } from '@/components/ui/NavBar'
import { Footer } from '@/components/ui/Footer'
import { ArrowRight, Users, CheckCircle2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Outsourcing TI — Bexaltec · TI como Serviço Angola',
  description: 'Outsourcing TI completo: técnicos dedicados, gestão de infraestrutura, helpdesk e suporte on-site para empresas em Angola.',
  keywords: 'outsourcing TI Angola, ITaaS Angola, técnico TI dedicado Luanda, gestão infraestrutura Angola',
}

const COLOR = '#80CBC4'

const benefits = [
  { title: 'Técnico(s) Dedicado(s)', items: ['Técnico exclusivo para a sua empresa', 'On-site diário ou parcial', 'Conhecimento profundo do ambiente', 'Continuidade e histórico', 'Substituição garantida em férias/doença'] },
  { title: 'ITaaS — TI como Serviço', items: ['Sem custo de contratação', 'Sem gestão de RH', 'Escalabilidade imediata', 'Acesso a toda a equipa Bexaltec', 'Ferramentas profissionais incluídas'] },
  { title: 'Gestão de Infraestrutura', items: ['Gestão completa de servidores', 'Redes e conectividade', 'Segurança e patches', 'Backup e recuperação', 'Relatórios executivos mensais'] },
  { title: 'Helpdesk & Suporte', items: ['Portal de tickets 24/7', 'SLA por prioridade', 'Suporte remoto imediato', 'Visitas on-site agendadas', 'Base de conhecimento interna'] },
]

export default function OutsourcingPage() {
  return (
    <div style={{ background: 'var(--navy)', minHeight: '100vh' }}>
      <NavBar />

      <div style={{ padding: '100px 2rem 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: 12, color: 'var(--slate)' }}>
          <Link href="/" style={{ color: 'var(--slate)', textDecoration: 'none' }}>Início</Link>
          <span>›</span>
          <Link href="/services" style={{ color: 'var(--slate)', textDecoration: 'none' }}>Serviços</Link>
          <span>›</span>
          <span style={{ color: COLOR }}>Outsourcing TI</span>
        </div>
      </div>

      <section style={{ padding: '2rem 2rem 5rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.25rem' }}>
                <div style={{ width: 44, height: 44, borderRadius: 11, background: `rgba(128,203,196,0.12)`, border: `1px solid rgba(128,203,196,0.25)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Users size={22} color={COLOR} />
                </div>
                <span style={{ fontSize: 10, letterSpacing: 2, color: COLOR, fontWeight: 700, textTransform: 'uppercase' }}>Outsourcing TI</span>
              </div>
              <h1 className="font-rajdhani font-black" style={{ fontSize: 'clamp(30px,5vw,52px)', letterSpacing: 2, color: 'var(--text)', lineHeight: 1.05, marginBottom: '1rem' }}>
                A SUA EQUIPA TI,<br />
                <span style={{ color: COLOR }}>SEM CONTRATAR</span>
              </h1>
              <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.85, marginBottom: '1.5rem' }}>
                Tenha uma equipa TI completa e profissional sem os custos e complexidades de uma contratação direta. Técnicos dedicados, gestão proativa e suporte contínuo.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <Link href="/quote" className="btn-primary" style={{ fontSize: 13, padding: '11px 22px' }}>
                  Pedir Proposta <ArrowRight size={14} />
                </Link>
                <Link href="/contact" className="btn-secondary" style={{ fontSize: 13, padding: '11px 22px' }}>
                  Contactar
                </Link>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {[
                { n: '60+', l: 'Empresas em Outsourcing' },
                { n: '0h', l: 'Tempo de Recrutamento' },
                { n: '100%', l: 'Cobertura Nacional' },
                { n: '30d', l: 'Para Começar' },
              ].map((s, i) => (
                <div key={i} style={{ padding: '1.5rem', background: `rgba(128,203,196,0.04)`, border: `1px solid rgba(128,203,196,0.14)`, borderRadius: 14, textAlign: 'center' }}>
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
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: COLOR, textTransform: 'uppercase', marginBottom: '0.6rem' }}>O que Inclui</div>
          <h2 className="font-rajdhani font-black" style={{ fontSize: 'clamp(24px,4vw,36px)', letterSpacing: 1, color: 'var(--text)', marginBottom: '2.5rem' }}>
            Outsourcing Completo
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.1rem' }}>
            {benefits.map((b, i) => (
              <div key={i} className="card-base" style={{ padding: '1.75rem', borderTop: `2px solid ${COLOR}40` }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: COLOR, marginBottom: '1rem' }}>{b.title}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  {b.items.map((item, j) => (
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
            Foque no seu Negócio
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.75, marginBottom: '2rem' }}>
            Tratamos da TI. Você trata do que realmente importa.
          </p>
          <Link href="/quote" className="btn-primary" style={{ fontSize: 14, padding: '13px 28px' }}>
            Pedir Proposta de Outsourcing ↗
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
