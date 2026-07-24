// ─── Equipment Page — Server Component ────────────────────────────────────
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth-server'
import { getClientEquipment } from '@/lib/queries/equipment'
import { PageHeader, StatusBadge, EmptyState } from '@/components/ui/shared'

export default async function EquipmentPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const items = await getClientEquipment(session.id)

  return (
    <div>
      <PageHeader
        title="Equipamentos"
        sub={`${items.length} equipamentos registados na sua conta.`}
      />

      {items.length === 0 ? (
        <EmptyState ico="💻" title="Sem equipamentos" sub="Não tem equipamentos registados na sua conta." />
      ) : (
        <div className="card-base" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Nome', 'S/N', 'Categoria', 'Marca / Modelo', 'Localização', 'Estado', 'Garantia até', 'Comprado em'].map(h => (
                    <th key={h} style={{ padding: '0.85rem 1rem', textAlign: 'left', fontSize: 10, color: 'var(--slate)', letterSpacing: 1, textTransform: 'uppercase', fontWeight: 600, whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--silver2)' }}>{item.name}</div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      {item.serial
                        ? <span className="font-mono" style={{ fontSize: 11, color: 'var(--slate)' }}>{item.serial}</span>
                        : <span style={{ color: 'var(--muted)' }}>—</span>}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontSize: 12, color: 'var(--text2)' }}>{item.category ?? '—'}</td>
                    <td style={{ padding: '0.85rem 1rem', fontSize: 12, color: 'var(--text2)' }}>
                      {[item.brand, item.model].filter(Boolean).join(' / ') || '—'}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontSize: 12, color: 'var(--text2)' }}>{item.location ?? '—'}</td>
                    <td style={{ padding: '0.85rem 1rem' }}><StatusBadge status={item.status} /></td>
                    <td style={{ padding: '0.85rem 1rem', fontSize: 12, color: 'var(--text2)', whiteSpace: 'nowrap' }}>
                      {item.warrantyUntil ? new Date(item.warrantyUntil).toLocaleDateString('pt-AO') : '—'}
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontSize: 12, color: 'var(--text2)', whiteSpace: 'nowrap' }}>
                      {item.purchasedAt ? new Date(item.purchasedAt).toLocaleDateString('pt-AO') : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
