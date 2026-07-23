'use client'
import { useState } from 'react'
import { mockTickets } from '@/lib/mock-data'
import type { TicketPriority, TicketStatus } from '@/lib/mock-data'

const priorityBadge: Record<TicketPriority, string> = {
  low: 'badge-gray', medium: 'badge-blue', high: 'badge-yellow', critical: 'badge-red',
}
const priorityLabel: Record<TicketPriority, string> = {
  low: 'Baixa', medium: 'Média', high: 'Alta', critical: 'Crítica',
}
const statusBadge: Record<TicketStatus, string> = {
  open: 'badge-yellow', in_progress: 'badge-blue', resolved: 'badge-green', closed: 'badge-gray',
}
const statusLabel: Record<TicketStatus, string> = {
  open: 'Aberto', in_progress: 'Em Progresso', resolved: 'Resolvido', closed: 'Fechado',
}

export default function TicketsPage() {
  const myTickets = mockTickets.filter(t => t.clientId === 'c1')
  const [showModal, setShowModal] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [selected, setSelected] = useState<typeof mockTickets[0] | null>(null)

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    await new Promise(r => setTimeout(r, 800))
    setSubmitted(true)
    setTimeout(() => { setShowModal(false); setSubmitted(false) }, 2000)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <div style={{ fontSize: 11, color: 'var(--slate)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: '0.25rem' }}>Portal do Cliente</div>
          <h1 className="font-rajdhani font-black" style={{ fontSize: 28, color: 'var(--text)', letterSpacing: 1 }}>Tickets de Suporte</h1>
          <p style={{ fontSize: 13, color: 'var(--slate)', marginTop: 4 }}>{myTickets.length} tickets no total · {myTickets.filter(t => ['open','in_progress'].includes(t.status)).length} abertos</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)} style={{ fontSize: 13 }}>+ Novo Ticket</button>
      </div>

      {/* Tickets list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {myTickets.map(ticket => (
          <div key={ticket.id} className="card-base card-glow" style={{ padding: '1.1rem 1.25rem', cursor: 'pointer', transition: 'all 0.2s' }}
            onClick={() => setSelected(ticket)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <span className="font-mono" style={{ fontSize: 10, color: 'var(--slate)' }}>{ticket.ref}</span>
                  <span className={`badge ${priorityBadge[ticket.priority]}`}>{priorityLabel[ticket.priority]}</span>
                  <span style={{ fontSize: 10, background: 'rgba(176,190,197,0.07)', border: '1px solid rgba(176,190,197,0.15)', color: 'var(--slate)', padding: '2px 7px', borderRadius: 10 }}>{ticket.category}</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--silver2)', marginBottom: '0.25rem' }}>{ticket.subject}</div>
                <div style={{ fontSize: 12, color: 'var(--slate)', lineHeight: 1.5 }}>{ticket.description.slice(0, 100)}...</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem', flexShrink: 0 }}>
                <span className={`badge ${statusBadge[ticket.status]}`}>{statusLabel[ticket.status]}</span>
                <div style={{ fontSize: 10, color: 'var(--muted)' }}>{new Date(ticket.createdAt).toLocaleDateString('pt-AO')}</div>
                {ticket.assignedTo && <div style={{ fontSize: 10, color: 'var(--slate)' }}>👤 {ticket.assignedTo}</div>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* New Ticket Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(6,16,30,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="card-base" style={{ width: '100%', maxWidth: 520, padding: '2rem', position: 'relative' }}>
            <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--slate)', fontSize: 18, cursor: 'pointer' }}>✕</button>
            <div className="font-rajdhani font-black" style={{ fontSize: 22, color: 'var(--text)', marginBottom: '0.25rem' }}>Abrir Novo Ticket</div>
            <p style={{ fontSize: 12, color: 'var(--slate)', marginBottom: '1.5rem' }}>A nossa equipa técnica responde em até 4 horas.</p>

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{ fontSize: 40, marginBottom: '0.75rem' }}>✅</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--green)' }}>Ticket criado com sucesso!</div>
              </div>
            ) : (
              <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: 11, color: 'var(--silver)', letterSpacing: '0.5px', display: 'block', marginBottom: '0.35rem' }}>ASSUNTO *</label>
                  <input className="input-field" placeholder="Descreva brevemente o problema" required />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: 11, color: 'var(--silver)', letterSpacing: '0.5px', display: 'block', marginBottom: '0.35rem' }}>CATEGORIA</label>
                    <select className="input-field">
                      {['Infra & Redes', 'Segurança Eletr.', 'Software', 'Website', 'Outro'].map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 11, color: 'var(--silver)', letterSpacing: '0.5px', display: 'block', marginBottom: '0.35rem' }}>PRIORIDADE</label>
                    <select className="input-field">
                      <option value="low">Baixa</option>
                      <option value="medium">Média</option>
                      <option value="high">Alta</option>
                      <option value="critical">Crítica</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 11, color: 'var(--silver)', letterSpacing: '0.5px', display: 'block', marginBottom: '0.35rem' }}>DESCRIÇÃO DETALHADA *</label>
                  <textarea className="input-field" style={{ resize: 'vertical', minHeight: 110, lineHeight: 1.6 }}
                    placeholder="Descreva o problema em detalhe: quando começou, o que já tentou, impacto no trabalho..." required />
                </div>
                <button type="submit" className="btn-primary justify-center w-full" style={{ fontSize: 13, padding: '12px' }}>
                  Submeter Ticket ↗
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Ticket detail modal */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(6,16,30,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
          onClick={() => setSelected(null)}>
          <div className="card-base" style={{ width: '100%', maxWidth: 560, padding: '2rem', position: 'relative' }}
            onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelected(null)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--slate)', fontSize: 18, cursor: 'pointer' }}>✕</button>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
              <span className="font-mono" style={{ fontSize: 10, color: 'var(--slate)' }}>{selected.ref}</span>
              <span className={`badge ${statusBadge[selected.status]}`}>{statusLabel[selected.status]}</span>
              <span className={`badge ${priorityBadge[selected.priority]}`}>{priorityLabel[selected.priority]}</span>
            </div>
            <div className="font-rajdhani font-bold" style={{ fontSize: 20, color: 'var(--text)', marginBottom: '0.75rem' }}>{selected.subject}</div>
            <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.7, marginBottom: '1.25rem' }}>{selected.description}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {[
                ['Categoria', selected.category],
                ['Criado em', new Date(selected.createdAt).toLocaleDateString('pt-AO')],
                ['Atualizado', new Date(selected.updatedAt).toLocaleDateString('pt-AO')],
                ['Atribuído a', selected.assignedTo || 'Aguardando atribuição'],
              ].map(([k, v]) => (
                <div key={k} style={{ padding: '0.75rem', background: 'rgba(13,31,58,0.5)', borderRadius: 8, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 10, color: 'var(--slate)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 2 }}>{k}</div>
                  <div style={{ fontSize: 12, color: 'var(--silver2)' }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
