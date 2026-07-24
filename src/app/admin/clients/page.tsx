'use client'
import { useEffect, useState, useTransition } from 'react'
import { adminUpdateUser } from '@/lib/actions/profile'
import {
  PageHeader, SearchBar, StatusBadge, Modal, FormField, useToast, EmptyState,
} from '@/components/ui/shared'

interface Client {
  id: number
  name: string
  email: string
  phone: string | null
  companyName: string | null
  isActive: boolean | null
  lastLoginAt: string | null
}

export default function ClientsAdminPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [companyFilter, setCompanyFilter] = useState('')
  const [editTarget, setEditTarget] = useState<Client | null>(null)
  const [form, setForm] = useState({ name: '', email: '', phone: '', isActive: true })
  const [isPending, startTransition] = useTransition()
  const { show, ToastComponent } = useToast()

  useEffect(() => {
    fetch('/api/admin/clients')
      .then(r => r.json())
      .then(data => { setClients(data.clients ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const companies = Array.from(new Set(clients.map(c => c.companyName).filter(Boolean))) as string[]

  const filtered = clients.filter(c => {
    const q = search.toLowerCase()
    const matchSearch = !q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || (c.phone ?? '').toLowerCase().includes(q)
    const matchCompany = !companyFilter || c.companyName === companyFilter
    return matchSearch && matchCompany
  })

  function openEdit(c: Client) {
    setEditTarget(c)
    setForm({ name: c.name, email: c.email, phone: c.phone ?? '', isActive: c.isActive ?? true })
  }

  function handleSave() {
    if (!editTarget) return
    startTransition(async () => {
      const res = await adminUpdateUser(editTarget.id, form)
      if (res.error) { show(res.error, 'error'); return }
      setClients(prev => prev.map(c => c.id === editTarget.id ? { ...c, ...form } : c))
      setEditTarget(null)
      show('Cliente actualizado com sucesso.', 'success')
    })
  }

  return (
    <div>
      <PageHeader
        supra="CRM Admin"
        title="Gestão de Clientes"
        sub={`${clients.length} clientes registados`}
      />

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Pesquisar por nome, email, telefone..." />
        <select
          className="input-field"
          style={{ maxWidth: 200 }}
          value={companyFilter}
          onChange={e => setCompanyFilter(e.target.value)}
        >
          <option value="">Todas as empresas</option>
          {companies.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {(['all', 'active', 'inactive'] as const).map(f => (
            <button
              key={f}
              onClick={() => {
                if (f === 'all') setCompanyFilter('')
              }}
              style={{ fontSize: 11, padding: '6px 14px', borderRadius: 20, cursor: 'pointer', border: '1px solid var(--border)', color: 'var(--slate)', background: 'transparent', fontFamily: 'inherit' }}
            >
              {f === 'all' ? `Todos (${clients.length})` : f === 'active' ? `Ativos (${clients.filter(c => c.isActive).length})` : `Inativos (${clients.filter(c => !c.isActive).length})`}
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
                <th>Nome</th>
                <th>Email</th>
                <th>Telefone</th>
                <th>Empresa</th>
                <th>Último Login</th>
                <th>Estado</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 7 }).map((__, j) => (
                      <td key={j} style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ height: 14, borderRadius: 6, background: 'rgba(255,255,255,0.06)', width: j === 0 ? '70%' : '50%' }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <EmptyState ico="👥" title="Nenhum cliente encontrado" sub="Ajuste os filtros de pesquisa" />
                  </td>
                </tr>
              ) : filtered.map(c => (
                <tr key={c.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(0,230,118,0.1)', border: '1px solid rgba(0,230,118,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'var(--green)', flexShrink: 0 }}>
                        {c.name.charAt(0).toUpperCase()}
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--silver2)' }}>{c.name}</span>
                    </div>
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--green2)' }}>{c.email}</td>
                  <td style={{ fontSize: 12, color: 'var(--slate)' }}>{c.phone ?? '—'}</td>
                  <td style={{ fontSize: 12 }}>{c.companyName ?? '—'}</td>
                  <td style={{ fontSize: 11, color: 'var(--muted)' }}>
                    {c.lastLoginAt ? new Date(c.lastLoginAt).toLocaleDateString('pt-AO') : '—'}
                  </td>
                  <td>
                    <StatusBadge status={c.isActive ? 'active' : 'closed'} />
                  </td>
                  <td>
                    <button
                      onClick={() => openEdit(c)}
                      style={{ fontSize: 11, padding: '3px 9px', borderRadius: 6, background: 'rgba(66,165,245,0.07)', border: '1px solid rgba(66,165,245,0.18)', color: '#42A5F5', cursor: 'pointer' }}
                    >
                      ✏️ Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit modal */}
      <Modal open={!!editTarget} onClose={() => setEditTarget(null)} title="Editar Cliente" maxWidth={480}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <FormField label="Nome" required>
            <input className="input-field" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
          </FormField>
          <FormField label="Email" required>
            <input className="input-field" type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
          </FormField>
          <FormField label="Telefone">
            <input className="input-field" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
          </FormField>
          <FormField label="Estado">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={e => setForm(p => ({ ...p, isActive: e.target.checked }))}
                style={{ accentColor: 'var(--green)', width: 16, height: 16 }}
              />
              <span style={{ fontSize: 13, color: 'var(--text2)' }}>Conta ativa</span>
            </label>
          </FormField>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button onClick={() => setEditTarget(null)} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid var(--border)', background: 'none', color: 'var(--slate)', cursor: 'pointer', fontSize: 13 }}>
              Cancelar
            </button>
            <button onClick={handleSave} disabled={isPending} className="btn-primary" style={{ fontSize: 13, padding: '8px 20px' }}>
              {isPending ? 'A guardar...' : 'Guardar'}
            </button>
          </div>
        </div>
      </Modal>

      {ToastComponent}
    </div>
  )
}
