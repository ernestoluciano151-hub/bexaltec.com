import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth-server'
import { getAllRepairs } from '@/lib/queries/repairs'

export async function GET() {
  const session = await getSession()
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const repairs = await getAllRepairs()
  return NextResponse.json({ repairs })
}
