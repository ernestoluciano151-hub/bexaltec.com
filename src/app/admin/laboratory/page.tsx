'use client'
import { useEffect, useState, useTransition } from 'react'
import { updateRepairStatus } from '@/lib/actions/repairs'
import {
  PageHeader, SearchBar, StatusBadge, PriorityBadge, Modal, FormField, useToast, EmptyState,
} from '@/components/ui/shared'

interface Repair {
  id: number
  ref: string
  deviceName: string
  brand: string | null
  model: string | null
  issue: string
  status: string
  priority: string
  entryDate: string | null
  eta: string | null
  totalCost: string | null
  clientName: string | null
  clientEmail: string | null
}

type RepairStatus = 'intake' | 'diagnosis' | 'waiting_parts' | 'in_repair' | 'testing' | 'ready' | 'delivered' | 'cancelled'

const REPAIR_STATUSES: { value: RepairStatus; label: string }[] = [
  { value: 'intake',        label: 'Entrada' },
  { value: 'diagnosis',     label: 'Diagnóstico' },
  { value: 'waiting_parts', label: 'Aguarda Peças' },
  { value: 'in_repair',     label: 'Em Reparação' },
  { value: 'testing',       label: 'A Testar' },
  { value: 'ready',         label: 'Pronto' },
  { value: 'delivered',     label: 'Entregue' },
  { value: 'cancelled',     label: 'Cancelado' },
]

export default function LaboratoryPage() {
  const [repairs, setRepairs] = useState<Repair[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [detail, setDetail] = useState<Repair | null>(null)
  const [newStatus, setNewStatus] = useState<RepairStatus>('intake')
  const [laborCost, setLaborCost] = useState('')
  const [partsCost, setPartsCost] = useState('')
  const [isPending, startTransition] = useTransition()
  const { show, ToastComponent } = useToast()

  useEffect(() => {
    fetch('/api/admin/repairs')
      .then(r => r.json())
      .then(data => { setRepairs(data.repairs ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  function openDetail(r: Repair) {
    setDetail(r)
    setNewStatus(r.status as RepairStatus)
    setLaborCost('')
    setPartsCost('')
  }

  function handleUpdate() {
    if (!detail) return
    startTransition(async () => {
      const extra: Record<string, number | undefined> = {}
      if (laborCost) extra.laborCost = Number(laborCost)
      if (partsCost) extra.partsCost = Number(partsCost)
      if (laborCost || partsCost) {
        extra.totalCost = (Number(laborCost) || 0) + (Number(partsCost) || 0)
      }
      const res = await updateRepairStatus(detail.id, newStatus, Object.keys(extra).length ? extra : undefined)
      if (res.error) { show(res.error, 'error'); return }
      setRepairs(prev => prev.map(r => r.id === detail.id ? { ...r, status: newStatus, ...extra } : r))
      setDetail(prev => prev ? { ...prev, status: newStatus } : null)
      show('Reparação actualizada.', 'success')
    })
  }

  const filtered = repairs.filter(r => {
    const q = search.toLowerCase()
    const matchSearch = !q || r.deviceName.toLowerCase().includes(q) || r.ref.toLowerCase().includes(q) || (r.clientName ?? '').toLowerCase().includes(q) || (r.brand ?? '').toLowerCase().includes(q)
    const matchStatus = !statusFilter || r.status === statusFilter
    return matchSearch && matchStatus
  })

  // Count by status
  const statusCounts = REPAIR_STATUSES.reduce((acc, s) => {
    acc[s.value] = repairs.filter(r => r.status === s.value).length
    return acc
  }, {} as Record<string, number>)

  return (
    <div>
      <PageHeader
        supra="CRM Admin"
        title="Laboratório"
        sub={`${repairs.length} reparações registadas`}
      />

      {/* Status pills */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setStatusFilter('')}
          style={{ fontSize: 11, padding: '5px 12px', borderRadius: 20, cursor: 'pointer', border: `1px solid ${!statusFilter ? 'rgba(0,230,118,0.4)' : 'var(--border)'}`, color: !statusFilter ? 'var(--green)' : 'var(--slate)', background: !statusFilter ? 'rgba(0,230,118,0.08)' : 'transparent', fontFamily: 'inherit' }}
        >
          Todos ({repairs.length})
        </button>
        {REPAIR_STATUSES.map(s => statusCounts[s.value] > 0 && (
          <button
            key={s.value}
            onClick={() => setStatusFilter(s.value)}
            style={{ fontSize: 11, padding: '5px 12px', borderRadius: 20, cursor: 'pointer', border: `1px solid ${statusFilter === s.value ? 'rgba(0,230,118,0.4)' : 'var(--border)'}`, color: statusFilter === s.value ? 'var(--green)' : 'var(--slate)', background: statusFilter === s.value ? 'rgba(0,230,118,0.08)' : 'transparent', fontFamily: 'inherit' }}
          >
            {s.label} ({statusCounts[s.value]})
          </button>
        ))}
      </div>

      {/* Search */}
      <div style={{ marginBottom: '1.25rem' }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Pesquisar por dispositivo, ref, cliente, marca..." />
      </div>

      {/* Table */}
      <div className="card-base" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Ref</th>
                <th>Dispositivo</th>
                <th>Marca / Modelo</th>
                <th>Cliente</th>
                <th>Estado</th>
                <th>Prioridade</th>
                <th>Entrada</th>
                <th>ETA</th>
                <th>Custo Total</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 10 }).map((__, j) => (
                      <td key={j} style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ height: 14, borderRadius: 6, background: 'rgba(255,255,255,0.06)', width: '60%' }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={10}><EmptyState ico="🔬" title="Nenhuma reparação encontrada" /></td></tr>
              ) : filtered.map(r => (
                <tr key={r.id} style={{ cursor: 'pointer' }} onClick={() => openDetail(r)}>
                  <td><span className="font-mono" style={{ fontSize: 11, color: 'var(--green2)' }}>{r.ref}</span></td>
                  <td style={{ fontSize: 12, fontWeight: 600, color: 'var(--silver2)' }}>{r.deviceName}</td>
                  <td style={{ fontSize: 11, color: 'var(--slate)' }}>{[r.brand, r.model].filter(Boolean).join(' / ') || '—'}</td>
                  <td style={{ fontSize: 12 }}>{r.clientName ?? '—'}</td>
                  <td><StatusBadge status={r.status} /></td>
                  <td><PriorityBadge priority={r.priority as any} /></td>
                  <td style={{ fontSize: 11, color: 'var(--muted)' }}>{r.entryDate ? new Date(r.entryDate).toLocaleDateString('pt-AO') : '—'}</td>
                  <td style={{ fontSize: 11, color: 'var(--slate)' }}>{r.eta ? new Date(r.eta).toLocaleDateString('pt-AO') : '—'}</td>
                  <td><span className="font-mono" style={{ fontSize: 12, color: 'var(--silver2)' }}>{r.totalCost ? `${Number(r.totalCost).toLocaleString('pt-AO')} Kz` : '—'}</span></td>
                  <td onClick={e => e.stopPropagation()}>
                    <button onClick={() => openDetail(r)} style={{ fontSize: 11, padding: '3px 9px', borderRadius: 6, background: 'rgba(0,230,118,0.07)', border: '1px solid rgba(0,230,118,0.18)', color: 'var(--green2)', cursor: 'pointer' }}>
                      Gerir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail modal */}
      <Modal open={!!detail} onClose={() => setDetail(null)} title={detail?.ref ?? ''} subtitle={`${detail?.deviceName} — ${detail?.clientName ?? 'Cliente'}`} maxWidth={560}>
        {detail && (
          <div>
            {/* Badges */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
              <StatusBadge status={detail.status} />
              <PriorityBadge priority={detail.priority as any} />
            </div>

            {/* Info grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', marginBottom: '1.25rem' }}>
              {[
                ['Dispositivo', detail.deviceName],
                ['Marca / Modelo', [detail.brand, detail.model].filter(Boolean).join(' / ') || '—'],
                ['Problema', detail.issue],
                ['Cliente', detail.clientName ?? '—'],
                ['Entrada', detail.entryDate ? new Date(detail.entryDate).toLocaleDateString('pt-AO') : '—'],
                ['ETA', detail.eta ? new Date(detail.eta).toLocaleDateString('pt-AO') : '—'],
              ].map(([k, v]) => (
                <div key={k} style={{ padding: '0.65rem 0.85rem', background: 'rgba(13,31,58,0.5)', borderRadius: 8, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 10, color: 'var(--slate)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>{k}</div>
                  <div style={{ fontSize: 12, color: 'var(--silver2)' }}>{v}</div>
                </div>
              ))}
            </div>

            {/* Costs section */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', marginBottom: '1rem' }}>
              <div className="font-rajdhani font-semibold" style={{ fontSize: 14, color: 'var(--text)', marginBottom: '0.75rem' }}>Custos</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <FormField label="Mão de Obra (Kz)">
                  <input className="input-field" type="number" value={laborCost} onChange={e => setLaborCost(e.target.value)} placeholder="0" />
                </FormField>
                <FormField label="Peças (Kz)">
                  <input className="input-field" type="number" value={partsCost} onChange={e => setPartsCost(e.target.value)} placeholder="0" />
                </FormField>
              </div>
              {(laborCost || partsCost) && (
                <div style={{ marginTop: '0.5rem', fontSize: 13, color: 'var(--green)', fontWeight: 600 }}>
                  Total estimado: {((Number(laborCost) || 0) + (Number(partsCost) || 0)).toLocaleString('pt-AO')} Kz
                </div>
              )}
              {!laborCost && !partsCost && detail.totalCost && (
                <div style={{ marginTop: '0.5rem', fontSize: 13, color: 'var(--silver2)' }}>
                  Custo actual: {Number(detail.totalCost).toLocaleString('pt-AO')} Kz
                </div>
              )}
            </div>

            {/* Status update */}
            <FormField label="Actualizar Estado">
              <select className="input-field" value={newStatus} onChange={e => setNewStatus(e.target.value as RepairStatus)}>
                {REPAIR_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </FormField>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
              <button onClick={() => setDetail(null)} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid var(--border)', background: 'none', color: 'var(--slate)', cursor: 'pointer', fontSize: 13 }}>
                Fechar
              </button>
              <button onClick={handleUpdate} disabled={isPending} className="btn-primary" style={{ fontSize: 13, padding: '8px 20px' }}>
                {isPending ? 'A guardar...' : 'Guardar Alterações'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {ToastComponent}
    </div>
  )
}
