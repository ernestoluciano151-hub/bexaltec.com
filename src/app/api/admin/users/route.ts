import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth-server'
import { getAllUsers } from '@/lib/queries/users'

export async function GET() {
  const session = await getSession()
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const users = await getAllUsers()
  return NextResponse.json({ users })
}
