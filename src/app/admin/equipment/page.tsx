'use client'
import { useEffect, useState } from 'react'
import { PageHeader, SearchBar, StatusBadge, EmptyState } from '@/components/ui/shared'

interface Equipment {
  id: number
  name: string
  serial: string | null
  category: string | null
  brand: string | null
  model: string | null
  status: string
  clientName: string | null
  companyName: string | null
  warrantyUntil: string | null
  location: string | null
}

export default function EquipmentAdminPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/admin/equipment')
      .then(r => r.json())
      .then(data => { setEquipment(data.equipment ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = equipment.filter(e => {
    const q = search.toLowerCase()
    return !q
      || e.name.toLowerCase().includes(q)
      || (e.serial ?? '').toLowerCase().includes(q)
      || (e.brand ?? '').toLowerCase().includes(q)
      || (e.model ?? '').toLowerCase().includes(q)
      || (e.category ?? '').toLowerCase().includes(q)
      || (e.clientName ?? '').toLowerCase().includes(q)
      || (e.companyName ?? '').toLowerCase().includes(q)
  })

  return (
    <div>
      <PageHeader
        supra="CRM Admin"
        title="Equipamentos"
        sub={`${equipment.length} equipamentos registados`}
      />

      {/* Search */}
      <div style={{ marginBottom: '1.25rem' }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Pesquisar por nome, serial, marca, modelo, cliente..." />
      </div>

      {/* Table */}
      <div className="card-base" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Serial</th>
                <th>Categoria</th>
                <th>Marca / Modelo</th>
                <th>Cliente</th>
                <th>Empresa</th>
                <th>Estado</th>
                <th>Garantia até</th>
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
                <tr><td colSpan={9}><EmptyState ico="💻" title="Nenhum equipamento encontrado" /></td></tr>
              ) : filtered.map(e => {
                const warrantyExpired = e.warrantyUntil && new Date(e.warrantyUntil) < new Date()
                return (
                  <tr key={e.id}>
                    <td style={{ fontSize: 13, fontWeight: 600, color: 'var(--silver2)' }}>{e.name}</td>
                    <td><span className="font-mono" style={{ fontSize: 11, color: 'var(--green2)' }}>{e.serial ?? '—'}</span></td>
                    <td style={{ fontSize: 11, color: 'var(--slate)' }}>{e.category ?? '—'}</td>
                    <td style={{ fontSize: 12, color: 'var(--slate)' }}>{[e.brand, e.model].filter(Boolean).join(' / ') || '—'}</td>
                    <td style={{ fontSize: 12 }}>{e.clientName ?? '—'}</td>
                    <td style={{ fontSize: 12, color: 'var(--slate)' }}>{e.companyName ?? '—'}</td>
                    <td><StatusBadge status={e.status} /></td>
                    <td style={{ fontSize: 11, color: warrantyExpired ? '#ef4444' : 'var(--muted)' }}>
                      {e.warrantyUntil ? new Date(e.warrantyUntil).toLocaleDateString('pt-AO') : '—'}
                    </td>
                    <td style={{ fontSize: 11, color: 'var(--muted)' }}>{e.location ?? '—'}</td>
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
