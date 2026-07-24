import { NextRequest, NextResponse } from 'next/server'
import { loginWithCredentials } from '@/lib/auth-server'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email e senha são obrigatórios.' }, { status: 400 })
    }

    const { user, error } = await loginWithCredentials(email, password)

    if (error || !user) {
      return NextResponse.json({ error }, { status: 401 })
    }

    return NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    })
  } catch {
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}
