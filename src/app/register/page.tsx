'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BexaltecLogo } from '@/components/Logo'
export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', company: '', phone: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (key: string, val: string) => setForm(f => ({ ...f, [key]: val }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirm) { setError('As senhas não coincidem.'); return }
    if (form.password.length < 8) { setError('A senha deve ter pelo menos 8 caracteres.'); return }
    setLoading(true); setError('')

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password, company: form.company, phone: form.phone }),
      })
      const data = await res.json()
      setLoading(false)
      if (!res.ok) { setError(data.error ?? 'Erro ao criar conta.'); return }
      router.push('/dashboard')
      router.refresh()
    } catch {
      setError('Erro de ligação. Tente novamente.')
      setLoading(false)
    }
  }

  const fields = [
    { key: 'name', label: 'NOME COMPLETO *', placeholder: 'João Manuel Silva', type: 'text' },
    { key: 'company', label: 'EMPRESA / ORGANIZAÇÃO *', placeholder: 'Nome da empresa', type: 'text' },
    { key: 'email', label: 'EMAIL CORPORATIVO *', placeholder: 'email@empresa.ao', type: 'email' },
    { key: 'phone', label: 'TELEFONE / WHATSAPP', placeholder: '+244 9XX XXX XXX', type: 'tel' },
    { key: 'password', label: 'SENHA *', placeholder: 'Mínimo 6 caracteres', type: 'password' },
    { key: 'confirm', label: 'CONFIRMAR SENHA *', placeholder: '••••••••', type: 'password' },
  ]

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 py-12"
      style={{ background: 'radial-gradient(ellipse at 70% 30%, rgba(0,230,118,0.05) 0%, transparent 50%), var(--navy)' }}>

      <Link href="/" className="mb-8 hover:opacity-80 transition-opacity">
        <BexaltecLogo size={36} />
      </Link>

      <div className="card-base w-full max-w-md p-8">
        <div className="font-rajdhani font-black text-2xl tracking-wide mb-1" style={{ color: 'var(--text)' }}>
          Registar Empresa
        </div>
        <p style={{ fontSize: 13, color: 'var(--slate)', marginBottom: '2rem' }}>
          Crie a sua conta e acesse os nossos serviços
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-lg text-sm text-center" style={{ background: 'rgba(239,83,80,0.08)', border: '1px solid rgba(239,83,80,0.25)', color: '#EF5350' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {fields.map(f => (
            <div key={f.key}>
              <label style={{ fontSize: 11, color: 'var(--silver)', letterSpacing: '0.5px', display: 'block', marginBottom: '0.35rem' }}>{f.label}</label>
              <input
                type={f.type} className="input-field"
                value={form[f.key as keyof typeof form]}
                onChange={e => handleChange(f.key, e.target.value)}
                placeholder={f.placeholder}
                required={f.label.includes('*')}
              />
            </div>
          ))}

          <div style={{ fontSize: 11, color: 'var(--slate)', lineHeight: 1.6, padding: '0.75rem', background: 'rgba(0,230,118,0.05)', border: '1px solid var(--border-g)', borderRadius: 8 }}>
            Ao criar conta, aceita os nossos <span style={{ color: 'var(--green)' }}>Termos de Serviço</span> e <span style={{ color: 'var(--green)' }}>Política de Privacidade</span>.
          </div>

          <button type="submit" disabled={loading} className="btn-primary justify-center w-full" style={{ padding: '13px', fontSize: 14 }}>
            {loading ? 'Criando conta...' : 'Criar Conta ↗'}
          </button>
        </form>

        <p style={{ fontSize: 12, color: 'var(--slate)', textAlign: 'center', marginTop: '1.5rem' }}>
          Já tem conta?{' '}
          <Link href="/login" style={{ color: 'var(--green)', textDecoration: 'none' }}>Entrar</Link>
        </p>
      </div>

      <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: '1.5rem', letterSpacing: 2 }}>
        BEXALTEC · LUANDA, ANGOLA
      </p>
    </div>
  )
}
