// ─── Notifications Page — Server Component + Client wrapper ───────────────
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth-server'
import { getUserNotifications } from '@/lib/queries/dashboard'
import { NotificationsClient } from './NotificationsClient'

export default async function NotificationsPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const notifications = await getUserNotifications(session.id)

  return <NotificationsClient notifications={notifications} />
}
