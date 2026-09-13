'use client'
import { useEffect, useState } from 'react'
import { PageHeader, EmptyState, TableRowSkeleton, SearchBar } from '@/components/ui/shared'
import { updateQuoteStatus } from '@/lib/actions/quotes'
import { CONTACT, whatsappLink } from '@/lib/contact'

type QuoteStatus = 'new' | 'in_review' | 'sent' | 'accepted' | 'rejected' | 'expired'

interface Quote {
  id: number
  ref: string
  name: string
  email: string
  phone: string | null
  company: string | null
  province: string | null
  services: string | null
  budget: string | null
  deadline: string | null
  message: string | null
  status: QuoteStatus
  createdAt: string
}

const STATUS_LABEL: Record<QuoteStatus, string> = {
  new: 'Novo', in_review: 'Em análise', sent: 'Proposta enviada',
  accepted: 'Aceite', rejected: 'Recusado', expired: 'Expirado',
}

const STATUS_COLOR: Record<QuoteStatus, string> = {
  new: '#00E676', in_review: '#FFC107', sent: '#42A5F5',
  accepted: '#00C853', rejected: '#EF5350', expired: '#90A4AE',
}

const FILTERS: Array<{ key: 'all' | QuoteStatus; label: string }> = [
  { key: 'all', label: 'Todos' },
  { key: 'new', label: 'Novos' },
  { key: 'in_review', label: 'Em análise' },
  { key: 'sent', label: 'Enviados' },
  { key: 'accepted', label: 'Aceites' },
]

export default function AdminQuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [filter, setFilter] = useState<'all' | QuoteStatus>('all')
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/admin/quotes')
      .then(async r => {
        if (!r.ok) throw new Error(r.status === 401 ? 'Sessão expirada. Volte a entrar.' : 'Erro ao carregar os orçamentos.')
        return r.json()
      })
      .then(d => setQuotes(d.quotes ?? []))
      .catch(e => setLoadError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const changeStatus = async (id: number, status: QuoteStatus) => {
    setQuotes(qs => qs.map(q => (q.id === id ? { ...q, status } : q)))
    const { error } = await updateQuoteStatus(id, status)
    if (error) setLoadError(error)
  }

  const term = search.trim().toLowerCase()
  const visible = quotes.filter(q => {
    if (filter !== 'all' && q.status !== filter) return false
    if (!term) return true
    return [q.ref, q.name, q.email, q.company, q.services].some(v => v?.toLowerCase().includes(term))
  })

  const newCount = quotes.filter(q => q.status === 'new').length

  return (
    <div>
      <PageHeader
        supra="CRM Admin"
        title="Pedidos de Orçamento"
        sub={
          loading ? 'A carregar…'
          : `${quotes.length} pedido(s)${newCount ? ` · ${newCount} por responder` : ''}`
        }
      />

      {loadError && (
        <div role="alert" style={{
          padding: '0.85rem 1rem', borderRadius: 8, fontSize: 13, marginBottom: '1.5rem',
          background: 'rgba(239,83,80,0.08)', border: '1px solid rgba(239,83,80,0.25)', color: '#EF5350',
        }}>
          {loadError}
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem', alignItems: 'center' }}>
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            style={{
              fontSize: 12, padding: '6px 14px', borderRadius: 20, cursor: 'pointer', fontFamily: 'inherit',
              background: filter === f.key ? 'rgba(0,230,118,0.1)' : 'transparent',
              border: `1px solid ${filter === f.key ? 'rgba(0,230,118,0.35)' : 'var(--border)'}`,
              color: filter === f.key ? 'var(--green)' : 'var(--text2)',
            }}>
            {f.label}
          </button>
        ))}
        <div style={{ flex: 1, minWidth: 180 }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Pesquisar por referência, nome ou empresa…" />
        </div>
      </div>

      <div className="card-base" style={{ overflowX: 'auto' }}>
        {loading ? (
          <table className="data-table">
            <tbody>{Array.from({ length: 4 }).map((_, i) => <TableRowSkeleton key={i} cols={5} />)}</tbody>
          </table>
        ) : visible.length === 0 ? (
          <EmptyState
            ico="📋"
            title={quotes.length === 0 ? 'Ainda não há pedidos de orçamento' : 'Nenhum pedido corresponde ao filtro'}
            sub={quotes.length === 0
              ? 'Os pedidos submetidos em bexaltec.com/quote aparecem aqui automaticamente.'
              : undefined}
          />
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Referência</th><th>Cliente</th><th>Serviços</th><th>Data</th><th>Estado</th><th></th>
              </tr>
            </thead>
            <tbody>
              {visible.map(q => (
                <tr key={q.id}>
                  <td className="font-mono" style={{ color: 'var(--green)', whiteSpace: 'nowrap' }}>{q.ref}</td>
                  <td>
                    <div style={{ color: 'var(--silver2)', fontWeight: 600 }}>{q.name}</div>
                    <div style={{ fontSize: 11 }}>{q.company ?? q.email}</div>
                  </td>
                  <td style={{ maxWidth: 260 }}>{q.services ?? '—'}</td>
                  <td style={{ whiteSpace: 'nowrap' }}>{new Date(q.createdAt).toLocaleDateString('pt-AO')}</td>
                  <td>
                    <select
                      value={q.status}
                      onChange={e => changeStatus(q.id, e.target.value as QuoteStatus)}
                      style={{
                        fontSize: 11, padding: '3px 8px', borderRadius: 20, fontFamily: 'inherit', cursor: 'pointer',
                        background: `${STATUS_COLOR[q.status]}14`,
                        border: `1px solid ${STATUS_COLOR[q.status]}44`,
                        color: STATUS_COLOR[q.status], fontWeight: 700,
                      }}>
                      {(Object.keys(STATUS_LABEL) as QuoteStatus[]).map(s => (
                        <option key={s} value={s} style={{ background: 'var(--card)', color: 'var(--text)' }}>
                          {STATUS_LABEL[s]}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <button
                      onClick={() => setOpen(open === q.id ? null : q.id)}
                      style={{ fontSize: 11, padding: '4px 10px', borderRadius: 6, background: 'none', border: '1px solid var(--border)', color: 'var(--text2)', cursor: 'pointer', fontFamily: 'inherit' }}>
                      {open === q.id ? 'Fechar' : 'Detalhe'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {open !== null && (() => {
        const q = quotes.find(x => x.id === open)
        if (!q) return null
        return (
          <div className="card-base" style={{ padding: '1.5rem', marginTop: '1rem' }}>
            <div className="font-rajdhani font-bold" style={{ fontSize: 17, color: 'var(--text)', marginBottom: '1rem' }}>
              {q.ref} · {q.name}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
              {[
                ['Email', q.email], ['Telefone', q.phone], ['Empresa', q.company],
                ['Província', q.province], ['Dimensão', q.budget], ['Cargo', q.deadline],
              ].map(([label, value]) => (
                <div key={label as string}>
                  <div style={{ fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 3 }}>{label}</div>
                  <div style={{ fontSize: 13, color: 'var(--silver2)' }}>{value || '—'}</div>
                </div>
              ))}
            </div>
            {q.message && (
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--slate)', marginBottom: 4 }}>Descrição do projeto</div>
                <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{q.message}</p>
              </div>
            )}
            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
              <a href={`mailto:${q.email}?subject=${encodeURIComponent(`Bexaltec — Proposta ${q.ref}`)}`} className="btn-primary" style={{ fontSize: 12, padding: '8px 16px' }}>
                Responder por email
              </a>
              {q.phone && (
                <a
                  href={whatsappLink(`Olá ${q.name.split(' ')[0]}, é da Bexaltec sobre o seu pedido ${q.ref}.`)}
                  target="_blank" rel="noopener noreferrer"
                  className="btn-secondary" style={{ fontSize: 12, padding: '8px 16px' }}>
                  WhatsApp ({CONTACT.phoneDisplay})
                </a>
              )}
            </div>
          </div>
        )
      })()}
    </div>
  )
}
