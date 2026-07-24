import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth-server'
import { getAllContracts } from '@/lib/queries/contracts'

export async function GET() {
  const session = await getSession()
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const contracts = await getAllContracts()
  return NextResponse.json({ contracts })
}
