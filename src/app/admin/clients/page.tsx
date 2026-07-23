'use client'
import { useState } from 'react'
import { mockClients } from '@/lib/mock-data'

export default function AdminClientsPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [selected, setSelected] = useState<typeof mockClients[0] | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)

  const filtered = mockClients.filter(c => {
    const matchSearch = c.company.toLowerCase().includes(search.toLowerCase()) || c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || c.status === filter
    return matchSearch && matchFilter
  })

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ fontSize: 11, color: 'var(--forest)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: '0.25rem' }}>CRM</div>
          <h1 className="font-rajdhani font-black" style={{ fontSize: 28, color: 'var(--text)', letterSpacing: 1 }}>Gestão de Clientes</h1>
          <p style={{ fontSize: 13, color: 'var(--slate)', marginTop: 4 }}>{mockClients.filter(c => c.status === 'active').length} clientes ativos de {mockClients.length} total</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn-secondary text-xs py-2 px-4" style={{ fontSize: 12 }}>📤 Exportar CSV</button>
          <button className="btn-primary text-xs py-2 px-4" style={{ fontSize: 12 }} onClick={() => setShowAddModal(true)}>+ Novo Cliente</button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <input className="input-field" style={{ maxWidth: 280 }} value={search} onChange={e => setSearch(e.target.value)}
          placeholder="🔍  Pesquisar por empresa, nome ou email..." />
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {(['all', 'active', 'inactive'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ fontSize: 11, padding: '6px 14px', borderRadius: 20, cursor: 'pointer', border: `1px solid ${filter === f ? 'rgba(0,230,118,0.4)' : 'var(--border)'}`, color: filter === f ? 'var(--green)' : 'var(--slate)', background: filter === f ? 'rgba(0,230,118,0.08)' : 'transparent', fontFamily: 'inherit' }}>
              {f === 'all' ? 'Todos' : f === 'active' ? 'Ativos' : 'Inativos'}
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
                <th>Empresa / Cliente</th>
                <th>Contacto</th>
                <th>Localização</th>
                <th>Serviços</th>
                <th>Tickets</th>
                <th>Receita Total</th>
                <th>Estado</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(client => (
                <tr key={client.id} style={{ cursor: 'pointer' }} onClick={() => setSelected(client)}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'rgba(0,230,118,0.1)', border: '1px solid rgba(0,230,118,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'var(--green)', flexShrink: 0 }}>
                        {client.company.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--silver2)' }}>{client.company}</div>
                        <div style={{ fontSize: 11, color: 'var(--slate)' }}>{client.name}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: 12, color: 'var(--green2)' }}>{client.email}</div>
                    <div style={{ fontSize: 11, color: 'var(--slate)' }}>{client.phone}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: 12 }}>{client.province}</div>
                    <div style={{ fontSize: 11, color: 'var(--slate)' }}>{client.size}</div>
                  </td>
                  <td>
                    <span className="font-rajdhani font-bold" style={{ fontSize: 16, color: 'var(--green)' }}>{client.services}</span>
                  </td>
                  <td>
                    <span style={{ fontSize: 13, color: client.openTickets > 0 ? '#FFC107' : 'var(--slate)' }}>
                      {client.openTickets}
                    </span>
                  </td>
                  <td>
                    <span className="font-mono" style={{ fontSize: 12, color: 'var(--silver2)' }}>
                      {(client.totalRevenue / 1000000).toFixed(1)}M Kz
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${client.status === 'active' ? 'badge-green' : 'badge-gray'}`}>
                      {client.status === 'active' ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td onClick={e => e.stopPropagation()}>
                    <div style={{ display: 'flex', gap: '0.35rem' }}>
                      <button onClick={() => setSelected(client)}
                        style={{ fontSize: 11, padding: '3px 9px', borderRadius: 6, background: 'rgba(0,230,118,0.07)', border: '1px solid rgba(0,230,118,0.18)', color: 'var(--green2)', cursor: 'pointer' }}>
                        Ver
                      </button>
                      <button style={{ fontSize: 11, padding: '3px 9px', borderRadius: 6, background: 'rgba(66,165,245,0.07)', border: '1px solid rgba(66,165,245,0.18)', color: '#42A5F5', cursor: 'pointer' }}>
                        ✏️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--slate)', fontSize: 13 }}>
              Nenhum cliente encontrado com os filtros atuais.
            </div>
          )}
        </div>
      </div>

      {/* Client detail panel */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(6,16,30,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
          onClick={() => setSelected(null)}>
          <div className="card-base" style={{ width: '100%', maxWidth: 560, padding: '2rem', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}
            onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelected(null)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--slate)', fontSize: 18, cursor: 'pointer' }}>✕</button>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(0,230,118,0.15)', border: '2px solid rgba(0,230,118,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: 'var(--green)', flexShrink: 0 }}>
                {selected.company.charAt(0)}
              </div>
              <div>
                <div className="font-rajdhani font-bold" style={{ fontSize: 20, color: 'var(--text)' }}>{selected.company}</div>
                <div style={{ fontSize: 13, color: 'var(--slate)' }}>{selected.name}</div>
                <span className={`badge mt-1 ${selected.status === 'active' ? 'badge-green' : 'badge-gray'}`}>
                  {selected.status === 'active' ? 'Ativo' : 'Inativo'}
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {[
                ['Email', selected.email],
                ['Telefone', selected.phone],
                ['Província', selected.province],
                ['Dimensão', selected.size],
                ['Cliente desde', new Date(selected.joinedAt).toLocaleDateString('pt-AO')],
                ['Receita total', `${(selected.totalRevenue / 1000000).toFixed(2)}M Kz`],
                ['Serviços ativos', `${selected.services}`],
                ['Tickets abertos', `${selected.openTickets}`],
              ].map(([k, v]) => (
                <div key={k} style={{ padding: '0.75rem', background: 'rgba(13,31,58,0.5)', borderRadius: 8, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 10, color: 'var(--slate)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 2 }}>{k}</div>
                  <div style={{ fontSize: 12, color: 'var(--silver2)' }}>{v}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button className="btn-primary text-sm py-2 px-4" style={{ fontSize: 12 }}>🎫 Criar Ticket</button>
              <button className="btn-secondary text-sm py-2 px-4" style={{ fontSize: 12 }}>🧾 Nova Fatura</button>
              <button className="btn-secondary text-sm py-2 px-4" style={{ fontSize: 12 }}>✏️ Editar</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Client Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(6,16,30,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="card-base" style={{ width: '100%', maxWidth: 480, padding: '2rem', position: 'relative' }}>
            <button onClick={() => setShowAddModal(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--slate)', fontSize: 18, cursor: 'pointer' }}>✕</button>
            <div className="font-rajdhani font-black" style={{ fontSize: 22, color: 'var(--text)', marginBottom: '1.5rem' }}>Novo Cliente</div>
            <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} onSubmit={e => { e.preventDefault(); setShowAddModal(false) }}>
              {[
                { l: 'EMPRESA *', p: 'Nome da empresa' },
                { l: 'NOME DO CONTACTO *', p: 'Nome completo' },
                { l: 'EMAIL *', p: 'email@empresa.ao' },
                { l: 'TELEFONE', p: '+244 9XX XXX XXX' },
              ].map(f => (
                <div key={f.l}>
                  <label style={{ fontSize: 11, color: 'var(--silver)', letterSpacing: '0.5px', display: 'block', marginBottom: '0.35rem' }}>{f.l}</label>
                  <input className="input-field" placeholder={f.p} required={f.l.includes('*')} />
                </div>
              ))}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: 11, color: 'var(--silver)', letterSpacing: '0.5px', display: 'block', marginBottom: '0.35rem' }}>PROVÍNCIA</label>
                  <select className="input-field">
                    {['Luanda','Benguela','Huíla','Huambo','Cabinda'].map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 11, color: 'var(--silver)', letterSpacing: '0.5px', display: 'block', marginBottom: '0.35rem' }}>DIMENSÃO</label>
                  <select className="input-field">
                    {['Micro (1–9)','Pequena (10–49)','Média (50–249)','Grande (250+)'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <button type="submit" className="btn-primary justify-center w-full" style={{ fontSize: 13, padding: '12px', marginTop: '0.5rem' }}>
                Adicionar Cliente ↗
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
