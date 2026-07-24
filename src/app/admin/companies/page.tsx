'use client'
import { useEffect, useState, useTransition } from 'react'
import { createCompany, updateCompany } from '@/lib/actions/admin'
import {
  PageHeader, SearchBar, Modal, FormField, useToast, EmptyState,
} from '@/components/ui/shared'

interface Company {
  id: number
  name: string
  nif: string | null
  sector: string | null
  phone: string | null
  email: string | null
  contractType: string | null
  revenue: string | number | null
  isActive: boolean | null
}

type ContractType = 'basic' | 'business' | 'enterprise'

const CONTRACT_BADGE: Record<string, { cls: string; label: string }> = {
  basic:      { cls: 'badge-gray',   label: 'Básico' },
  business:   { cls: 'badge-blue',   label: 'Business' },
  enterprise: { cls: 'badge-yellow', label: 'Enterprise' },
}

const emptyForm = { name: '', nif: '', sector: '', phone: '', email: '', contractType: 'basic' as ContractType, website: '', address: '' }

export default function CompaniesAdminPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [contractFilter, setContractFilter] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editTarget, setEditTarget] = useState<Company | null>(null)
  const [form, setForm] = useState({ ...emptyForm })
  const [isPending, startTransition] = useTransition()
  const { show, ToastComponent } = useToast()

  useEffect(() => {
    fetch('/api/admin/companies')
      .then(r => r.json())
      .then(data => { setCompanies(data.companies ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = companies.filter(c => {
    const q = search.toLowerCase()
    const matchSearch = !q || c.name.toLowerCase().includes(q) || (c.nif ?? '').toLowerCase().includes(q) || (c.sector ?? '').toLowerCase().includes(q)
    const matchContract = !contractFilter || c.contractType === contractFilter
    return matchSearch && matchContract
  })

  function openCreate() {
    setForm({ ...emptyForm })
    setEditTarget(null)
    setShowModal(true)
  }

  function openEdit(c: Company) {
    setEditTarget(c)
    setForm({
      name: c.name,
      nif: c.nif ?? '',
      sector: c.sector ?? '',
      phone: c.phone ?? '',
      email: c.email ?? '',
      contractType: (c.contractType as ContractType) ?? 'basic',
      website: '',
      address: '',
    })
    setShowModal(true)
  }

  function handleSubmit() {
    startTransition(async () => {
      if (editTarget) {
        const res = await updateCompany(editTarget.id, { ...form })
        if (res.error) { show(res.error, 'error'); return }
        setCompanies(prev => prev.map(c => c.id === editTarget.id ? { ...c, ...form } : c))
        show('Empresa actualizada.', 'success')
      } else {
        const res = await createCompany({ ...form })
        if (res.error) { show(res.error, 'error'); return }
        fetch('/api/admin/companies').then(r => r.json()).then(data => setCompanies(data.companies ?? []))
        show('Empresa criada com sucesso.', 'success')
      }
      setShowModal(false)
      setEditTarget(null)
    })
  }

  const f = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [k]: e.target.value }))

  return (
    <div>
      <PageHeader
        supra="CRM Admin"
        title="Empresas"
        sub={`${companies.length} empresas registadas`}
        action={
          <button className="btn-primary" style={{ fontSize: 13 }} onClick={openCreate}>
            + Nova Empresa
          </button>
        }
      />

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Pesquisar por nome, NIF, sector..." />
        <select className="input-field" style={{ maxWidth: 180 }} value={contractFilter} onChange={e => setContractFilter(e.target.value)}>
          <option value="">Todos os contratos</option>
          <option value="basic">Básico</option>
          <option value="business">Business</option>
          <option value="enterprise">Enterprise</option>
        </select>
      </div>

      {/* Table */}
      <div className="card-base" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>NIF</th>
                <th>Sector</th>
                <th>Telefone</th>
                <th>Email</th>
                <th>Contrato</th>
                <th>Receita</th>
                <th>Ativo</th>
                <th>Ações</th>
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
                <tr><td colSpan={9}><EmptyState ico="🏢" title="Nenhuma empresa encontrada" /></td></tr>
              ) : filtered.map(c => {
                const badge = CONTRACT_BADGE[c.contractType ?? 'basic'] ?? CONTRACT_BADGE.basic
                return (
                  <tr key={c.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: 26, height: 26, borderRadius: 6, background: 'rgba(0,230,118,0.1)', border: '1px solid rgba(0,230,118,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: 'var(--green)', flexShrink: 0 }}>
                          {c.name.charAt(0)}
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--silver2)' }}>{c.name}</span>
                      </div>
                    </td>
                    <td><span className="font-mono" style={{ fontSize: 11, color: 'var(--slate)' }}>{c.nif ?? '—'}</span></td>
                    <td style={{ fontSize: 12, color: 'var(--slate)' }}>{c.sector ?? '—'}</td>
                    <td style={{ fontSize: 12, color: 'var(--slate)' }}>{c.phone ?? '—'}</td>
                    <td style={{ fontSize: 12, color: 'var(--green2)' }}>{c.email ?? '—'}</td>
                    <td><span className={`badge ${badge.cls}`}>{badge.label}</span></td>
                    <td><span className="font-mono" style={{ fontSize: 12, color: 'var(--silver2)' }}>{c.revenue ? `${Number(c.revenue).toLocaleString('pt-AO')} Kz` : '—'}</span></td>
                    <td>
                      <span className={`badge ${c.isActive ? 'badge-green' : 'badge-gray'}`}>
                        {c.isActive ? 'Sim' : 'Não'}
                      </span>
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
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit modal */}
      <Modal open={showModal} onClose={() => { setShowModal(false); setEditTarget(null) }} title={editTarget ? 'Editar Empresa' : 'Nova Empresa'} maxWidth={520}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <FormField label="Nome da Empresa" required>
            <input className="input-field" value={form.name} onChange={f('name')} />
          </FormField>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <FormField label="NIF">
              <input className="input-field" value={form.nif} onChange={f('nif')} />
            </FormField>
            <FormField label="Sector">
              <input className="input-field" value={form.sector} onChange={f('sector')} placeholder="TI, Telecomunicações..." />
            </FormField>
            <FormField label="Telefone">
              <input className="input-field" value={form.phone} onChange={f('phone')} />
            </FormField>
            <FormField label="Email">
              <input className="input-field" type="email" value={form.email} onChange={f('email')} />
            </FormField>
            <FormField label="Website">
              <input className="input-field" value={form.website} onChange={f('website')} />
            </FormField>
            <FormField label="Tipo de Contrato">
              <select className="input-field" value={form.contractType} onChange={f('contractType')}>
                <option value="basic">Básico</option>
                <option value="business">Business</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </FormField>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button onClick={() => { setShowModal(false); setEditTarget(null) }} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid var(--border)', background: 'none', color: 'var(--slate)', cursor: 'pointer', fontSize: 13 }}>
              Cancelar
            </button>
            <button onClick={handleSubmit} disabled={isPending || !form.name} className="btn-primary" style={{ fontSize: 13, padding: '8px 20px' }}>
              {isPending ? 'A guardar...' : editTarget ? 'Actualizar' : 'Criar Empresa'}
            </button>
          </div>
        </div>
      </Modal>

      {ToastComponent}
    </div>
  )
}
