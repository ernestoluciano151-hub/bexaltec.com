import type { Metadata } from 'next'
import Link from 'next/link'
import { NavBar } from '@/components/ui/NavBar'
import { Footer } from '@/components/ui/Footer'
import { Server, CheckCircle2, ArrowRight, Building2, ChevronRight, ShieldCheck, Clock, Award } from 'lucide-react'
import { GaleriaObras } from '@/components/GaleriaObras'
import { OBRAS_INFRA } from '@/lib/obras'

export const metadata: Metadata = {
  title: 'Infraestrutura TI — Bexaltec · Luanda, Angola',
  description: 'Implementação de infraestrutura TI empresarial em Angola: cabeamento estruturado, fibra óptica, datacenter, wireless, firewall e servidores. Projetos turnkey.',
  keywords: ['infraestrutura TI Angola', 'cabeamento estruturado Luanda', 'fibra óptica Angola', 'datacenter Luanda', 'Bexaltec infraestrutura'],
  openGraph: {
    title: 'Infraestrutura TI — Bexaltec',
    description: 'Projectos de infraestrutura TI de grande escala em Angola: edifícios institucionais, sedes corporativas e salas técnicas.',
    url: 'https://www.bexaltec.com/services/infrastructure',
  },
}

// ── Data ──────────────────────────────────────────────────────────────────────
const services = [
  {
    title: 'Cabeamento Estruturado',
    desc: 'Cat.6 e Cat.6A, com ensaio ponto a ponto e relatório por canal. Instalação de tomadas, patch panels e organizadores de cabos.',
    tags: ['Cat.6', 'Cat.6A', 'ANSI/TIA-568', 'ISO/IEC 11801'],
  },
  {
    title: 'Fibra Óptica',
    desc: 'Instalação e fusão de fibra monomodo e multimodo. Backbone entre edifícios, pisos e datacenters. Certificação OTDR.',
    tags: ['SM/MM', 'Fusão', 'OTDR', 'LC/SC'],
  },
  {
    title: 'Rack & Patch Panel',
    desc: 'Montagem e organização de racks de 19". Patch panels Cat6A, organizadores de cabos e gestão de energia em rack.',
    tags: ['APC', 'Panduit', '19" Rack', 'PDU'],
  },
  {
    title: 'Wireless Empresarial',
    desc: 'Cobertura Wi-Fi total com access points Cisco Meraki, Ubiquiti UniFi e Aruba. Wi-Fi 6/6E, roaming seguro, SSID segmentado.',
    tags: ['WiFi 6', 'Cisco Meraki', 'Ubiquiti', 'VLAN'],
  },
  {
    title: 'Firewall & Segurança de Rede',
    desc: 'Implementação de firewall Fortinet, Cisco ASA e pfSense. UTM, IPS/IDS, VPN site-to-site e remote access.',
    tags: ['Fortinet', 'Cisco ASA', 'VPN', 'UTM'],
  },
  {
    title: 'Switches Managed',
    desc: 'Switches Cisco Catalyst, HP/Aruba e Huawei. VLAN, QoS, STP, Port security, LACP e redundância de links.',
    tags: ['Cisco Catalyst', 'HP Aruba', 'VLAN', 'QoS'],
  },
  {
    title: 'Servidores & Virtualização',
    desc: 'Servidores Dell PowerEdge e HP ProLiant. VMware vSphere, Microsoft Hyper-V, Proxmox. Storage SAN e NAS.',
    tags: ['Dell', 'HPE', 'VMware', 'Hyper-V'],
  },
  {
    title: 'Datacenter On-Premise',
    desc: 'Projeto e implementação de datacenter completo: energia UPS, arrefecimento, estrutura, segurança e monitoramento.',
    tags: ['UPS APC', 'PDU', 'DCIM', 'Biometria'],
  },
]

const caseStudies = [
  {
    client: 'Edifício institucional · Luanda',
    icon: '🏢',
    scope: 'Três pisos',
    description: 'Infraestrutura de rede nos três pisos de um edifício institucional: percursos em esteira metálica suspensa, cabeamento estruturado Cat.6, bastidores de piso e terminação identificada painel a painel.',
    deliverables: ['Esteira metálica e percursos', 'Cabeamento Cat.6 ensaiado', 'Bastidores por piso', 'Mapa de portas e registo fotográfico'],
    year: '2024',
    category: 'Cabeamento + Rede',
  },
  {
    client: 'Sede corporativa · Luanda',
    icon: '🖧',
    scope: 'Rede de dados e voz',
    description: 'Rede completa para uma sede corporativa, com separação de serviços de dados e de voz no mesmo bastidor, backbone em fibra e identificação integral por piso e por tipo de serviço.',
    deliverables: ['Backbone em fibra', 'Dados e voz no mesmo bastidor', 'Identificação por piso e serviço', 'Documentação de entrega'],
    year: '2023',
    category: 'Infraestrutura Completa',
  },
]

const process = [
  { n: '01', title: 'Levantamento', desc: 'Visita técnica ao local, análise das necessidades e levantamento da infraestrutura existente.' },
  { n: '02', title: 'Projeto', desc: 'Elaboração do projeto técnico com planta de rede, especificação de equipamentos e orçamento detalhado.' },
  { n: '03', title: 'Aprovação', desc: 'Apresentação ao cliente, ajustes e aprovação formal antes de qualquer trabalho de campo.' },
  { n: '04', title: 'Implementação', desc: 'Instalação por equipa técnica certificada, seguindo projeto aprovado e melhores práticas.' },
  { n: '05', title: 'Ensaio', desc: 'Verificação de continuidade e sequência de pares em cada canal, com relatório por ponto. Certificação com equipamento homologado quando o caderno de encargos a exige.' },
  { n: '06', title: 'Entrega', desc: 'Documentação completa, formação da equipa interna e garantia sobre todos os trabalhos.' },
]

// ── Page ──────────────────────────────────────────────────────────────────────
export default function InfrastructurePage() {
  return (
    <div style={{ background: 'var(--navy)', minHeight: '100vh' }}>
      <NavBar />

      {/* ── HERO ── */}
      <section style={{ padding: '120px 2rem 5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 70% 30%, rgba(66,165,245,0.06) 0%, transparent 55%)', pointerEvents: 'none' }} />
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.03, pointerEvents: 'none' }} xmlns="http://www.w3.org/2000/svg">
          <defs><pattern id="grid-infra" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M 60 0 L 0 0 0 60" fill="none" stroke="#42A5F5" strokeWidth="0.5" /></pattern></defs>
          <rect width="100%" height="100%" fill="url(#grid-infra)" />
        </svg>

        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: '1.5rem', fontSize: 12, color: 'var(--slate)' }}>
            <Link href="/" style={{ color: 'var(--slate)', textDecoration: 'none' }}>Início</Link>
            <ChevronRight size={12} />
            <Link href="/services" style={{ color: 'var(--slate)', textDecoration: 'none' }}>Serviços</Link>
            <ChevronRight size={12} />
            <span style={{ color: '#42A5F5' }}>Infraestrutura TI</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 20, background: 'rgba(66,165,245,0.08)', border: '1px solid rgba(66,165,245,0.25)', marginBottom: '1rem' }}>
                <Server size={12} color="#42A5F5" />
                <span style={{ fontSize: 10, letterSpacing: 3, color: '#42A5F5', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>DIFERENCIAL #2 · PROJETOS EMPRESARIAIS</span>
              </div>
              <h1 className="font-rajdhani font-black" style={{ fontSize: 'clamp(32px,5vw,56px)', lineHeight: 1, letterSpacing: 2, color: 'var(--text)', marginBottom: '1rem' }}>
                INFRAESTRUTURA<br />
                <span style={{ color: '#42A5F5' }}>DE TI</span>
              </h1>
              <p style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.8, marginBottom: '2rem' }}>
                Projectos de infraestrutura TI de grande escala para empresas e instituições angolanas. Cabeamento estruturado, fibra óptica, datacenter e redes empresariais completas.
              </p>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                <Link href="/quote" className="btn-primary" style={{ fontSize: 13, padding: '11px 24px', background: 'rgba(66,165,245,0.1)', border: '1px solid rgba(66,165,245,0.35)', color: '#42A5F5' }}>
                  Solicitar Estudo de Projeto ↗
                </Link>
                <Link href="/contact" className="btn-secondary" style={{ fontSize: 13, padding: '11px 24px' }}>
                  Falar com Engenheiro
                </Link>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {[
                  { icon: ShieldCheck, text: 'Ensaio ponto a ponto com relatório de entrega' },
                  { icon: Clock, text: 'Projetos turnkey: entrega completa com documentação' },
                  { icon: Award, text: 'Experiência comprovada · 11 CAEs licenciadas' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--slate)' }}>
                    <item.icon size={13} color="#42A5F5" />
                    {item.text}
                  </div>
                ))}
              </div>
            </div>

            {/* Hero photo grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {['Rack & Patch Panel', 'Cabeamento Estruturado', 'Fibra Óptica', 'Sala de Servidores'].map((label, i) => (
                <div key={i} style={{
                  aspectRatio: '4/3',
                  background: 'var(--card)', border: '1px solid rgba(66,165,245,0.15)', borderRadius: 14,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6,
                }}>
                  <div style={{ fontSize: 28, opacity: 0.25 }}>📸</div>
                  <div style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: 1, textAlign: 'center', padding: '0 0.5rem' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES GRID ── */}
      <section style={{ padding: '5rem 2rem', background: 'linear-gradient(135deg, rgba(13,32,68,0.5) 0%, rgba(10,22,40,0.9) 100%)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="section-badge">Soluções</div>
          <h2 className="font-rajdhani font-black" style={{ fontSize: 'clamp(26px,4vw,38px)', letterSpacing: 1, color: 'var(--text)', marginBottom: '0.5rem' }}>
            Soluções de Infraestrutura
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: '2.5rem', maxWidth: 520 }}>
            Cobertura completa desde o cabeamento passivo até à camada de virtualização e cloud.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {services.map((svc, i) => (
              <div key={i} className="card-base card-glow" style={{ padding: '1.5rem', transition: 'all 0.25s', borderLeft: '2px solid rgba(66,165,245,0.2)' }}>
                <h3 className="font-rajdhani font-semibold" style={{ fontSize: 15, color: 'var(--silver2)', marginBottom: '0.5rem', letterSpacing: 0.3 }}>{svc.title}</h3>
                <p style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.65, marginBottom: '0.85rem' }}>{svc.desc}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {svc.tags.map(tag => (
                    <span key={tag} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, background: 'rgba(66,165,245,0.07)', border: '1px solid rgba(66,165,245,0.18)', color: '#42A5F5' }}>{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CASOS DE REFERÊNCIA ── */}
      <section style={{ padding: '5rem 2rem', background: 'var(--navy)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="section-badge">Prova Social</div>
          <h2 className="font-rajdhani font-black" style={{ fontSize: 'clamp(26px,4vw,38px)', letterSpacing: 1, color: 'var(--text)', marginBottom: '0.5rem' }}>
            Casos de Referência
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: '2.5rem', maxWidth: 520 }}>
            Projectos entregues para as mais importantes instituições de Angola.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
            {caseStudies.map((cs, i) => (
              <div key={i} className="card-base" style={{ padding: '2rem', borderLeft: '3px solid #42A5F5' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.25rem' }}>
                  <div style={{ fontSize: 32 }}>{cs.icon}</div>
                  <div>
                    <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--silver2)', fontFamily: 'var(--font-rajdhani)', letterSpacing: 0.5, marginBottom: 3 }}>{cs.client}</div>
                    <div style={{ fontSize: 11, color: '#42A5F5', letterSpacing: 1 }}>{cs.scope} · {cs.category}</div>
                  </div>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.75, marginBottom: '1.25rem' }}>{cs.description}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {cs.deliverables.map((d, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12, color: 'var(--slate)' }}>
                      <CheckCircle2 size={12} color="#42A5F5" style={{ flexShrink: 0 }} />
                      {d}
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: '1rem', fontSize: 10, color: 'var(--forest)', letterSpacing: 1 }}>PROJETO {cs.year}</div>
              </div>
            ))}
          </div>

          <GaleriaObras obras={OBRAS_INFRA.slice(0, 4)} colunas={4} nota={false} />
        </div>
      </section>

      {/* ── PROCESSO ── */}
      <section style={{ padding: '5rem 2rem', background: 'linear-gradient(135deg, rgba(13,32,68,0.5) 0%, rgba(10,22,40,0.9) 100%)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="section-badge">Metodologia</div>
          <h2 className="font-rajdhani font-black" style={{ fontSize: 'clamp(26px,4vw,38px)', letterSpacing: 1, color: 'var(--text)', marginBottom: '0.5rem' }}>
            Processo Turnkey
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: '2.5rem', maxWidth: 520 }}>
            Do levantamento à entrega final com documentação completa.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            {process.map((step, i) => (
              <div key={i} className="card-base" style={{ padding: '1.5rem' }}>
                <div className="font-rajdhani font-black" style={{ fontSize: 36, color: 'rgba(66,165,245,0.15)', lineHeight: 1, marginBottom: '0.75rem', letterSpacing: 2 }}>
                  {step.n}
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--silver2)', marginBottom: '0.5rem' }}>{step.title}</h3>
                <p style={{ fontSize: 12, color: 'var(--slate)', lineHeight: 1.65 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REGISTO FOTOGRÁFICO DE OBRA ── */}
      <section style={{ padding: '5rem 2rem', background: 'var(--navy)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="section-badge">Registo de obra</div>
          <h2 className="font-rajdhani font-black" style={{ fontSize: 'clamp(24px,4vw,36px)', letterSpacing: 1, color: 'var(--text)', marginBottom: '0.75rem' }}>
            Fotografias dos Projetos
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.7, maxWidth: '62ch', marginBottom: '2.5rem' }}>
            Do percurso em esteira metálica à terminação identificada painel a painel. Todas as
            imagens são das nossas intervenções.
          </p>
          <GaleriaObras obras={OBRAS_INFRA} colunas={4} />
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '5rem 2rem', background: 'var(--navy3)', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
            <Building2 size={32} color="rgba(66,165,245,0.4)" />
          </div>
          <h2 className="font-rajdhani font-black" style={{ fontSize: 'clamp(24px,4vw,40px)', letterSpacing: 1, color: 'var(--text)', marginBottom: '0.75rem' }}>
            A Sua Empresa Merece<br />Infraestrutura Profissional
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.75, marginBottom: '2rem' }}>
            Visita técnica gratuita. Estudo de projeto sem compromisso. Entrega turnkey com garantia e documentação completa.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/quote" className="btn-primary" style={{ fontSize: 14, padding: '13px 28px', background: 'rgba(66,165,245,0.1)', border: '1px solid rgba(66,165,245,0.4)', color: '#42A5F5' }}>
              Solicitar Estudo Gratuito ↗
            </Link>
            <Link href="/portfolio" className="btn-secondary" style={{ fontSize: 14, padding: '13px 28px' }}>
              Ver Portfólio Completo
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
