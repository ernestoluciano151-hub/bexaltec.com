'use client'
// ─── Repairs Client Component ──────────────────────────────────────────────
import { useState } from 'react'
import { PageHeader, SearchBar, StatusBadge, PriorityBadge, EmptyState } from '@/components/ui/shared'

type Repair = {
  id: number
  ref: string
  deviceName: string
  brand: string | null
  model: string | null
  issue: string
  status: 'intake' | 'diagnosis' | 'waiting_parts' | 'in_repair' | 'testing' | 'ready' | 'delivered' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'critical'
  entryDate: Date
  eta: Date | null
  totalCost: string | null
}

const STAGES = ['intake', 'diagnosis', 'waiting_parts', 'in_repair', 'testing', 'ready', 'delivered'] as const
const STAGE_LABELS: Record<string, string> = {
  intake: 'Entrada', diagnosis: 'Diagnóstico', waiting_parts: 'Peças',
  in_repair: 'Reparação', testing: 'Teste', ready: 'Pronto', delivered: 'Entregue',
}

function getStageProgress(status: string): number {
  const idx = STAGES.indexOf(status as any)
  if (idx === -1) return 0
  return Math.round(((idx + 1) / STAGES.length) * 100)
}

function getProgressColor(status: string): string {
  if (status === 'delivered') return '#90A4AE'
  if (status === 'ready') return '#00E676'
  if (status === 'cancelled') return '#ef4444'
  if (status === 'testing') return '#42A5F5'
  if (status === 'in_repair') return '#42A5F5'
  if (status === 'waiting_parts') return '#CE93D8'
  return '#FFC107'
}

export function RepairsClient({ repairs }: { repairs: Repair[] }) {
  const [search, setSearch] = useState('')

  const filtered = repairs.filter(r =>
    !search ||
    r.ref.toLowerCase().includes(search.toLowerCase()) ||
    r.deviceName.toLowerCase().includes(search.toLowerCase()) ||
    (r.brand ?? '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <PageHeader
        title="Estado das Reparações"
        sub="Acompanhe em tempo real o estado das suas reparações no laboratório."
      />

      <div style={{ marginBottom: '1.5rem' }}>
        <SearchBar value={search} onChange={setSearch} placeholder="Pesquisar reparações..." />
      </div>

      {filtered.length === 0 ? (
        <EmptyState ico="🔧" title="Sem reparações" sub={repairs.length === 0 ? 'Não tem reparações registadas.' : 'Nenhuma reparação corresponde à pesquisa.'} />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filtered.map(repair => {
            const progress = getStageProgress(repair.status)
            const color = getProgressColor(repair.status)
            const currentStageIdx = STAGES.indexOf(repair.status as any)

            return (
              <div key={repair.id} className="card-base" style={{ padding: '1.5rem' }}>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <div className="font-mono" style={{ fontSize: 11, color: 'var(--green)', marginBottom: '0.25rem' }}>{repair.ref}</div>
                    <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--silver2)' }}>{repair.deviceName}</div>
                    {(repair.brand || repair.model) && (
                      <div style={{ fontSize: 12, color: 'var(--slate)', marginTop: 2 }}>{[repair.brand, repair.model].filter(Boolean).join(' · ')}</div>
                    )}
                    <div style={{ fontSize: 12, color: 'var(--text2)', marginTop: 4 }}>{repair.issue}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.35rem' }}>
                    <StatusBadge status={repair.status} />
                    <PriorityBadge priority={repair.priority} />
                  </div>
                </div>

                {/* Stage timeline */}
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    {STAGES.filter(s => s !== 'delivered').map((stage, i) => (
                      <div key={stage} style={{ textAlign: 'center', flex: 1 }}>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', margin: '0 auto 4px',
                          background: i <= currentStageIdx ? color : 'var(--border)',
                          border: `2px solid ${i === currentStageIdx ? color : 'transparent'}`,
                          boxShadow: i === currentStageIdx ? `0 0 8px ${color}` : 'none',
                          transition: 'all 0.3s' }} />
                        <div style={{ fontSize: 9, color: i <= currentStageIdx ? 'var(--silver)' : 'var(--slate)', lineHeight: 1.2 }}>
                          {STAGE_LABELS[stage]}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div style={{ height: 4, background: 'var(--border)', borderRadius: 4 }}>
                    <div style={{ width: `${progress}%`, height: '100%', background: color, borderRadius: 4, transition: 'width 0.5s' }} />
                  </div>
                </div>

                {/* Footer info */}
                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ fontSize: 10, color: 'var(--slate)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 }}>Entrada</div>
                    <div style={{ fontSize: 12, color: 'var(--silver2)' }}>{new Date(repair.entryDate).toLocaleDateString('pt-AO')}</div>
                  </div>
                  {repair.eta && (
                    <div>
                      <div style={{ fontSize: 10, color: 'var(--slate)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 }}>ETA</div>
                      <div style={{ fontSize: 12, color: 'var(--silver2)' }}>{new Date(repair.eta).toLocaleDateString('pt-AO')}</div>
                    </div>
                  )}
                  {repair.totalCost && (
                    <div>
                      <div style={{ fontSize: 10, color: 'var(--slate)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 }}>Custo Estimado</div>
                      <div style={{ fontSize: 12, color: 'var(--green)' }}>{Number(repair.totalCost).toLocaleString('pt-AO')} Kz</div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
