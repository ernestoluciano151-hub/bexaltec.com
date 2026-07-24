import type { Metadata } from 'next'
import Link from 'next/link'
import { NavBar } from '@/components/ui/NavBar'
import { Footer } from '@/components/ui/Footer'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Sobre Nós — Bexaltec · Empresa de TI Angola',
  description: 'Conheça a Bexaltec, empresa angolana especializada em tecnologia da informação desde 2018. Equipa certificada, projetos turnkey, presença nacional.',
}

const kpis = [
  { n: '6+', l: 'Anos no Mercado' },
  { n: '120+', l: 'Projetos Concluídos' },
  { n: '60+', l: 'Clientes Ativos' },
  { n: '11', l: 'CAEs Registadas' },
]

const values = [
  { ico: '🎯', t: 'Foco no Cliente', d: 'Cada projeto é único. Estudamos o contexto e desenvolvemos soluções adaptadas às necessidades reais.' },
  { ico: '🔬', t: 'Rigor Técnico', d: 'Profissionais certificados, equipamentos de diagnóstico profissional e processos de qualidade documentados.' },
  { ico: '🛡️', t: 'Responsabilidade', d: 'Assumimos total responsabilidade pelos projetos que entregamos, com garantia e suporte pós-instalação.' },
  { ico: '🚀', t: 'Inovação', d: 'Mantemo-nos atualizados com as mais recentes tecnologias e metodologias do sector.' },
]

const caes = [
  { ref: 'CAE 62010', name: 'Atividades de programação informática' },
  { ref: 'CAE 62020', name: 'Consultoria em informática' },
  { ref: 'CAE 62030', name: 'Gestão e exploração de equipamentos informáticos' },
  { ref: 'CAE 62090', name: 'Outras atividades dos serviços de informática' },
  { ref: 'CAE 63110', name: 'Atividades de processamento de dados' },
  { ref: 'CAE 63120', name: 'Atividades dos portais Web' },
  { ref: 'CAE 47410', name: 'Comércio retalhista de computadores' },
  { ref: 'CAE 95110', name: 'Reparação de computadores e equipamentos periféricos' },
  { ref: 'CAE 95120', name: 'Reparação de equipamentos de comunicação' },
  { ref: 'CAE 46520', name: 'Comércio por grosso de equipamentos eletrónicos' },
  { ref: 'CAE 80200', name: 'Atividades de sistemas de segurança' },
]

export default function AboutPage() {
  return (
    <div style={{ background: 'var(--navy)', minHeight: '100vh' }}>
      <NavBar />

      {/* Hero */}
      <section style={{ padding: '120px 2rem 5rem', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 40% 40%, rgba(0,230,118,0.05) 0%, transparent 55%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div className="section-badge">Sobre Nós</div>
          <h1 className="font-rajdhani font-black" style={{ fontSize: 'clamp(32px,5vw,60px)', letterSpacing: 2, color: 'var(--text)', lineHeight: 1, marginBottom: '1.5rem' }}>
            QUEM SOMOS
          </h1>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>
            <div>
              <p style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.85, marginBottom: '1rem' }}>
                A Bexaltec é uma empresa angolana especializada em soluções de tecnologia da informação, com sede em Luanda. Fundada com o objectivo de modernizar a infraestrutura tecnológica das empresas e instituições angolanas.
              </p>
              <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.85, marginBottom: '2rem' }}>
                Contamos com uma equipa multidisciplinar de técnicos certificados, capaz de responder a projetos de qualquer dimensão — desde a reparação de um smartphone ao nível de componentes até à implementação de redes empresariais em grandes instituições públicas.
              </p>
              <Link href="/quote" className="btn-primary" style={{ fontSize: 13, padding: '11px 24px' }}>
                Trabalhar Connosco <ArrowRight size={14} />
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {kpis.map((k, i) => (
                <div key={i} style={{ padding: '1.5rem', background: 'rgba(0,230,118,0.04)', border: '1px solid rgba(0,230,118,0.14)', borderRadius: 14, textAlign: 'center' }}>
                  <div className="font-rajdhani font-black" style={{ fontSize: 40, color: 'var(--green)', lineHeight: 1 }}>{k.n}</div>
                  <div style={{ fontSize: 11, color: 'var(--slate)', marginTop: 6 }}>{k.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{ padding: '5rem 2rem', background: 'linear-gradient(135deg, rgba(13,32,68,0.5) 0%, rgba(10,22,40,0.9) 100%)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="section-badge">Valores</div>
          <h2 className="font-rajdhani font-black" style={{ fontSize: 'clamp(26px,4vw,38px)', letterSpacing: 1, color: 'var(--text)', marginBottom: '2.5rem' }}>
            O Que Nos Define
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            {values.map((v, i) => (
              <div key={i} className="card-base" style={{ padding: '1.75rem' }}>
                <div style={{ fontSize: 28, marginBottom: '0.85rem' }}>{v.ico}</div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--silver2)', marginBottom: '0.5rem' }}>{v.t}</h3>
                <p style={{ fontSize: 12, color: 'var(--slate)', lineHeight: 1.7 }}>{v.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CAEs */}
      <section style={{ padding: '5rem 2rem', background: 'var(--navy)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="section-badge">Actividades Licenciadas</div>
          <h2 className="font-rajdhani font-black" style={{ fontSize: 'clamp(24px,4vw,36px)', letterSpacing: 1, color: 'var(--text)', marginBottom: '0.5rem' }}>
            Classificações de Atividade (CAEs)
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: '2rem', maxWidth: 520 }}>
            Empresa devidamente licenciada com 11 CAEs registadas, cobrindo todas as atividades de TI, segurança, comércio e reparação.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '0.6rem' }}>
            {caes.map((cae, i) => (
              <div key={i} className="card-base" style={{ display: 'flex', gap: '0.85rem', padding: '0.9rem 1.1rem', alignItems: 'flex-start' }}>
                <span style={{ fontSize: 11, color: 'rgba(0,230,118,0.5)', letterSpacing: 1, flexShrink: 0, minWidth: 56, paddingTop: 1, fontFamily: 'var(--font-mono)' }}>{cae.ref}</span>
                <span style={{ fontSize: 12, color: 'var(--silver2)', lineHeight: 1.5 }}>{cae.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '5rem 2rem', background: 'var(--navy3)', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
          <h2 className="font-rajdhani font-black" style={{ fontSize: 'clamp(24px,4vw,40px)', letterSpacing: 1, color: 'var(--text)', marginBottom: '0.75rem' }}>
            Vamos Trabalhar Juntos
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.75, marginBottom: '2rem' }}>
            Seja para reparar um dispositivo ou implementar infraestrutura empresarial, a Bexaltec tem a solução certa.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/quote" className="btn-primary" style={{ fontSize: 14, padding: '12px 26px' }}>Pedir Orçamento ↗</Link>
            <Link href="/contact" className="btn-secondary" style={{ fontSize: 14, padding: '12px 26px' }}>Contactar</Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
