import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth-server'
import { getAdminDashboard } from '@/lib/queries/dashboard'
import { getAllTickets } from '@/lib/queries/tickets'
import { getAllWorkOrders } from '@/lib/queries/workOrders'

export async function GET() {
  const session = await getSession()
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const [kpis, tickets, workOrders] = await Promise.all([
    getAdminDashboard(),
    getAllTickets(),
    getAllWorkOrders(),
  ])
  return NextResponse.json({ kpis, tickets, workOrders })
}
