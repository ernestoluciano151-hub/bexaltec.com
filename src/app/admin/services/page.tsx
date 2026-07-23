'use client'
import { useState } from 'react'
import { mockServices, mockClients } from '@/lib/mock-data'
import type { ServiceStatus } from '@/lib/mock-data'

const statusBadge: Record<ServiceStatus, string> = { active: 'badge-green', suspended: 'badge-yellow', expired: 'badge-red' }
const statusLabel: Record<ServiceStatus, string> = { active: 'Ativo', suspended: 'Suspenso', expired: 'Expirado' }

export default function AdminServicesPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | ServiceStatus>('all')

  const filtered = mockServices.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.clientName.toLowerCase().includes(search.toLowerCase()) || s.category.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || s.status === filter
    return matchSearch && matchFilter
  })

  const totalMRR = mockServices.filter(s => s.status === 'active').reduce((a, s) => a + s.monthlyValue, 0)
  const totalActive = mockServices.filter(s => s.status === 'active').length

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: 11, color: 'var(--forest)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: '0.25rem' }}>CRM</div>
          <h1 className="font-rajdhani font-black" style={{ fontSize: 28, color: 'var(--text)', letterSpacing: 1 }}>Gestão de Serviços</h1>
          <p style={{ fontSize: 13, color: 'var(--slate)', marginTop: 4 }}>{totalActive} serviços ativos · MRR: {totalMRR.toLocaleString('pt-AO')} Kz</p>
        </div>
        <button className="btn-primary text-xs py-2 px-4" style={{ fontSize: 12 }}>+ Novo Serviço</button>
      </div>

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { l: 'Serviços Ativos', v: totalActive, c: '#00E676' },
          { l: 'Receita Mensal (MRR)', v: `${(totalMRR/1000000).toFixed(2)}M Kz`, c: '#00E676' },
          { l: 'Contratos a Expirar (90d)', v: mockServices.filter(s => { const d = new Date(s.endDate).getTime() - Date.now(); return d > 0 && d < 90*24*60*60*1000 }).length, c: '#FFC107' },
        ].map((c, i) => (
          <div key={i} className="card-base" style={{ padding: '1.1rem' }}>
            <div style={{ fontSize: 10, color: 'var(--slate)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: '0.4rem' }}>{c.l}</div>
            <div className="font-rajdhani font-black" style={{ fontSize: 28, color: c.c, lineHeight: 1 }}>{c.v}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <input className="input-field" style={{ maxWidth: 280 }} value={search} onChange={e => setSearch(e.target.value)}
          placeholder="🔍  Pesquisar por serviço, cliente, categoria..." />
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {(['all', 'active', 'suspended', 'expired'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ fontSize: 11, padding: '6px 12px', borderRadius: 20, cursor: 'pointer', border: `1px solid ${filter === f ? 'rgba(0,230,118,0.4)' : 'var(--border)'}`, color: filter === f ? 'var(--green)' : 'var(--slate)', background: filter === f ? 'rgba(0,230,118,0.08)' : 'transparent', fontFamily: 'inherit' }}>
              {f === 'all' ? 'Todos' : statusLabel[f as ServiceStatus]}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="card-base" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Serviço</th>
                <th>Cliente</th>
                <th>Categoria</th>
                <th>Valor Mensal</th>
                <th>Início</th>
                <th>Término</th>
                <th>Estado</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(service => {
                const days = Math.ceil((new Date(service.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
                return (
                  <tr key={service.id}>
                    <td>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--silver2)' }}>{service.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--slate)', marginTop: 2, maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{service.description}</div>
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--text2)' }}>{service.clientName}</td>
                    <td>
                      <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 10, background: 'rgba(66,165,245,0.07)', border: '1px solid rgba(66,165,245,0.18)', color: '#42A5F5' }}>{service.category}</span>
                    </td>
                    <td>
                      <span className="font-rajdhani font-semibold" style={{ fontSize: 14, color: 'var(--green)' }}>
                        {service.monthlyValue.toLocaleString('pt-AO')}
                        <span style={{ fontSize: 10, color: 'var(--slate)' }}> Kz</span>
                      </span>
                    </td>
                    <td style={{ fontSize: 12 }}>{new Date(service.startDate).toLocaleDateString('pt-AO')}</td>
                    <td style={{ fontSize: 12, color: days < 90 && days > 0 ? '#FFC107' : 'var(--text2)' }}>
                      {new Date(service.endDate).toLocaleDateString('pt-AO')}
                      {days > 0 && days < 90 && <div style={{ fontSize: 10 }}>{days}d restantes</div>}
                    </td>
                    <td><span className={`badge ${statusBadge[service.status]}`}>{statusLabel[service.status]}</span></td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.35rem' }}>
                        <button style={{ fontSize: 11, padding: '3px 9px', borderRadius: 6, background: 'rgba(0,230,118,0.07)', border: '1px solid rgba(0,230,118,0.18)', color: 'var(--green2)', cursor: 'pointer' }}>✏️ Editar</button>
                        {days < 90 && days > 0 && (
                          <button style={{ fontSize: 11, padding: '3px 9px', borderRadius: 6, background: 'rgba(255,193,7,0.07)', border: '1px solid rgba(255,193,7,0.2)', color: '#FFC107', cursor: 'pointer' }}>🔄 Renovar</button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--slate)', fontSize: 13 }}>
              Nenhum serviço encontrado.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
