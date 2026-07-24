import type { Metadata } from 'next'
import Link from 'next/link'
import { NavBar } from '@/components/ui/NavBar'
import { Footer } from '@/components/ui/Footer'
import { ArrowRight, Shield, CheckCircle2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Segurança Eletrónica — Bexaltec · CCTV & Controlo de Acessos Angola',
  description: 'CCTV, controlo de acessos biométrico, alarmes, deteção de incêndio e cibersegurança para empresas em Angola. Hikvision, Dahua e ZKTeco.',
  keywords: 'CCTV Angola, câmeras segurança Luanda, controlo acessos Angola, alarme intrusão, cibersegurança Angola, Hikvision Angola',
}

const solutions = [
  { color: '#EF5350', title: 'CCTV & Videovigilância', items: ['Câmeras IP 4K Hikvision/Dahua', 'NVR & DVR geridos', 'Monitoramento remoto 24/7', 'Análise de vídeo com IA', 'Armazenamento em nuvem/local'] },
  { color: '#EF5350', title: 'Controlo de Acessos', items: ['Biométrico (impressão digital/facial)', 'Cartões RFID e QR code', 'Portões e cancelas automáticas', 'Integração com CCTV', 'ZKTeco & HID'] },
  { color: '#EF5350', title: 'Alarmes & Intrusão', items: ['Sensores PIR e volumétricos', 'Painéis de alarme Paradox/DSC', 'Sirenes e flash estroboscópico', 'Notificação por SMS/App', 'Monitoramento central'] },
  { color: '#EF5350', title: 'Deteção de Incêndio', items: ['Detetores de fumo e calor', 'Painéis de incêndio endereçáveis', 'Sprinklers e supressão', 'Integração com evacuação', 'Certificação ANAC'] },
  { color: '#EF5350', title: 'Cibersegurança', items: ['Firewall UTM (Fortinet/Sophos)', 'Antivírus empresarial gerido', 'VPN site-to-site e remote', 'Auditoria de vulnerabilidades', 'Formação de utilizadores'] },
  { color: '#EF5350', title: 'Cercas Elétricas & Perímetro', items: ['Cercas elétricas industriais', 'Sensores de vibração e tensão', 'Integração com câmeras', 'Controlo central unificado', 'Garantia documentada'] },
]

export default function SecurityPage() {
  return (
    <div style={{ background: 'var(--navy)', minHeight: '100vh' }}>
      <NavBar />

      {/* Breadcrumb */}
      <div style={{ padding: '100px 2rem 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: 12, color: 'var(--slate)' }}>
          <Link href="/" style={{ color: 'var(--slate)', textDecoration: 'none' }}>Início</Link>
          <span>›</span>
          <Link href="/services" style={{ color: 'var(--slate)', textDecoration: 'none' }}>Serviços</Link>
          <span>›</span>
          <span style={{ color: '#EF5350' }}>Segurança Eletrónica</span>
        </div>
      </div>

      {/* Hero */}
      <section style={{ padding: '2rem 2rem 5rem', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 40%, rgba(239,83,80,0.05) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.25rem' }}>
                <div style={{ width: 44, height: 44, borderRadius: 11, background: 'rgba(239,83,80,0.12)', border: '1px solid rgba(239,83,80,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Shield size={22} color="#EF5350" />
                </div>
                <span style={{ fontSize: 10, letterSpacing: 2, color: '#EF5350', fontWeight: 700, textTransform: 'uppercase' }}>Segurança Eletrónica</span>
              </div>
              <h1 className="font-rajdhani font-black" style={{ fontSize: 'clamp(30px,5vw,52px)', letterSpacing: 2, color: 'var(--text)', lineHeight: 1.05, marginBottom: '1rem' }}>
                PROTEJA O QUE<br />
                <span style={{ color: '#EF5350' }}>MAIS IMPORTA</span>
              </h1>
              <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.85, marginBottom: '1.5rem' }}>
                Soluções integradas de segurança eletrónica para empresas, instituições e indústria em Angola. Da câmera ao firewall, protegemos o seu espaço físico e digital.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <Link href="/quote" className="btn-primary" style={{ fontSize: 13, padding: '11px 22px', background: '#EF5350', borderColor: '#EF5350' }}>
                  Pedir Estudo de Segurança <ArrowRight size={14} />
                </Link>
                <Link href="/contact" className="btn-secondary" style={{ fontSize: 13, padding: '11px 22px' }}>
                  Falar com Especialista
                </Link>
              </div>
            </div>
            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {[
                { n: '300+', l: 'Câmeras Instaladas' },
                { n: '50+', l: 'Projetos de Segurança' },
                { n: '24/7', l: 'Monitoramento Disponível' },
                { n: '5', l: 'Anos de Experiência' },
              ].map((s, i) => (
                <div key={i} style={{ padding: '1.5rem', background: 'rgba(239,83,80,0.04)', border: '1px solid rgba(239,83,80,0.14)', borderRadius: 14, textAlign: 'center' }}>
                  <div className="font-rajdhani font-black" style={{ fontSize: 36, color: '#EF5350', lineHeight: 1 }}>{s.n}</div>
                  <div style={{ fontSize: 11, color: 'var(--slate)', marginTop: 6 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Solutions */}
      <section style={{ padding: '3rem 2rem 6rem', background: 'linear-gradient(135deg, rgba(13,32,68,0.6) 0%, rgba(10,22,40,0.95) 100%)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: '#EF5350', textTransform: 'uppercase', marginBottom: '0.6rem' }}>Soluções</div>
          <h2 className="font-rajdhani font-black" style={{ fontSize: 'clamp(24px,4vw,36px)', letterSpacing: 1, color: 'var(--text)', marginBottom: '2.5rem' }}>
            Segurança 360°
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.1rem' }}>
            {solutions.map((sol, i) => (
              <div key={i} className="card-base" style={{ padding: '1.75rem', borderTop: `2px solid ${sol.color}40` }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: sol.color, marginBottom: '1rem', letterSpacing: 0.5 }}>{sol.title}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  {sol.items.map((item, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <CheckCircle2 size={12} color={sol.color} style={{ flexShrink: 0, opacity: 0.7 }} />
                      <span style={{ fontSize: 12, color: 'var(--text2)' }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '5rem 2rem', background: 'var(--navy3)', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
          <h2 className="font-rajdhani font-black" style={{ fontSize: 'clamp(24px,4vw,38px)', letterSpacing: 1, color: 'var(--text)', marginBottom: '0.75rem' }}>
            Avalie a Segurança da Sua Empresa
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.75, marginBottom: '2rem' }}>
            Fazemos um diagnóstico gratuito das vulnerabilidades e apresentamos uma proposta completa.
          </p>
          <Link href="/quote" className="btn-primary" style={{ fontSize: 14, padding: '13px 28px', background: '#EF5350', borderColor: '#EF5350' }}>
            Diagnóstico Gratuito ↗
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
