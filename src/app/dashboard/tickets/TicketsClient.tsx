'use client'
// ─── Tickets Client Component ──────────────────────────────────────────────
import { useState, useTransition } from 'react'
import {
  StatusBadge, PriorityBadge, PageHeader, SearchBar,
  Modal, FormField, EmptyState, useToast,
} from '@/components/ui/shared'
import { createTicket, addTicketMessage } from '@/lib/actions/tickets'

type Ticket = {
  id: number
  ref: string
  title: string
  status: 'open' | 'in_progress' | 'waiting' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'critical'
  category: string | null
  createdAt: Date
  updatedAt: Date
}

const STATUS_TABS = ['all', 'open', 'in_progress', 'waiting', 'resolved'] as const
const STATUS_LABELS: Record<string, string> = {
  all: 'Todos', open: 'Abertos', in_progress: 'Em Progresso', waiting: 'Aguardando', resolved: 'Resolvidos',
}

export function TicketsClient({ tickets, sessionId }: { tickets: Ticket[]; sessionId: number }) {
  const { show, ToastComponent } = useToast()
  const [isPending, startTransition] = useTransition()

  const [search, setSearch] = useState('')
  const [tab, setTab] = useState<string>('all')
  const [showNew, setShowNew] = useState(false)
  const [selected, setSelected] = useState<Ticket | null>(null)
  const [replyBody, setReplyBody] = useState('')

  // New ticket form state
  const [newTitle, setNewTitle] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newCategory, setNewCategory] = useState('Infra & Redes')
  const [newPriority, setNewPriority] = useState<'low'|'medium'|'high'|'critical'>('medium')

  const filtered = tickets.filter(t => {
    const matchTab = tab === 'all' || t.status === tab
    const matchSearch = !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.ref.toLowerCase().includes(search.toLowerCase())
    return matchTab && matchSearch
  })

  const openCount = tickets.filter(t => t.status === 'open' || t.status === 'in_progress').length

  function handleCreate() {
    if (!newTitle.trim() || !newDesc.trim()) return
    startTransition(async () => {
      const result = await createTicket({ title: newTitle, description: newDesc, category: newCategory, priority: newPriority })
      if (result.error) {
        show(result.error, 'error')
      } else {
        show('Ticket criado com sucesso!', 'success')
        setShowNew(false)
        setNewTitle(''); setNewDesc(''); setNewCategory('Infra & Redes'); setNewPriority('medium')
      }
    })
  }

  function handleReply(ticketId: number) {
    if (!replyBody.trim()) return
    startTransition(async () => {
      const result = await addTicketMessage(ticketId, replyBody)
      if (result.error) {
        show(result.error, 'error')
      } else {
        show('Resposta enviada!', 'success')
        setReplyBody('')
      }
    })
  }

  return (
    <div>
      <PageHeader
        title="Tickets de Suporte"
        sub={`${tickets.length} tickets · ${openCount} abertos`}
        action={
          <button className="btn-primary" onClick={() => setShowNew(true)} style={{ fontSize: 13 }}>
            + Novo Ticket
          </button>
        }
      />

      {/* Filters */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Pesquisar tickets..." />
        </div>
        <div style={{ display: 'flex', gap: '0.35rem' }}>
          {STATUS_TABS.map(s => (
            <button key={s} onClick={() => setTab(s)}
              style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid', fontSize: 12, cursor: 'pointer', transition: 'all 0.2s',
                borderColor: tab === s ? 'var(--green)' : 'var(--border)',
                background: tab === s ? 'rgba(0,230,118,0.1)' : 'transparent',
                color: tab === s ? 'var(--green)' : 'var(--slate)' }}>
              {STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      {/* Ticket list */}
      {filtered.length === 0 ? (
        <EmptyState ico="🎫" title="Sem tickets" sub="Nenhum ticket corresponde aos filtros." />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filtered.map(ticket => (
            <div key={ticket.id} className="card-base card-glow"
              style={{ padding: '1.1rem 1.25rem', cursor: 'pointer', transition: 'all 0.2s' }}
              onClick={() => setSelected(ticket)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <span className="font-mono" style={{ fontSize: 10, color: 'var(--slate)' }}>{ticket.ref}</span>
                    <PriorityBadge priority={ticket.priority} />
                    {ticket.category && (
                      <span style={{ fontSize: 10, background: 'rgba(176,190,197,0.07)', border: '1px solid rgba(176,190,197,0.15)', color: 'var(--slate)', padding: '2px 7px', borderRadius: 10 }}>{ticket.category}</span>
                    )}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--silver2)' }}>{ticket.title}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem', flexShrink: 0 }}>
                  <StatusBadge status={ticket.status} />
                  <div style={{ fontSize: 10, color: 'var(--muted)' }}>{new Date(ticket.createdAt).toLocaleDateString('pt-AO')}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Ticket Modal */}
      <Modal open={showNew} onClose={() => setShowNew(false)} title="Abrir Novo Ticket"
        subtitle="A nossa equipa técnica responde em até 4 horas.">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <FormField label="Assunto" required>
            <input className="input-field" value={newTitle} onChange={e => setNewTitle(e.target.value)}
              placeholder="Descreva brevemente o problema" />
          </FormField>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <FormField label="Categoria">
              <select className="input-field" value={newCategory} onChange={e => setNewCategory(e.target.value)}>
                {['Infra & Redes', 'Segurança Eletr.', 'Software', 'Website', 'Outro'].map(o => <option key={o}>{o}</option>)}
              </select>
            </FormField>
            <FormField label="Prioridade">
              <select className="input-field" value={newPriority} onChange={e => setNewPriority(e.target.value as any)}>
                <option value="low">Baixa</option>
                <option value="medium">Média</option>
                <option value="high">Alta</option>
                <option value="critical">Crítica</option>
              </select>
            </FormField>
          </div>
          <FormField label="Descrição Detalhada" required>
            <textarea className="input-field" value={newDesc} onChange={e => setNewDesc(e.target.value)}
              style={{ resize: 'vertical', minHeight: 110, lineHeight: 1.6 }}
              placeholder="Descreva o problema em detalhe: quando começou, o que já tentou, impacto no trabalho..." />
          </FormField>
          <button onClick={handleCreate} disabled={isPending} className="btn-primary"
            style={{ justifyContent: 'center', fontSize: 13, padding: '12px', opacity: isPending ? 0.6 : 1 }}>
            {isPending ? 'A submeter...' : 'Submeter Ticket ↗'}
          </button>
        </div>
      </Modal>

      {/* Ticket detail modal */}
      <Modal open={!!selected} onClose={() => { setSelected(null); setReplyBody('') }}
        title={selected?.ref ?? ''} subtitle={selected?.title} maxWidth={600}>
        {selected && (
          <div>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <StatusBadge status={selected.status} />
              <PriorityBadge priority={selected.priority} />
              {selected.category && (
                <span style={{ fontSize: 10, background: 'rgba(176,190,197,0.07)', border: '1px solid rgba(176,190,197,0.15)', color: 'var(--slate)', padding: '2px 7px', borderRadius: 10 }}>{selected.category}</span>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
              {[
                ['Criado em', new Date(selected.createdAt).toLocaleDateString('pt-AO')],
                ['Atualizado', new Date(selected.updatedAt).toLocaleDateString('pt-AO')],
              ].map(([k, v]) => (
                <div key={k} style={{ padding: '0.75rem', background: 'rgba(13,31,58,0.5)', borderRadius: 8, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 10, color: 'var(--slate)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 2 }}>{k}</div>
                  <div style={{ fontSize: 12, color: 'var(--silver2)' }}>{v}</div>
                </div>
              ))}
            </div>

            {/* Reply */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
              <div style={{ fontSize: 12, color: 'var(--slate)', marginBottom: '0.5rem' }}>Adicionar resposta</div>
              <textarea className="input-field" value={replyBody} onChange={e => setReplyBody(e.target.value)}
                style={{ resize: 'vertical', minHeight: 80, lineHeight: 1.6, marginBottom: '0.75rem' }}
                placeholder="Escreva a sua mensagem..." />
              <button onClick={() => handleReply(selected.id)} disabled={isPending || !replyBody.trim()} className="btn-primary"
                style={{ fontSize: 12, opacity: (isPending || !replyBody.trim()) ? 0.5 : 1 }}>
                {isPending ? 'A enviar...' : 'Enviar Resposta'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {ToastComponent}
    </div>
  )
}
