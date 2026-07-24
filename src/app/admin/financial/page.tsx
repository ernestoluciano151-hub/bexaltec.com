'use client'
import { useEffect, useState, useTransition } from 'react'
import { updateInvoiceStatus, createInvoice } from '@/lib/actions/admin'
import {
  PageHeader, SearchBar, StatusBadge, StatCard, Modal, FormField, useToast, EmptyState, CardSkeleton,
} from '@/components/ui/shared'

interface Invoice {
  id: number
  ref: string
  status: string
  clientName: string | null
  companyName: string | null
  amount: string | number
  tax: string | number | null
  total: string | number
  issueDate: string | null
  dueDate: string | null
  paidAt: string | null
}

interface SummaryEntry { total: number | string; count: number }
interface Summary {
  paid?: SummaryEntry
  sent?: SummaryEntry
  overdue?: SummaryEntry
  draft?: SummaryEntry
  [key: string]: SummaryEntry | undefined
}

type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'

const TABS: { key: string; label: string }[] = [
  { key: 'all',       label: 'Todas' },
  { key: 'draft',     label: 'Rascunho' },
  { key: 'sent',      label: 'Enviadas' },
  { key: 'overdue',   label: 'Em Atraso' },
  { key: 'paid',      label: 'Pagas' },
  { key: 'cancelled', label: 'Canceladas' },
]

const emptyForm = { amount: '', tax: '', total: '', dueDate: '', notes: '' }

export default function FinancialAdminPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [summary, setSummary] = useState<Summary>({})
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('all')
  const [search, setSearch] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({ ...emptyForm })
  const [isPending, startTransition] = useTransition()
  const { show, ToastComponent } = useToast()

  useEffect(() => {
    fetch('/api/admin/invoices')
      .then(r => r.json())
      .then(data => { setInvoices(data.invoices ?? []); setSummary(data.summary ?? {}) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = invoices.filter(i => {
    const q = search.toLowerCase()
    const matchTab = tab === 'all' || i.status === tab
    const matchSearch = !q || i.ref.toLowerCase().includes(q) || (i.clientName ?? '').toLowerCase().includes(q) || (i.companyName ?? '').toLowerCase().includes(q)
    return matchTab && matchSearch
  })

  function handleMarkPaid(id: number, e: React.MouseEvent) {
    e.stopPropagation()
    startTransition(async () => {
      const res = await updateInvoiceStatus(id, 'paid')
      if (res.error) { show(res.error, 'error'); return }
      setInvoices(prev => prev.map(i => i.id === id ? { ...i, status: 'paid' } : i))
      show('Fatura marcada como paga.', 'success')
    })
  }

  function handleCreate() {
    startTransition(async () => {
      const res = await createInvoice({
        amount: Number(form.amount),
        tax: form.tax ? Number(form.tax) : undefined,
        total: Number(form.total),
        dueDate: new Date(form.dueDate),
        notes: form.notes || undefined,
      })
      if (res.error) { show(res.error, 'error'); return }
      fetch('/api/admin/invoices').then(r => r.json()).then(data => { setInvoices(data.invoices ?? []); setSummary(data.summary ?? {}) })
      setShowCreate(false)
      setForm({ ...emptyForm })
      show('Fatura criada.', 'success')
    })
  }

  const f = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }))

  const paid    = summary.paid    ?? { total: 0, count: 0 }
  const sent    = summary.sent    ?? { total: 0, count: 0 }
  const overdue = summary.overdue ?? { total: 0, count: 0 }
  const draft   = summary.draft   ?? { total: 0, count: 0 }

  return (
    <div>
      <PageHeader
        supra="CRM Admin"
        title="Financeiro"
        sub="Faturas e resumo financeiro"
        action={
          <button className="btn-primary" style={{ fontSize: 13 }} onClick={() => setShowCreate(true)}>
            + Nova Fatura
          </button>
        }
      />

      {/* Summary cards */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '2rem' }}>
          {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <StatCard ico="✅" label="Total Pago" value={`${Number(paid.total).toLocaleString('pt-AO')} Kz`} sub={`${paid.count} faturas`} color="var(--green)" />
          <StatCard ico="⏳" label="Pendente" value={`${Number(sent.total).toLocaleString('pt-AO')} Kz`} sub={`${sent.count} faturas`} color="#FFC107" />
          <StatCard ico="⚠️" label="Em Atraso" value={`${Number(overdue.total).toLocaleString('pt-AO')} Kz`} sub={`${overdue.count} faturas`} color="#ef4444" />
          <StatCard ico="📝" label="Rascunhos" value={`${Number(draft.total).toLocaleString('pt-AO')} Kz`} sub={`${draft.count} faturas`} color="var(--slate)" />
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {TABS.map(t => {
          const active = tab === t.key
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{ fontSize: 12, padding: '6px 14px', borderRadius: 20, cursor: 'pointer', border: `1px solid ${active ? 'rgba(0,230,118,0.4)' : 'var(--border)'}`, color: active ? 'var(--green)' : 'var(--slate)', background: active ? 'rgba(0,230,118,0.08)' : 'transparent', fontFamily: 'inherit' }}
            >
              {t.label}
            </button>
          )
        })}
      </div>

      {/* Search */}
      <div style={{ marginBottom: '1.25rem' }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Pesquisar por ref, cliente, empresa..." />
      </div>

      {/* Table */}
      <div className="card-base" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Ref</th>
                <th>Cliente</th>
                <th>Empresa</th>
                <th>Estado</th>
                <th>Valor</th>
                <th>Total</th>
                <th>Emissão</th>
                <th>Vencimento</th>
                <th>Pago Em</th>
                <th>Ação</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 10 }).map((__, j) => (
                      <td key={j} style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ height: 14, borderRadius: 6, background: 'rgba(255,255,255,0.06)', width: '60%' }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={10}><EmptyState ico="🧾" title="Nenhuma fatura encontrada" /></td></tr>
              ) : filtered.map(inv => (
                <tr key={inv.id}>
                  <td><span className="font-mono" style={{ fontSize: 11, color: 'var(--green2)' }}>{inv.ref}</span></td>
                  <td style={{ fontSize: 12 }}>{inv.clientName ?? '—'}</td>
                  <td style={{ fontSize: 12, color: 'var(--slate)' }}>{inv.companyName ?? '—'}</td>
                  <td><StatusBadge status={inv.status} /></td>
                  <td><span className="font-mono" style={{ fontSize: 12 }}>{Number(inv.amount).toLocaleString('pt-AO')} Kz</span></td>
                  <td><span className="font-mono" style={{ fontSize: 12, fontWeight: 600, color: 'var(--silver2)' }}>{Number(inv.total).toLocaleString('pt-AO')} Kz</span></td>
                  <td style={{ fontSize: 11, color: 'var(--muted)' }}>{inv.issueDate ? new Date(inv.issueDate).toLocaleDateString('pt-AO') : '—'}</td>
                  <td style={{ fontSize: 11, color: inv.status === 'overdue' ? '#ef4444' : 'var(--muted)' }}>{inv.dueDate ? new Date(inv.dueDate).toLocaleDateString('pt-AO') : '—'}</td>
                  <td style={{ fontSize: 11, color: 'var(--muted)' }}>{inv.paidAt ? new Date(inv.paidAt).toLocaleDateString('pt-AO') : '—'}</td>
                  <td>
                    {(inv.status === 'sent' || inv.status === 'overdue') && (
                      <button
                        onClick={e => handleMarkPaid(inv.id, e)}
                        disabled={isPending}
                        style={{ fontSize: 11, padding: '3px 9px', borderRadius: 6, background: 'rgba(0,230,118,0.07)', border: '1px solid rgba(0,230,118,0.18)', color: 'var(--green2)', cursor: 'pointer', whiteSpace: 'nowrap' }}
                      >
                        ✓ Marcar Pago
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create modal */}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Nova Fatura" maxWidth={480}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <FormField label="Valor Base (Kz)" required>
              <input className="input-field" type="number" value={form.amount} onChange={f('amount')} placeholder="0" />
            </FormField>
            <FormField label="IVA (Kz)">
              <input className="input-field" type="number" value={form.tax} onChange={f('tax')} placeholder="0" />
            </FormField>
            <FormField label="Total (Kz)" required>
              <input className="input-field" type="number" value={form.total} onChange={f('total')} placeholder="0" />
            </FormField>
            <FormField label="Data de Vencimento" required>
              <input className="input-field" type="date" value={form.dueDate} onChange={f('dueDate')} />
            </FormField>
          </div>
          <FormField label="Notas">
            <textarea className="input-field" value={form.notes} onChange={f('notes')} rows={2} style={{ resize: 'vertical' }} />
          </FormField>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button onClick={() => setShowCreate(false)} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid var(--border)', background: 'none', color: 'var(--slate)', cursor: 'pointer', fontSize: 13 }}>
              Cancelar
            </button>
            <button onClick={handleCreate} disabled={isPending || !form.amount || !form.total || !form.dueDate} className="btn-primary" style={{ fontSize: 13, padding: '8px 20px' }}>
              {isPending ? 'A criar...' : 'Criar Fatura'}
            </button>
          </div>
        </div>
      </Modal>

      {ToastComponent}
    </div>
  )
}
