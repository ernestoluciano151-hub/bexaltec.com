import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth-server'
import { getUserNotifications } from '@/lib/queries/dashboard'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const notifications = await getUserNotifications(session.id)
  return NextResponse.json({ notifications })
}
