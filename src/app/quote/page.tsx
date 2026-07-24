'use client'
import { useState } from 'react'
import Link from 'next/link'
import { NavBar } from '@/components/ui/NavBar'
import { Footer } from '@/components/ui/Footer'
import { CheckCircle2 } from 'lucide-react'

const provinces = ['Luanda', 'Benguela', 'Huíla', 'Huambo', 'Cabinda', 'Malanje', 'Bié', 'Namibe', 'Lunda Norte', 'Lunda Sul', 'Cunene', 'Moxico', 'Outra']

const serviceOptions = [
  { id: 'lab', label: 'Laboratório de Reparação', color: '#00E676' },
  { id: 'infra', label: 'Infraestrutura TI', color: '#42A5F5' },
  { id: 'security', label: 'Segurança Eletrónica', color: '#EF5350' },
  { id: 'network', label: 'Redes & Cabeamento', color: '#4DD0E1' },
  { id: 'software', label: 'Software & Desenvolvimento', color: '#CE93D8' },
  { id: 'web', label: 'Website / E-commerce', color: '#80DEEA' },
  { id: 'hosting', label: 'Hospedagem & Domínio', color: '#FFB74D' },
  { id: 'maintenance', label: 'Manutenção & Suporte', color: '#A5D6A7' },
  { id: 'consulting', label: 'Consultoria TI', color: '#F48FB1' },
  { id: 'commerce', label: 'Comércio & Importação', color: '#80CBC4' },
]

export default function QuotePage() {
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [formSent, setFormSent] = useState(false)
  const [formRef, setFormRef] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const toggleService = (id: string) => {
    setSelectedServices(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id])
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 1200))
    const ref = `BX-ORC-${new Date().getFullYear()}-${Math.floor(Math.random() * 9000) + 1000}`
    setFormRef(ref)
    setFormSent(true)
    setSubmitting(false)
    // TODO: POST to Formspree or email API
    // await fetch('https://formspree.io/f/FORM_ID', { method: 'POST', body: new FormData(e.currentTarget) })
  }

  return (
    <div style={{ background: 'var(--navy)', minHeight: '100vh' }}>
      <NavBar />

      <section style={{ padding: '120px 2rem 5rem' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div className="section-badge">Orçamento</div>
          <h1 className="font-rajdhani font-black" style={{ fontSize: 'clamp(28px,4vw,48px)', letterSpacing: 2, color: 'var(--text)', lineHeight: 1, marginBottom: '0.75rem' }}>
            PEDIR ORÇAMENTO
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.75, marginBottom: '2.5rem', maxWidth: 480 }}>
            Gratuito, sem compromisso. Resposta em até 24 horas úteis.
          </p>

          {formSent ? (
            <div className="card-base" style={{ padding: '4rem 2rem', textAlign: 'center', maxWidth: 560, margin: '0 auto' }}>
              <div style={{ fontSize: 52, marginBottom: '1rem' }}>✅</div>
              <h2 className="font-rajdhani font-black" style={{ fontSize: 28, color: 'var(--green)', marginBottom: '0.5rem' }}>
                Orçamento Enviado!
              </h2>
              <p style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.75, marginBottom: '1rem' }}>
                Recebemos o seu pedido e entraremos em contacto em até 24 horas úteis com uma proposta detalhada.
              </p>
              <div style={{ fontSize: 12, color: 'var(--slate)' }}>
                Referência: <span style={{ color: 'var(--green)', fontFamily: 'var(--font-mono)' }}>{formRef}</span>
              </div>
              <div style={{ marginTop: '2rem', display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link href="/" className="btn-secondary" style={{ fontSize: 13, padding: '10px 20px' }}>Voltar ao início</Link>
                <Link href="/login" className="btn-primary" style={{ fontSize: 13, padding: '10px 20px' }}>Aceder ao portal</Link>
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 0.7fr', gap: '2.5rem', alignItems: 'start' }}>
              {/* Form */}
              <div className="card-base" style={{ padding: '2rem' }}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                  {/* Personal info */}
                  <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, color: 'var(--green)', textTransform: 'uppercase', marginBottom: '-0.25rem' }}>
                    Dados de Contacto
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label style={{ fontSize: 11, color: 'var(--silver)', letterSpacing: '0.5px', display: 'block', marginBottom: '0.3rem' }}>Nome Completo *</label>
                      <input className="input-field" name="name" placeholder="João Silva" required />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, color: 'var(--silver)', letterSpacing: '0.5px', display: 'block', marginBottom: '0.3rem' }}>Cargo / Função</label>
                      <input className="input-field" name="role" placeholder="Diretor de TI" />
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: 11, color: 'var(--silver)', letterSpacing: '0.5px', display: 'block', marginBottom: '0.3rem' }}>Nome da Empresa *</label>
                    <input className="input-field" name="company" placeholder="Nome da empresa" required />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label style={{ fontSize: 11, color: 'var(--silver)', letterSpacing: '0.5px', display: 'block', marginBottom: '0.3rem' }}>Email *</label>
                      <input type="email" className="input-field" name="email" placeholder="email@empresa.ao" required />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, color: 'var(--silver)', letterSpacing: '0.5px', display: 'block', marginBottom: '0.3rem' }}>Telefone / WhatsApp *</label>
                      <input type="tel" className="input-field" name="phone" placeholder="+244 9XX XXX XXX" required />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <div>
                      <label style={{ fontSize: 11, color: 'var(--silver)', letterSpacing: '0.5px', display: 'block', marginBottom: '0.3rem' }}>Província</label>
                      <select className="input-field" name="province">
                        <option>Selecionar...</option>
                        {provinces.map(p => <option key={p}>{p}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize: 11, color: 'var(--silver)', letterSpacing: '0.5px', display: 'block', marginBottom: '0.3rem' }}>Dimensão da Empresa</label>
                      <select className="input-field" name="size">
                        {['Micro (1–9)', 'Pequena (10–49)', 'Média (50–249)', 'Grande (250+)'].map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Services */}
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: 'var(--green)', display: 'block', marginBottom: '0.6rem', textTransform: 'uppercase' }}>
                      Serviços de Interesse
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
                      {serviceOptions.map(svc => (
                        <button
                          key={svc.id}
                          type="button"
                          onClick={() => toggleService(svc.id)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 8, padding: '0.55rem 0.7rem',
                            borderRadius: 7, border: `1px solid ${selectedServices.includes(svc.id) ? svc.color + '60' : 'var(--border)'}`,
                            background: selectedServices.includes(svc.id) ? `${svc.color}0E` : 'transparent',
                            cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', transition: 'all 0.2s',
                          }}>
                          <div style={{
                            width: 14, height: 14, borderRadius: 3, flexShrink: 0,
                            border: `1.5px solid ${selectedServices.includes(svc.id) ? svc.color : 'var(--border)'}`,
                            background: selectedServices.includes(svc.id) ? svc.color : 'transparent',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            {selectedServices.includes(svc.id) && <span style={{ color: '#000', fontSize: 9, fontWeight: 900 }}>✓</span>}
                          </div>
                          <span style={{ fontSize: 11.5, color: selectedServices.includes(svc.id) ? 'var(--silver2)' : 'var(--text2)' }}>{svc.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label style={{ fontSize: 11, color: 'var(--silver)', letterSpacing: '0.5px', display: 'block', marginBottom: '0.3rem' }}>Descreva o Projeto *</label>
                    <textarea
                      className="input-field"
                      name="description"
                      style={{ resize: 'vertical', minHeight: 100, lineHeight: 1.6 }}
                      placeholder="Descreva resumidamente o que precisa. Quanto mais detalhe, melhor a proposta."
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary"
                    style={{ justifyContent: 'center', padding: '14px', fontSize: 14, width: '100%', opacity: submitting ? 0.7 : 1 }}>
                    {submitting ? 'A enviar...' : 'Enviar Pedido de Orçamento ↗'}
                  </button>
                  <p style={{ fontSize: 10, color: 'var(--muted)', textAlign: 'center', letterSpacing: 0.5 }}>
                    Gratuito · Sem compromisso · Resposta em 24h
                  </p>
                </form>
              </div>

              {/* Info panel */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {[
                  { ico: '⚡', t: 'Resposta Rápida', d: 'Contactamos em até 24 horas úteis com proposta detalhada.' },
                  { ico: '🎯', t: 'Proposta Personalizada', d: 'Cada orçamento é elaborado especificamente para as suas necessidades.' },
                  { ico: '🔒', t: 'Sem Compromisso', d: 'O orçamento é gratuito e não implica qualquer obrigação de compra.' },
                  { ico: '🛡️', t: 'Projetos com Garantia', d: 'Todos os trabalhos executados têm garantia documentada.' },
                  { ico: '🗺️', t: 'Presença Nacional', d: 'Projetos em todo o território angolano com equipas técnicas.' },
                ].map((item, i) => (
                  <div key={i} className="card-base" style={{ display: 'flex', gap: '0.75rem', padding: '0.9rem 1rem', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 18 }}>{item.ico}</span>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--silver2)', marginBottom: 2 }}>{item.t}</div>
                      <div style={{ fontSize: 11, color: 'var(--slate)', lineHeight: 1.5 }}>{item.d}</div>
                    </div>
                  </div>
                ))}

                {/* Direct contact */}
                <div style={{ padding: '1.1rem', background: 'rgba(0,230,118,0.05)', border: '1px solid rgba(0,230,118,0.18)', borderRadius: 12 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--silver2)', marginBottom: '0.6rem' }}>Contacto Direto</div>
                  <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 2.1 }}>
                    📧 info@bexaltec.ao<br />
                    📞 +244 9XX XXX XXX<br />
                    💬 WhatsApp Business
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  )
}
