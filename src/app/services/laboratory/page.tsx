import type { Metadata } from 'next'
import Link from 'next/link'
import { NavBar } from '@/components/ui/NavBar'
import { Footer } from '@/components/ui/Footer'
import { Microscope, CheckCircle2, ArrowRight, Play, Clock, Shield, Award, ChevronRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Laboratório de Reparação — Bexaltec · Luanda, Angola',
  description: 'Laboratório especializado em reparação de iPhone, MacBook, computadores e eletrónica ao nível de componentes com microscópio profissional e soldadura SMD. Luanda, Angola.',
  keywords: ['reparação iPhone Luanda', 'reparação MacBook Angola', 'laboratório eletrónica', 'soldadura SMD Angola', 'diagnóstico placa Luanda'],
  openGraph: {
    title: 'Laboratório de Reparação — Bexaltec',
    description: 'Reparação ao nível de componentes. iPhone, MacBook, computadores, consolas. Microscópio profissional. Soldadura SMD.',
    url: 'https://bexaltec.ao/services/laboratory',
  },
}

// ── Data ──────────────────────────────────────────────────────────────────────
const devices = [
  {
    category: 'iPhone & iOS',
    icon: '📱',
    services: ['Substituição de ecrã', 'Troca de bateria', 'Reparação câmera', 'Diagnóstico de placa lógica', 'Componentes Face ID', 'Conector de carga'],
  },
  {
    category: 'MacBook & Apple',
    icon: '💻',
    services: ['Diagnóstico GPU/CPU', 'Reparação placa principal', 'Substituição teclado', 'Ecrã Retina', 'Conector MagSafe/USB-C', 'Bateria & trackpad'],
  },
  {
    category: 'Computadores & Notebooks',
    icon: '🖥️',
    services: ['Reparação placa-mãe', 'Troca de disco SSD/HDD', 'Upgrade de RAM', 'Substituição ecrã', 'Limpeza e thermal paste', 'Recuperação de dados'],
  },
  {
    category: 'Consolas de Jogos',
    icon: '🎮',
    services: ['PlayStation 4/5', 'Xbox One/Series', 'Nintendo Switch', 'Erro HDMI', 'Problema de leitura', 'Diagnóstico completo'],
  },
  {
    category: 'Diagnóstico de Placas',
    icon: '🔬',
    services: ['Análise com microscópio', 'Teste de componentes', 'Medição de tensões', 'Identificação de curto', 'Análise BGA', 'Relatório técnico'],
  },
  {
    category: 'Soldadura SMD',
    icon: '⚡',
    services: ['Troca de componentes SMD', 'Reballing BGA', 'Reflow de GPU', 'Pontes e curtocircuitos', 'ICs e mosfets', 'Condensadores e resistências'],
  },
]

const process = [
  { n: '01', title: 'Receção', desc: 'Levantamos o equipamento e registamos o estado inicial com fotografia.' },
  { n: '02', title: 'Diagnóstico', desc: 'Análise completa com microscópio e equipamento de medição especializado.' },
  { n: '03', title: 'Orçamento', desc: 'Apresentamos orçamento detalhado antes de qualquer intervenção.' },
  { n: '04', title: 'Reparação', desc: 'Intervenção ao nível de componentes com peças de qualidade garantida.' },
  { n: '05', title: 'Teste', desc: 'Testes funcionais completos antes de qualquer entrega ao cliente.' },
  { n: '06', title: 'Entrega', desc: 'Entrega com relatório técnico e garantia sobre a intervenção realizada.' },
]

const stats = [
  { n: '800+', l: 'Dispositivos Reparados' },
  { n: '95%', l: 'Taxa de Sucesso' },
  { n: '3–7d', l: 'Prazo Médio' },
  { n: '30d', l: 'Garantia Incluída' },
]

// ── Page ──────────────────────────────────────────────────────────────────────
export default function LaboratoryPage() {
  return (
    <div style={{ background: 'var(--navy)', minHeight: '100vh' }}>
      <NavBar />

      {/* ── HERO ── */}
      <section style={{ padding: '120px 2rem 5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 50%, rgba(0,230,118,0.07) 0%, transparent 55%)', pointerEvents: 'none' }} />
        {/* Circuit grid */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.03, pointerEvents: 'none' }} xmlns="http://www.w3.org/2000/svg">
          <defs><pattern id="grid-lab" width="50" height="50" patternUnits="userSpaceOnUse"><path d="M 50 0 L 0 0 0 50" fill="none" stroke="#00E676" strokeWidth="0.5" /></pattern></defs>
          <rect width="100%" height="100%" fill="url(#grid-lab)" />
        </svg>

        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: '1.5rem', fontSize: 12, color: 'var(--slate)' }}>
            <Link href="/" style={{ color: 'var(--slate)', textDecoration: 'none' }}>Início</Link>
            <ChevronRight size={12} />
            <Link href="/services" style={{ color: 'var(--slate)', textDecoration: 'none' }}>Serviços</Link>
            <ChevronRight size={12} />
            <span style={{ color: 'var(--green)' }}>Laboratório</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 20, background: 'rgba(0,230,118,0.08)', border: '1px solid rgba(0,230,118,0.25)', marginBottom: '1rem' }}>
                <Microscope size={12} color="var(--green)" />
                <span style={{ fontSize: 10, letterSpacing: 3, color: 'var(--green)', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>DIFERENCIAL #1 · ÚNICO EM ANGOLA</span>
              </div>
              <h1 className="font-rajdhani font-black" style={{ fontSize: 'clamp(32px,5vw,56px)', lineHeight: 1, letterSpacing: 2, color: 'var(--text)', marginBottom: '1rem' }}>
                LABORATÓRIO<br />
                <span style={{ color: 'var(--green)' }}>ESPECIALIZADO</span>
              </h1>
              <p style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.8, marginBottom: '2rem' }}>
                Centro técnico com microscópio profissional, estação de soldadura SMD e equipamento de diagnóstico avançado. Reparamos ao nível de componentes o que outros não conseguem.
              </p>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                <Link href="/quote" className="btn-primary" style={{ fontSize: 13, padding: '11px 24px' }}>
                  Entregar Dispositivo ↗
                </Link>
                <Link href="/contact" className="btn-secondary" style={{ fontSize: 13, padding: '11px 24px' }}>
                  Falar com Técnico
                </Link>
              </div>

              {/* Quick guarantees */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {[
                  { icon: Clock, text: 'Orçamento em 24 horas · sem compromisso' },
                  { icon: Shield, text: 'Garantia de 30 dias sobre a reparação' },
                  { icon: Award, text: 'Técnicos certificados com microscópio profissional' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--slate)' }}>
                    <item.icon size={13} color="var(--green)" />
                    {item.text}
                  </div>
                ))}
              </div>
            </div>

            {/* Hero photo grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {['Microscópio Profissional', 'Soldadura SMD', 'Diagnóstico de Placa', 'Reparação iPhone'].map((label, i) => (
                <div key={i} style={{
                  aspectRatio: i === 0 ? '1/1.1' : '1/1',
                  gridRow: i === 0 ? 'span 1' : undefined,
                  background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6,
                }}>
                  <div style={{ fontSize: 28, opacity: 0.25 }}>📸</div>
                  <div style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: 1, textAlign: 'center', padding: '0 0.5rem' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginTop: '3rem' }}>
            {stats.map((s, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '1.25rem', background: 'rgba(0,230,118,0.04)', border: '1px solid rgba(0,230,118,0.14)', borderRadius: 12 }}>
                <div className="font-rajdhani font-black" style={{ fontSize: 32, color: 'var(--green)', lineHeight: 1 }}>{s.n}</div>
                <div style={{ fontSize: 11, color: 'var(--slate)', marginTop: 5 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEVICES WE REPAIR ── */}
      <section style={{ padding: '5rem 2rem', background: 'linear-gradient(135deg, rgba(13,32,68,0.5) 0%, rgba(10,22,40,0.9) 100%)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="section-badge">O Que Reparamos</div>
          <h2 className="font-rajdhani font-black" style={{ fontSize: 'clamp(26px,4vw,38px)', letterSpacing: 1, color: 'var(--text)', marginBottom: '0.5rem' }}>
            Dispositivos e Intervenções
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: '2.5rem', maxWidth: 520 }}>
            Reparação especializada ao nível de componentes, não apenas substituição de peças.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
            {devices.map((device, i) => (
              <div key={i} className="card-base card-glow" style={{ padding: '1.5rem', transition: 'all 0.25s' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <span style={{ fontSize: 24 }}>{device.icon}</span>
                  <h3 className="font-rajdhani font-semibold" style={{ fontSize: 16, color: 'var(--silver2)', letterSpacing: 0.5 }}>{device.category}</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {device.services.map((svc, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: 'var(--text2)' }}>
                      <CheckCircle2 size={12} color="var(--green)" style={{ flexShrink: 0 }} />
                      {svc}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROCESSO ── */}
      <section style={{ padding: '5rem 2rem', background: 'var(--navy)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="section-badge">Como Funciona</div>
          <h2 className="font-rajdhani font-black" style={{ fontSize: 'clamp(26px,4vw,38px)', letterSpacing: 1, color: 'var(--text)', marginBottom: '0.5rem' }}>
            Processo de Reparação
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: '3rem', maxWidth: 520 }}>
            Transparência total em cada etapa, do diagnóstico à entrega.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            {process.map((step, i) => (
              <div key={i} className="card-base" style={{ padding: '1.5rem', position: 'relative' }}>
                <div className="font-rajdhani font-black" style={{ fontSize: 36, color: 'rgba(0,230,118,0.15)', lineHeight: 1, marginBottom: '0.75rem', letterSpacing: 2 }}>
                  {step.n}
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--silver2)', marginBottom: '0.5rem' }}>{step.title}</h3>
                <p style={{ fontSize: 12, color: 'var(--slate)', lineHeight: 1.65 }}>{step.desc}</p>
                {i < process.length - 1 && (
                  <div style={{ position: 'absolute', top: '1.5rem', right: '-0.5rem', zIndex: 1, display: 'flex', alignItems: 'center' }}>
                    <ArrowRight size={14} color="rgba(0,230,118,0.25)" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VÍDEO (placeholder vturb-ready) ── */}
      <section style={{ padding: '5rem 2rem', background: 'linear-gradient(135deg, rgba(13,32,68,0.4) 0%, rgba(10,22,40,0.95) 100%)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div className="section-badge" style={{ justifyContent: 'center' }}>Em Ação</div>
            <h2 className="font-rajdhani font-black" style={{ fontSize: 'clamp(24px,4vw,36px)', letterSpacing: 1, color: 'var(--text)' }}>
              Veja o Laboratório a Trabalhar
            </h2>
          </div>

          {/*
            VÍDEO PLACEHOLDER — VTURB/YOUTUBE/VIMEO READY
            Para integrar vturb:
              <div id="vid_XXXXX" style={{ position: 'relative', width: '100%' }}>
                <img src="https://thumbnail.vturb.com.br/..." style={{ width: '100%' }} />
                <div id="backdrop_vid_XXXXX" style={{ backdropFilter: 'blur(5px)', position: 'absolute', inset: 0 }} />
              </div>
              <script src="https://cdn.converteai.net/lib/js/smartplayer/v1/sdk.min.js" .../>

            Para YouTube: <iframe src="https://www.youtube.com/embed/VIDEO_ID" .../>
            Para Vimeo:   <iframe src="https://player.vimeo.com/video/VIDEO_ID" .../>
          */}
          <div style={{
            width: '100%', aspectRatio: '16/9',
            background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 20,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.25rem',
          }}>
            <div style={{
              width: 70, height: 70, borderRadius: '50%',
              background: 'rgba(0,230,118,0.1)', border: '2px solid rgba(0,230,118,0.35)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}>
              <Play size={26} color="var(--green)" fill="rgba(0,230,118,0.3)" />
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--silver2)', marginBottom: 6 }}>
                Laboratório Bexaltec em Ação
              </div>
              <div style={{ fontSize: 12, color: 'var(--slate)' }}>
                Espaço reservado para vídeo · <span style={{ color: 'var(--forest)' }}>vturb / YouTube / Vimeo</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── GALERIA FOTOGRÁFICA (placeholder) ── */}
      <section style={{ padding: '5rem 2rem', background: 'var(--navy)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="section-badge">Galeria</div>
          <h2 className="font-rajdhani font-black" style={{ fontSize: 'clamp(24px,4vw,36px)', letterSpacing: 1, color: 'var(--text)', marginBottom: '2rem' }}>
            Fotografias do Laboratório
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
            {[
              { label: 'Estação de Soldadura SMD', size: '2' },
              { label: 'Microscópio Profissional' },
              { label: 'Diagnóstico em Andamento' },
              { label: 'Reparação de iPhone' },
              { label: 'Reballing BGA', size: '2' },
              { label: 'Componentes em Análise' },
            ].map((item, i) => (
              <div key={i} style={{
                aspectRatio: '4/3',
                gridColumn: (item as any).size === '2' ? 'span 1' : undefined,
                background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 14,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}>
                <div style={{ fontSize: 30, opacity: 0.2 }}>📷</div>
                <div style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: 1, textAlign: 'center', padding: '0 1rem' }}>{item.label}</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 11, color: 'var(--muted)', textAlign: 'center', marginTop: '1rem', letterSpacing: 1 }}>
            FOTOGRAFIAS REAIS A SEREM ADICIONADAS
          </p>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '5rem 2rem', background: 'var(--navy3)', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <h2 className="font-rajdhani font-black" style={{ fontSize: 'clamp(24px,4vw,40px)', letterSpacing: 1, color: 'var(--text)', marginBottom: '0.75rem' }}>
            O Seu Dispositivo Tem Solução
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.75, marginBottom: '2rem' }}>
            Não descarte antes de nos consultar. Avaliação gratuita, orçamento sem compromisso, garantia sobre a reparação.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/quote" className="btn-primary" style={{ fontSize: 14, padding: '13px 28px' }}>
              Solicitar Avaliação Gratuita ↗
            </Link>
            <Link href="/contact" className="btn-secondary" style={{ fontSize: 14, padding: '13px 28px' }}>
              Contactar Laboratório
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
