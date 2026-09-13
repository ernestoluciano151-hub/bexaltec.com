'use client'
import { useEffect, useState } from 'react'
import { PageHeader, EmptyState, TableRowSkeleton, SearchBar } from '@/components/ui/shared'

interface Part {
  id: number
  ref: string
  name: string
  category: string | null
  brand: string | null
  stockQty: number
  minQty: number
  unitPrice: string | null
  supplier: string | null
  location: string | null
}

function stockState(p: Part) {
  if (p.stockQty <= 0) return { label: 'Sem Stock', color: '#EF5350' }
  if (p.stockQty <= p.minQty) return { label: 'Baixo', color: '#FFB74D' }
  return { label: 'OK', color: '#00E676' }
}

const kwanza = (v: string | null) =>
  v == null ? '—' : `${Number(v).toLocaleString('pt-AO', { maximumFractionDigits: 0 })} AOA`

export default function PartsPage() {
  const [parts, setParts] = useState<Part[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/admin/parts')
      .then(async r => {
        if (!r.ok) throw new Error(r.status === 401 ? 'Sessão expirada. Volte a entrar.' : 'Erro ao carregar o stock.')
        return r.json()
      })
      .then(d => setParts(d.parts ?? []))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const term = search.trim().toLowerCase()
  const visible = parts.filter(p =>
    !term || [p.ref, p.name, p.category, p.brand, p.supplier].some(v => v?.toLowerCase().includes(term)))

  const outOfStock = parts.filter(p => p.stockQty <= 0).length
  const lowStock = parts.filter(p => p.stockQty > 0 && p.stockQty <= p.minQty).length

  return (
    <div>
      <PageHeader
        supra="CRM Admin"
        title="Peças & Stock"
        sub="Gestão de componentes e peças do laboratório."
        action={
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {!loading && outOfStock > 0 && (
              <div style={{ padding: '0.65rem 1rem', background: '#EF535010', border: '1px solid #EF535025', borderRadius: 8, fontSize: 11, color: '#EF5350', fontWeight: 700 }}>
                ⚠️ {outOfStock} Sem Stock
              </div>
            )}
            {!loading && lowStock > 0 && (
              <div style={{ padding: '0.65rem 1rem', background: '#FFB74D10', border: '1px solid #FFB74D25', borderRadius: 8, fontSize: 11, color: '#FFB74D', fontWeight: 700 }}>
                ⚠️ {lowStock} Stock Baixo
              </div>
            )}
          </div>
        }
      />

      {error && (
        <div role="alert" style={{
          padding: '0.85rem 1rem', borderRadius: 8, fontSize: 13, marginBottom: '1.5rem',
          background: 'rgba(239,83,80,0.08)', border: '1px solid rgba(239,83,80,0.25)', color: '#EF5350',
        }}>
          {error}
        </div>
      )}

      {!loading && parts.length > 0 && (
        <div style={{ marginBottom: '1rem', maxWidth: 360 }}>
          <SearchBar value={search} onChange={setSearch} placeholder="Pesquisar peça, referência ou fornecedor…" />
        </div>
      )}

      <div className="card-base" style={{ overflowX: 'auto' }}>
        {loading ? (
          <table className="data-table">
            <tbody>{Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} cols={6} />)}</tbody>
          </table>
        ) : visible.length === 0 ? (
          <EmptyState
            ico="🗜️"
            title={parts.length === 0 ? 'Ainda não há peças registadas' : 'Nenhuma peça corresponde à pesquisa'}
            sub={parts.length === 0 ? 'As peças registadas na base de dados aparecem aqui.' : undefined}
          />
        ) : (
          <table className="data-table">
            <thead>
              <tr><th>Referência</th><th>Peça</th><th>Categoria</th><th>Stock</th><th>Preço</th><th>Estado</th></tr>
            </thead>
            <tbody>
              {visible.map(p => {
                const st = stockState(p)
                return (
                  <tr key={p.id}>
                    <td className="font-mono" style={{ color: 'var(--green)', whiteSpace: 'nowrap' }}>{p.ref}</td>
                    <td style={{ color: 'var(--silver2)' }}>
                      {p.name}
                      {p.location && <div style={{ fontSize: 11 }}>📍 {p.location}</div>}
                    </td>
                    <td>{p.category ?? '—'}</td>
                    <td style={{ whiteSpace: 'nowrap' }}>{p.stockQty} <span style={{ fontSize: 11 }}>(mín. {p.minQty})</span></td>
                    <td style={{ whiteSpace: 'nowrap' }}>{kwanza(p.unitPrice)}</td>
                    <td>
                      <span style={{ fontSize: 11, padding: '3px 10px', borderRadius: 20, background: `${st.color}14`, border: `1px solid ${st.color}33`, color: st.color, fontWeight: 700 }}>
                        {st.label}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
