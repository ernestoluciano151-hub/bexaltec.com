'use client'
import { useEffect, useState, useTransition } from 'react'
import { createWorkOrder, updateWorkOrderStatus } from '@/lib/actions/admin'
import {
  PageHeader, SearchBar, StatusBadge, PriorityBadge, Modal, FormField, useToast, EmptyState,
} from '@/components/ui/shared'

interface WorkOrder {
  id: number
  ref: string
  title: string
  description: string | null
  status: string
  priority: string
  clientName: string | null
  companyName: string | null
  scheduledAt: string | null
  completedAt: string | null
  createdAt: string
  value: string | number | null
}

type WoStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled'

const WO_STATUSES: { value: WoStatus; label: string }[] = [
  { value: 'pending',     label: 'Pendente' },
  { value: 'in_progress', label: 'Em Progresso' },
  { value: 'completed',   label: 'Concluída' },
  { value: 'cancelled',   label: 'Cancelada' },
]

const emptyForm = { title: '', description: '', priority: 'medium' as const, scheduledAt: '', value: '' }

export default function WorkOrdersAdminPage() {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [detail, setDetail] = useState<WorkOrder | null>(null)
  const [newStatus, setNewStatus] = useState<WoStatus>('pending')
  const [form, setForm] = useState({ ...emptyForm })
  const [isPending, startTransition] = useTransition()
  const { show, ToastComponent } = useToast()

  useEffect(() => {
    fetch('/api/admin/work-orders')
      .then(r => r.json())
      .then(data => { setWorkOrders(data.workOrders ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = workOrders.filter(w => {
    const q = search.toLowerCase()
    const matchSearch = !q || w.title.toLowerCase().includes(q) || w.ref.toLowerCase().includes(q) || (w.clientName ?? '').toLowerCase().includes(q) || (w.companyName ?? '').toLowerCase().includes(q)
    const matchStatus = !statusFilter || w.status === statusFilter
    return matchSearch && matchStatus
  })

  function openDetail(w: WorkOrder) {
    setDetail(w)
    setNewStatus(w.status as WoStatus)
  }

  function handleCreate() {
    startTransition(async () => {
      const res = await createWorkOrder({
        title: form.title,
        description: form.description || undefined,
        priority: form.priority,
        value: form.value ? Number(form.value) : undefined,
        scheduledAt: form.scheduledAt ? new Date(form.scheduledAt) : undefined,
      })
      if (res.error) { show(res.error, 'error'); return }
      fetch('/api/admin/work-orders').then(r => r.json()).then(data => setWorkOrders(data.workOrders ?? []))
      setShowCreate(false)
      setForm({ ...emptyForm })
      show('Ordem de Trabalho criada.', 'success')
    })
  }

  function handleStatusUpdate() {
    if (!detail) return
    startTransition(async () => {
      const res = await updateWorkOrderStatus(detail.id, newStatus)
      if (res.error) { show(res.error, 'error'); return }
      setWorkOrders(prev => prev.map(w => w.id === detail.id ? { ...w, status: newStatus } : w))
      setDetail(prev => prev ? { ...prev, status: newStatus } : null)
      show('Estado actualizado.', 'success')
    })
  }

  const f = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }))

  return (
    <div>
      <PageHeader
        supra="CRM Admin"
        title="Ordens de Trabalho"
        sub={`${workOrders.length} ordens registadas`}
        action={
          <button className="btn-primary" style={{ fontSize: 13 }} onClick={() => setShowCreate(true)}>
            + Nova OT
          </button>
        }
      />

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Pesquisar por título, ref, cliente..." />
        <select className="input-field" style={{ maxWidth: 180 }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">Todos os estados</option>
          {WO_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="card-base" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Ref</th>
                <th>Título</th>
                <th>Cliente / Empresa</th>
                <th>Estado</th>
                <th>Prioridade</th>
                <th>Agendado</th>
                <th>Valor</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 8 }).map((__, j) => (
                      <td key={j} style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ height: 14, borderRadius: 6, background: 'rgba(255,255,255,0.06)', width: '60%' }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8}><EmptyState ico="📋" title="Nenhuma ordem de trabalho encontrada" /></td></tr>
              ) : filtered.map(w => (
                <tr key={w.id} style={{ cursor: 'pointer' }} onClick={() => openDetail(w)}>
                  <td><span className="font-mono" style={{ fontSize: 11, color: 'var(--green2)' }}>{w.ref}</span></td>
                  <td style={{ maxWidth: 200 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--silver2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{w.title}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: 12 }}>{w.clientName ?? '—'}</div>
                    <div style={{ fontSize: 10, color: 'var(--slate)' }}>{w.companyName ?? ''}</div>
                  </td>
                  <td><StatusBadge status={w.status} /></td>
                  <td><PriorityBadge priority={w.priority as any} /></td>
                  <td style={{ fontSize: 11, color: 'var(--muted)' }}>{w.scheduledAt ? new Date(w.scheduledAt).toLocaleDateString('pt-AO') : '—'}</td>
                  <td><span className="font-mono" style={{ fontSize: 12, color: 'var(--silver2)' }}>{w.value ? `${Number(w.value).toLocaleString('pt-AO')} Kz` : '—'}</span></td>
                  <td onClick={e => e.stopPropagation()}>
                    <button onClick={() => openDetail(w)} style={{ fontSize: 11, padding: '3px 9px', borderRadius: 6, background: 'rgba(0,230,118,0.07)', border: '1px solid rgba(0,230,118,0.18)', color: 'var(--green2)', cursor: 'pointer' }}>
                      Gerir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create modal */}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Nova Ordem de Trabalho" maxWidth={520}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <FormField label="Título" required>
            <input className="input-field" value={form.title} onChange={f('title')} />
          </FormField>
          <FormField label="Descrição">
            <textarea className="input-field" value={form.description} onChange={f('description')} rows={3} style={{ resize: 'vertical' }} />
          </FormField>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <FormField label="Prioridade">
              <select className="input-field" value={form.priority} onChange={f('priority')}>
                <option value="low">Baixa</option>
                <option value="medium">Média</option>
                <option value="high">Alta</option>
                <option value="critical">Crítica</option>
              </select>
            </FormField>
            <FormField label="Valor (Kz)">
              <input className="input-field" type="number" value={form.value} onChange={f('value')} placeholder="0" />
            </FormField>
            <div style={{ gridColumn: '1/-1' }}>
              <FormField label="Data Agendada">
                <input className="input-field" type="date" value={form.scheduledAt} onChange={f('scheduledAt')} />
              </FormField>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button onClick={() => setShowCreate(false)} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid var(--border)', background: 'none', color: 'var(--slate)', cursor: 'pointer', fontSize: 13 }}>
              Cancelar
            </button>
            <button onClick={handleCreate} disabled={isPending || !form.title} className="btn-primary" style={{ fontSize: 13, padding: '8px 20px' }}>
              {isPending ? 'A criar...' : 'Criar OT'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Detail modal */}
      <Modal open={!!detail} onClose={() => setDetail(null)} title={detail?.ref ?? ''} subtitle={detail?.title} maxWidth={520}>
        {detail && (
          <div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
              <StatusBadge status={detail.status} />
              <PriorityBadge priority={detail.priority as any} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', marginBottom: '1.25rem' }}>
              {[
                ['Cliente', detail.clientName ?? '—'],
                ['Empresa', detail.companyName ?? '—'],
                ['Valor', detail.value ? `${Number(detail.value).toLocaleString('pt-AO')} Kz` : '—'],
                ['Agendado', detail.scheduledAt ? new Date(detail.scheduledAt).toLocaleDateString('pt-AO') : '—'],
                ['Criado', new Date(detail.createdAt).toLocaleDateString('pt-AO')],
                ['Concluído', detail.completedAt ? new Date(detail.completedAt).toLocaleDateString('pt-AO') : '—'],
              ].map(([k, v]) => (
                <div key={k} style={{ padding: '0.65rem 0.85rem', background: 'rgba(13,31,58,0.5)', borderRadius: 8, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 10, color: 'var(--slate)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>{k}</div>
                  <div style={{ fontSize: 12, color: 'var(--silver2)' }}>{v}</div>
                </div>
              ))}
            </div>
            {detail.description && (
              <div style={{ marginBottom: '1.25rem', padding: '0.75rem', background: 'rgba(13,31,58,0.5)', borderRadius: 8, border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 10, color: 'var(--slate)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Descrição</div>
                <p style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.6 }}>{detail.description}</p>
              </div>
            )}
            <FormField label="Actualizar Estado">
              <select className="input-field" value={newStatus} onChange={e => setNewStatus(e.target.value as WoStatus)}>
                {WO_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
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
