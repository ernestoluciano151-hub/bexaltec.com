import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth-server'
import { getClientEquipment } from '@/lib/queries/equipment'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const equipment = await getClientEquipment(session.id)
  return NextResponse.json({ equipment })
}
