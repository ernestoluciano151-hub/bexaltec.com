'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { PageHeader, EmptyState, CardSkeleton, PriorityBadge } from '@/components/ui/shared'

interface WorkOrder {
  id: number
  ref: string
  title: string
  description: string | null
  status: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  scheduledAt: string | null
  clientName: string | null
  companyName: string | null
}

const dayKey = (iso: string) => new Date(iso).toISOString().slice(0, 10)

const formatDay = (key: string) => {
  const d = new Date(`${key}T00:00:00`)
  const today = new Date().toISOString().slice(0, 10)
  const tomorrow = new Date(Date.now() + 86_400_000).toISOString().slice(0, 10)
  const label = d.toLocaleDateString('pt-AO', { weekday: 'long', day: 'numeric', month: 'long' })
  if (key === today) return `Hoje · ${label}`
  if (key === tomorrow) return `Amanhã · ${label}`
  return label.charAt(0).toUpperCase() + label.slice(1)
}

const formatTime = (iso: string) =>
  new Date(iso).toLocaleTimeString('pt-AO', { hour: '2-digit', minute: '2-digit' })

export default function SchedulePage() {
  const [orders, setOrders] = useState<WorkOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/admin/work-orders')
      .then(async r => {
        if (!r.ok) throw new Error(r.status === 401 ? 'Sessão expirada. Volte a entrar.' : 'Erro ao carregar a agenda.')
        return r.json()
      })
      .then(d => setOrders(d.workOrders ?? []))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  // Só trabalhos agendados, de hoje em diante, ainda não concluídos.
  const startOfToday = new Date().setHours(0, 0, 0, 0)
  const scheduled = orders
    .filter(o => o.scheduledAt && o.status !== 'completed' && o.status !== 'cancelled')
    .filter(o => new Date(o.scheduledAt as string).getTime() >= startOfToday)
    .sort((a, b) => new Date(a.scheduledAt as string).getTime() - new Date(b.scheduledAt as string).getTime())

  const byDay = scheduled.reduce<Record<string, WorkOrder[]>>((acc, o) => {
    const k = dayKey(o.scheduledAt as string)
    ;(acc[k] ??= []).push(o)
    return acc
  }, {})

  return (
    <div>
      <PageHeader
        supra="CRM Admin"
        title="Agenda"
        sub={loading ? 'A carregar…' : `${scheduled.length} trabalho(s) agendado(s) a partir de hoje`}
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {Array.from({ length: 3 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : scheduled.length === 0 ? (
        <div className="card-base">
          <EmptyState
            ico="📅"
            title="Sem trabalhos agendados"
            sub="As ordens de trabalho com data marcada aparecem aqui, agrupadas por dia."
            action={<Link href="/admin/work-orders" className="btn-primary" style={{ fontSize: 12, padding: '8px 16px' }}>Ver ordens de trabalho</Link>}
          />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          {Object.entries(byDay).map(([day, items]) => (
            <div key={day}>
              <div style={{ fontSize: 11, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--green)', fontWeight: 700, marginBottom: '0.75rem' }}>
                {formatDay(day)}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {items.map(o => (
                  <div key={o.id} className="card-base" style={{ padding: '1.1rem 1.25rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', borderLeft: '3px solid var(--forest)' }}>
                    <div style={{ minWidth: 56, textAlign: 'center' }}>
                      <div style={{ fontSize: 15, fontWeight: 900, color: 'var(--green)', fontFamily: 'var(--font-mono)' }}>
                        {formatTime(o.scheduledAt as string)}
                      </div>
                    </div>
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--silver2)', marginBottom: '0.2rem' }}>{o.title}</div>
                      <div style={{ fontSize: 11, color: 'var(--text2)' }}>
                        <span className="font-mono">{o.ref}</span>
                        {(o.companyName || o.clientName) && ` · 👥 ${o.companyName ?? o.clientName}`}
                      </div>
                      {o.description && (
                        <div style={{ fontSize: 11, color: 'var(--text2)', marginTop: 3 }}>{o.description}</div>
                      )}
                    </div>
                    <PriorityBadge priority={o.priority} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
