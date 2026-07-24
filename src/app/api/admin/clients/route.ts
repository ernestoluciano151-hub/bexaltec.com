import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth-server'
import { getAllClients } from '@/lib/queries/clients'

export async function GET() {
  const session = await getSession()
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const clients = await getAllClients()
  return NextResponse.json({ clients })
}
