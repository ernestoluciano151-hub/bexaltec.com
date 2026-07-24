import type { Metadata } from 'next'
import Link from 'next/link'
import { NavBar } from '@/components/ui/NavBar'
import { Footer } from '@/components/ui/Footer'
import { ArrowRight, ShoppingBag, CheckCircle2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Comércio & Importação — Bexaltec · Equipamentos TI Angola',
  description: 'Venda e importação de equipamentos TI: Cisco, Dell, HP, Lenovo, Apple. Licenças Microsoft, garantia incluída e entrega em Angola.',
  keywords: 'equipamentos TI Angola, importação informática Angola, Cisco Angola, Dell Angola, HP Angola, Microsoft licenças Angola',
}

const COLOR = '#80CBC4'

const brands = ['Cisco', 'Dell', 'HP', 'Lenovo', 'Apple', 'Hikvision', 'Dahua', 'Ubiquiti', 'Fortinet', 'APC', 'ZKTeco', 'Microsoft']

const categories = [
  { title: 'Computadores & Portáteis', items: ['Lenovo ThinkPad & IdeaPad', 'HP ProBook & EliteBook', 'Dell Latitude & Inspiron', 'Apple MacBook (Pro/Air/Mac)', 'Workstations de engenharia'] },
  { title: 'Servidores & Storage', items: ['Dell PowerEdge rack e torre', 'HPE ProLiant série Gen10+', 'Storage SAN/NAS Dell/Synology', 'UPS APC e Eaton', 'Cabos e acessórios de rack'] },
  { title: 'Redes & Switching', items: ['Switches Cisco Catalyst e Meraki', 'Routers Cisco ISR', 'Firewalls Fortinet & Sophos', 'Access Points Ubiquiti UniFi', 'Cablagem Cat6A e Fibra'] },
  { title: 'Segurança & CCTV', items: ['Câmeras Hikvision 4K IP', 'NVR Dahua Pro Series', 'Controlo de acessos ZKTeco', 'Cerca elétrica Poulsen', 'Alarmes Paradox & DSC'] },
  { title: 'Software & Licenças', items: ['Microsoft 365 Business', 'Windows Server 2022', 'Office perpétuo (CSP)', 'Antivírus empresarial', 'Adobe Creative Cloud'] },
  { title: 'Consumíveis & Periféricos', items: ['Tinteiros e toners originais', 'Monitores profissionais', 'Teclados e ratos ergonómicos', 'Headsets para call center', 'Projetores e ecrãs interativos'] },
]

export default function CommercePage() {
  return (
    <div style={{ background: 'var(--navy)', minHeight: '100vh' }}>
      <NavBar />

      <div style={{ padding: '100px 2rem 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: 12, color: 'var(--slate)' }}>
          <Link href="/" style={{ color: 'var(--slate)', textDecoration: 'none' }}>Início</Link>
          <span>›</span>
          <Link href="/services" style={{ color: 'var(--slate)', textDecoration: 'none' }}>Serviços</Link>
          <span>›</span>
          <span style={{ color: COLOR }}>Comércio & Importação</span>
        </div>
      </div>

      <section style={{ padding: '2rem 2rem 4rem', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 30% 40%, rgba(128,203,196,0.05) 0%, transparent 60%)`, pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.25rem' }}>
                <div style={{ width: 44, height: 44, borderRadius: 11, background: `rgba(128,203,196,0.12)`, border: `1px solid rgba(128,203,196,0.25)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShoppingBag size={22} color={COLOR} />
                </div>
                <span style={{ fontSize: 10, letterSpacing: 2, color: COLOR, fontWeight: 700, textTransform: 'uppercase' }}>Comércio & Importação</span>
              </div>
              <h1 className="font-rajdhani font-black" style={{ fontSize: 'clamp(30px,5vw,52px)', letterSpacing: 2, color: 'var(--text)', lineHeight: 1.05, marginBottom: '1rem' }}>
                EQUIPAMENTOS<br />
                <span style={{ color: COLOR }}>DE TOPO, EM ANGOLA</span>
              </h1>
              <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.85, marginBottom: '1.5rem' }}>
                Importação e venda de equipamentos TI de marcas líderes mundiais — Cisco, Dell, HP, Apple e mais. Garantia documentada, desalfandegamento e entrega em todo o território nacional.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <Link href="/quote" className="btn-primary" style={{ fontSize: 13, padding: '11px 22px' }}>
                  Pedir Cotação <ArrowRight size={14} />
                </Link>
                <Link href="/contact" className="btn-secondary" style={{ fontSize: 13, padding: '11px 22px' }}>
                  Contactar
                </Link>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {[
                { n: '12+', l: 'Marcas Parceiras' },
                { n: '1000+', l: 'Equipamentos Vendidos' },
                { n: 'Nacional', l: 'Entrega em Angola' },
                { n: '12m', l: 'Garantia Incluída' },
              ].map((s, i) => (
                <div key={i} style={{ padding: '1.5rem', background: `rgba(128,203,196,0.04)`, border: `1px solid rgba(128,203,196,0.14)`, borderRadius: 14, textAlign: 'center' }}>
                  <div className="font-rajdhani font-black" style={{ fontSize: 28, color: COLOR, lineHeight: 1 }}>{s.n}</div>
                  <div style={{ fontSize: 11, color: 'var(--slate)', marginTop: 6 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Brands */}
          <div style={{ marginTop: '3rem', padding: '1.5rem', background: 'rgba(128,203,196,0.04)', border: '1px solid rgba(128,203,196,0.14)', borderRadius: 14 }}>
            <div style={{ fontSize: 10, letterSpacing: 2, color: 'var(--slate)', marginBottom: '1rem', textTransform: 'uppercase' }}>Marcas que Comercializamos</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {brands.map(b => (
                <span key={b} style={{ fontSize: 11, padding: '4px 12px', background: 'rgba(128,203,196,0.08)', border: '1px solid rgba(128,203,196,0.2)', color: COLOR, borderRadius: 20 }}>{b}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '3rem 2rem 6rem', background: 'linear-gradient(135deg, rgba(13,32,68,0.6) 0%, rgba(10,22,40,0.95) 100%)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: COLOR, textTransform: 'uppercase', marginBottom: '0.6rem' }}>Catálogo</div>
          <h2 className="font-rajdhani font-black" style={{ fontSize: 'clamp(24px,4vw,36px)', letterSpacing: 1, color: 'var(--text)', marginBottom: '2.5rem' }}>
            O Que Temos Para Si
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.1rem' }}>
            {categories.map((cat, i) => (
              <div key={i} className="card-base" style={{ padding: '1.75rem', borderTop: `2px solid ${COLOR}40` }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: COLOR, marginBottom: '1rem' }}>{cat.title}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  {cat.items.map((item, j) => (
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
            Cotação em 24 Horas
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.75, marginBottom: '2rem' }}>
            Envie a lista de equipamentos que precisa e receba uma proposta com preços e prazos.
          </p>
          <Link href="/quote" className="btn-primary" style={{ fontSize: 14, padding: '13px 28px' }}>
            Pedir Cotação ↗
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
