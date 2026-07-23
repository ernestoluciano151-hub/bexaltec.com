'use client'
import { useState } from 'react'
import { mockTickets } from '@/lib/mock-data'
import type { TicketStatus, TicketPriority } from '@/lib/mock-data'

const statusBadge: Record<TicketStatus, string> = { open: 'badge-yellow', in_progress: 'badge-blue', resolved: 'badge-green', closed: 'badge-gray' }
const statusLabel: Record<TicketStatus, string> = { open: 'Aberto', in_progress: 'Em Progresso', resolved: 'Resolvido', closed: 'Fechado' }
const priorityBadge: Record<TicketPriority, string> = { low: 'badge-gray', medium: 'badge-blue', high: 'badge-yellow', critical: 'badge-red' }
const priorityLabel: Record<TicketPriority, string> = { low: 'Baixa', medium: 'Média', high: 'Alta', critical: 'Crítica' }

export default function AdminTicketsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | TicketStatus>('all')
  const [priorityFilter, setPriorityFilter] = useState<'all' | TicketPriority>('all')
  const [selected, setSelected] = useState<typeof mockTickets[0] | null>(null)

  const filtered = mockTickets.filter(t => {
    const matchSearch = t.subject.toLowerCase().includes(search.toLowerCase()) || t.company.toLowerCase().includes(search.toLowerCase()) || t.ref.includes(search)
    const matchStatus = statusFilter === 'all' || t.status === statusFilter
    const matchPriority = priorityFilter === 'all' || t.priority === priorityFilter
    return matchSearch && matchStatus && matchPriority
  })

  const counts = {
    open: mockTickets.filter(t => t.status === 'open').length,
    in_progress: mockTickets.filter(t => t.status === 'in_progress').length,
    resolved: mockTickets.filter(t => t.status === 'resolved').length,
    closed: mockTickets.filter(t => t.status === 'closed').length,
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: 11, color: 'var(--forest)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: '0.25rem' }}>CRM</div>
          <h1 className="font-rajdhani font-black" style={{ fontSize: 28, color: 'var(--text)', letterSpacing: 1 }}>Gestão de Tickets</h1>
          <p style={{ fontSize: 13, color: 'var(--slate)', marginTop: 4 }}>{mockTickets.length} tickets no total</p>
        </div>
      </div>

      {/* Status counters */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {(Object.entries(counts) as [TicketStatus, number][]).map(([status, count]) => (
          <button key={status} onClick={() => setStatusFilter(statusFilter === status ? 'all' : status)}
            className="card-base" style={{ padding: '1rem', textAlign: 'center', cursor: 'pointer', border: statusFilter === status ? '1px solid rgba(0,230,118,0.35)' : undefined, transition: 'all 0.2s' }}>
            <div className="font-rajdhani font-black" style={{ fontSize: 28, lineHeight: 1, color: status === 'open' ? '#FFC107' : status === 'in_progress' ? '#42A5F5' : status === 'resolved' ? '#00E676' : 'var(--slate)' }}>{count}</div>
            <div style={{ fontSize: 10, color: 'var(--slate)', marginTop: 4 }}>{statusLabel[status]}</div>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <input className="input-field" style={{ maxWidth: 280 }} value={search} onChange={e => setSearch(e.target.value)}
          placeholder="🔍  Pesquisar por assunto, empresa, ref..." />
        <select className="input-field" style={{ maxWidth: 140 }} value={priorityFilter} onChange={e => setPriorityFilter(e.target.value as 'all' | TicketPriority)}>
          <option value="all">Todas Prioridades</option>
          <option value="low">Baixa</option>
          <option value="medium">Média</option>
          <option value="high">Alta</option>
          <option value="critical">Crítica</option>
        </select>
      </div>

      {/* Tickets table */}
      <div className="card-base" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Referência</th>
                <th>Assunto</th>
                <th>Cliente</th>
                <th>Categoria</th>
                <th>Prioridade</th>
                <th>Estado</th>
                <th>Atribuído a</th>
                <th>Data</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(ticket => (
                <tr key={ticket.id} style={{ cursor: 'pointer' }} onClick={() => setSelected(ticket)}>
                  <td><span className="font-mono" style={{ fontSize: 11, color: 'var(--green2)' }}>{ticket.ref}</span></td>
                  <td style={{ maxWidth: 220 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--silver2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ticket.subject}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: 12 }}>{ticket.company}</div>
                    <div style={{ fontSize: 10, color: 'var(--slate)' }}>{ticket.clientName}</div>
                  </td>
                  <td><span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 10, background: 'rgba(176,190,197,0.07)', border: '1px solid rgba(176,190,197,0.15)', color: 'var(--slate)' }}>{ticket.category}</span></td>
                  <td><span className={`badge ${priorityBadge[ticket.priority]}`}>{priorityLabel[ticket.priority]}</span></td>
                  <td><span className={`badge ${statusBadge[ticket.status]}`}>{statusLabel[ticket.status]}</span></td>
                  <td style={{ fontSize: 11, color: 'var(--slate)' }}>{ticket.assignedTo || '—'}</td>
                  <td style={{ fontSize: 11, color: 'var(--muted)' }}>{new Date(ticket.createdAt).toLocaleDateString('pt-AO')}</td>
                  <td onClick={e => e.stopPropagation()}>
                    <button onClick={() => setSelected(ticket)}
                      style={{ fontSize: 11, padding: '3px 9px', borderRadius: 6, background: 'rgba(0,230,118,0.07)', border: '1px solid rgba(0,230,118,0.18)', color: 'var(--green2)', cursor: 'pointer' }}>
                      Detalhes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--slate)', fontSize: 13 }}>
              Nenhum ticket encontrado.
            </div>
          )}
        </div>
      </div>

      {/* Ticket detail */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(6,16,30,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
          onClick={() => setSelected(null)}>
          <div className="card-base" style={{ width: '100%', maxWidth: 580, padding: '2rem', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}
            onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelected(null)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--slate)', fontSize: 18, cursor: 'pointer' }}>✕</button>

            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                <span className="font-mono" style={{ fontSize: 10, color: 'var(--slate)' }}>{selected.ref}</span>
                <span className={`badge ${statusBadge[selected.status]}`}>{statusLabel[selected.status]}</span>
                <span className={`badge ${priorityBadge[selected.priority]}`}>{priorityLabel[selected.priority]}</span>
                <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 10, background: 'rgba(176,190,197,0.07)', border: '1px solid rgba(176,190,197,0.15)', color: 'var(--slate)' }}>{selected.category}</span>
              </div>
              <div className="font-rajdhani font-bold" style={{ fontSize: 20, color: 'var(--text)', marginBottom: '0.5rem' }}>{selected.subject}</div>
              <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.7 }}>{selected.description}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem', marginBottom: '1.5rem' }}>
              {[
                ['Cliente', selected.clientName],
                ['Empresa', selected.company],
                ['Criado em', new Date(selected.createdAt).toLocaleString('pt-AO')],
                ['Atualizado', new Date(selected.updatedAt).toLocaleString('pt-AO')],
                ['Atribuído a', selected.assignedTo || 'Sem atribuição'],
                ['Categoria', selected.category],
              ].map(([k, v]) => (
                <div key={k} style={{ padding: '0.7rem 0.85rem', background: 'rgba(13,31,58,0.5)', borderRadius: 8, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 10, color: 'var(--slate)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 2 }}>{k}</div>
                  <div style={{ fontSize: 12, color: 'var(--silver2)' }}>{v}</div>
                </div>
              ))}
            </div>

            {/* Update status */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: 11, color: 'var(--silver)', letterSpacing: '0.5px', display: 'block', marginBottom: '0.5rem' }}>ATUALIZAR ESTADO</label>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {(['open','in_progress','resolved','closed'] as TicketStatus[]).map(s => (
                  <button key={s}
                    style={{ fontSize: 11, padding: '5px 12px', borderRadius: 6, cursor: 'pointer', background: selected.status === s ? 'rgba(0,230,118,0.1)' : 'rgba(13,31,58,0.5)', border: `1px solid ${selected.status === s ? 'rgba(0,230,118,0.3)' : 'var(--border)'}`, color: selected.status === s ? 'var(--green)' : 'var(--slate)', fontFamily: 'inherit' }}>
                    {statusLabel[s]}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="btn-primary flex-1 justify-center text-xs py-2" style={{ fontSize: 12 }}>💬 Responder ao Cliente</button>
              <button className="btn-secondary text-xs py-2 px-3" style={{ fontSize: 12 }}>📋 Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
