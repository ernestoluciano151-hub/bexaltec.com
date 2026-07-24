'use client'
// ─── Invoices Client Component ─────────────────────────────────────────────
import { useState } from 'react'
import { PageHeader, SearchBar, StatusBadge, EmptyState, Modal } from '@/components/ui/shared'

type Invoice = {
  id: number
  ref: string
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  amount: string
  tax: string | null
  total: string
  currency: string
  issueDate: Date
  dueDate: Date
  paidAt: Date | null
  notes: string | null
}

const TABS = ['all', 'sent', 'paid', 'overdue'] as const
const TAB_LABELS: Record<string, string> = { all: 'Todas', sent: 'Pendentes', paid: 'Pagas', overdue: 'Em Atraso' }

export function InvoicesClient({ invoices }: { invoices: Invoice[] }) {
  const [tab, setTab] = useState<string>('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Invoice | null>(null)

  const totalPaid = invoices.filter(i => i.status === 'paid').reduce((a, i) => a + Number(i.total), 0)
  const totalPending = invoices.filter(i => i.status === 'sent').reduce((a, i) => a + Number(i.total), 0)
  const totalOverdue = invoices.filter(i => i.status === 'overdue').reduce((a, i) => a + Number(i.total), 0)

  const filtered = invoices.filter(inv => {
    const matchTab = tab === 'all' || inv.status === tab
    const matchSearch = !search || inv.ref.toLowerCase().includes(search.toLowerCase())
    return matchTab && matchSearch
  })

  function fmt(val: string | number) {
    return Number(val).toLocaleString('pt-AO') + ' Kz'
  }

  return (
    <div>
      <PageHeader
        title="Faturação"
        sub={`${invoices.length} faturas · Histórico completo`}
      />

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Total Pago', value: totalPaid, color: '#00E676', ico: '✅' },
          { label: 'Pendente', value: totalPending, color: '#FFC107', ico: '⏳' },
          { label: 'Em Atraso', value: totalOverdue, color: '#EF5350', ico: '⚠️' },
        ].map((c, i) => (
          <div key={i} className="card-base" style={{ padding: '1.25rem', textAlign: 'center' }}>
            <div style={{ fontSize: 24, marginBottom: '0.5rem' }}>{c.ico}</div>
            <div style={{ fontSize: 10, color: 'var(--slate)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: '0.35rem' }}>{c.label}</div>
            <div className="font-rajdhani font-black" style={{ fontSize: 22, color: c.color, lineHeight: 1 }}>
              {c.value.toLocaleString('pt-AO')}
            </div>
            <div style={{ fontSize: 10, color: 'var(--slate)', marginTop: 2 }}>Kwanzas (AOA)</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Pesquisar por referência..." />
        </div>
        <div style={{ display: 'flex', gap: '0.35rem' }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid', fontSize: 12, cursor: 'pointer', transition: 'all 0.2s',
                borderColor: tab === t ? 'var(--green)' : 'var(--border)',
                background: tab === t ? 'rgba(0,230,118,0.1)' : 'transparent',
                color: tab === t ? 'var(--green)' : 'var(--slate)' }}>
              {TAB_LABELS[t]}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices list */}
      {filtered.length === 0 ? (
        <EmptyState ico="🧾" title="Sem faturas" sub={invoices.length === 0 ? 'Não tem faturas registadas.' : 'Nenhuma fatura corresponde aos filtros.'} />
      ) : (
        <div className="card-base" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Referência', 'Estado', 'Valor', 'Total', 'Emissão', 'Vencimento', 'Pago em'].map(h => (
                    <th key={h} style={{ padding: '0.85rem 1rem', textAlign: 'left', fontSize: 10, color: 'var(--slate)', letterSpacing: 1, textTransform: 'uppercase', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(inv => (
                  <tr key={inv.id}
                    onClick={() => setSelected(inv)}
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer', transition: 'background 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span className="font-mono" style={{ fontSize: 12, color: 'var(--green)' }}>{inv.ref}</span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}><StatusBadge status={inv.status} /></td>
                    <td style={{ padding: '0.85rem 1rem', fontSize: 13, color: 'var(--text)' }}>{Number(inv.amount).toLocaleString('pt-AO')} <span style={{ fontSize: 10, color: 'var(--slate)' }}>{inv.currency}</span></td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span className="font-rajdhani font-semibold" style={{ fontSize: 14, color: 'var(--green)' }}>{Number(inv.total).toLocaleString('pt-AO')}</span>
                      <span style={{ fontSize: 10, color: 'var(--slate)', marginLeft: 4 }}>{inv.currency}</span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontSize: 12, color: 'var(--text2)' }}>{new Date(inv.issueDate).toLocaleDateString('pt-AO')}</td>
                    <td style={{ padding: '0.85rem 1rem', fontSize: 12, color: inv.status === 'overdue' ? '#EF5350' : 'var(--text2)' }}>{new Date(inv.dueDate).toLocaleDateString('pt-AO')}</td>
                    <td style={{ padding: '0.85rem 1rem', fontSize: 12, color: 'var(--slate)' }}>{inv.paidAt ? new Date(inv.paidAt).toLocaleDateString('pt-AO') : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail modal */}
      <Modal open={!!selected} onClose={() => setSelected(null)} title={selected?.ref ?? ''} subtitle="Detalhes da Fatura" maxWidth={500}>
        {selected && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <StatusBadge status={selected.status} />
              <span className="badge badge-gray">{selected.currency}</span>
            </div>
            {[
              ['Valor', `${Number(selected.amount).toLocaleString('pt-AO')} ${selected.currency}`],
              ['IVA', selected.tax ? `${Number(selected.tax).toLocaleString('pt-AO')} ${selected.currency}` : '—'],
              ['Total', `${Number(selected.total).toLocaleString('pt-AO')} ${selected.currency}`],
              ['Data de Emissão', new Date(selected.issueDate).toLocaleDateString('pt-AO')],
              ['Data de Vencimento', new Date(selected.dueDate).toLocaleDateString('pt-AO')],
              ['Pago em', selected.paidAt ? new Date(selected.paidAt).toLocaleDateString('pt-AO') : '—'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.65rem 0.85rem', background: 'rgba(13,31,58,0.5)', borderRadius: 8, border: '1px solid var(--border)' }}>
                <span style={{ fontSize: 12, color: 'var(--slate)' }}>{k}</span>
                <span style={{ fontSize: 12, color: 'var(--silver2)', fontWeight: 600 }}>{v}</span>
              </div>
            ))}
            {selected.notes && (
              <div style={{ padding: '0.75rem', background: 'rgba(13,31,58,0.5)', borderRadius: 8, border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 10, color: 'var(--slate)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 }}>Notas</div>
                <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.6 }}>{selected.notes}</div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Payment info */}
      <div style={{ marginTop: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="card-base" style={{ padding: '1.25rem' }}>
          <div className="font-rajdhani font-semibold" style={{ fontSize: 15, color: 'var(--text)', marginBottom: '0.75rem' }}>Formas de Pagamento</div>
          <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 2 }}>
            • Transferência Bancária (BAI, BFA, BPC)<br/>
            • Multicaixa Express<br/>
            • PayByLink (cartão Visa/Mastercard)<br/>
            • Dinheiro (escritório)
          </div>
        </div>
        <div className="card-base" style={{ padding: '1.25rem' }}>
          <div className="font-rajdhani font-semibold" style={{ fontSize: 15, color: 'var(--text)', marginBottom: '0.75rem' }}>Suporte de Faturação</div>
          <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 2 }}>
            faturacao@bexaltec.ao<br/>
            +244 9XX XXX XXX<br/>
            WhatsApp Business<br/>
            Seg–Sex 08h–17h
          </div>
        </div>
      </div>
    </div>
  )
}
