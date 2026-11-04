'use client'
// ─── Selecção de Cliente / Empresa / Técnico ──────────────────────────────
// Usado em "Nova OT" e "Nova Fatura" para que nenhum registo nasça órfão.
// A empresa vem da ficha do cliente; só se escolhe à mão quando o cliente
// ainda não tem empresa associada. O servidor valida tudo de novo.

import { useEffect, useState } from 'react'
import { FormField } from '@/components/ui/shared'

export interface Parties {
  clientId: string
  companyId: string
  technicianId?: string
}

interface UserRow { id: number; name: string; email: string; role: string; companyId: number | null; companyName: string | null; isActive: boolean | null }
interface CompanyRow { id: number; name: string; nif: string | null }

export function PartyPicker({ value, onChange, withTechnician = false }: {
  value: Parties
  onChange: (next: Parties) => void
  withTechnician?: boolean
}) {
  const [userRows, setUserRows] = useState<UserRow[]>([])
  const [companyRows, setCompanyRows] = useState<CompanyRow[]>([])

  useEffect(() => {
    fetch('/api/admin/users').then(r => r.json()).then(d => setUserRows(d.users ?? [])).catch(() => {})
    fetch('/api/admin/companies').then(r => r.json()).then(d => setCompanyRows(d.companies ?? [])).catch(() => {})
  }, [])

  const clients = userRows.filter(u => u.role === 'client' && u.isActive !== false)
  const technicians = userRows.filter(u => u.role === 'technician' && u.isActive !== false)
  const client = clients.find(c => String(c.id) === value.clientId)
  const companyLocked = !!client?.companyId

  function pickClient(id: string) {
    const c = clients.find(x => String(x.id) === id)
    onChange({ ...value, clientId: id, companyId: c?.companyId ? String(c.companyId) : '' })
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
      <FormField label="Cliente" required>
        <select className="input-field" value={value.clientId} onChange={e => pickClient(e.target.value)}>
          <option value="">— Escolher —</option>
          {clients.map(c => (
            <option key={c.id} value={c.id}>{c.name}{c.companyName ? ` · ${c.companyName}` : ''}</option>
          ))}
        </select>
      </FormField>
      <FormField label="Empresa" required>
        <select
          className="input-field"
          value={value.companyId}
          disabled={!value.clientId || companyLocked}
          onChange={e => onChange({ ...value, companyId: e.target.value })}
        >
          <option value="">— Escolher —</option>
          {companyRows.map(co => (
            <option key={co.id} value={co.id}>{co.name}{co.nif ? ` · NIF ${co.nif}` : ''}</option>
          ))}
        </select>
        {value.clientId && !companyLocked && (
          <div style={{ fontSize: 11, color: '#FFB74D', marginTop: 4 }}>
            Este cliente não tem empresa na ficha. Associe-a também no ecrã Clientes.
          </div>
        )}
      </FormField>
      {withTechnician && (
        <div style={{ gridColumn: '1/-1' }}>
          <FormField label="Técnico">
            <select className="input-field" value={value.technicianId ?? ''} onChange={e => onChange({ ...value, technicianId: e.target.value })}>
              <option value="">— Por atribuir —</option>
              {technicians.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </FormField>
        </div>
      )}
    </div>
  )
}
