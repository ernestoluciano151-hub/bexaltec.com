'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BexaltecLogo } from '@/components/Logo'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Email ou senha inválidos.')
        setLoading(false)
        return
      }

      // Redirect based on role (cookie already set by API)
      router.push(data.user.role === 'admin' ? '/admin' : '/dashboard')
      router.refresh()
    } catch {
      setError('Erro de ligação. Tente novamente.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{ background: 'radial-gradient(ellipse at 30% 40%, rgba(0,230,118,0.05) 0%, transparent 50%), var(--navy)' }}>

      <Link href="/" className="mb-8 hover:opacity-80 transition-opacity">
        <BexaltecLogo size={36} />
      </Link>

      <div className="card-base w-full max-w-md p-8">
        <div className="font-rajdhani font-black text-2xl tracking-wide mb-1" style={{ color: 'var(--text)' }}>
          Portal do Cliente
        </div>
        <p style={{ fontSize: 13, color: 'var(--slate)', marginBottom: '2rem' }}>
          Aceda à sua área de cliente Bexaltec
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-lg text-sm w-full text-center"
            style={{ background: 'rgba(239,83,80,0.08)', border: '1px solid rgba(239,83,80,0.25)', color: '#EF5350' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label style={{ fontSize: 11, color: 'var(--silver)', letterSpacing: '0.5px', display: 'block', marginBottom: '0.35rem' }}>
              EMAIL
            </label>
            <input
              type="email"
              className="input-field"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="email@empresa.ao"
              required autoFocus
            />
          </div>
          <div>
            <label style={{ fontSize: 11, color: 'var(--silver)', letterSpacing: '0.5px', display: 'block', marginBottom: '0.35rem' }}>
              SENHA
            </label>
            <input
              type="password"
              className="input-field"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={8}
            />
          </div>
          <div className="flex justify-end">
            <button type="button" style={{ fontSize: 11, color: 'var(--slate)', background: 'none', border: 'none', cursor: 'pointer' }}>
              Esqueceu a senha?
            </button>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary justify-center w-full"
            style={{ padding: '13px', fontSize: 14 }}
          >
            {loading ? 'Entrando...' : 'Entrar ↗'}
          </button>
        </form>

        <p style={{ fontSize: 12, color: 'var(--slate)', textAlign: 'center', marginTop: '1.5rem' }}>
          Não tem conta?{' '}
          <Link href="/register" style={{ color: 'var(--green)', textDecoration: 'none' }}>
            Registar empresa
          </Link>
        </p>
      </div>

      <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: '1.5rem', letterSpacing: 2 }}>
        BEXALTEC · LUANDA, ANGOLA
      </p>
    </div>
  )
}
