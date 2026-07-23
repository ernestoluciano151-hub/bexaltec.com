'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BexaltecLogo } from '@/components/Logo'
import { login, loginDemo, loginAdmin, getUser } from '@/lib/auth'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const user = getUser()
    if (user) router.push(user.role === 'admin' ? '/admin' : '/dashboard')
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true); setError('')
    const { user, error: err } = await login(email, password)
    setLoading(false)
    if (err) { setError(err); return }
    router.push(user?.role === 'admin' ? '/admin' : '/dashboard')
  }

  const handleDemo = () => { loginDemo(); router.push('/dashboard') }
  const handleAdminDemo = () => { loginAdmin(); router.push('/admin') }

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
          <div className="badge-red mb-4 p-3 rounded-lg text-sm w-full text-center" style={{ background: 'rgba(239,83,80,0.08)', border: '1px solid rgba(239,83,80,0.25)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label style={{ fontSize: 11, color: 'var(--silver)', letterSpacing: '0.5px', display: 'block', marginBottom: '0.35rem' }}>EMAIL</label>
            <input type="email" className="input-field" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="email@empresa.ao" required autoFocus />
          </div>
          <div>
            <label style={{ fontSize: 11, color: 'var(--silver)', letterSpacing: '0.5px', display: 'block', marginBottom: '0.35rem' }}>SENHA</label>
            <input type="password" className="input-field" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" required />
          </div>
          <div className="flex justify-end">
            <button type="button" style={{ fontSize: 11, color: 'var(--slate)', background: 'none', border: 'none', cursor: 'pointer' }}>
              Esqueceu a senha?
            </button>
          </div>
          <button type="submit" disabled={loading} className="btn-primary justify-center w-full" style={{ padding: '13px', fontSize: 14 }}>
            {loading ? 'Entrando...' : 'Entrar ↗'}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin: '1.5rem 0' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          <span style={{ fontSize: 11, color: 'var(--slate)' }}>ou acesso rápido</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>

        {/* Demo buttons */}
        <div className="flex gap-2">
          <button onClick={handleDemo} className="btn-secondary flex-1 justify-center text-xs py-2">
            🧑‍💼 Demo Cliente
          </button>
          <button onClick={handleAdminDemo} className="btn-secondary flex-1 justify-center text-xs py-2">
            ⚙️ Demo Admin
          </button>
        </div>

        <p style={{ fontSize: 12, color: 'var(--slate)', textAlign: 'center', marginTop: '1.5rem' }}>
          Não tem conta?{' '}
          <Link href="/register" style={{ color: 'var(--green)', textDecoration: 'none' }}>Registar empresa</Link>
        </p>
      </div>

      <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: '1.5rem', letterSpacing: 2 }}>
        BEXALTEC · LUANDA, ANGOLA
      </p>
    </div>
  )
}
