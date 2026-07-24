'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BexaltecLogo } from '@/components/Logo'
import {
  Menu, X, ChevronDown, Microscope, Server, Shield,
  Code2, Globe, Wrench, ShoppingBag, ArrowRight, Building2, Network, Database, Users
} from 'lucide-react'

// ── Service categories (hamburger + desktop dropdown) ──────────────────────────
const serviceCategories = [
  {
    id: 'laboratory',
    label: 'Laboratório',
    href: '/services/laboratory',
    featured: true,
    badge: 'Diferencial #1',
    Icon: Microscope,
    color: '#00E676',
    sub: [
      { label: 'Reparação iPhone & iOS', href: '/services/laboratory#iphone' },
      { label: 'MacBook & Apple', href: '/services/laboratory#macbook' },
      { label: 'Computadores & Notebooks', href: '/services/laboratory#computers' },
      { label: 'Diagnóstico de Placas', href: '/services/laboratory#diagnosis' },
      { label: 'Soldadura SMD', href: '/services/laboratory#smd' },
      { label: 'Consolas & Eletrónica', href: '/services/laboratory#consoles' },
    ],
  },
  {
    id: 'infrastructure',
    label: 'Infraestrutura TI',
    href: '/services/infrastructure',
    featured: true,
    badge: 'Diferencial #2',
    Icon: Server,
    color: '#42A5F5',
    sub: [
      { label: 'Cabeamento Estruturado', href: '/services/infrastructure#cabling' },
      { label: 'Fibra Óptica', href: '/services/infrastructure#fiber' },
      { label: 'Rack & Patch Panel', href: '/services/infrastructure#rack' },
      { label: 'Wireless Empresarial', href: '/services/infrastructure#wireless' },
      { label: 'Firewall & Switches', href: '/services/infrastructure#firewall' },
      { label: 'Servidores & Storage', href: '/services/infrastructure#servers' },
    ],
  },
  {
    id: 'security',
    label: 'Segurança',
    href: '/services/security',
    Icon: Shield,
    color: '#EF5350',
    sub: [
      { label: 'CCTV & Vigilância IP', href: '/services/security#cctv' },
      { label: 'Controlo de Acessos', href: '/services/security#access' },
      { label: 'Alarmes & Intrusão', href: '/services/security#alarm' },
      { label: 'Cibersegurança', href: '/services/security#cyber' },
    ],
  },
  {
    id: 'network',
    label: 'Redes',
    href: '/services/network',
    Icon: Network,
    color: '#4DD0E1',
    sub: [
      { label: 'Redes Empresariais', href: '/services/network#enterprise' },
      { label: 'Internet Dedicada', href: '/services/network#internet' },
      { label: 'Domínios .ao', href: '/services/network#domains' },
    ],
  },
  {
    id: 'datacenter',
    label: 'Datacenter',
    href: '/services/datacenter',
    Icon: Database,
    color: '#CE93D8',
    sub: [
      { label: 'Servidores & Virtualização', href: '/services/datacenter#servers' },
      { label: 'Storage SAN/NAS', href: '/services/datacenter#storage' },
      { label: 'Backup & Recuperação', href: '/services/datacenter#backup' },
      { label: 'Cloud (AWS / Azure)', href: '/services/datacenter#cloud' },
    ],
  },
  {
    id: 'maintenance',
    label: 'Assistência Técnica',
    href: '/services/maintenance',
    Icon: Wrench,
    color: '#FFB74D',
    sub: [
      { label: 'Contratos de Manutenção', href: '/services/maintenance#contracts' },
      { label: 'Helpdesk & Suporte Remoto', href: '/services/maintenance#helpdesk' },
      { label: 'UPS & Energia', href: '/services/maintenance#ups' },
    ],
  },
  {
    id: 'consulting',
    label: 'Consultoria',
    href: '/services/consulting',
    Icon: Building2,
    color: '#A5D6A7',
    sub: [
      { label: 'Consultoria TI', href: '/services/consulting#it' },
      { label: 'Projetos Turnkey', href: '/services/consulting#turnkey' },
      { label: 'ERP & Transformação Digital', href: '/services/consulting#erp' },
    ],
  },
  {
    id: 'outsourcing',
    label: 'Outsourcing',
    href: '/services/outsourcing',
    Icon: Users,
    color: '#80CBC4',
    sub: [
      { label: 'TI como Serviço (ITaaS)', href: '/services/outsourcing#itaas' },
      { label: 'Técnicos Dedicados', href: '/services/outsourcing#technicians' },
      { label: 'Gestão de Infraestrutura', href: '/services/outsourcing#management' },
    ],
  },
  {
    id: 'software',
    label: 'Software & Dev',
    href: '/services/software',
    Icon: Code2,
    color: '#F48FB1',
    sub: [
      { label: 'Aplicações Web & Mobile', href: '/services/software#web' },
      { label: 'ERP & CRM', href: '/services/software#erp' },
      { label: 'IA & Automação', href: '/services/software#ai' },
    ],
  },
  {
    id: 'commerce',
    label: 'Comércio & Import.',
    href: '/services/commerce',
    Icon: ShoppingBag,
    color: '#81C784',
    sub: [
      { label: 'Equipamentos TI', href: '/services/commerce#equipment' },
      { label: 'Importação & Logística', href: '/services/commerce#import' },
      { label: 'Licenciamento Software', href: '/services/commerce#licensing' },
    ],
  },
]

// ── Component ──────────────────────────────────────────────────────────────────
export function NavBar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [desktopServicesOpen, setDesktopServicesOpen] = useState(false)
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false)
    setDesktopServicesOpen(false)
    setMobileExpanded(null)
  }, [pathname])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const isActive = (href: string) =>
    pathname === href || (href !== '/' && pathname.startsWith(href + '/'))

  const featured = serviceCategories.filter(s => s.featured)
  const others = serviceCategories.filter(s => !s.featured)

  return (
    <>
      {/* ── Desktop / Mobile top bar ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        height: 64,
        background: scrolled ? 'rgba(10,22,40,0.98)' : 'rgba(10,22,40,0.82)',
        backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${scrolled ? 'rgba(176,190,197,0.14)' : 'rgba(176,190,197,0.06)'}`,
        transition: 'background 0.3s, border-color 0.3s',
      }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto', height: '100%',
          display: 'flex', alignItems: 'center',
          padding: '0 1.5rem', gap: '1.5rem',
        }}>
          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
            <BexaltecLogo size={30} />
          </Link>

          {/* ── Desktop nav ── */}
          <div className="hidden md:flex items-center gap-0.5 flex-1">
            {/* Services mega-dropdown */}
            <div
              style={{ position: 'relative' }}
              onMouseEnter={() => setDesktopServicesOpen(true)}
              onMouseLeave={() => setDesktopServicesOpen(false)}
            >
              <button style={{
                display: 'flex', alignItems: 'center', gap: 4,
                padding: '6px 12px', borderRadius: 6, fontSize: 13, fontWeight: 500,
                color: desktopServicesOpen || isActive('/services') ? 'var(--green)' : 'var(--text2)',
                background: desktopServicesOpen ? 'rgba(0,230,118,0.06)' : 'transparent',
                border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                letterSpacing: '0.3px', fontFamily: 'inherit',
              }}>
                Serviços
                <ChevronDown size={12} style={{
                  transition: 'transform 0.2s',
                  transform: desktopServicesOpen ? 'rotate(180deg)' : 'none',
                }} />
              </button>

              {/* Mega dropdown */}
              {desktopServicesOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 8px)', left: '-20px',
                  width: 720, background: 'var(--navy2)',
                  border: '1px solid var(--border)', borderRadius: 16,
                  padding: '1.25rem',
                  boxShadow: '0 32px 64px rgba(0,0,0,0.5)',
                }}>
                  {/* Featured row */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', paddingBottom: '0.85rem', marginBottom: '0.85rem', borderBottom: '1px solid var(--border)' }}>
                    {featured.map(svc => (
                      <Link key={svc.id} href={svc.href} style={{ textDecoration: 'none' }}>
                        <div style={{
                          display: 'flex', gap: '0.85rem', padding: '0.85rem',
                          borderRadius: 10,
                          background: svc.color === '#00E676' ? 'rgba(0,230,118,0.05)' : 'rgba(66,165,245,0.05)',
                          border: `1px solid ${svc.color}22`,
                          transition: 'all 0.2s', cursor: 'pointer',
                        }}
                          onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = svc.color === '#00E676' ? 'rgba(0,230,118,0.1)' : 'rgba(66,165,245,0.1)' }}
                          onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = svc.color === '#00E676' ? 'rgba(0,230,118,0.05)' : 'rgba(66,165,245,0.05)' }}
                        >
                          <div style={{
                            width: 38, height: 38, borderRadius: 9,
                            background: `${svc.color}18`, border: `1px solid ${svc.color}30`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                          }}>
                            <svc.Icon size={17} color={svc.color} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--silver2)' }}>{svc.label}</span>
                              <span style={{ fontSize: 9, padding: '1px 6px', borderRadius: 20, background: `${svc.color}20`, color: svc.color, fontWeight: 700, letterSpacing: 0.5, flexShrink: 0 }}>{svc.badge}</span>
                            </div>
                            <div style={{ fontSize: 11, color: 'var(--slate)', lineHeight: 1.5 }}>
                              {svc.sub.slice(0, 3).map(s => s.label).join(' · ')}
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Others grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.35rem', marginBottom: '0.85rem' }}>
                    {others.map(svc => (
                      <Link key={svc.id} href={svc.href} style={{ textDecoration: 'none' }}>
                        <div style={{
                          display: 'flex', alignItems: 'center', gap: '0.5rem',
                          padding: '0.55rem 0.65rem', borderRadius: 8, transition: 'all 0.15s',
                        }}
                          onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(176,190,197,0.07)' }}
                          onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent' }}
                        >
                          <div style={{ width: 26, height: 26, borderRadius: 6, background: `${svc.color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <svc.Icon size={12} color={svc.color} />
                          </div>
                          <span style={{ fontSize: 11.5, color: 'var(--text2)', lineHeight: 1.3 }}>{svc.label}</span>
                        </div>
                      </Link>
                    ))}
                  </div>

                  {/* Footer */}
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
                    <Link href="/services" style={{
                      display: 'inline-flex', alignItems: 'center', gap: 5,
                      fontSize: 12, color: 'var(--green)', textDecoration: 'none', fontWeight: 500,
                    }}>
                      Ver todos os serviços <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Other nav links */}
            {[
              { href: '/about', label: 'Sobre Nós' },
              { href: '/portfolio', label: 'Portfólio' },
              { href: '/contact', label: 'Contacto' },
            ].map(link => (
              <Link key={link.href} href={link.href} style={{
                padding: '6px 12px', borderRadius: 6, fontSize: 13, fontWeight: 500,
                color: isActive(link.href) ? 'var(--green)' : 'var(--text2)',
                background: isActive(link.href) ? 'rgba(0,230,118,0.06)' : 'transparent',
                textDecoration: 'none', transition: 'all 0.2s', letterSpacing: '0.3px',
              }}>
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop actions */}
          <div className="hidden md:flex items-center gap-2 ml-auto">
            <Link href="/login" style={{
              fontSize: 12, padding: '6px 14px', borderRadius: 6,
              border: '1px solid var(--border)', color: 'var(--text2)',
              textDecoration: 'none', transition: 'all 0.2s', letterSpacing: '0.3px',
            }}>
              Portal
            </Link>
            <Link href="/quote" style={{
              fontSize: 12, padding: '7px 18px', borderRadius: 7,
              background: 'rgba(0,230,118,0.1)', border: '1px solid rgba(0,230,118,0.35)',
              color: 'var(--green)', textDecoration: 'none',
              transition: 'all 0.2s', fontWeight: 600, letterSpacing: '0.4px',
            }}>
              Orçamento ↗
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden ml-auto"
            onClick={() => setMenuOpen(v => !v)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, color: 'var(--silver)', display: 'flex', alignItems: 'center' }}
            aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* ── Mobile full-screen menu ── */}
      {menuOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 49, top: 64,
          background: 'rgba(6,16,30,0.99)', backdropFilter: 'blur(24px)',
          overflowY: 'auto',
        }}>
          <div style={{ padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 64px)' }}>

            {/* Serviços accordion */}
            <div style={{ borderBottom: '1px solid var(--border)' }}>
              <button
                onClick={() => setMobileExpanded(mobileExpanded === '__services' ? null : '__services')}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '1rem 0', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                }}>
                <span style={{ fontSize: 17, fontFamily: 'var(--font-rajdhani)', fontWeight: 700, letterSpacing: 3, color: 'var(--silver2)' }}>SERVIÇOS</span>
                <ChevronDown size={16} color="var(--slate)" style={{ transition: 'transform 0.2s', transform: mobileExpanded === '__services' ? 'rotate(180deg)' : 'none' }} />
              </button>

              {mobileExpanded === '__services' && (
                <div style={{ paddingBottom: '0.5rem' }}>
                  {serviceCategories.map(svc => (
                    <div key={svc.id} style={{ borderTop: '1px solid rgba(176,190,197,0.06)' }}>
                      <button
                        onClick={() => setMobileExpanded(mobileExpanded === svc.id ? '__services' : svc.id)}
                        style={{
                          width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem',
                          padding: '0.75rem 0.25rem', background: 'none', border: 'none',
                          cursor: 'pointer', fontFamily: 'inherit',
                        }}>
                        <div style={{ width: 32, height: 32, borderRadius: 7, background: `${svc.color}14`, border: `1px solid ${svc.color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <svc.Icon size={14} color={svc.color} />
                        </div>
                        <span style={{ flex: 1, textAlign: 'left', fontSize: 14, color: 'var(--silver2)', fontWeight: 500 }}>{svc.label}</span>
                        {svc.featured && (
                          <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 20, background: `${svc.color}20`, color: svc.color, fontWeight: 700, letterSpacing: 0.5, flexShrink: 0 }}>
                            {svc.badge}
                          </span>
                        )}
                        <ChevronDown size={13} color="var(--slate)" style={{ transition: 'transform 0.2s', transform: mobileExpanded === svc.id ? 'rotate(180deg)' : 'none', flexShrink: 0 }} />
                      </button>

                      {mobileExpanded === svc.id && (
                        <div style={{ paddingLeft: '3rem', paddingBottom: '0.75rem' }}>
                          {svc.sub.map(item => (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setMenuOpen(false)}
                              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0.35rem 0', fontSize: 13, color: 'var(--slate)', textDecoration: 'none' }}
                            >
                              <span style={{ color: svc.color, fontSize: 10 }}>›</span> {item.label}
                            </Link>
                          ))}
                          <Link href={svc.href} onClick={() => setMenuOpen(false)}
                            style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: '0.4rem', fontSize: 12, color: svc.color, textDecoration: 'none', fontWeight: 600 }}>
                            Ver página completa <ArrowRight size={11} />
                          </Link>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Other mobile links */}
            {[
              { href: '/about', label: 'SOBRE NÓS' },
              { href: '/portfolio', label: 'PORTFÓLIO' },
              { href: '/contact', label: 'CONTACTO' },
            ].map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: 'block', padding: '1rem 0',
                  borderBottom: '1px solid var(--border)',
                  fontSize: 17, fontFamily: 'var(--font-rajdhani)', fontWeight: 700,
                  color: isActive(link.href) ? 'var(--green)' : 'var(--silver2)',
                  textDecoration: 'none', letterSpacing: 3,
                }}>
                {link.label}
              </Link>
            ))}

            {/* Mobile CTA area */}
            <div style={{ marginTop: 'auto', paddingTop: '2rem', paddingBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link href="/login" onClick={() => setMenuOpen(false)} style={{
                display: 'block', textAlign: 'center', padding: '0.85rem',
                borderRadius: 8, border: '1px solid var(--border)',
                color: 'var(--silver2)', textDecoration: 'none', fontSize: 14, fontWeight: 600, letterSpacing: 1,
              }}>
                PORTAL DO CLIENTE
              </Link>
              <Link href="/quote" onClick={() => setMenuOpen(false)} style={{
                display: 'block', textAlign: 'center', padding: '0.9rem',
                borderRadius: 8, background: 'rgba(0,230,118,0.1)', border: '1px solid rgba(0,230,118,0.4)',
                color: 'var(--green)', textDecoration: 'none', fontSize: 14, fontWeight: 700, letterSpacing: 2,
              }}>
                PEDIR ORÇAMENTO ↗
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
