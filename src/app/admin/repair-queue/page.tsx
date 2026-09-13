'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { PageHeader, EmptyState, CardSkeleton, PriorityBadge } from '@/components/ui/shared'

interface Repair {
  id: number
  ref: string
  deviceName: string
  brand: string | null
  model: string | null
  issue: string
  status: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  entryDate: string
  eta: string | null
  clientName: string | null
}

const ACTIVE = ['intake', 'diagnosis', 'waiting_parts', 'in_repair', 'testing', 'ready']
const PRIORITY_RANK: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 }

const STATUS_LABEL: Record<string, string> = {
  intake: 'Receção', diagnosis: 'Diagnóstico', waiting_parts: 'Aguarda peças',
  in_repair: 'Em reparação', testing: 'Em teste', ready: 'Pronto',
}

function daysSince(iso: string) {
  return Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000))
}

export default function RepairQueuePage() {
  const [repairs, setRepairs] = useState<Repair[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/admin/repairs')
      .then(async r => {
        if (!r.ok) throw new Error(r.status === 401 ? 'Sessão expirada. Volte a entrar.' : 'Erro ao carregar a fila.')
        return r.json()
      })
      .then(d => setRepairs(d.repairs ?? []))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  const queue = repairs
    .filter(r => ACTIVE.includes(r.status))
    .sort((a, b) => {
      const p = (PRIORITY_RANK[a.priority] ?? 9) - (PRIORITY_RANK[b.priority] ?? 9)
      if (p !== 0) return p
      return new Date(a.entryDate).getTime() - new Date(b.entryDate).getTime()
    })

  return (
    <div>
      <PageHeader
        supra="CRM Admin"
        title="Fila de Reparação"
        sub={loading ? 'A carregar…' : `${queue.length} equipamento(s) em curso · ordenado por prioridade e antiguidade`}
      />

      {error && (
        <div role="alert" style={{
          padding: '0.85rem 1rem', borderRadius: 8, fontSize: 13, marginBottom: '1.5rem',
          background: 'rgba(239,83,80,0.08)', border: '1px solid rgba(239,83,80,0.25)', color: '#EF5350',
        }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : queue.length === 0 ? (
        <div className="card-base">
          <EmptyState
            ico="🔧"
            title="Nenhuma reparação em curso"
            sub="As reparações com estado activo aparecem aqui, por ordem de prioridade."
            action={<Link href="/admin/laboratory" className="btn-primary" style={{ fontSize: 12, padding: '8px 16px' }}>Ir para o Laboratório</Link>}
          />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {queue.map((r, i) => {
            const urgent = r.priority === 'critical' || r.priority === 'high'
            return (
              <div
                key={r.id}
                className="card-base"
                style={{
                  padding: '1.1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap',
                  borderLeft: urgent ? '3px solid #EF5350' : '3px solid var(--border)',
                }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                  background: urgent ? 'rgba(239,83,80,0.15)' : 'rgba(0,230,118,0.08)',
                  border: urgent ? '1px solid rgba(239,83,80,0.3)' : '1px solid rgba(0,230,118,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 900, color: urgent ? '#EF5350' : 'var(--green)',
                }}>
                  {i + 1}
                </div>

                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ fontSize: 11, color: 'var(--green)', fontFamily: 'var(--font-mono)', marginBottom: '0.15rem' }}>{r.ref}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--silver2)' }}>
                    {[r.brand, r.deviceName, r.model].filter(Boolean).join(' ')}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text2)' }}>{r.clientName ?? 'Cliente não associado'}</div>
                </div>

                <div style={{ textAlign: 'right', minWidth: 120 }}>
                  <div style={{ fontSize: 11, color: 'var(--text2)' }}>{STATUS_LABEL[r.status] ?? r.status}</div>
                  <div style={{ fontSize: 11, color: 'var(--forest)', marginTop: 2 }}>
                    Em laboratório há {daysSince(r.entryDate)} dia(s)
                  </div>
                  {r.eta && (
                    <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 2 }}>
                      Previsão: {new Date(r.eta).toLocaleDateString('pt-AO')}
                    </div>
                  )}
                </div>

                <PriorityBadge priority={r.priority} />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
