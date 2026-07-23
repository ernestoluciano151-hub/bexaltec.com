'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { BexaltecLogo } from '@/components/Logo'
import { t, type Lang } from '@/lib/translations'

// ── Services data ─────────────────────────────────────────────────────────────
const servicesData = {
  infra: [
    { ico: '🌐', t: 'Redes & Cabeamento', d: 'Structured cabling Cat6A/fiber, switches Cisco/HP, wireless enterprise, VLAN design.', tags: ['Cisco', 'HP', 'Cat6A', 'WiFi 6'] },
    { ico: '🖥️', t: 'Servidores & Virtualização', d: 'Dell/HP ProLiant servers, VMware vSphere, Hyper-V, storage SAN/NAS, backup.', tags: ['VMware', 'Dell', 'NAS', 'Backup'] },
    { ico: '☁️', t: 'Transformação Digital', d: 'Migração para nuvem AWS, Azure, GCP. Digitalização de processos empresariais.', tags: ['AWS', 'Azure', 'GCP', 'Cloud'] },
    { ico: '🔌', t: 'APIs & Integrações', d: 'APIs REST e GraphQL. Integração de sistemas ERP, CRM e plataformas SaaS.', tags: ['REST API', 'GraphQL', 'ERP'] },
    { ico: '📋', t: 'Projetos Turnkey', d: 'Equipamentos + instalação + configuração + documentação + formação + garantia.', tags: ['Turnkey', 'Formação'] },
  ],
  seg: [
    { ico: '📷', t: 'CCTV & Vigilância IP', d: 'Câmeras Hikvision/Dahua, NVR 4K, analítica de vídeo IA, monitoramento remoto.', tags: ['Hikvision', 'Dahua', '4K', 'IA'] },
    { ico: '🔑', t: 'Controlo de Acessos', d: 'Biometria, cartões RFID, fechaduras eletrónicas, integração com CCTV.', tags: ['RFID', 'Biometria', 'ZKTeco'] },
    { ico: '🚨', t: 'Alarmes & Intrusão', d: 'Centrais de alarme, sensores de movimento, detetores de incêndio, sirenes.', tags: ['Alarme', 'Incêndio', 'Paradox'] },
    { ico: '🔥', t: 'Deteção de Incêndio', d: 'Sistemas NFPA/EN 54 compliant, centrais inteligentes, sprinklers, extintores.', tags: ['NFPA', 'EN54', 'Sprinkler'] },
    { ico: '🛡️', t: 'Cibersegurança', d: 'Firewall, IDS/IPS, SOC, pentest, políticas de segurança, SIEM.', tags: ['Firewall', 'Fortinet', 'SOC'] },
  ],
  sw: [
    { ico: '💻', t: 'Desenvolvimento Web', d: 'Aplicações web modernas com React, Next.js, Node.js. PWA, SaaS, portais.', tags: ['React', 'Next.js', 'Node'] },
    { ico: '📱', t: 'Apps Mobile', d: 'Aplicações iOS e Android nativas e híbridas. Flutter, React Native.', tags: ['Flutter', 'iOS', 'Android'] },
    { ico: '🏢', t: 'ERP & CRM', d: 'Sistemas de gestão empresarial customizados. Odoo, Microsoft Dynamics.', tags: ['ERP', 'Odoo', 'CRM'] },
    { ico: '🤖', t: 'IA & Automação', d: 'Chatbots, análise de dados, machine learning, automação de processos RPA.', tags: ['IA', 'RPA', 'Python'] },
    { ico: '🔗', t: 'Integrações', d: 'Conecta sistemas legados com novas plataformas via APIs seguras.', tags: ['API', 'Webhook', 'ETL'] },
  ],
  web: [
    { ico: '🌍', t: 'Websites Corporativos', d: 'Sites profissionais com CMS, SEO, design responsivo e alta performance.', tags: ['WordPress', 'SEO', 'Responsive'] },
    { ico: '🛒', t: 'E-commerce', d: 'Lojas online completas com pagamento, inventário e logística integrados.', tags: ['E-commerce', 'Pagamento', 'Multicaixa'] },
    { ico: '🖧', t: 'Hospedagem VPS', d: 'Servidores VPS geridos, SSL, CDN, backups automáticos e uptime 99.9%.', tags: ['VPS', 'SSL', 'CDN', '99.9%'] },
    { ico: '📧', t: 'Email Corporativo', d: 'Microsoft 365, Google Workspace, emails @suaempresa.ao.', tags: ['Microsoft 365', 'Google', 'Email'] },
  ],
  isp: [
    { ico: '📡', t: 'Internet Dedicada', d: 'Fibra ótica, VSAT e WiMAX. Links dedicados com SLA e IP fixo.', tags: ['Fibra', 'VSAT', 'IP Fixo'] },
    { ico: '🌐', t: 'Domínios .ao', d: 'Registo e gestão de domínios .ao, .com, .net. DNS gerido.', tags: ['.ao', '.com', 'DNS'] },
    { ico: '📶', t: 'Wireless Empresarial', d: 'Cobertura WiFi total para escritórios, fábricas e campus. Ubiquiti, Cisco.', tags: ['WiFi', 'Ubiquiti', 'Cisco'] },
  ],
  man: [
    { ico: '🔧', t: 'Manutenção Preventiva', d: 'Contratos mensais de manutenção. Visitas periódicas, relatórios técnicos.', tags: ['Preventiva', 'Mensal', 'SLA'] },
    { ico: '🆘', t: 'Helpdesk & Suporte', d: 'Suporte técnico presencial e remoto. Ticket system, SLA garantido.', tags: ['Helpdesk', 'Remoto', 'SLA'] },
    { ico: '⚡', t: 'UPS & Energia', d: 'Instalação de UPS, geradores, estabilizadores e aterramento elétrico.', tags: ['UPS', 'Gerador', 'APC'] },
    { ico: '🖨️', t: 'Reparação de Equipamentos', d: 'Diagnóstico e reparação de computadores, impressoras, servidores.', tags: ['Reparação', 'Computadores', 'Impressoras'] },
  ],
  com: [
    { ico: '🛒', t: 'Comércio de Equipamentos', d: 'Venda e importação de equipamentos de TI das principais marcas.', tags: ['Cisco', 'Dell', 'HP', 'Lenovo'] },
    { ico: '📦', t: 'Importação & Logística', d: 'Importação, desembaraço aduaneiro e entrega em toda Angola.', tags: ['Importação', 'Alfândega', 'Nacional'] },
    { ico: '🏷️', t: 'Licenciamento de Software', d: 'Microsoft, Adobe, Antivírus, Office 365, Windows Server e mais.', tags: ['Microsoft', 'Adobe', 'Licenças'] },
  ],
}

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

const provinces = ['Luanda', 'Benguela', 'Huíla', 'Huambo', 'Cabinda', 'Malanje', 'Bié', 'Namibe', 'Lunda Norte', 'Lunda Sul', 'Cunene', 'Moxico', 'Outra']
const serviceCbx = ['Infra & Redes TI', 'Segurança Eletrónica', 'Desenvolvimento Software', 'Website / E-commerce', 'Hospedagem & Domínio', 'Internet (ISP)', 'Manutenção & Suporte', 'Comércio & Importação', 'Consultoria TI', 'Outro']

export default function LandingPage() {
  const [lang, setLang] = useState<Lang>('pt')
  const [activeTab, setActiveTab] = useState<keyof typeof servicesData>('infra')
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('inicio')
  const [formSent, setFormSent] = useState(false)
  const [formRef, setFormRef] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const tx = t[lang]

  useEffect(() => {
    const stored = localStorage.getItem('bx_lang') as Lang | null
    if (stored) setLang(stored)
  }, [])

  const toggleLang = () => {
    const nl: Lang = lang === 'pt' ? 'en' : 'pt'
    setLang(nl)
    localStorage.setItem('bx_lang', nl)
  }

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20)
      const sections = ['inicio','servicos','sobre','parceiros','metodologia','caes','orcamento','contacto']
      let current = 'inicio'
      for (const id of sections) {
        const el = document.getElementById(id)
        if (el && window.scrollY >= el.offsetTop - 100) current = id
      }
      setActiveSection(current)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (id: string) => {
    setMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 1200))
    const ref = `BX-ORC-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000) + 1000}`
    setFormRef(ref)
    setFormSent(true)
    setSubmitting(false)
    // TODO: POST to Formspree: await fetch('https://formspree.io/f/FORM_ID', { method:'POST', body: new FormData(e.currentTarget) })
  }

  const navLink = (id: string, label: string) => (
    <button
      key={id}
      onClick={() => scrollTo(id)}
      className={`text-xs tracking-wider transition-colors font-medium ${activeSection === id ? 'text-green' : 'text-text2 hover:text-silver2'}`}
      style={{ color: activeSection === id ? 'var(--green)' : undefined }}
    >
      {label}
    </button>
  )

  const tabKeys = Object.keys(servicesData) as (keyof typeof servicesData)[]

  return (
    <div className="min-h-screen" style={{ background: 'var(--navy)' }}>

      {/* ── NAV ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'py-0' : 'py-0'}`}
        style={{
          background: scrolled ? 'rgba(10,22,40,0.98)' : 'rgba(10,22,40,0.85)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--border)',
          height: 64,
          display: 'flex', alignItems: 'center', padding: '0 1.5rem', gap: '1.5rem',
        }}>
        <BexaltecLogo size={32} />

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-5 flex-1 ml-4">
          {navLink('servicos', tx.nav.services)}
          {navLink('sobre', tx.nav.about)}
          {navLink('parceiros', tx.nav.partners)}
          {navLink('metodologia', tx.nav.methodology)}
          {navLink('caes', tx.nav.caes)}
          {navLink('contacto', tx.nav.contact)}
        </div>

        <div className="hidden md:flex items-center gap-3 ml-auto">
          <button onClick={toggleLang}
            className="text-xs font-mono tracking-widest px-3 py-1.5 rounded border transition-all"
            style={{ borderColor: 'var(--border)', color: 'var(--text2)' }}>
            {tx.nav.lang}
          </button>
          <Link href="/login"
            className="text-xs tracking-wide px-3 py-1.5 rounded transition-all"
            style={{ color: 'var(--text2)', border: '1px solid var(--border)' }}>
            {tx.nav.login}
          </Link>
          <button onClick={() => scrollTo('orcamento')}
            className="btn-primary text-xs py-2 px-5">
            {tx.nav.cta} ↗
          </button>
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden ml-auto p-2" onClick={() => setMenuOpen(!menuOpen)}
          style={{ color: 'var(--silver)' }}>
          <div className="w-5 space-y-1">
            {[0,1,2].map(i => (
              <span key={i} className="block h-0.5 rounded transition-all"
                style={{ background: 'var(--silver)', width: i === 1 && menuOpen ? '60%' : '100%' }} />
            ))}
          </div>
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 pt-16" style={{ background: 'rgba(10,22,40,0.98)', backdropFilter: 'blur(16px)' }}>
          <div className="flex flex-col items-center gap-6 pt-12">
            {[['servicos', tx.nav.services], ['sobre', tx.nav.about], ['parceiros', tx.nav.partners],
              ['metodologia', tx.nav.methodology], ['caes', tx.nav.caes], ['contacto', tx.nav.contact]
            ].map(([id, label]) => (
              <button key={id} onClick={() => scrollTo(id)}
                className="text-lg font-rajdhani font-bold tracking-widest"
                style={{ color: 'var(--silver2)' }}>
                {label}
              </button>
            ))}
            <div className="flex gap-3 mt-4">
              <button onClick={toggleLang} className="btn-secondary text-sm py-2 px-4">{tx.nav.lang}</button>
              <Link href="/login" className="btn-secondary text-sm py-2 px-4" onClick={() => setMenuOpen(false)}>{tx.nav.login}</Link>
            </div>
            <button onClick={() => scrollTo('orcamento')} className="btn-primary">{tx.nav.cta} ↗</button>
          </div>
        </div>
      )}

      {/* ── HERO ── */}
      <section id="inicio" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 2rem 5rem', position: 'relative', overflow: 'hidden' }}>
        {/* Background */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 20% 50%, rgba(0,230,118,0.06) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(0,100,255,0.05) 0%, transparent 40%)' }} />
        {/* Circuit grid */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.04, pointerEvents: 'none' }} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#00E676" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)"/>
          {[...Array(8)].map((_, i) => (
            <circle key={i} cx={`${15 + i * 12}%`} cy={`${20 + (i % 3) * 25}%`} r="2" fill="#00E676" />
          ))}
        </svg>

        <div style={{ textAlign: 'center', position: 'relative', zIndex: 2, maxWidth: 860 }} className="animate-fade-up">
          <div className="section-badge" style={{ justifyContent: 'center', marginBottom: '1.5rem', padding: '6px 16px', border: '1px solid rgba(0,230,118,0.25)', borderRadius: 20, background: 'rgba(0,230,118,0.07)', display: 'inline-flex' }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse-slow" style={{ background: 'var(--green)', flexShrink: 0 }} />
            {tx.hero.badge}
          </div>

          <h1 className="font-rajdhani font-black gradient-text" style={{ fontSize: 'clamp(64px,10vw,100px)', lineHeight: 0.9, letterSpacing: 6, marginBottom: '0.5rem' }}>
            {tx.hero.title}
          </h1>
          <p className="font-mono" style={{ fontSize: 'clamp(11px,1.6vw,14px)', letterSpacing: 6, color: 'var(--text2)', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
            {tx.hero.sub}
          </p>
          <p style={{ fontSize: 'clamp(14px,1.8vw,17px)', color: 'var(--text2)', lineHeight: 1.75, maxWidth: 620, margin: '0 auto 2.5rem' }}>
            {tx.hero.desc}
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-primary" style={{ fontSize: 15, padding: '14px 32px' }} onClick={() => scrollTo('orcamento')}>
              {tx.hero.cta1}
            </button>
            <button className="btn-secondary" style={{ fontSize: 15, padding: '14px 32px' }} onClick={() => scrollTo('servicos')}>
              {tx.hero.cta2}
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginTop: '3.5rem', maxWidth: 680, marginLeft: 'auto', marginRight: 'auto' }}>
            {[tx.hero.stat1, tx.hero.stat2, tx.hero.stat3, tx.hero.stat4].map((s, i) => (
              <div key={i} className="card-base" style={{ padding: '1rem 0.75rem', textAlign: 'center' }}>
                <div className="font-rajdhani font-black" style={{ fontSize: 32, color: 'var(--green)', lineHeight: 1 }}>{s.n}</div>
                <div style={{ fontSize: 10, color: 'var(--slate)', marginTop: 4, letterSpacing: 0.5 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="servicos" style={{ padding: '5rem 2rem', background: 'linear-gradient(180deg, var(--navy) 0%, rgba(13,32,68,0.3) 100%)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="section-badge">{tx.services.badge}</div>
          <h2 className="font-rajdhani font-black" style={{ fontSize: 'clamp(28px,4vw,40px)', letterSpacing: 1, color: 'var(--text)', marginBottom: '0.5rem' }}>{tx.services.title}</h2>
          <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.7, maxWidth: 560, marginBottom: '1.75rem' }}>{tx.services.desc}</p>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: '1.5rem' }}>
            {tabKeys.map((key, i) => (
              <button key={key} onClick={() => setActiveTab(key)}
                style={{
                  fontSize: 12, padding: '7px 16px', borderRadius: 20,
                  border: `1px solid ${activeTab === key ? 'rgba(0,230,118,0.4)' : 'var(--border)'}`,
                  color: activeTab === key ? 'var(--green)' : 'var(--slate)',
                  background: activeTab === key ? 'rgba(0,230,118,0.08)' : 'transparent',
                  cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit', letterSpacing: '0.4px',
                }}>
                {tx.services.tabs[i]}
              </button>
            ))}
          </div>

          {/* Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: '0.85rem' }}>
            {servicesData[activeTab].map((card, i) => (
              <div key={i} className="card-base card-glow" style={{ padding: '1.25rem', transition: 'all 0.25s' }}>
                <div style={{ fontSize: 24, marginBottom: '0.75rem' }}>{card.ico}</div>
                <div className="font-rajdhani font-semibold" style={{ fontSize: 16, color: 'var(--text)', marginBottom: '0.3rem' }}>{card.t}</div>
                <div style={{ fontSize: 12, color: 'var(--slate)', lineHeight: 1.6, marginBottom: '0.6rem' }}>{card.d}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {card.tags.map(tag => (
                    <span key={tag} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, background: 'rgba(0,230,118,0.07)', border: '1px solid rgba(0,230,118,0.18)', color: 'var(--green2)' }}>{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="sobre" style={{ padding: '5rem 2rem', background: 'linear-gradient(135deg,rgba(13,32,68,0.5) 0%,rgba(10,22,40,.8) 100%)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center' }}>
          <div>
            <div className="section-badge">{tx.about.badge}</div>
            <h2 className="font-rajdhani font-black" style={{ fontSize: 'clamp(28px,4vw,40px)', letterSpacing: 1, color: 'var(--text)', marginBottom: '0.75rem' }}>{tx.about.title}</h2>
            <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.75, marginBottom: '1rem' }}>{tx.about.p1}</p>
            <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.75, marginBottom: '1.75rem' }}>{tx.about.p2}</p>
            {/* KPIs */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {tx.about.kpis.map((k, i) => (
                <div key={i} style={{ background: 'var(--glow)', border: '1px solid var(--border-g)', borderRadius: 12, padding: '1rem', textAlign: 'center' }}>
                  <div className="font-rajdhani font-black" style={{ fontSize: 34, color: 'var(--green)', lineHeight: 1 }}>{k.n}</div>
                  <div style={{ fontSize: 10, color: 'var(--slate)', marginTop: 3 }}>{k.l}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {tx.about.items.map((item, i) => (
              <div key={i} className="card-base" style={{ display: 'flex', gap: '0.85rem', padding: '0.9rem 1.1rem', alignItems: 'flex-start' }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(0,230,118,0.1)', border: '1px solid rgba(0,230,118,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                  {['🏅','📦','🎯','🗺️'][i]}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--silver2)', marginBottom: 2 }}>{item.t}</div>
                  <div style={{ fontSize: 11, color: 'var(--slate)', lineHeight: 1.5 }}>{item.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PARTNERS ── */}
      <section id="parceiros" style={{ padding: '5rem 2rem', background: 'var(--navy)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="section-badge">{tx.partners.badge}</div>
          <h2 className="font-rajdhani font-black" style={{ fontSize: 'clamp(28px,4vw,40px)', letterSpacing: 1, color: 'var(--text)', marginBottom: '0.5rem' }}>{tx.partners.title}</h2>
          <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.7, maxWidth: 560, marginBottom: '2rem' }}>{tx.partners.desc}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))', gap: '0.75rem' }}>
            {partners.map((p) => (
              <div key={p.name} className="card-base card-glow" style={{ padding: '0.9rem', textAlign: 'center', transition: 'all 0.25s' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: p.color, margin: '0 auto 0.5rem' }} />
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--silver2)' }}>{p.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── METHODOLOGY ── */}
      <section id="metodologia" style={{ padding: '5rem 2rem', background: 'linear-gradient(135deg,rgba(13,32,68,.4) 0%,var(--navy) 100%)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="section-badge">{tx.methodology.badge}</div>
          <h2 className="font-rajdhani font-black" style={{ fontSize: 'clamp(28px,4vw,40px)', letterSpacing: 1, color: 'var(--text)', marginBottom: '0.5rem' }}>{tx.methodology.title}</h2>
          <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.7, maxWidth: 560, marginBottom: '2.5rem' }}>{tx.methodology.desc}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 0, position: 'relative' }}>
            <div style={{ position: 'absolute', top: 27, left: '5%', right: '5%', height: 1, background: 'linear-gradient(90deg,transparent,rgba(0,230,118,.3),transparent)', zIndex: 0 }} />
            {tx.methodology.steps.map((step) => (
              <div key={step.n} style={{ textAlign: 'center', padding: '0.4rem', position: 'relative', zIndex: 1 }}>
                <div className="font-rajdhani font-black"
                  style={{ width: 54, height: 54, borderRadius: '50%', border: '2px solid rgba(0,230,118,.4)', background: 'var(--navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.85rem', fontSize: 19, color: 'var(--green)', transition: 'all 0.3s' }}>
                  {step.n}
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--silver2)', marginBottom: '0.25rem' }}>{step.t}</div>
                <div style={{ fontSize: 10, color: 'var(--slate)', lineHeight: 1.5 }}>{step.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CAEs ── */}
      <section id="caes" style={{ padding: '5rem 2rem', background: 'var(--navy)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="section-badge">{tx.caes.badge}</div>
          <h2 className="font-rajdhani font-black" style={{ fontSize: 'clamp(28px,4vw,40px)', letterSpacing: 1, color: 'var(--text)', marginBottom: '0.5rem' }}>{tx.caes.title}</h2>
          <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.7, maxWidth: 560, marginBottom: '2rem' }}>{tx.caes.desc}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(290px,1fr))', gap: '0.65rem' }}>
            {tx.caes.list.map((cae) => (
              <div key={cae.ref} className="card-base card-glow" style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem', padding: '0.9rem 1.1rem', transition: 'all 0.2s' }}>
                <div className="font-rajdhani" style={{ fontSize: 11, color: 'rgba(0,230,118,.5)', letterSpacing: 1, flexShrink: 0, minWidth: 50, paddingTop: 1 }}>{cae.ref}</div>
                <div style={{ fontSize: 12, color: 'var(--silver2)', lineHeight: 1.5 }}>{cae.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUOTE FORM ── */}
      <section id="orcamento" style={{ padding: '5rem 2rem', background: 'linear-gradient(135deg,rgba(13,32,68,.6) 0%,rgba(10,22,40,.9) 100%)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="section-badge">{tx.quote.badge}</div>
          <h2 className="font-rajdhani font-black" style={{ fontSize: 'clamp(28px,4vw,40px)', letterSpacing: 1, color: 'var(--text)', marginBottom: '0.5rem' }}>{tx.quote.title}</h2>
          <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.7, maxWidth: 560, marginBottom: '2.5rem' }}>{tx.quote.desc}</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '2.5rem', alignItems: 'start' }}>
            {/* Form */}
            <div className="card-base" style={{ padding: '2rem' }}>
              <div className="font-rajdhani font-semibold" style={{ fontSize: 20, color: 'var(--text)', marginBottom: '0.25rem' }}>
                {lang === 'pt' ? 'Formulário de Orçamento' : 'Quote Form'}
              </div>
              <div style={{ fontSize: 12, color: 'var(--slate)', marginBottom: '1.5rem' }}>{tx.quote.form.required}</div>

              {formSent ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                  <div style={{ fontSize: 48, marginBottom: '1rem' }}>✅</div>
                  <div className="font-rajdhani font-bold" style={{ fontSize: 24, color: 'var(--green)', marginBottom: '0.5rem' }}>{tx.quote.form.success}</div>
                  <div style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.7 }}>{tx.quote.form.successDesc}</div>
                  <div style={{ marginTop: '1rem', fontSize: 12, color: 'var(--slate)' }}>Ref: <span style={{ color: 'var(--green)' }}>{formRef}</span></div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div><label style={{ fontSize: 11, color: 'var(--silver)', letterSpacing: '0.5px', display: 'block', marginBottom: '0.3rem' }}>{tx.quote.form.name}</label><input className="input-field" placeholder="João Silva" required /></div>
                    <div><label style={{ fontSize: 11, color: 'var(--silver)', letterSpacing: '0.5px', display: 'block', marginBottom: '0.3rem' }}>{tx.quote.form.role}</label><input className="input-field" placeholder="Diretor de TI" /></div>
                  </div>
                  <div><label style={{ fontSize: 11, color: 'var(--silver)', letterSpacing: '0.5px', display: 'block', marginBottom: '0.3rem' }}>{tx.quote.form.company}</label><input className="input-field" placeholder="Nome da empresa" required /></div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div><label style={{ fontSize: 11, color: 'var(--silver)', letterSpacing: '0.5px', display: 'block', marginBottom: '0.3rem' }}>{tx.quote.form.email}</label><input type="email" className="input-field" placeholder="email@empresa.ao" required /></div>
                    <div><label style={{ fontSize: 11, color: 'var(--silver)', letterSpacing: '0.5px', display: 'block', marginBottom: '0.3rem' }}>{tx.quote.form.phone}</label><input type="tel" className="input-field" placeholder="+244 9XX XXX XXX" required /></div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label style={{ fontSize: 11, color: 'var(--silver)', letterSpacing: '0.5px', display: 'block', marginBottom: '0.3rem' }}>{tx.quote.form.province}</label>
                      <select className="input-field">
                        <option>{lang === 'pt' ? 'Selecionar...' : 'Select...'}</option>
                        {provinces.map(p => <option key={p}>{p}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: 11, color: 'var(--silver)', letterSpacing: '0.5px', display: 'block', marginBottom: '0.3rem' }}>{tx.quote.form.size}</label>
                      <select className="input-field">
                        {['Micro (1–9)', 'Pequena (10–49)', 'Média (50–249)', 'Grande (250+)'].map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: 11, color: 'var(--silver)', letterSpacing: '0.5px', display: 'block', marginBottom: '0.5rem' }}>{tx.quote.form.services}</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.35rem' }}>
                      {serviceCbx.map(s => (
                        <label key={s} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text2)', cursor: 'pointer' }}>
                          <input type="checkbox" style={{ accentColor: 'var(--green)', width: 13, height: 13 }} />
                          <span>{s}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: 11, color: 'var(--silver)', letterSpacing: '0.5px', display: 'block', marginBottom: '0.3rem' }}>{tx.quote.form.description}</label>
                    <textarea className="input-field" style={{ resize: 'vertical', minHeight: 95, lineHeight: 1.6 }}
                      placeholder={lang === 'pt' ? 'Descreva resumidamente o projeto...' : 'Briefly describe the project...'} required />
                  </div>
                  <button type="submit" disabled={submitting}
                    className="btn-primary" style={{ justifyContent: 'center', padding: '14px', fontSize: 14, width: '100%', opacity: submitting ? 0.7 : 1 }}>
                    {submitting ? (lang === 'pt' ? 'Enviando...' : 'Sending...') : tx.quote.form.submit}
                  </button>
                </form>
              )}
            </div>

            {/* Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {tx.quote.info.map((item, i) => (
                <div key={i} className="card-base" style={{ display: 'flex', gap: '0.85rem', padding: '1rem 1.1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(0,230,118,0.1)', border: '1px solid rgba(0,230,118,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{item.ico}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--silver2)', marginBottom: 2 }}>{item.t}</div>
                    <div style={{ fontSize: 11, color: 'var(--slate)', lineHeight: 1.5 }}>{item.d}</div>
                  </div>
                </div>
              ))}
              <div style={{ background: 'var(--glow)', border: '1px solid var(--border-g)', borderRadius: 14, padding: '1.25rem', marginTop: '0.25rem' }}>
                <div className="font-rajdhani font-semibold" style={{ fontSize: 15, color: 'var(--text)', marginBottom: '0.75rem' }}>
                  {lang === 'pt' ? 'Contacto Direto' : 'Direct Contact'}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 2.2 }}>
                  📧 info@bexaltec.ao<br/>
                  📞 +244 9XX XXX XXX<br/>
                  💬 WhatsApp Business<br/>
                  📍 Luanda, Angola<br/>
                  🕐 {tx.contact.hours}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contacto" style={{ padding: '5rem 2rem', background: 'var(--navy)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="section-badge">{tx.contact.badge}</div>
          <h2 className="font-rajdhani font-black" style={{ fontSize: 'clamp(28px,4vw,40px)', letterSpacing: 1, color: 'var(--text)', marginBottom: '0.5rem' }}>{tx.contact.title}</h2>
          <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.7, maxWidth: 560, marginBottom: '2rem' }}>{tx.contact.desc}</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '1rem' }}>
            {[
              { ico: '📧', t: tx.contact.email, d: 'info@bexaltec.ao', s: tx.contact.hours.split('·')[0] },
              { ico: '📱', t: tx.contact.phone, d: '+244 9XX XXX XXX', s: tx.contact.hours },
              { ico: '📍', t: tx.contact.location, d: 'Luanda, Angola', s: tx.contact.address },
            ].map((c, i) => (
              <div key={i} className="card-base card-glow" style={{ padding: '1.5rem', textAlign: 'center', transition: 'all 0.25s' }}>
                <div style={{ fontSize: 28, marginBottom: '0.75rem' }}>{c.ico}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--silver2)', marginBottom: '0.5rem' }}>{c.t}</div>
                <div style={{ fontSize: 13, color: 'var(--green2)', marginBottom: '0.25rem' }}>{c.d}</div>
                <div style={{ fontSize: 11, color: 'var(--slate)' }}>{c.s}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: 'var(--navy3)', borderTop: '1px solid var(--border)', padding: '2rem', textAlign: 'center' }}>
        <div style={{ marginBottom: '0.75rem', display: 'flex', justifyContent: 'center' }}>
          <BexaltecLogo size={28} />
        </div>
        <div style={{ fontSize: 10, color: 'var(--slate)', letterSpacing: 3, marginBottom: '0.4rem', textTransform: 'uppercase' }}>{tx.footer.tagline}</div>
        <div style={{ fontSize: 11, color: 'var(--muted)' }}>
          {tx.footer.copy} · {tx.footer.caes} · info@bexaltec.ao
        </div>
        <div style={{ marginTop: '1rem', display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
          {[['servicos', tx.nav.services], ['sobre', tx.nav.about], ['orcamento', tx.nav.cta]].map(([id, label]) => (
            <button key={id} onClick={() => scrollTo(id)} style={{ fontSize: 11, color: 'var(--slate)', cursor: 'pointer', background: 'none', border: 'none' }}>{label}</button>
          ))}
          <Link href="/login" style={{ fontSize: 11, color: 'var(--slate)', textDecoration: 'none' }}>{tx.nav.login}</Link>
        </div>
      </footer>

    </div>
  )
}
