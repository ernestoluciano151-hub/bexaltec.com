import type { Metadata } from 'next'
import Link from 'next/link'
import { NavBar } from '@/components/ui/NavBar'
import { Footer } from '@/components/ui/Footer'
import { ArrowRight, Microscope, Server, CheckCircle2, Play } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Bexaltec — Soluções Informáticas · Luanda, Angola',
  description: 'Empresa angolana especializada em laboratório de reparação de dispositivos, infraestrutura TI, segurança eletrónica e transformação digital. Luanda, Angola.',
  keywords: ['reparação iPhone Angola', 'infraestrutura TI Luanda', 'laboratório reparação', 'Bexaltec', 'TI Angola'],
  openGraph: {
    title: 'Bexaltec — Soluções Informáticas · Angola',
    description: 'Laboratório especializado em reparação ao nível de componentes. Infraestrutura TI para empresas angolanas.',
    url: 'https://bexaltec.ao',
    siteName: 'Bexaltec',
    locale: 'pt_AO',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bexaltec — Soluções Informáticas · Angola',
    description: 'Laboratório especializado + Infraestrutura TI para empresas angolanas.',
  },
}

// ── Data ──────────────────────────────────────────────────────────────────────
const stats = [
  { n: '6+', l: 'Anos no Mercado' },
  { n: '120+', l: 'Projetos Concluídos' },
  { n: '60+', l: 'Empresas Clientes' },
  { n: '24h', l: 'Tempo de Resposta' },
]

const labServices = [
  { label: 'iPhone & iOS', detail: 'Ecrã, bateria, câmera, placa' },
  { label: 'MacBook & Apple', detail: 'GPU, placa principal, teclado' },
  { label: 'Computadores & Notebooks', detail: 'Todas as marcas e modelos' },
  { label: 'Diagnóstico de Placas', detail: 'Microscópio + análise BGA' },
  { label: 'Soldadura SMD', detail: 'Componentes ao nível de chip' },
  { label: 'Consolas & Eletrónica', detail: 'PlayStation, Xbox, Nintendo' },
]

const infraServices = [
  'Cabeamento Estruturado Cat6A', 'Fibra Óptica Monomodo/Multimodo',
  'Rack & Patch Panel', 'Wireless Empresarial Wi-Fi 6',
  'Firewall & UTM', 'Switches Managed Cisco / HP',
  'Servidores Dell / HPE', 'Datacenter On-Premise',
]

const projects = [
  { category: 'Infraestrutura', client: 'Palácio da Justiça', detail: 'Pisos 6, 7 e 8 · Cabeamento estruturado + rede completa', year: '2024' },
  { category: 'Infraestrutura', client: 'Tribunal Constitucional', detail: 'Instalação rede corporativa · Fibra óptica + switches', year: '2023' },
  { category: 'Laboratório', client: 'Clientes Particulares', detail: '800+ dispositivos reparados ao nível de componentes', year: '2026' },
  { category: 'Segurança', client: 'Entidade Corporativa', detail: '24 câmeras Hikvision + NVR 4K + monitoramento remoto', year: '2025' },
]

const partners = [
  { name: 'Cisco', color: '#049FD9' }, { name: 'HP', color: '#0096D6' },
  { name: 'Microsoft', color: '#00A4EF' }, { name: 'Dell', color: '#007DB8' },
  { name: 'Hikvision', color: '#E02020' }, { name: 'Lenovo', color: '#E21C23' },
  { name: 'VMware', color: '#607078' }, { name: 'Fortinet', color: '#EE2124' },
  { name: 'Ubiquiti', color: '#0559C9' }, { name: 'AWS', color: '#FF9900' },
  { name: 'Azure', color: '#0078D4' }, { name: 'Dahua', color: '#C8102E' },
  { name: 'Huawei', color: '#CF0A2C' }, { name: 'APC', color: '#005B94' },
  { name: 'Synology', color: '#B5B5B6' }, { name: 'ZKTeco', color: '#004B87' },
  { name: 'Eaton', color: '#004B87' }, { name: 'Panduit', color: '#D31245' },
  { name: 'Odoo', color: '#714B67' }, { name: 'Google', color: '#4285F4' },
]

// ── Page ──────────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <div style={{ background: 'var(--navy)', minHeight: '100vh' }}>
      <NavBar />

      {/* ── HERO ── */}
      <section style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '100px 2rem 5rem', position: 'relative', overflow: 'hidden',
      }}>
        {/* Radial background */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse at 20% 50%, rgba(0,230,118,0.06) 0%, transparent 55%), radial-gradient(ellipse at 80% 20%, rgba(0,100,255,0.05) 0%, transparent 45%)',
        }} />
        {/* Circuit grid */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.04, pointerEvents: 'none' }} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#00E676" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        <div style={{ textAlign: 'center', position: 'relative', zIndex: 2, maxWidth: 880 }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '5px 16px', borderRadius: 20, marginBottom: '1.5rem',
            border: '1px solid rgba(0,230,118,0.25)', background: 'rgba(0,230,118,0.07)',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', display: 'block' }} />
            <span style={{ fontSize: 11, letterSpacing: 3, color: 'var(--green)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
              Soluções Informáticas · Angola
            </span>
          </div>

          <h1 className="font-rajdhani font-black gradient-text" style={{
            fontSize: 'clamp(60px, 10vw, 110px)',
            lineHeight: 0.88, letterSpacing: 6, marginBottom: '0.5rem',
          }}>
            BEXALTEC
          </h1>
          <p style={{
            fontSize: 'clamp(11px, 1.6vw, 14px)', letterSpacing: 6,
            color: 'var(--text2)', textTransform: 'uppercase', marginBottom: '1.25rem',
            fontFamily: 'var(--font-mono)',
          }}>
            Tecnologia que impulsiona o seu negócio
          </p>
          <p style={{
            fontSize: 'clamp(14px, 1.8vw, 17px)', color: 'var(--text2)',
            lineHeight: 1.8, maxWidth: 580, margin: '0 auto 2.5rem',
          }}>
            Laboratório especializado em reparação ao nível de componentes. Infraestrutura TI para empresas angolanas.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/services/laboratory" className="btn-primary" style={{ fontSize: 14, padding: '13px 28px' }}>
              <Microscope size={16} /> Laboratório de Reparação
            </Link>
            <Link href="/services/infrastructure" className="btn-secondary" style={{ fontSize: 14, padding: '13px 28px' }}>
              <Server size={16} /> Infraestrutura TI
            </Link>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginTop: '4rem', maxWidth: 640, marginLeft: 'auto', marginRight: 'auto' }}>
            {stats.map((s, i) => (
              <div key={i} className="card-base" style={{ padding: '1rem', textAlign: 'center' }}>
                <div className="font-rajdhani font-black" style={{ fontSize: 30, color: 'var(--green)', lineHeight: 1 }}>{s.n}</div>
                <div style={{ fontSize: 10, color: 'var(--slate)', marginTop: 4, letterSpacing: 0.5 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUEM SOMOS ── */}
      <section style={{ padding: '6rem 2rem', background: 'linear-gradient(135deg, rgba(13,32,68,0.5) 0%, rgba(10,22,40,0.8) 100%)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          <div>
            <div className="section-badge">Sobre Nós</div>
            <h2 className="font-rajdhani font-black" style={{ fontSize: 'clamp(28px,4vw,42px)', letterSpacing: 1, color: 'var(--text)', marginBottom: '1rem', lineHeight: 1.1 }}>
              Quem Somos
            </h2>
            <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.8, marginBottom: '0.85rem' }}>
              A Bexaltec é uma empresa angolana especializada em soluções de tecnologia da informação, com sede em Luanda. Contamos com uma equipa multidisciplinar de técnicos certificados.
            </p>
            <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.8, marginBottom: '2rem' }}>
              Do laboratório de reparação ao nível de componentes à implementação de infraestrutura empresarial de grande escala — somos o parceiro tecnológico que as empresas angolanas precisam.
            </p>
            <Link href="/about" className="btn-secondary" style={{ fontSize: 13, padding: '10px 22px' }}>
              Conhecer a empresa <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { ico: '🏅', t: 'Equipa Certificada', d: 'Profissionais com certificações Cisco, Microsoft, CompTIA e outras.' },
              { ico: '🔬', t: 'Laboratório Próprio', d: 'Equipamento de diagnóstico avançado com microscópio profissional.' },
              { ico: '🎯', t: 'Projetos Turnkey', d: 'Fornecimento + instalação + configuração + formação + garantia.' },
              { ico: '🗺️', t: 'Presença Nacional', d: 'Projetos em todo o território angolano com equipas técnicas móveis.' },
            ].map((item, i) => (
              <div key={i} className="card-base" style={{ display: 'flex', gap: '0.85rem', padding: '1rem 1.1rem', alignItems: 'flex-start' }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 9, flexShrink: 0,
                  background: 'rgba(0,230,118,0.08)', border: '1px solid rgba(0,230,118,0.18)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17,
                }}>
                  {item.ico}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--silver2)', marginBottom: 3 }}>{item.t}</div>
                  <div style={{ fontSize: 12, color: 'var(--slate)', lineHeight: 1.55 }}>{item.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LABORATÓRIO (Diferencial #1) ── */}
      <section style={{ padding: '6rem 2rem', background: 'var(--navy)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '3rem' }}>
            <div style={{ maxWidth: 540 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 20, background: 'rgba(0,230,118,0.08)', border: '1px solid rgba(0,230,118,0.25)', marginBottom: '0.75rem' }}>
                <Microscope size={12} color="var(--green)" />
                <span style={{ fontSize: 10, letterSpacing: 3, color: 'var(--green)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>DIFERENCIAL #1</span>
              </div>
              <h2 className="font-rajdhani font-black" style={{ fontSize: 'clamp(26px,4vw,42px)', letterSpacing: 1, color: 'var(--text)', lineHeight: 1.05, marginBottom: '0.75rem' }}>
                Laboratório Especializado<br />
                <span style={{ color: 'var(--green)' }}>Reparação ao Nível de Componentes</span>
              </h2>
              <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.75 }}>
                Centro técnico com microscópio profissional, equipamento BGA e soldadura SMD. Reparamos o que outros dizem ser irrecuperável.
              </p>
            </div>
            <Link href="/services/laboratory" className="btn-primary" style={{ fontSize: 13, padding: '10px 22px', flexShrink: 0, alignSelf: 'flex-start' }}>
              Ver laboratório completo <ArrowRight size={14} />
            </Link>
          </div>

          {/* Services grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem', marginBottom: '2.5rem' }}>
            {labServices.map((svc, i) => (
              <div key={i} className="card-base card-glow" style={{ padding: '1.1rem 1.25rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start', transition: 'all 0.25s' }}>
                <CheckCircle2 size={16} color="var(--green)" style={{ marginTop: 2, flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--silver2)', marginBottom: 2 }}>{svc.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--slate)' }}>{svc.detail}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Photo grid + Video */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem' }}>
            {/* Photo grid placeholder */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {[
                'Microscópio Profissional', 'Diagnóstico de Placa',
                'Soldadura SMD', 'Reparação iPhone'
              ].map((label, i) => (
                <div key={i} style={{
                  aspectRatio: '4/3', background: 'var(--card)',
                  border: '1px solid var(--border)', borderRadius: 12,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6,
                }}>
                  <div style={{ fontSize: 24, opacity: 0.3 }}>📸</div>
                  <div style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: 1 }}>{label}</div>
                </div>
              ))}
            </div>
            {/* Video placeholder — ready for vturb/YouTube/Vimeo */}
            <div style={{
              background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 16,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem',
              padding: '2rem', minHeight: 260,
            }}>
              <div style={{
                width: 60, height: 60, borderRadius: '50%',
                background: 'rgba(0,230,118,0.1)', border: '1px solid rgba(0,230,118,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Play size={22} color="var(--green)" />
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--silver2)', marginBottom: 4 }}>Veja o laboratório em ação</div>
                <div style={{ fontSize: 11, color: 'var(--slate)', lineHeight: 1.6 }}>
                  Vídeo do processo de reparação<br />
                  <span style={{ color: 'var(--forest)', fontSize: 10 }}>Espaço reservado · vturb / YouTube / Vimeo</span>
                </div>
              </div>
            </div>
          </div>

          {/* Lab stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '1.5rem' }}>
            {[
              { n: '800+', l: 'Dispositivos Reparados' },
              { n: '95%', l: 'Taxa de Sucesso' },
              { n: '3–7d', l: 'Prazo Médio de Entrega' },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '1rem', background: 'rgba(0,230,118,0.04)', border: '1px solid rgba(0,230,118,0.12)', borderRadius: 12 }}>
                <div className="font-rajdhani font-black" style={{ fontSize: 28, color: 'var(--green)', lineHeight: 1 }}>{s.n}</div>
                <div style={{ fontSize: 11, color: 'var(--slate)', marginTop: 4 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INFRAESTRUTURA TI (Diferencial #2) ── */}
      <section style={{ padding: '6rem 2rem', background: 'linear-gradient(135deg, rgba(13,32,68,0.5) 0%, rgba(10,22,40,0.9) 100%)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '3rem' }}>
            <div style={{ maxWidth: 540 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 20, background: 'rgba(66,165,245,0.08)', border: '1px solid rgba(66,165,245,0.25)', marginBottom: '0.75rem' }}>
                <Server size={12} color="#42A5F5" />
                <span style={{ fontSize: 10, letterSpacing: 3, color: '#42A5F5', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>DIFERENCIAL #2</span>
              </div>
              <h2 className="font-rajdhani font-black" style={{ fontSize: 'clamp(26px,4vw,42px)', letterSpacing: 1, color: 'var(--text)', lineHeight: 1.05, marginBottom: '0.75rem' }}>
                Infraestrutura de TI<br />
                <span style={{ color: '#42A5F5' }}>Projetos Empresariais de Grande Escala</span>
              </h2>
              <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.75 }}>
                Cabeamento estruturado, fibra óptica, datacenter e redes empresariais. Projetos turnkey para os maiores clientes de Angola.
              </p>
            </div>
            <Link href="/services/infrastructure" className="btn-secondary" style={{ fontSize: 13, padding: '10px 22px', flexShrink: 0, alignSelf: 'flex-start' }}>
              Ver infraestrutura completa <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem', alignItems: 'start' }}>
            {/* Services list */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
              {infraServices.map((svc, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0.7rem 0.9rem', background: 'rgba(66,165,245,0.05)', border: '1px solid rgba(66,165,245,0.15)', borderRadius: 8 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#42A5F5', flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: 'var(--text2)' }}>{svc}</span>
                </div>
              ))}
            </div>

            {/* Proof social — case studies */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: 'var(--slate)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                Casos de Referência
              </div>
              {[
                { client: 'Palácio da Justiça', detail: 'Cabeamento estruturado + rede completa · Pisos 6, 7 e 8', year: '2024', icon: '🏛️' },
                { client: 'Tribunal Constitucional', detail: 'Rede corporativa · Fibra óptica + switches managed', year: '2023', icon: '⚖️' },
              ].map((cs, i) => (
                <div key={i} className="card-base" style={{ padding: '1.25rem', borderLeft: '3px solid #42A5F5' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <span style={{ fontSize: 24 }}>{cs.icon}</span>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--silver2)', marginBottom: 4 }}>{cs.client}</div>
                      <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.6, marginBottom: 6 }}>{cs.detail}</div>
                      <div style={{ fontSize: 10, color: 'var(--forest)', letterSpacing: 1 }}>PROJETO {cs.year}</div>
                    </div>
                  </div>
                </div>
              ))}
              <Link href="/portfolio" style={{ fontSize: 12, color: '#42A5F5', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4, marginTop: '0.25rem' }}>
                Ver todos os projetos <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── PROJETOS (preview) ── */}
      <section style={{ padding: '6rem 2rem', background: 'var(--navy)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div className="section-badge">Portfólio</div>
              <h2 className="font-rajdhani font-black" style={{ fontSize: 'clamp(26px,4vw,40px)', letterSpacing: 1, color: 'var(--text)' }}>Projetos Realizados</h2>
            </div>
            <Link href="/portfolio" className="btn-secondary" style={{ fontSize: 13, padding: '9px 20px' }}>
              Ver portfólio completo <ArrowRight size={13} />
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            {projects.map((p, i) => (
              <div key={i} className="card-base card-glow" style={{ padding: '1.5rem', transition: 'all 0.25s' }}>
                <div style={{ fontSize: 10, letterSpacing: 2, color: 'var(--green)', textTransform: 'uppercase', marginBottom: '0.6rem', fontFamily: 'var(--font-mono)' }}>{p.category}</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--silver2)', marginBottom: '0.4rem' }}>{p.client}</div>
                <div style={{ fontSize: 12, color: 'var(--slate)', lineHeight: 1.6, marginBottom: '0.75rem' }}>{p.detail}</div>
                <div style={{ fontSize: 10, color: 'var(--forest)' }}>{p.year}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PARCEIROS ── */}
      <section style={{ padding: '5rem 2rem', background: 'linear-gradient(135deg, rgba(13,32,68,0.4) 0%, var(--navy) 100%)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="section-badge">Fabricantes & Parceiros</div>
          <h2 className="font-rajdhani font-black" style={{ fontSize: 'clamp(24px,4vw,36px)', letterSpacing: 1, color: 'var(--text)', marginBottom: '0.5rem' }}>
            Marcas que Representamos
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: '2rem', maxWidth: 500 }}>
            Trabalhamos com os principais fabricantes e plataformas do mercado global.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '0.65rem' }}>
            {partners.map(p => (
              <div key={p.name} className="card-base card-glow" style={{ padding: '0.85rem', textAlign: 'center', transition: 'all 0.25s' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.color, margin: '0 auto 0.5rem' }} />
                <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--silver2)' }}>{p.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '7rem 2rem', background: 'var(--navy3)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 50%, rgba(0,230,118,0.05) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div className="section-badge" style={{ justifyContent: 'center' }}>Próximo Passo</div>
          <h2 className="font-rajdhani font-black" style={{ fontSize: 'clamp(28px,5vw,52px)', letterSpacing: 2, color: 'var(--text)', marginBottom: '1rem', lineHeight: 1.05 }}>
            Pronto para Avançar?
          </h2>
          <p style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.75, marginBottom: '2.5rem' }}>
            Fale com a nossa equipa. Orçamentos gratuitos, resposta em 24 horas, projetos em todo o território angolano.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/quote" className="btn-primary" style={{ fontSize: 15, padding: '14px 32px' }}>
              Pedir Orçamento Gratuito ↗
            </Link>
            <Link href="/contact" className="btn-secondary" style={{ fontSize: 15, padding: '14px 32px' }}>
              Falar com um Técnico
            </Link>
          </div>
          <div style={{ marginTop: '2rem', display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {['Orçamento Gratuito', 'Resposta em 24h', 'Presença Nacional', 'Projetos Turnkey'].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--slate)' }}>
                <CheckCircle2 size={13} color="var(--green)" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
