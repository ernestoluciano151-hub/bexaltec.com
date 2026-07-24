// ─── Profile Page — Server Component + Client wrapper ─────────────────────
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth-server'
import { getUserProfile } from '@/lib/queries/users'
import { ProfileClient } from './ProfileClient'

export default async function ProfilePage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const profile = await getUserProfile(session.id)
  if (!profile) redirect('/login')

  return <ProfileClient profile={profile} />
}
