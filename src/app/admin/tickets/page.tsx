'use client'
import { useEffect, useState, useTransition } from 'react'
import { updateTicketStatus } from '@/lib/actions/tickets'
import {
  PageHeader, SearchBar, StatusBadge, PriorityBadge, Modal, FormField, useToast, EmptyState,
} from '@/components/ui/shared'

interface Ticket {
  id: number
  ref: string
  title: string
  status: string
  priority: string
  category: string
  clientName: string | null
  clientEmail: string | null
  createdAt: string
  updatedAt: string
}

type TicketStatus = 'open' | 'in_progress' | 'waiting' | 'resolved' | 'closed'

const TABS: { key: string; label: string }[] = [
  { key: 'all',         label: 'Todos' },
  { key: 'open',        label: 'Abertos' },
  { key: 'in_progress', label: 'Em Progresso' },
  { key: 'waiting',     label: 'Aguardando' },
  { key: 'resolved',    label: 'Resolvidos' },
  { key: 'closed',      label: 'Fechados' },
]

const STATUS_OPTIONS: TicketStatus[] = ['open', 'in_progress', 'waiting', 'resolved', 'closed']
const STATUS_LABEL: Record<TicketStatus, string> = {
  open: 'Aberto', in_progress: 'Em Progresso', waiting: 'Aguardando', resolved: 'Resolvido', closed: 'Fechado',
}

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('all')
  const [search, setSearch] = useState('')
  const [detail, setDetail] = useState<Ticket | null>(null)
  const [newStatus, setNewStatus] = useState<TicketStatus>('open')
  const [isPending, startTransition] = useTransition()
  const { show, ToastComponent } = useToast()

  useEffect(() => {
    fetch('/api/admin/tickets')
      .then(r => r.json())
      .then(data => { setTickets(data.tickets ?? []); setCounts(data.counts ?? {}) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  function openDetail(t: Ticket) {
    setDetail(t)
    setNewStatus(t.status as TicketStatus)
  }

  function handleStatusUpdate() {
    if (!detail) return
    startTransition(async () => {
      const res = await updateTicketStatus(detail.id, newStatus)
      if (res.error) { show(res.error, 'error'); return }
      setTickets(prev => prev.map(t => t.id === detail.id ? { ...t, status: newStatus } : t))
      setDetail(prev => prev ? { ...prev, status: newStatus } : null)
      show('Estado actualizado.', 'success')
    })
  }

  const filtered = tickets.filter(t => {
    const q = search.toLowerCase()
    const matchTab = tab === 'all' || t.status === tab
    const matchSearch = !q || t.title.toLowerCase().includes(q) || t.ref.toLowerCase().includes(q) || (t.clientName ?? '').toLowerCase().includes(q)
    return matchTab && matchSearch
  })

  return (
    <div>
      <PageHeader
        supra="CRM Admin"
        title="Fila de Tickets"
        sub={`${tickets.length} tickets no total`}
      />

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {TABS.map(t => {
          const cnt = t.key === 'all' ? tickets.length : (counts[t.key] ?? 0)
          const active = tab === t.key
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                fontSize: 12, padding: '6px 14px', borderRadius: 20, cursor: 'pointer',
                border: `1px solid ${active ? 'rgba(0,230,118,0.4)' : 'var(--border)'}`,
                color: active ? 'var(--green)' : 'var(--slate)',
                background: active ? 'rgba(0,230,118,0.08)' : 'transparent',
                fontFamily: 'inherit',
              }}
            >
              {t.label} {cnt > 0 && <span style={{ opacity: 0.7 }}>({cnt})</span>}
            </button>
          )
        })}
      </div>

      {/* Search */}
      <div style={{ marginBottom: '1.25rem' }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Pesquisar por título, ref ou cliente..." />
      </div>

      {/* Table */}
      <div className="card-base" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Ref</th>
                <th>Título</th>
                <th>Cliente</th>
                <th>Estado</th>
                <th>Prioridade</th>
                <th>Categoria</th>
                <th>Criado</th>
                <th>Actualizado</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 9 }).map((__, j) => (
                      <td key={j} style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ height: 14, borderRadius: 6, background: 'rgba(255,255,255,0.06)', width: j === 0 ? '50%' : '65%' }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={9}><EmptyState ico="🎫" title="Nenhum ticket encontrado" sub="Ajuste os filtros" /></td></tr>
              ) : filtered.map(t => (
                <tr key={t.id} style={{ cursor: 'pointer' }} onClick={() => openDetail(t)}>
                  <td><span className="font-mono" style={{ fontSize: 11, color: 'var(--green2)' }}>{t.ref}</span></td>
                  <td style={{ maxWidth: 220 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--silver2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.title}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: 12 }}>{t.clientName ?? '—'}</div>
                    <div style={{ fontSize: 10, color: 'var(--slate)' }}>{t.clientEmail ?? ''}</div>
                  </td>
                  <td><StatusBadge status={t.status} /></td>
                  <td><PriorityBadge priority={t.priority as any} /></td>
                  <td><span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 10, background: 'rgba(176,190,197,0.07)', border: '1px solid rgba(176,190,197,0.15)', color: 'var(--slate)' }}>{t.category}</span></td>
                  <td style={{ fontSize: 11, color: 'var(--muted)' }}>{new Date(t.createdAt).toLocaleDateString('pt-AO')}</td>
                  <td style={{ fontSize: 11, color: 'var(--muted)' }}>{new Date(t.updatedAt).toLocaleDateString('pt-AO')}</td>
                  <td onClick={e => e.stopPropagation()}>
                    <button onClick={() => openDetail(t)} style={{ fontSize: 11, padding: '3px 9px', borderRadius: 6, background: 'rgba(0,230,118,0.07)', border: '1px solid rgba(0,230,118,0.18)', color: 'var(--green2)', cursor: 'pointer' }}>
                      Detalhes
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail modal */}
      <Modal open={!!detail} onClose={() => setDetail(null)} title={detail?.ref ?? ''} subtitle={detail?.title} maxWidth={580}>
        {detail && (
          <div>
            {/* Badges */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
              <StatusBadge status={detail.status} />
              <PriorityBadge priority={detail.priority as any} />
              <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 10, background: 'rgba(176,190,197,0.07)', border: '1px solid rgba(176,190,197,0.15)', color: 'var(--slate)' }}>{detail.category}</span>
            </div>

            {/* Info grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', marginBottom: '1.5rem' }}>
              {[
                ['Cliente', detail.clientName ?? '—'],
                ['Email', detail.clientEmail ?? '—'],
                ['Criado em', new Date(detail.createdAt).toLocaleString('pt-AO')],
                ['Actualizado', new Date(detail.updatedAt).toLocaleString('pt-AO')],
              ].map(([k, v]) => (
                <div key={k} style={{ padding: '0.65rem 0.85rem', background: 'rgba(13,31,58,0.5)', borderRadius: 8, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 10, color: 'var(--slate)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>{k}</div>
                  <div style={{ fontSize: 12, color: 'var(--silver2)' }}>{v}</div>
                </div>
              ))}
            </div>

            {/* Status update */}
            <FormField label="Alterar Estado">
              <select className="input-field" value={newStatus} onChange={e => setNewStatus(e.target.value as TicketStatus)}>
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
              </select>
            </FormField>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
              <button onClick={() => setDetail(null)} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid var(--border)', background: 'none', color: 'var(--slate)', cursor: 'pointer', fontSize: 13 }}>
                Fechar
              </button>
              <button onClick={handleStatusUpdate} disabled={isPending || newStatus === detail.status} className="btn-primary" style={{ fontSize: 13, padding: '8px 20px' }}>
                {isPending ? 'A guardar...' : 'Actualizar Estado'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {ToastComponent}
    </div>
  )
}
