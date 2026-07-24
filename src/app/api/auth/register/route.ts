import { NextRequest, NextResponse } from 'next/server'
import { registerUser } from '@/lib/auth-server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { name, email, password, company, phone } = body

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Campos obrigatórios em falta.' }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'A senha deve ter pelo menos 8 caracteres.' }, { status: 400 })
    }

    const { user, error } = await registerUser({ name, email, password, company, phone })

    if (error || !user) {
      return NextResponse.json({ error }, { status: 400 })
    }

    return NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}
