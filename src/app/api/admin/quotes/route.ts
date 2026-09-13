import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth-server'
import { getAllQuotes } from '@/lib/queries/quotes'

export async function GET() {
  const session = await getSession()
  if (!session || session.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const quotes = await getAllQuotes()
  return NextResponse.json({ quotes })
}
