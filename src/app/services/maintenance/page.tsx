import type { Metadata } from 'next'
import Link from 'next/link'
import { NavBar } from '@/components/ui/NavBar'
import { Footer } from '@/components/ui/Footer'
import { ArrowRight, Wrench, CheckCircle2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Assistência Técnica & Manutenção — Bexaltec · Suporte TI Angola',
  description: 'Contratos de manutenção TI, helpdesk remoto e presencial, suporte 24/7 e SLA garantido para empresas em Angola.',
  keywords: 'manutenção TI Angola, helpdesk Angola, suporte informático Luanda, contrato manutenção Angola, SLA Angola',
}

const COLOR = '#FFB74D'

const plans = [
  {
    name: 'Basic', price: 'Sob consulta', desc: 'Para pequenas empresas',
    items: ['Até 10 equipamentos', 'Suporte remoto', 'Tempo de resposta 48h', 'Visitas mensais (1)', 'Relatório trimestral'],
  },
  {
    name: 'Business', price: 'Sob consulta', desc: 'Para empresas médias', highlight: true,
    items: ['Até 50 equipamentos', 'Suporte remoto + presencial', 'Tempo de resposta 4h', 'Visitas semanais', 'Relatório mensal', 'Backup gerido incluído'],
  },
  {
    name: 'Enterprise', price: 'Sob consulta', desc: 'Para grandes organizações',
    items: ['Equipamentos ilimitados', 'Técnico dedicado on-site', 'SLA 2h resposta', 'Monitoramento 24/7 NOC', 'Relatório semanal', 'UPS e geradores incluídos'],
  },
]

export default function MaintenancePage() {
  return (
    <div style={{ background: 'var(--navy)', minHeight: '100vh' }}>
      <NavBar />

      <div style={{ padding: '100px 2rem 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: 12, color: 'var(--slate)' }}>
          <Link href="/" style={{ color: 'var(--slate)', textDecoration: 'none' }}>Início</Link>
          <span>›</span>
          <Link href="/services" style={{ color: 'var(--slate)', textDecoration: 'none' }}>Serviços</Link>
          <span>›</span>
          <span style={{ color: COLOR }}>Assistência Técnica</span>
        </div>
      </div>

      <section style={{ padding: '2rem 2rem 5rem', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 30% 40%, rgba(255,183,77,0.05) 0%, transparent 60%)`, pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.25rem' }}>
                <div style={{ width: 44, height: 44, borderRadius: 11, background: `rgba(255,183,77,0.12)`, border: `1px solid rgba(255,183,77,0.25)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Wrench size={22} color={COLOR} />
                </div>
                <span style={{ fontSize: 10, letterSpacing: 2, color: COLOR, fontWeight: 700, textTransform: 'uppercase' }}>Assistência Técnica</span>
              </div>
              <h1 className="font-rajdhani font-black" style={{ fontSize: 'clamp(30px,5vw,52px)', letterSpacing: 2, color: 'var(--text)', lineHeight: 1.05, marginBottom: '1rem' }}>
                TI GERIDA,<br />
                <span style={{ color: COLOR }}>SEM PREOCUPAÇÕES</span>
              </h1>
              <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.85, marginBottom: '1.5rem' }}>
                Contratos de manutenção TI com SLA garantido. A sua tecnologia sempre a funcionar, enquanto foca no seu negócio.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <Link href="/quote" className="btn-primary" style={{ fontSize: 13, padding: '11px 22px' }}>
                  Ver Planos <ArrowRight size={14} />
                </Link>
                <Link href="/contact" className="btn-secondary" style={{ fontSize: 13, padding: '11px 22px' }}>
                  Contactar
                </Link>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {[
                { n: '4h', l: 'Tempo de Resposta (Business)' },
                { n: '24/7', l: 'Suporte Disponível' },
                { n: '60+', l: 'Clientes em Contrato' },
                { n: '99%', l: 'Taxa de Satisfação' },
              ].map((s, i) => (
                <div key={i} style={{ padding: '1.5rem', background: `rgba(255,183,77,0.04)`, border: `1px solid rgba(255,183,77,0.14)`, borderRadius: 14, textAlign: 'center' }}>
                  <div className="font-rajdhani font-black" style={{ fontSize: 34, color: COLOR, lineHeight: 1 }}>{s.n}</div>
                  <div style={{ fontSize: 11, color: 'var(--slate)', marginTop: 6 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section style={{ padding: '3rem 2rem 6rem', background: 'linear-gradient(135deg, rgba(13,32,68,0.6) 0%, rgba(10,22,40,0.95) 100%)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: COLOR, textTransform: 'uppercase', marginBottom: '0.6rem', textAlign: 'center' }}>Contratos</div>
          <h2 className="font-rajdhani font-black" style={{ fontSize: 'clamp(24px,4vw,36px)', letterSpacing: 1, color: 'var(--text)', marginBottom: '2.5rem', textAlign: 'center' }}>
            Planos de Manutenção
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
            {plans.map((plan, i) => (
              <div key={i} className="card-base" style={{
                padding: '2rem',
                border: plan.highlight ? `1px solid ${COLOR}40` : '1px solid var(--border)',
                background: plan.highlight ? `rgba(255,183,77,0.04)` : undefined,
              }}>
                {plan.highlight && (
                  <div style={{ fontSize: 9, padding: '2px 10px', background: `${COLOR}20`, color: COLOR, borderRadius: 20, display: 'inline-block', marginBottom: '0.75rem', fontWeight: 700, letterSpacing: 1 }}>
                    MAIS POPULAR
                  </div>
                )}
                <h3 className="font-rajdhani font-bold" style={{ fontSize: 22, color: plan.highlight ? COLOR : 'var(--silver2)', marginBottom: '0.25rem' }}>{plan.name}</h3>
                <div style={{ fontSize: 11, color: 'var(--slate)', marginBottom: '1.25rem' }}>{plan.desc}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                  {plan.items.map((item, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <CheckCircle2 size={12} color={COLOR} style={{ flexShrink: 0, opacity: plan.highlight ? 1 : 0.6 }} />
                      <span style={{ fontSize: 12, color: 'var(--text2)' }}>{item}</span>
                    </div>
                  ))}
                </div>
                <Link href="/quote" className={plan.highlight ? 'btn-primary' : 'btn-secondary'} style={{ fontSize: 12, padding: '10px', width: '100%', justifyContent: 'center', display: 'flex' }}>
                  Pedir Proposta
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '5rem 2rem', background: 'var(--navy3)', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
          <h2 className="font-rajdhani font-black" style={{ fontSize: 'clamp(24px,4vw,38px)', letterSpacing: 1, color: 'var(--text)', marginBottom: '0.75rem' }}>
            TI sem stress, por contrato
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.75, marginBottom: '2rem' }}>
            Diagnóstico gratuito do ambiente atual e proposta personalizada.
          </p>
          <Link href="/quote" className="btn-primary" style={{ fontSize: 14, padding: '13px 28px' }}>
            Solicitar Proposta ↗
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
