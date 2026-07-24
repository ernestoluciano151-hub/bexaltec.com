import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth-server'
import { getAllParts, getLowStockParts } from '@/lib/queries/parts'

export async function GET() {
  const session = await getSession()
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const [parts, lowStock] = await Promise.all([getAllParts(), getLowStockParts()])
  return NextResponse.json({ parts, lowStock })
}
