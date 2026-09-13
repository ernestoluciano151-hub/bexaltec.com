import type { Metadata } from 'next'
import Link from 'next/link'
import { NavBar } from '@/components/ui/NavBar'
import { Footer } from '@/components/ui/Footer'
import { CONTACT, whatsappLink, telLink, mailLink } from '@/lib/contact'

export const metadata: Metadata = {
  title: 'Contacto — Bexaltec · Luanda, Angola',
  description: `Entre em contacto com a Bexaltec. Telefone e WhatsApp ${CONTACT.phoneDisplay}, email ${CONTACT.email}. Luanda, Angola. Resposta em 24 horas.`,
}

const channels = [
  {
    ico: '💬',
    title: 'WhatsApp',
    value: CONTACT.phoneDisplay,
    sub: 'A via mais rápida · resposta em horário laboral',
    href: whatsappLink('Olá Bexaltec, gostaria de mais informações sobre os vossos serviços.'),
    external: true,
    highlight: true,
  },
  {
    ico: '📞',
    title: 'Telefone',
    value: CONTACT.phoneDisplay,
    sub: CONTACT.hoursShort,
    href: telLink,
  },
  {
    ico: '📧',
    title: 'Email',
    value: CONTACT.email,
    sub: 'Resposta em até 24 horas úteis',
    href: mailLink,
  },
  {
    ico: '🕐',
    title: 'Horário',
    value: CONTACT.hoursShort,
    sub: 'Sábado 09h–13h · Emergências 24/7 para clientes com contrato',
  },
  {
    ico: '📍',
    title: 'Onde estamos',
    value: CONTACT.city,
    sub: 'Visitas técnicas em todo o território nacional · atendimento por marcação',
  },
]

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

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '2rem', alignItems: 'start' }}>
            {/* Canais de contacto */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {channels.map(c => {
                const inner = (
                  <>
                    <div style={{ fontSize: 24 }}>{c.ico}</div>
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: 'var(--green)', textTransform: 'uppercase', marginBottom: 4 }}>{c.title}</div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--silver2)', marginBottom: 3 }}>{c.value}</div>
                      <div style={{ fontSize: 11, color: 'var(--text2)' }}>{c.sub}</div>
                    </div>
                  </>
                )
                const style: React.CSSProperties = {
                  padding: '1.25rem 1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start',
                  textDecoration: 'none', transition: 'all 0.25s',
                  ...(c.highlight ? { background: 'rgba(0,230,118,0.05)', border: '1px solid rgba(0,230,118,0.22)' } : null),
                }
                return c.href ? (
                  <a
                    key={c.title}
                    href={c.href}
                    target={c.external ? '_blank' : undefined}
                    rel={c.external ? 'noopener noreferrer' : undefined}
                    className="card-base card-glow"
                    style={style}>
                    {inner}
                  </a>
                ) : (
                  <div key={c.title} className="card-base" style={style}>{inner}</div>
                )
              })}
            </div>

            {/* Ações */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="card-base" style={{ padding: '1.75rem', background: 'rgba(0,230,118,0.04)', border: '1px solid rgba(0,230,118,0.18)' }}>
                <div className="font-rajdhani font-black" style={{ fontSize: 22, letterSpacing: 1, color: 'var(--text)', marginBottom: '0.5rem' }}>
                  PRECISA DE UM ORÇAMENTO?
                </div>
                <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.7, marginBottom: '1.25rem' }}>
                  Preencha o formulário com os detalhes do projeto e recebe uma proposta detalhada em até 24 horas úteis. Gratuito e sem compromisso.
                </p>
                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                  <Link href="/quote" className="btn-primary" style={{ fontSize: 13, padding: '11px 22px' }}>
                    Pedir Orçamento ↗
                  </Link>
                  <a
                    href={whatsappLink('Olá Bexaltec, gostaria de pedir um orçamento.')}
                    target="_blank" rel="noopener noreferrer"
                    className="btn-secondary" style={{ fontSize: 13, padding: '11px 22px' }}>
                    Falar por WhatsApp
                  </a>
                </div>
              </div>

              <div className="card-base" style={{ padding: '1.5rem' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--silver2)', marginBottom: '0.85rem' }}>Atalhos Rápidos</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  <Link href="/services/laboratory" style={{ fontSize: 13, color: 'var(--text2)', textDecoration: 'none' }}>→ Entregar dispositivo para reparação</Link>
                  <Link href="/services/infrastructure" style={{ fontSize: 13, color: 'var(--text2)', textDecoration: 'none' }}>→ Solicitar estudo de infraestrutura</Link>
                  <Link href="/portfolio" style={{ fontSize: 13, color: 'var(--text2)', textDecoration: 'none' }}>→ Ver projetos realizados</Link>
                  <Link href="/login" style={{ fontSize: 13, color: 'var(--text2)', textDecoration: 'none' }}>→ Aceder ao portal do cliente</Link>
                </div>
              </div>

              <div className="card-base" style={{ padding: '1.5rem' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--silver2)', marginBottom: '0.6rem' }}>Assistência urgente</div>
                <p style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.7, marginBottom: '1rem' }}>
                  Clientes com contrato de manutenção têm linha de emergência 24/7. Abra um ticket no portal ou ligue diretamente.
                </p>
                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                  <a href={telLink} className="btn-secondary" style={{ fontSize: 12, padding: '9px 18px' }}>
                    Ligar {CONTACT.phoneDisplay}
                  </a>
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
