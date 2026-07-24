'use client'
import Link from 'next/link'
import { BexaltecLogo } from '@/components/Logo'

const col1 = {
  title: 'Empresa',
  links: [
    { label: 'Sobre Nós', href: '/about' },
    { label: 'Portfólio', href: '/portfolio' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contacto', href: '/contact' },
    { label: 'Portal do Cliente', href: '/login' },
  ],
}

const col2 = {
  title: 'Serviços em Destaque',
  links: [
    { label: 'Laboratório de Reparação', href: '/services/laboratory' },
    { label: 'Infraestrutura TI', href: '/services/infrastructure' },
    { label: 'Segurança Eletrónica', href: '/services/security' },
    { label: 'Redes & Cabeamento', href: '/services/network' },
    { label: 'Datacenter', href: '/services/datacenter' },
  ],
}

const col3 = {
  title: 'Outros Serviços',
  links: [
    { label: 'Software & Desenvolvimento', href: '/services/software' },
    { label: 'Web & Hosting', href: '/services/web' },
    { label: 'Assistência Técnica', href: '/services/maintenance' },
    { label: 'Consultoria TI', href: '/services/consulting' },
    { label: 'Outsourcing & Comércio', href: '/services/outsourcing' },
  ],
}

const caes = [
  'CAE 62010', 'CAE 62020', 'CAE 62030', 'CAE 62090',
  'CAE 63110', 'CAE 63120', 'CAE 47410', 'CAE 95110',
  'CAE 95120', 'CAE 46520', 'CAE 80200',
]

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer style={{ background: 'var(--navy3)', borderTop: '1px solid var(--border)' }}>
      {/* Main footer grid */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '4rem 2rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr 1fr', gap: '3rem' }}>

          {/* Brand column */}
          <div>
            <div style={{ marginBottom: '1.25rem' }}>
              <BexaltecLogo size={34} />
            </div>
            <p style={{ fontSize: 13, color: 'var(--slate)', lineHeight: 1.75, marginBottom: '1.5rem', maxWidth: 280 }}>
              Empresa angolana especializada em soluções de tecnologia da informação, segurança eletrónica e reparação de equipamentos.
            </p>
            {/* Contact info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[
                { icon: '📧', text: 'info@bexaltec.ao' },
                { icon: '📱', text: '+244 9XX XXX XXX' },
                { icon: '📍', text: 'Luanda, Angola' },
                { icon: '🕐', text: 'Seg–Sex 08h–18h · Sáb 09h–13h' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: 12, color: 'var(--slate)' }}>
                  <span style={{ fontSize: 13 }}>{item.icon}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {[col1, col2, col3].map(col => (
            <div key={col.title}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: 'var(--green)', textTransform: 'uppercase', marginBottom: '1rem' }}>
                {col.title}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {col.links.map(link => (
                  <Link key={link.href} href={link.href} style={{
                    fontSize: 13, color: 'var(--slate)', textDecoration: 'none',
                    transition: 'color 0.2s', letterSpacing: '0.2px',
                  }}
                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--silver2)' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = 'var(--slate)' }}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CAEs bar */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 2rem 1rem' }}>
        <div style={{ borderTop: '1px solid rgba(176,190,197,0.06)', paddingTop: '1rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.5rem' }}>
            {caes.map(cae => (
              <span key={cae} style={{
                fontSize: 10, padding: '2px 8px', borderRadius: 20,
                background: 'rgba(0,230,118,0.05)', border: '1px solid rgba(0,230,118,0.12)',
                color: 'var(--forest)', letterSpacing: 0.5,
              }}>
                {cae}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div style={{ borderTop: '1px solid var(--border)', padding: '1.25rem 2rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ fontSize: 11, color: 'var(--muted)' }}>
            © {year} Bexaltec · Todos os direitos reservados · Luanda, Angola
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            {[
              { label: 'Privacidade', href: '/privacy' },
              { label: 'Termos', href: '/terms' },
              { label: 'Sitemap', href: '/sitemap.xml' },
            ].map(link => (
              <Link key={link.href} href={link.href} style={{ fontSize: 11, color: 'var(--muted)', textDecoration: 'none' }}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
