import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth-server'
import { getAllEquipment } from '@/lib/queries/equipment'

export async function GET() {
  const session = await getSession()
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const equipment = await getAllEquipment()
  return NextResponse.json({ equipment })
}
