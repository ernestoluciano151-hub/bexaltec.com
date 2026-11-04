import { NextRequest, NextResponse } from 'next/server'
import { registerUser } from '@/lib/auth-server'
import { clientIp, withinLimit } from '@/lib/crm'

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

    // No máximo 5 contas novas por hora a partir do mesmo IP.
    if (!(await withinLimit('register', await clientIp(), 5, 60))) {
      return NextResponse.json({ error: 'Demasiados registos a partir desta ligação. Tente mais tarde.' }, { status: 429 })
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
