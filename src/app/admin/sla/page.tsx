'use client'
import { useEffect, useState } from 'react'
import { PageHeader, SearchBar, EmptyState } from '@/components/ui/shared'

interface Contract {
  id: number
  ref: string
  type: string | null
  companyName: string | null
  slaTarget: string | number | null
  responseTime: number | null
  value: string | number | null
  startDate: string | null
  endDate: string | null
  autoRenew: boolean | null
}

const CONTRACT_BADGE: Record<string, { cls: string; label: string }> = {
  basic:      { cls: 'badge-gray',   label: 'Básico' },
  business:   { cls: 'badge-blue',   label: 'Business' },
  enterprise: { cls: 'badge-yellow', label: 'Enterprise' },
}

export default function SlaAdminPage() {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/admin/contracts')
      .then(r => r.json())
      .then(data => { setContracts(data.contracts ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const now = new Date()

  const filtered = contracts.filter(c => {
    const q = search.toLowerCase()
    return !q || (c.companyName ?? '').toLowerCase().includes(q) || c.ref.toLowerCase().includes(q) || (c.type ?? '').toLowerCase().includes(q)
  })

  const activeCount = contracts.filter(c => c.endDate && new Date(c.endDate) >= now).length
  const totalValue = contracts.reduce((sum, c) => sum + Number(c.value ?? 0), 0)

  return (
    <div>
      <PageHeader
        supra="CRM Admin"
        title="SLA & Contratos"
        sub="Contratos de nível de serviço"
      />

      {/* Summary */}
      {!loading && (
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <div className="card-base" style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: 22 }}>📄</span>
            <div>
              <div style={{ fontSize: 10, color: 'var(--slate)', textTransform: 'uppercase', letterSpacing: 1 }}>Contratos Ativos</div>
              <div className="font-rajdhani font-black" style={{ fontSize: 28, color: 'var(--green)', lineHeight: 1 }}>{activeCount}</div>
            </div>
          </div>
          <div className="card-base" style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: 22 }}>💰</span>
            <div>
              <div style={{ fontSize: 10, color: 'var(--slate)', textTransform: 'uppercase', letterSpacing: 1 }}>Valor Total Contratos</div>
              <div className="font-rajdhani font-black" style={{ fontSize: 22, color: 'var(--green)', lineHeight: 1 }}>{totalValue.toLocaleString('pt-AO')} Kz</div>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div style={{ marginBottom: '1.25rem' }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Pesquisar por empresa, ref, tipo..." />
      </div>

      {/* Table */}
      <div className="card-base" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Ref</th>
                <th>Empresa</th>
                <th>Tipo</th>
                <th>SLA Target %</th>
                <th>Tempo Resp. (h)</th>
                <th>Valor</th>
                <th>Início</th>
                <th>Fim</th>
                <th>Auto Renovação</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 9 }).map((__, j) => (
                      <td key={j} style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ height: 14, borderRadius: 6, background: 'rgba(255,255,255,0.06)', width: '60%' }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={9}><EmptyState ico="📄" title="Nenhum contrato encontrado" /></td></tr>
              ) : filtered.map(c => {
                const expired = c.endDate && new Date(c.endDate) < now
                const badge = CONTRACT_BADGE[c.type ?? 'basic'] ?? CONTRACT_BADGE.basic
                return (
                  <tr key={c.id} style={{ background: expired ? 'rgba(239,68,68,0.04)' : undefined }}>
                    <td><span className="font-mono" style={{ fontSize: 11, color: expired ? '#ef4444' : 'var(--green2)' }}>{c.ref}</span></td>
                    <td style={{ fontSize: 13, fontWeight: 600, color: 'var(--silver2)' }}>{c.companyName ?? '—'}</td>
                    <td><span className={`badge ${badge.cls}`}>{badge.label}</span></td>
                    <td>
                      <span className="font-mono" style={{ fontSize: 13, fontWeight: 700, color: Number(c.slaTarget) >= 99 ? 'var(--green)' : '#FFC107' }}>
                        {c.slaTarget ? `${c.slaTarget}%` : '—'}
                      </span>
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--silver2)' }}>{c.responseTime ? `${c.responseTime}h` : '—'}</td>
                    <td><span className="font-mono" style={{ fontSize: 12, color: 'var(--silver2)' }}>{c.value ? `${Number(c.value).toLocaleString('pt-AO')} Kz` : '—'}</span></td>
                    <td style={{ fontSize: 11, color: 'var(--muted)' }}>{c.startDate ? new Date(c.startDate).toLocaleDateString('pt-AO') : '—'}</td>
                    <td style={{ fontSize: 11, color: expired ? '#ef4444' : 'var(--muted)', fontWeight: expired ? 600 : undefined }}>
                      {c.endDate ? new Date(c.endDate).toLocaleDateString('pt-AO') : '—'}
                      {expired && <span style={{ marginLeft: 4, fontSize: 10 }}>⚠️ Expirado</span>}
                    </td>
                    <td>
                      <span className={`badge ${c.autoRenew ? 'badge-green' : 'badge-gray'}`}>
                        {c.autoRenew ? 'Sim' : 'Não'}
                      </span>
                    </td>
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
