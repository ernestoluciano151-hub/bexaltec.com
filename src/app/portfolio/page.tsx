import type { Metadata } from 'next'
import Link from 'next/link'
import { NavBar } from '@/components/ui/NavBar'
import { Footer } from '@/components/ui/Footer'

export const metadata: Metadata = {
  title: 'Portfólio — Bexaltec · Projetos em Angola',
  description: 'Portfólio de projetos Bexaltec: infraestrutura TI, laboratório de reparação, segurança eletrónica, software e muito mais. Casos reais em Angola.',
}

const projects = [
  { category: 'Infraestrutura', client: 'Palácio da Justiça', detail: 'Cabeamento estruturado Cat6A + switches Cisco · Pisos 6, 7 e 8', year: '2024', highlight: true },
  { category: 'Infraestrutura', client: 'Tribunal Constitucional', detail: 'Rede corporativa completa · Fibra óptica + switches Layer 3 + firewall', year: '2023', highlight: true },
  { category: 'Laboratório', client: 'Clientes Particulares', detail: '800+ dispositivos reparados ao nível de componentes · iPhone, MacBook, Computadores', year: '2022–2026' },
  { category: 'Segurança', client: 'Empresa Privada (Confidencial)', detail: '24 câmeras Hikvision 4K + NVR + monitoramento remoto + controlo de acessos biométrico', year: '2025' },
  { category: 'Software', client: 'Escola Superior (Confidencial)', detail: 'Sistema de gestão escolar ERP customizado · Matrículas, notas, financeiro', year: '2023' },
  { category: 'Web & Hosting', client: 'Grupo Empresarial (Confidencial)', detail: 'Website corporativo + email @empresa.ao + hospedagem VPS gerida', year: '2024' },
  { category: 'Redes', client: 'Empresa Industrial (Confidencial)', detail: 'Rede industrial + wireless cobertura total fábrica + VLAN por departamento', year: '2024' },
  { category: 'Datacenter', client: 'Instituição Financeira (Confidencial)', detail: 'Datacenter on-premise completo · Servidores Dell + VMware + Storage SAN + UPS', year: '2023' },
]

const categories = ['Todos', 'Infraestrutura', 'Laboratório', 'Segurança', 'Software', 'Web & Hosting', 'Redes', 'Datacenter']

const catColors: Record<string, string> = {
  'Infraestrutura': '#42A5F5', 'Laboratório': '#00E676', 'Segurança': '#EF5350',
  'Software': '#CE93D8', 'Web & Hosting': '#4DD0E1', 'Redes': '#FFB74D',
  'Datacenter': '#A5D6A7',
}

export default function PortfolioPage() {
  return (
    <div style={{ background: 'var(--navy)', minHeight: '100vh' }}>
      <NavBar />

      {/* Header */}
      <section style={{ padding: '120px 2rem 4rem', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 30%, rgba(0,230,118,0.04) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div className="section-badge" style={{ justifyContent: 'center' }}>Portfólio</div>
          <h1 className="font-rajdhani font-black" style={{ fontSize: 'clamp(32px,5vw,60px)', letterSpacing: 2, color: 'var(--text)', lineHeight: 1, marginBottom: '1rem' }}>
            PROJETOS REALIZADOS
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.75, maxWidth: 520, margin: '0 auto' }}>
            Uma selecção de projetos entregues pela Bexaltec em Angola.
          </p>
        </div>
      </section>

      {/* Highlighted projects */}
      <section style={{ padding: '1rem 2rem 3rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: 'var(--green)', textTransform: 'uppercase', marginBottom: '1rem' }}>
            Casos de Referência
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '3rem' }}>
            {projects.filter(p => p.highlight).map((p, i) => (
              <div key={i} className="card-base" style={{ padding: '2rem', borderLeft: `3px solid ${catColors[p.category] ?? 'var(--green)'}` }}>
                <div style={{ fontSize: 10, letterSpacing: 2, color: catColors[p.category] ?? 'var(--green)', textTransform: 'uppercase', marginBottom: '0.5rem', fontFamily: 'var(--font-mono)' }}>{p.category}</div>
                <h3 className="font-rajdhani font-bold" style={{ fontSize: 22, color: 'var(--silver2)', marginBottom: '0.5rem', letterSpacing: 0.5 }}>{p.client}</h3>
                <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.7, marginBottom: '1rem' }}>{p.detail}</p>
                {/* Photo placeholder */}
                <div style={{ width: '100%', aspectRatio: '16/7', background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 6 }}>
                  <div style={{ fontSize: 24, opacity: 0.2 }}>📷</div>
                  <div style={{ fontSize: 9, color: 'var(--muted)', letterSpacing: 1 }}>FOTOGRAFIA DO PROJETO</div>
                </div>
                <div style={{ marginTop: '0.75rem', fontSize: 10, color: 'var(--forest)', letterSpacing: 1 }}>PROJETO {p.year}</div>
              </div>
            ))}
          </div>

          {/* All projects */}
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: 'var(--slate)', textTransform: 'uppercase', marginBottom: '1rem' }}>
            Outros Projetos
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            {projects.filter(p => !p.highlight).map((p, i) => (
              <div key={i} className="card-base card-glow" style={{ padding: '1.5rem', transition: 'all 0.25s' }}>
                <div style={{ width: '100%', aspectRatio: '16/9', background: 'var(--card2)', border: '1px solid var(--border)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <div style={{ fontSize: 20, opacity: 0.15 }}>📷</div>
                </div>
                <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, background: `${catColors[p.category] ?? 'var(--green)'}12`, border: `1px solid ${catColors[p.category] ?? 'var(--green)'}22`, color: catColors[p.category] ?? 'var(--green)', display: 'inline-block', marginBottom: '0.5rem' }}>
                  {p.category}
                </span>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--silver2)', marginBottom: '0.4rem' }}>{p.client}</h3>
                <p style={{ fontSize: 12, color: 'var(--slate)', lineHeight: 1.6, marginBottom: '0.5rem' }}>{p.detail}</p>
                <div style={{ fontSize: 10, color: 'var(--forest)' }}>{p.year}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '5rem 2rem', background: 'var(--navy3)', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
          <h2 className="font-rajdhani font-black" style={{ fontSize: 'clamp(24px,4vw,40px)', letterSpacing: 1, color: 'var(--text)', marginBottom: '0.75rem' }}>
            O Seu Projeto É o Próximo
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.75, marginBottom: '2rem' }}>
            Venha fazer parte do nosso portfólio. Orçamento gratuito, resposta rápida.
          </p>
          <Link href="/quote" className="btn-primary" style={{ fontSize: 14, padding: '13px 28px' }}>
            Pedir Orçamento ↗
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
