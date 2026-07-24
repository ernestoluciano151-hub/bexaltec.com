'use client'
// ─── Profile Client Component ──────────────────────────────────────────────
import { useState, useTransition } from 'react'
import { PageHeader, Modal, FormField, useToast } from '@/components/ui/shared'
import { updateProfile, changePassword } from '@/lib/actions/profile'

type Profile = {
  id: number
  name: string
  email: string
  phone: string | null
  avatarUrl: string | null
  role: 'client' | 'admin' | 'technician'
  isActive: boolean
  lastLoginAt: Date | null
  createdAt: Date
  companyId: number | null
  companyName: string | null
  companyNif: string | null
}

const ROLE_LABELS: Record<string, string> = {
  client: 'Cliente', admin: 'Administrador', technician: 'Técnico',
}

export function ProfileClient({ profile }: { profile: Profile }) {
  const { show, ToastComponent } = useToast()
  const [isPending, startTransition] = useTransition()

  // Edit profile modal
  const [showEdit, setShowEdit] = useState(false)
  const [editName, setEditName] = useState(profile.name)
  const [editPhone, setEditPhone] = useState(profile.phone ?? '')

  // Change password modal
  const [showPwd, setShowPwd] = useState(false)
  const [currentPwd, setCurrentPwd] = useState('')
  const [newPwd, setNewPwd] = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')

  function handleUpdateProfile() {
    if (!editName.trim()) return
    startTransition(async () => {
      const result = await updateProfile({ name: editName, phone: editPhone || undefined })
      if (result.error) {
        show(result.error, 'error')
      } else {
        show('Perfil atualizado com sucesso!', 'success')
        setShowEdit(false)
      }
    })
  }

  function handleChangePassword() {
    if (newPwd !== confirmPwd) {
      show('As senhas não coincidem.', 'error')
      return
    }
    if (newPwd.length < 8) {
      show('A nova senha deve ter pelo menos 8 caracteres.', 'error')
      return
    }
    startTransition(async () => {
      const result = await changePassword(currentPwd, newPwd)
      if (result.error) {
        show(result.error, 'error')
      } else {
        show('Senha alterada com sucesso!', 'success')
        setShowPwd(false)
        setCurrentPwd(''); setNewPwd(''); setConfirmPwd('')
      }
    })
  }

  const initials = profile.name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()

  return (
    <div>
      <PageHeader
        title="O Meu Perfil"
        sub="Gerir as suas informações pessoais e segurança da conta."
        action={
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={() => setShowEdit(true)} className="btn-primary" style={{ fontSize: 13 }}>
              Editar Perfil
            </button>
            <button onClick={() => setShowPwd(true)}
              style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid var(--border)', background: 'none', color: 'var(--slate)', cursor: 'pointer', fontSize: 13 }}>
              Alterar Senha
            </button>
          </div>
        }
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '1.5rem' }}>
        {/* Avatar + basic info */}
        <div className="card-base" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          {profile.avatarUrl ? (
            <img src={profile.avatarUrl} alt={profile.name}
              style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover', marginBottom: '1rem', border: '2px solid var(--border-g)' }} />
          ) : (
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(0,230,118,0.15)', border: '2px solid rgba(0,230,118,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <span className="font-rajdhani font-black" style={{ fontSize: 28, color: 'var(--green)' }}>{initials}</span>
            </div>
          )}
          <div className="font-rajdhani font-bold" style={{ fontSize: 20, color: 'var(--text)', marginBottom: '0.25rem' }}>{profile.name}</div>
          <div style={{ fontSize: 13, color: 'var(--slate)', marginBottom: '0.5rem' }}>{profile.email}</div>
          <span className="badge badge-blue">{ROLE_LABELS[profile.role] ?? profile.role}</span>
          <div style={{ marginTop: '1rem', fontSize: 12, color: 'var(--slate)' }}>
            <span className={`badge ${profile.isActive ? 'badge-green' : 'badge-red'}`}>{profile.isActive ? 'Conta Ativa' : 'Conta Inativa'}</span>
          </div>
        </div>

        {/* Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="card-base" style={{ padding: '1.5rem' }}>
            <div className="font-rajdhani font-semibold" style={{ fontSize: 16, color: 'var(--text)', marginBottom: '1rem' }}>Informações Pessoais</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {[
                ['Nome completo', profile.name],
                ['Email', profile.email],
                ['Telefone', profile.phone ?? '—'],
                ['Função', ROLE_LABELS[profile.role] ?? profile.role],
              ].map(([k, v]) => (
                <div key={k} style={{ padding: '0.75rem', background: 'rgba(13,31,58,0.5)', borderRadius: 8, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 10, color: 'var(--slate)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 2 }}>{k}</div>
                  <div style={{ fontSize: 13, color: 'var(--silver2)' }}>{v}</div>
                </div>
              ))}
            </div>
          </div>

          {profile.companyName && (
            <div className="card-base" style={{ padding: '1.5rem' }}>
              <div className="font-rajdhani font-semibold" style={{ fontSize: 16, color: 'var(--text)', marginBottom: '1rem' }}>Empresa</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {[
                  ['Nome da Empresa', profile.companyName],
                  ['NIF', profile.companyNif ?? '—'],
                ].map(([k, v]) => (
                  <div key={k} style={{ padding: '0.75rem', background: 'rgba(13,31,58,0.5)', borderRadius: 8, border: '1px solid var(--border)' }}>
                    <div style={{ fontSize: 10, color: 'var(--slate)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 2 }}>{k}</div>
                    <div style={{ fontSize: 13, color: 'var(--silver2)' }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="card-base" style={{ padding: '1.5rem' }}>
            <div className="font-rajdhani font-semibold" style={{ fontSize: 16, color: 'var(--text)', marginBottom: '1rem' }}>Atividade da Conta</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              {[
                ['Membro desde', new Date(profile.createdAt).toLocaleDateString('pt-AO')],
                ['Último acesso', profile.lastLoginAt ? new Date(profile.lastLoginAt).toLocaleDateString('pt-AO') : '—'],
              ].map(([k, v]) => (
                <div key={k} style={{ padding: '0.75rem', background: 'rgba(13,31,58,0.5)', borderRadius: 8, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 10, color: 'var(--slate)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 2 }}>{k}</div>
                  <div style={{ fontSize: 13, color: 'var(--silver2)' }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal open={showEdit} onClose={() => setShowEdit(false)} title="Editar Perfil" subtitle="Atualize as suas informações pessoais.">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <FormField label="Nome completo" required>
            <input className="input-field" value={editName} onChange={e => setEditName(e.target.value)} placeholder="O seu nome completo" />
          </FormField>
          <FormField label="Telefone">
            <input className="input-field" value={editPhone} onChange={e => setEditPhone(e.target.value)} placeholder="+244 9XX XXX XXX" />
          </FormField>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button onClick={() => setShowEdit(false)}
              style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid var(--border)', background: 'none', color: 'var(--slate)', cursor: 'pointer', fontSize: 13 }}>
              Cancelar
            </button>
            <button onClick={handleUpdateProfile} disabled={isPending} className="btn-primary"
              style={{ fontSize: 13, opacity: isPending ? 0.6 : 1 }}>
              {isPending ? 'A guardar...' : 'Guardar Alterações'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Change Password Modal */}
      <Modal open={showPwd} onClose={() => setShowPwd(false)} title="Alterar Senha" subtitle="Introduza a sua senha atual e defina uma nova.">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <FormField label="Senha Atual" required>
            <input className="input-field" type="password" value={currentPwd} onChange={e => setCurrentPwd(e.target.value)} placeholder="Senha atual" autoComplete="current-password" />
          </FormField>
          <FormField label="Nova Senha" required>
            <input className="input-field" type="password" value={newPwd} onChange={e => setNewPwd(e.target.value)} placeholder="Mínimo 8 caracteres" autoComplete="new-password" />
          </FormField>
          <FormField label="Confirmar Nova Senha" required>
            <input className="input-field" type="password" value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)} placeholder="Repita a nova senha" autoComplete="new-password" />
          </FormField>
          {newPwd && confirmPwd && newPwd !== confirmPwd && (
            <div style={{ fontSize: 12, color: '#ef4444' }}>As senhas não coincidem.</div>
          )}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
            <button onClick={() => setShowPwd(false)}
              style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid var(--border)', background: 'none', color: 'var(--slate)', cursor: 'pointer', fontSize: 13 }}>
              Cancelar
            </button>
            <button onClick={handleChangePassword} disabled={isPending || !currentPwd || !newPwd || !confirmPwd} className="btn-primary"
              style={{ fontSize: 13, opacity: (isPending || !currentPwd || !newPwd || !confirmPwd) ? 0.6 : 1 }}>
              {isPending ? 'A alterar...' : 'Alterar Senha'}
            </button>
          </div>
        </div>
      </Modal>

      {ToastComponent}
    </div>
  )
}
