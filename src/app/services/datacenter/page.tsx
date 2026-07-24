import type { Metadata } from 'next'
import Link from 'next/link'
import { NavBar } from '@/components/ui/NavBar'
import { Footer } from '@/components/ui/Footer'
import { ArrowRight, Database, CheckCircle2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Datacenter & Cloud — Bexaltec · Servidores e Virtualização Angola',
  description: 'Servidores Dell/HPE, virtualização VMware/Hyper-V, storage SAN/NAS, backup e migração cloud AWS/Azure para empresas em Angola.',
  keywords: 'datacenter Angola, servidores Dell Angola, VMware Angola, cloud AWS Azure Angola, backup empresarial Angola',
}

const COLOR = '#CE93D8'

const solutions = [
  { title: 'Servidores & Hardware', items: ['Dell PowerEdge & HPE ProLiant', 'Configuração RAID e HA', 'UPS e energia condicionada', 'Gestão remota iDRAC/iLO', 'Garantia fabricante incluída'] },
  { title: 'Virtualização', items: ['VMware vSphere/ESXi', 'Microsoft Hyper-V', 'Proxmox VE (open-source)', 'vMotion e live migration', 'Alta disponibilidade (HA)'] },
  { title: 'Storage SAN & NAS', items: ['Storage Dell EMC/NetApp', 'SAN iSCSI e Fibre Channel', 'NAS Synology/QNAP', 'Deduplicação e compressão', 'Tiering automático SSD/HDD'] },
  { title: 'Backup & Recuperação', items: ['Veeam Backup & Replication', 'Backup 3-2-1 documentado', 'Testes de restore mensais', 'RPO e RTO definidos por SLA', 'Backup offsite e cloud'] },
  { title: 'Cloud (AWS & Azure)', items: ['Migração lift-and-shift', 'Arquitetura híbrida cloud', 'Azure Active Directory', 'Microsoft 365 empresarial', 'Cost optimization'] },
  { title: 'Sala de Servidores', items: ['Rack 19" e acessórios', 'Ar condicionado precision', 'Controlo de temperatura', 'Acesso biométrico à sala', 'Monitoramento ambiental'] },
]

export default function DatacenterPage() {
  return (
    <div style={{ background: 'var(--navy)', minHeight: '100vh' }}>
      <NavBar />

      <div style={{ padding: '100px 2rem 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: 12, color: 'var(--slate)' }}>
          <Link href="/" style={{ color: 'var(--slate)', textDecoration: 'none' }}>Início</Link>
          <span>›</span>
          <Link href="/services" style={{ color: 'var(--slate)', textDecoration: 'none' }}>Serviços</Link>
          <span>›</span>
          <span style={{ color: COLOR }}>Datacenter & Cloud</span>
        </div>
      </div>

      <section style={{ padding: '2rem 2rem 5rem', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 30% 40%, rgba(206,147,216,0.05) 0%, transparent 60%)`, pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.25rem' }}>
                <div style={{ width: 44, height: 44, borderRadius: 11, background: `rgba(206,147,216,0.12)`, border: `1px solid rgba(206,147,216,0.25)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Database size={22} color={COLOR} />
                </div>
                <span style={{ fontSize: 10, letterSpacing: 2, color: COLOR, fontWeight: 700, textTransform: 'uppercase' }}>Datacenter & Cloud</span>
              </div>
              <h1 className="font-rajdhani font-black" style={{ fontSize: 'clamp(30px,5vw,52px)', letterSpacing: 2, color: 'var(--text)', lineHeight: 1.05, marginBottom: '1rem' }}>
                INFRAESTRUTURA<br />
                <span style={{ color: COLOR }}>DE CLASSE MUNDIAL</span>
              </h1>
              <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.85, marginBottom: '1.5rem' }}>
                Servidores, virtualização, storage e cloud para empresas que precisam de máxima performance, disponibilidade e segurança de dados.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <Link href="/quote" className="btn-primary" style={{ fontSize: 13, padding: '11px 22px' }}>
                  Dimensionar Datacenter <ArrowRight size={14} />
                </Link>
                <Link href="/contact" className="btn-secondary" style={{ fontSize: 13, padding: '11px 22px' }}>
                  Contactar
                </Link>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              {[
                { n: '99.9%', l: 'Uptime Garantido' },
                { n: '5+', l: 'Datacenters Implementados' },
                { n: 'Dell+HPE', l: 'Parceiros Certificados' },
                { n: 'AWS/Azure', l: 'Cloud Partners' },
              ].map((s, i) => (
                <div key={i} style={{ padding: '1.5rem', background: `rgba(206,147,216,0.04)`, border: `1px solid rgba(206,147,216,0.14)`, borderRadius: 14, textAlign: 'center' }}>
                  <div className="font-rajdhani font-black" style={{ fontSize: 28, color: COLOR, lineHeight: 1 }}>{s.n}</div>
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
            Da Sala de Servidores à Nuvem
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
            Modernize a Sua Infraestrutura
          </h2>
          <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.75, marginBottom: '2rem' }}>
            Avaliação gratuita do ambiente atual e roadmap de modernização.
          </p>
          <Link href="/quote" className="btn-primary" style={{ fontSize: 14, padding: '13px 28px' }}>
            Pedir Avaliação Gratuita ↗
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
