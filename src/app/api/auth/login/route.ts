import { NextRequest, NextResponse } from 'next/server'
import { loginWithCredentials } from '@/lib/auth-server'
import { clientIp, countRecent, recordEvent } from '@/lib/crm'

// Limite de tentativas falhadas, em janelas de 15 minutos.
// Por IP+email trava a adivinhação de uma senha; por IP trava a varredura de
// muitas contas. Só as falhas contam: quem entra à primeira não é afectado.
const WINDOW_MIN = 15
const MAX_PER_ACCOUNT = 8
const MAX_PER_IP = 40

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json({ error: 'Email e senha são obrigatórios.' }, { status: 400 })
    }

    const ip = await clientIp()
    const accountKey = `${ip}|${email.toLowerCase().trim()}`
    try {
      const [byAccount, byIp] = await Promise.all([
        countRecent('login', accountKey, WINDOW_MIN),
        countRecent('login-ip', ip, WINDOW_MIN),
      ])
      if (byAccount >= MAX_PER_ACCOUNT || byIp >= MAX_PER_IP) {
        return NextResponse.json(
          { error: `Demasiadas tentativas. Aguarde ${WINDOW_MIN} minutos e tente de novo.` },
          { status: 429, headers: { 'Retry-After': String(WINDOW_MIN * 60) } },
        )
      }
    } catch (rateErr) {
      // Tabela por criar (migração 0003): não impede o login.
      console.error('[rate] login:', rateErr)
    }

    const { user, error } = await loginWithCredentials(email, password)

    if (error || !user) {
      await Promise.all([recordEvent('login', accountKey), recordEvent('login-ip', ip)]).catch(() => {})
      return NextResponse.json({ error }, { status: 401 })
    }

    return NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    })
  } catch {
    return NextResponse.json({ error: 'Erro interno.' }, { status: 500 })
  }
}
