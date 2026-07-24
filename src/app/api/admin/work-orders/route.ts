import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth-server'
import { getAllWorkOrders } from '@/lib/queries/workOrders'

export async function GET() {
  const session = await getSession()
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const workOrders = await getAllWorkOrders()
  return NextResponse.json({ workOrders })
}
