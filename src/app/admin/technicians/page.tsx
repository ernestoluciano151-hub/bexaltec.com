'use client'
import { useEffect, useState } from 'react'
import { PageHeader, SearchBar, Modal, FormField, useToast, EmptyState } from '@/components/ui/shared'

interface User {
  id: number
  name: string
  email: string
  phone: string | null
  role: string
  isActive: boolean | null
  lastLoginAt: string | null
}

export default function TechniciansAdminPage() {
  const [technicians, setTechnicians] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showInvite, setShowInvite] = useState(false)
  const { ToastComponent } = useToast()

  useEffect(() => {
    fetch('/api/admin/users')
      .then(r => r.json())
      .then(data => {
        setTechnicians((data.users ?? []).filter((u: User) => u.role === 'technician'))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const filtered = technicians.filter(t => {
    const q = search.toLowerCase()
    return !q || t.name.toLowerCase().includes(q) || t.email.toLowerCase().includes(q) || (t.phone ?? '').toLowerCase().includes(q)
  })

  return (
    <div>
      <PageHeader
        supra="CRM Admin"
        title="Técnicos"
        sub={`${technicians.length} técnicos registados`}
        action={
          <button className="btn-primary" style={{ fontSize: 13 }} onClick={() => setShowInvite(true)}>
            + Convidar Técnico
          </button>
        }
      />

      {/* Search */}
      <div style={{ marginBottom: '1.25rem' }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Pesquisar por nome, email, telefone..." />
      </div>

      {/* Table */}
      <div className="card-base" style={{ overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Técnico</th>
                <th>Email</th>
                <th>Telefone</th>
                <th>Último Login</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 5 }).map((__, j) => (
                      <td key={j} style={{ padding: '0.85rem 1rem' }}>
                        <div style={{ height: 14, borderRadius: 6, background: 'rgba(255,255,255,0.06)', width: j === 0 ? '70%' : '50%' }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5}><EmptyState ico="👨‍🔧" title="Nenhum técnico encontrado" sub="Convide técnicos para a plataforma" /></td></tr>
              ) : filtered.map(t => (
                <tr key={t.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(66,165,245,0.12)', border: '1px solid rgba(66,165,245,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#42A5F5', flexShrink: 0 }}>
                        {t.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--silver2)' }}>{t.name}</div>
                        <div style={{ fontSize: 10, color: 'var(--slate)' }}>Técnico</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize: 12, color: 'var(--green2)' }}>{t.email}</td>
                  <td style={{ fontSize: 12, color: 'var(--slate)' }}>{t.phone ?? '—'}</td>
                  <td style={{ fontSize: 11, color: 'var(--muted)' }}>
                    {t.lastLoginAt ? new Date(t.lastLoginAt).toLocaleDateString('pt-AO') : '—'}
                  </td>
                  <td>
                    <span className={`badge ${t.isActive ? 'badge-green' : 'badge-gray'}`}>
                      {t.isActive ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite modal (placeholder) */}
      <Modal open={showInvite} onClose={() => setShowInvite(false)} title="Convidar Técnico" maxWidth={440}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ padding: '0.85rem', background: 'rgba(66,165,245,0.07)', border: '1px solid rgba(66,165,245,0.2)', borderRadius: 8, fontSize: 12, color: '#42A5F5' }}>
            ℹ️ A funcionalidade de convite por email está em desenvolvimento.
          </div>
          <FormField label="Email do Técnico">
            <input
              className="input-field"
              type="email"
              placeholder="tecnico@bexaltec.ao"
              disabled
              style={{ opacity: 0.5, cursor: 'not-allowed' }}
            />
          </FormField>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button onClick={() => setShowInvite(false)} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid var(--border)', background: 'none', color: 'var(--slate)', cursor: 'pointer', fontSize: 13 }}>
              Fechar
            </button>
            <button
              disabled
              title="Em breve"
              style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: 'rgba(0,230,118,0.15)', color: 'var(--green)', cursor: 'not-allowed', fontSize: 13, fontWeight: 600, opacity: 0.5 }}
            >
              Enviar Convite — Em breve
            </button>
          </div>
        </div>
      </Modal>

      {ToastComponent}
    </div>
  )
}
