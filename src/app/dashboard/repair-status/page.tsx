// ─── Repair Status Page — Server Component + Client wrapper ───────────────
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth-server'
import { getClientRepairs } from '@/lib/queries/repairs'
import { RepairsClient } from './RepairsClient'

export default async function RepairStatusPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const repairs = await getClientRepairs(session.id)

  return <RepairsClient repairs={repairs} />
}
