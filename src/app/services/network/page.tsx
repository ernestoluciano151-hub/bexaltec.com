import type { Metadata } from 'next'
import Link from 'next/link'
import { NavBar } from '@/components/ui/NavBar'
import { Footer } from '@/components/ui/Footer'
import { ArrowRight, Network, CheckCircle2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Redes & Internet — Bexaltec · Redes Empresariais Angola',
  description: 'Redes empresariais, internet dedicada, domínios .ao, Wi-Fi corporativo e VPN para empresas em Angola. Cisco, Ubiquiti e Mikrotik.',
  keywords: 'redes empresariais Angola, internet dedicada Luanda, domínio ao, Wi-Fi empresarial Angola, VPN Angola, Cisco Angola',
}

const COLOR = '#4DD0E1'

const solutions = [
  { title: 'Internet Dedicada', items: ['Fibra óptica dedicada', 'SLA de disponibilidade 99.9%', 'IP estático incluído', 'Redundância de link', 'Gestão de QoS e prioridades'] },
  { title: 'Redes Empresariais LAN', items: ['Switches Cisco/HP geridos', 'VLAN por departamento', 'Spanning Tree e redundância', 'Monitoramento SNMP', 'Documentação de rede'] },
  { title: 'Wireless Wi-Fi 6', items: ['Access Points Ubiquiti/Cisco', 'Cobertura total de espaços', 'Portal cativo para hóspedes', 'Roaming transparente', 'Gestão centralizada UniFi'] },
  { title: 'VPN & Conectividade', items: ['VPN site-to-site IPSec', 'VPN de acesso remoto SSL', 'SD-WAN para múltiplas filiais', 'MPLS e circuitos dedicados', 'Failover automático'] },
  { title: 'Domínios .ao & DNS', items: ['Registo de domínios .ao', 'DNS gerido e redundante', 'Email corporativo @empresa.ao', 'Certificados SSL/TLS', 'Proteção DDoS incluída'] },
  { title: 'Monitoramento NOC', items: ['Monitoramento 24/7 proativo', 'Alertas em tempo real', 'Dashboard de performance', 'Relatórios mensais', 'SLA documentado'] },
]

export default function NetworkPage() {
  return (
    <div style={{ background: 'var(--navy)', minHeight: '100vh' }}>
      <NavBar />

      <div style={{ padding: '100px 2rem 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: 12, color: 'var(--slate)' }}>
          <Link href="/" style={{ color: 'var(--slate)', textDecoration: 'none' }}>Início</Link>
          <span>›</span>
          <Link href="/services" style={{ color: 'var(--slate)', textDecoration: 'none' }}>Serviços</Link>
          <span>›</span>
          <span style={{ color: COLOR }}>Redes & Internet</span>
        </div>
      </div>

      <section style={{ padding: '2rem 2rem 5rem', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 30% 40%, rgba(77,208,225,0.05) 0%, transparent 60%)`, pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.25rem' }}>
                <div style={{ width: 44, height: 44, borderRadius: 11, background: `rgba(77,208,225,0.12)`, border: `1px solid rgba(77,208,225,0.25)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Network size={22} color={COLOR} />
                </div>
                <span style={{ fontSize: 10, letterSpacing: 2, color: COLOR, fontWeight: 700, textTransform: 'uppercase' }}>Redes & Internet</span>
              </div>
              <h1 className="font-rajdhani font-black" style={{ fontSize: 'clamp(30px,5vw,52px)', letterSpacing: 2, color: 'var(--text)', lineHeight: 1.05, marginBottom: '1rem' }}>
                CONECTIVIDADE<br />
                <span style={{ color: COLOR }}>SEM LIMITES</span>
              </h1>
              <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.85, marginBottom: '1.5rem' }}>
                Redes empresariais de alta performance, internet dedicada e soluções de conectividade para empresas que não podem parar.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <Link href="/quote" className="btn-primary" style={{ fontSize: 13, padding: '11px 22px' }}>
                  Estudo de Rede Gratuito <ArrowRight size={14} />
                </Link>
                <Link href="/contact" className="btn-secondary" style={{ fontSize: 13, padding: '11px 22px' }}>
                  Contactar
                </Link>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {[
                { n: '99.9%', l: 'SLA Uptime' },
                { n: '1 Gbps', l: 'Velocidade Máxima' },
                { n: '40+', l: 'Redes Implementadas' },
                { n: '24/7', l: 'Monitoramento NOC' },
              ].map((s, i) => (
                <div key={i} style={{ padding: '1.5rem', background: `rgba(77,208,225,0.04)`, border: `1px solid rgba(77,208,225,0.14)`, borderRadius: 14, textAlign: 'center' }}>
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
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: COLOR, textTransform: 'uppercase', marginBottom: '0.6rem' }}>Soluções</div>
          <h2 className="font-rajdhani font-black" style={{ fontSize: 'clamp(24px,4vw,36px)', letterSpacing: 1, color: 'var(--text)', marginBottom: '2.5rem' }}>
            Infraestrutura de Rede Completa
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.1rem' }}>
            {solutions.map((sol, i) => (
              <div key={i} className="card-base" style={{ padding: '1.75rem', borderTop: `2px solid ${COLOR}40` }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: COLOR, marginBottom: '1rem' }}>{sol.title}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  {sol.items.map((item, j) => (
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
            A Sua Empresa Merece Conectividade Premium
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.75, marginBottom: '2rem' }}>
            Estudo de rede gratuito, sem compromisso.
          </p>
          <Link href="/quote" className="btn-primary" style={{ fontSize: 14, padding: '13px 28px' }}>
            Solicitar Estudo ↗
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
