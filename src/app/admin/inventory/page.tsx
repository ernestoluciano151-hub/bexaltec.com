'use client'
import { useEffect, useState } from 'react'
import { PageHeader, SearchBar, EmptyState } from '@/components/ui/shared'

interface Part {
  id: number
  ref: string | null
  name: string
  category: string | null
  brand: string | null
  stockQty: number | string
  minQty: number | string
  unitPrice: string | number | null
  supplier: string | null
  location: string | null
}

export default function InventoryAdminPage() {
  const [parts, setParts] = useState<Part[]>([])
  const [lowStock, setLowStock] = useState<Part[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/admin/parts')
      .then(r => r.json())
      .then(data => { setParts(data.parts ?? []); setLowStock(data.lowStock ?? []) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = parts.filter(p => {
    const q = search.toLowerCase()
    return !q || p.name.toLowerCase().includes(q) || (p.ref ?? '').toLowerCase().includes(q) || (p.brand ?? '').toLowerCase().includes(q) || (p.category ?? '').toLowerCase().includes(q)
  })

  return (
    <div>
      <PageHeader
        supra="CRM Admin"
        title="Inventário de Peças"
        sub={`${parts.length} peças registadas`}
      />

      {/* Low stock alert */}
      {!loading && lowStock.length > 0 && (
        <div style={{ marginBottom: '1.25rem', padding: '0.85rem 1.25rem', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: 18 }}>⚠️</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#ef4444' }}>
              {lowStock.length} {lowStock.length === 1 ? 'peça abaixo' : 'peças abaixo'} do stock mínimo
            </div>
            <div style={{ fontSize: 11, color: 'rgba(239,68,68,0.7)', marginTop: 2 }}>
              {lowStock.map(p => p.name).join(', ')}
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div style={{ marginBottom: '1.25rem' }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Pesquisar por nome, ref, marca, categoria..." />
      </div>

      {/* Table */}
      <div className="card-base" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Ref</th>
                <th>Nome</th>
                <th>Categoria</th>
                <th>Marca</th>
                <th>Stock</th>
                <th>Mín.</th>
                <th>Preço Unit.</th>
                <th>Fornecedor</th>
                <th>Localização</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 7 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 9 }).map((__, j) => (
                      <td key={j} style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ height: 14, borderRadius: 6, background: 'rgba(255,255,255,0.06)', width: '60%' }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={9}><EmptyState ico="📦" title="Nenhuma peça encontrada" /></td></tr>
              ) : filtered.map(p => {
                const isLow = Number(p.stockQty) <= Number(p.minQty)
                return (
                  <tr key={p.id}>
                    <td><span className="font-mono" style={{ fontSize: 11, color: 'var(--green2)' }}>{p.ref ?? '—'}</span></td>
                    <td style={{ fontSize: 13, fontWeight: 600, color: 'var(--silver2)' }}>{p.name}</td>
                    <td style={{ fontSize: 11, color: 'var(--slate)' }}>{p.category ?? '—'}</td>
                    <td style={{ fontSize: 12, color: 'var(--slate)' }}>{p.brand ?? '—'}</td>
                    <td>
                      <span className="font-mono" style={{ fontSize: 14, fontWeight: 700, color: isLow ? '#ef4444' : 'var(--green)' }}>
                        {p.stockQty}
                      </span>
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--slate)' }}>{p.minQty}</td>
                    <td><span className="font-mono" style={{ fontSize: 12, color: 'var(--silver2)' }}>{p.unitPrice ? `${Number(p.unitPrice).toLocaleString('pt-AO')} Kz` : '—'}</span></td>
                    <td style={{ fontSize: 12, color: 'var(--slate)' }}>{p.supplier ?? '—'}</td>
                    <td style={{ fontSize: 11, color: 'var(--muted)' }}>{p.location ?? '—'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
