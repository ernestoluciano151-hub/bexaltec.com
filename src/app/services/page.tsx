import type { Metadata } from 'next'
import Link from 'next/link'
import { NavBar } from '@/components/ui/NavBar'
import { Footer } from '@/components/ui/Footer'
import { ArrowRight, Microscope, Server, Shield, Network, Database, Wrench, Building2, Users, Code2, ShoppingBag, Globe } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Serviços — Bexaltec · Soluções Informáticas Angola',
  description: 'Todos os serviços Bexaltec: laboratório de reparação, infraestrutura TI, segurança eletrónica, software, redes, datacenter, assistência técnica e mais.',
}

const allServices = [
  {
    id: 'laboratory', Icon: Microscope, color: '#00E676',
    title: 'Laboratório de Reparação', href: '/services/laboratory',
    badge: 'Diferencial #1',
    desc: 'Reparação ao nível de componentes: iPhone, MacBook, computadores, consolas. Microscópio profissional e soldadura SMD.',
    highlights: ['iPhone & iOS', 'MacBook & Apple', 'Diagnóstico de placas', 'Soldadura SMD'],
  },
  {
    id: 'infrastructure', Icon: Server, color: '#42A5F5',
    title: 'Infraestrutura TI', href: '/services/infrastructure',
    badge: 'Diferencial #2',
    desc: 'Projectos turnkey de cabeamento estruturado, fibra óptica, rack, wireless e datacenter para empresas.',
    highlights: ['Cabeamento Cat6A/Fibra', 'Rack & Patch Panel', 'Wireless Wi-Fi 6', 'Datacenter'],
  },
  {
    id: 'security', Icon: Shield, color: '#EF5350',
    title: 'Segurança Eletrónica', href: '/services/security',
    desc: 'CCTV, controlo de acessos, alarmes, deteção de incêndio e cibersegurança.',
    highlights: ['CCTV Hikvision/Dahua', 'Controlo de acessos', 'Alarmes & Intrusão', 'Cibersegurança'],
  },
  {
    id: 'network', Icon: Network, color: '#4DD0E1',
    title: 'Redes & Internet', href: '/services/network',
    desc: 'Redes empresariais, internet dedicada, domínios .ao e wireless empresarial.',
    highlights: ['Internet dedicada', 'Domínios .ao', 'VPN site-to-site', 'Wireless'],
  },
  {
    id: 'datacenter', Icon: Database, color: '#CE93D8',
    title: 'Datacenter & Cloud', href: '/services/datacenter',
    desc: 'Servidores, virtualização, storage, backup e migração para cloud (AWS/Azure).',
    highlights: ['Dell / HPE Servers', 'VMware / Hyper-V', 'Storage SAN/NAS', 'AWS & Azure'],
  },
  {
    id: 'maintenance', Icon: Wrench, color: '#FFB74D',
    title: 'Assistência Técnica', href: '/services/maintenance',
    desc: 'Contratos de manutenção, helpdesk remoto e presencial, UPS e energia.',
    highlights: ['Contratos mensais', 'Helpdesk 24/7', 'UPS & Geradores', 'SLA garantido'],
  },
  {
    id: 'consulting', Icon: Building2, color: '#A5D6A7',
    title: 'Consultoria TI', href: '/services/consulting',
    desc: 'Consultoria estratégica, projetos turnkey, ERP e transformação digital.',
    highlights: ['Consultoria estratégica', 'Projetos Turnkey', 'ERP & CRM', 'Transformação Digital'],
  },
  {
    id: 'outsourcing', Icon: Users, color: '#80CBC4',
    title: 'Outsourcing', href: '/services/outsourcing',
    desc: 'TI como serviço: técnicos dedicados, gestão de infraestrutura e suporte contínuo.',
    highlights: ['Técnicos dedicados', 'ITaaS', 'Gestão de infra', 'Suporte on-site'],
  },
  {
    id: 'software', Icon: Code2, color: '#F48FB1',
    title: 'Software & Dev', href: '/services/software',
    desc: 'Aplicações web, mobile, ERP, CRM, IA e automação de processos empresariais.',
    highlights: ['Apps Web & Mobile', 'ERP & CRM', 'IA & RPA', 'Integrações API'],
  },
  {
    id: 'web', Icon: Globe, color: '#80DEEA',
    title: 'Web & Hosting', href: '/services/web',
    desc: 'Websites corporativos, e-commerce, hospedagem VPS, email corporativo.',
    highlights: ['Websites corporativos', 'E-commerce', 'VPS & SSL', 'Email @empresa.ao'],
  },
  {
    id: 'commerce', Icon: ShoppingBag, color: '#A5D6A7',
    title: 'Comércio & Importação', href: '/services/commerce',
    desc: 'Venda e importação de equipamentos TI. Cisco, Dell, HP, Lenovo e outros.',
    highlights: ['Equipamentos TI', 'Importação & Alfândega', 'Licenças Microsoft', 'Garantia incluída'],
  },
]

export default function ServicesPage() {
  return (
    <div style={{ background: 'var(--navy)', minHeight: '100vh' }}>
      <NavBar />

      {/* Header */}
      <section style={{ padding: '120px 2rem 4rem', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 30%, rgba(0,230,118,0.05) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1, textAlign: 'center' }}>
          <div className="section-badge" style={{ justifyContent: 'center' }}>Serviços</div>
          <h1 className="font-rajdhani font-black" style={{ fontSize: 'clamp(32px,5vw,60px)', letterSpacing: 2, color: 'var(--text)', lineHeight: 1, marginBottom: '1rem' }}>
            Tudo o que Oferecemos
          </h1>
          <p style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.75, maxWidth: 560, margin: '0 auto' }}>
            Soluções tecnológicas completas adaptadas à realidade das empresas e instituições angolanas.
          </p>
        </div>
      </section>

      {/* Services grid */}
      <section style={{ padding: '0 2rem 6rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          {/* Featured (Lab + Infra) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
            {allServices.filter(s => s.badge).map(svc => (
              <Link key={svc.id} href={svc.href} style={{ textDecoration: 'none' }}>
                <div className="card-base card-glow" style={{
                  padding: '2rem', transition: 'all 0.25s',
                  borderLeft: `3px solid ${svc.color}`,
                  height: '100%',
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ width: 48, height: 48, borderRadius: 12, background: `${svc.color}14`, border: `1px solid ${svc.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svc.Icon size={22} color={svc.color} />
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span className="font-rajdhani font-semibold" style={{ fontSize: 17, color: 'var(--silver2)' }}>{svc.title}</span>
                        <span style={{ fontSize: 9, padding: '2px 7px', borderRadius: 20, background: `${svc.color}18`, color: svc.color, fontWeight: 700, letterSpacing: 0.5 }}>{svc.badge}</span>
                      </div>
                      <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6 }}>{svc.desc}</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
                    {svc.highlights.map(h => (
                      <span key={h} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, background: `${svc.color}08`, border: `1px solid ${svc.color}18`, color: svc.color }}>{h}</span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: svc.color, fontWeight: 600 }}>
                    Ver serviço completo <ArrowRight size={13} />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Others grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {allServices.filter(s => !s.badge).map(svc => (
              <Link key={svc.id} href={svc.href} style={{ textDecoration: 'none' }}>
                <div className="card-base card-glow" style={{ padding: '1.5rem', transition: 'all 0.25s', height: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.85rem' }}>
                    <div style={{ width: 38, height: 38, borderRadius: 9, background: `${svc.color}12`, border: `1px solid ${svc.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svc.Icon size={17} color={svc.color} />
                    </div>
                    <span className="font-rajdhani font-semibold" style={{ fontSize: 15, color: 'var(--silver2)' }}>{svc.title}</span>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.65, marginBottom: '0.85rem' }}>{svc.desc}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: svc.color }}>
                    Saber mais <ArrowRight size={11} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '5rem 2rem', background: 'var(--navy3)', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
          <h2 className="font-rajdhani font-black" style={{ fontSize: 'clamp(24px,4vw,40px)', letterSpacing: 1, color: 'var(--text)', marginBottom: '0.75rem' }}>
            Não Encontrou o que Precisa?
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.75, marginBottom: '2rem' }}>
            Fale com a nossa equipa. Desenvolvemos soluções customizadas para cada cliente.
          </p>
          <Link href="/quote" className="btn-primary" style={{ fontSize: 14, padding: '13px 28px' }}>
            Pedir Orçamento Personalizado ↗
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
