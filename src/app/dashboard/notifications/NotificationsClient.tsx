'use client'
// ─── Notifications Client Component ───────────────────────────────────────
import { useState, useTransition } from 'react'
import { PageHeader, EmptyState, useToast } from '@/components/ui/shared'
import { markNotificationRead } from '@/lib/actions/admin'

type Notification = {
  id: number
  title: string
  body: string | null
  type: string
  isRead: boolean
  link: string | null
  createdAt: Date
}

const TYPE_ICONS: Record<string, string> = {
  info: 'ℹ',
  ticket: '🎫',
  repair: '🔧',
  invoice: '🧾',
  contract: '📋',
  alert: '⚠',
  success: '✓',
}

export function NotificationsClient({ notifications }: { notifications: Notification[] }) {
  const { show, ToastComponent } = useToast()
  const [isPending, startTransition] = useTransition()
  const [localRead, setLocalRead] = useState<Set<number>>(
    new Set(notifications.filter(n => n.isRead).map(n => n.id))
  )

  const unread = notifications.filter(n => !localRead.has(n.id))
  const read = notifications.filter(n => localRead.has(n.id))

  function handleMarkRead(id: number) {
    setLocalRead(prev => { const s = new Set(Array.from(prev)); s.add(id); return s })
    startTransition(async () => {
      const result = await markNotificationRead(id)
      if (result.error) {
        show(result.error, 'error')
        setLocalRead(prev => { const s = new Set(prev); s.delete(id); return s })
      }
    })
  }

  function markAllRead() {
    const unreadIds = unread.map(n => n.id)
    setLocalRead(prev => new Set(Array.from(prev).concat(unreadIds)))
    startTransition(async () => {
      await Promise.all(unreadIds.map(id => markNotificationRead(id)))
    })
  }

  if (notifications.length === 0) {
    return (
      <div>
        <PageHeader title="Notificações" sub="Atualizações sobre os seus serviços e contratos." />
        <EmptyState ico="🔔" title="Sem notificações" sub="Não tem notificações de momento." />
      </div>
    )
  }

  function NotifCard({ notif }: { notif: Notification }) {
    const isRead = localRead.has(notif.id)
    const ico = TYPE_ICONS[notif.type] ?? 'ℹ'
    return (
      <div className="card-base" style={{
        padding: '1rem 1.25rem',
        display: 'flex', gap: '1rem', alignItems: 'flex-start',
        background: isRead ? undefined : 'rgba(0,230,118,0.03)',
        borderLeft: isRead ? undefined : '2px solid rgba(0,230,118,0.4)',
        transition: 'all 0.3s',
      }}>
        <div style={{ fontSize: 22, flexShrink: 0, marginTop: 2, lineHeight: 1, color: isRead ? 'var(--slate)' : 'var(--green)' }}>{ico}</div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.2rem' }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--silver2)' }}>
              {notif.title}
              {!isRead && <span style={{ marginLeft: 8, fontSize: 9, padding: '1px 6px', background: 'rgba(0,230,118,0.2)', color: 'var(--green)', borderRadius: 10, fontWeight: 700 }}>NOVO</span>}
            </div>
            {!isRead && (
              <button onClick={() => handleMarkRead(notif.id)} disabled={isPending}
                style={{ fontSize: 10, padding: '3px 10px', borderRadius: 6, background: 'rgba(0,230,118,0.08)', border: '1px solid rgba(0,230,118,0.2)', color: 'var(--green)', cursor: 'pointer', flexShrink: 0, whiteSpace: 'nowrap' }}>
                Marcar como lido
              </button>
            )}
          </div>
          {notif.body && <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5 }}>{notif.body}</div>}
          <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: '0.35rem' }}>
            {new Date(notif.createdAt).toLocaleDateString('pt-AO')}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title="Notificações"
        sub={`${notifications.length} notificações · ${unread.length} não lidas`}
        action={unread.length > 0 ? (
          <button onClick={markAllRead} disabled={isPending}
            style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid var(--border)', background: 'none', color: 'var(--slate)', cursor: 'pointer', fontSize: 12 }}>
            Marcar todas como lidas
          </button>
        ) : undefined}
      />

      {unread.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontSize: 11, color: 'var(--slate)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            Não lidas ({unread.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {unread.map(n => <NotifCard key={n.id} notif={n} />)}
          </div>
        </div>
      )}

      {read.length > 0 && (
        <div>
          <div style={{ fontSize: 11, color: 'var(--slate)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            Lidas ({read.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {read.map(n => <NotifCard key={n.id} notif={n} />)}
          </div>
        </div>
      )}

      {ToastComponent}
    </div>
  )
}
