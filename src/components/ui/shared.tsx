'use client'
// ─── Shared UI Components — Bexaltec ─────────────────────────────────────
// StatusBadge, StatCard, EmptyState, Skeleton, Modal, Toast, DataTable
// All use CSS variables from globals.css — no Tailwind dependency.

import React, { useState, useEffect, useCallback } from 'react'

// ── Type helpers ──────────────────────────────────────────────────────────
type TicketStatus = 'open' | 'in_progress' | 'waiting' | 'resolved' | 'closed'
type RepairStatus = 'intake' | 'diagnosis' | 'waiting_parts' | 'in_repair' | 'testing' | 'ready' | 'delivered' | 'cancelled'
type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
type WoStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled'
type Priority = 'low' | 'medium' | 'high' | 'critical'
type EquipStatus = 'active' | 'warranty' | 'repair' | 'retired'

// ── StatusBadge ───────────────────────────────────────────────────────────
const STATUS_MAP: Record<string, { cls: string; label: string }> = {
  // Ticket
  open:          { cls: 'badge-yellow',  label: 'Aberto' },
  in_progress:   { cls: 'badge-blue',    label: 'Em Progresso' },
  waiting:       { cls: 'badge-gray',    label: 'Aguardando' },
  resolved:      { cls: 'badge-green',   label: 'Resolvido' },
  closed:        { cls: 'badge-gray',    label: 'Fechado' },
  // Repair
  intake:        { cls: 'badge-yellow',  label: 'Entrada' },
  diagnosis:     { cls: 'badge-blue',    label: 'Diagnóstico' },
  waiting_parts: { cls: 'badge-yellow',  label: 'Aguarda Peças' },
  in_repair:     { cls: 'badge-blue',    label: 'Em Reparação' },
  testing:       { cls: 'badge-blue',    label: 'A Testar' },
  ready:         { cls: 'badge-green',   label: 'Pronto' },
  delivered:     { cls: 'badge-gray',    label: 'Entregue' },
  cancelled:     { cls: 'badge-red',     label: 'Cancelado' },
  // Invoice
  draft:         { cls: 'badge-gray',    label: 'Rascunho' },
  sent:          { cls: 'badge-yellow',  label: 'Enviada' },
  paid:          { cls: 'badge-green',   label: 'Paga' },
  overdue:       { cls: 'badge-red',     label: 'Em Atraso' },
  // Work order
  pending:       { cls: 'badge-yellow',  label: 'Pendente' },
  completed:     { cls: 'badge-green',   label: 'Concluída' },
  // Equipment
  active:        { cls: 'badge-green',   label: 'Ativo' },
  warranty:      { cls: 'badge-blue',    label: 'Garantia' },
  repair:        { cls: 'badge-yellow',  label: 'Reparação' },
  retired:       { cls: 'badge-gray',    label: 'Retirado' },
}

const PRIORITY_MAP: Record<Priority, { cls: string; label: string }> = {
  low:      { cls: 'badge-gray',   label: 'Baixa' },
  medium:   { cls: 'badge-blue',   label: 'Média' },
  high:     { cls: 'badge-yellow', label: 'Alta' },
  critical: { cls: 'badge-red',    label: 'Crítica' },
}

export function StatusBadge({ status }: { status: string }) {
  const s = STATUS_MAP[status] ?? { cls: 'badge-gray', label: status }
  return <span className={`badge ${s.cls}`}>{s.label}</span>
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  const p = PRIORITY_MAP[priority] ?? { cls: 'badge-gray', label: priority }
  return <span className={`badge ${p.cls}`}>{p.label}</span>
}

// ── StatCard ──────────────────────────────────────────────────────────────
export function StatCard({
  ico, label, value, sub, color = 'var(--green)',
}: {
  ico: string; label: string; value: string | number; sub?: string; color?: string
}) {
  return (
    <div className="card-base" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 11, color: 'var(--slate)', letterSpacing: 1, textTransform: 'uppercase', marginBottom: '0.5rem' }}>{label}</div>
          <div className="font-rajdhani font-black" style={{ fontSize: 34, color, lineHeight: 1 }}>{value}</div>
          {sub && <div style={{ fontSize: 11, color: 'var(--slate)', marginTop: '0.25rem' }}>{sub}</div>}
        </div>
        <div style={{ fontSize: 22, opacity: 0.6 }}>{ico}</div>
      </div>
    </div>
  )
}

// ── Skeleton ──────────────────────────────────────────────────────────────
export function Skeleton({ height = 20, width = '100%', style }: { height?: number; width?: number | string; style?: React.CSSProperties }) {
  return (
    <div style={{
      height, width, borderRadius: 6,
      background: 'linear-gradient(90deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 100%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.5s infinite',
      ...style,
    }} />
  )
}

export function CardSkeleton() {
  return (
    <div className="card-base" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <Skeleton height={14} width="60%" />
      <Skeleton height={28} width="40%" />
      <Skeleton height={12} width="80%" />
    </div>
  )
}

export function TableRowSkeleton({ cols = 4 }: { cols?: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} style={{ padding: '0.85rem 1rem' }}>
          <Skeleton height={14} width={i === 0 ? '70%' : '50%'} />
        </td>
      ))}
    </tr>
  )
}

// ── EmptyState ────────────────────────────────────────────────────────────
export function EmptyState({
  ico = '📭', title, sub, action,
}: {
  ico?: string; title: string; sub?: string; action?: React.ReactNode
}) {
  return (
    <div style={{ textAlign: 'center', padding: '3rem 2rem', color: 'var(--slate)' }}>
      <div style={{ fontSize: 40, marginBottom: '0.75rem', opacity: 0.5 }}>{ico}</div>
      <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--silver2)', marginBottom: '0.4rem' }}>{title}</div>
      {sub && <div style={{ fontSize: 13, marginBottom: '1.25rem' }}>{sub}</div>}
      {action}
    </div>
  )
}

// ── Modal ─────────────────────────────────────────────────────────────────
export function Modal({
  open, onClose, title, subtitle, children, maxWidth = 520,
}: {
  open: boolean; onClose: () => void; title: string; subtitle?: string; children: React.ReactNode; maxWidth?: number
}) {
  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(6,16,30,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
      onClick={onClose}
    >
      <div
        className="card-base"
        style={{ width: '100%', maxWidth, padding: '2rem', position: 'relative' }}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--slate)', fontSize: 18, cursor: 'pointer', lineHeight: 1 }}
        >✕</button>
        <div className="font-rajdhani font-black" style={{ fontSize: 22, color: 'var(--text)', marginBottom: subtitle ? '0.25rem' : '1.5rem' }}>{title}</div>
        {subtitle && <p style={{ fontSize: 12, color: 'var(--slate)', marginBottom: '1.5rem' }}>{subtitle}</p>}
        {children}
      </div>
    </div>
  )
}

// ── Toast ─────────────────────────────────────────────────────────────────
type ToastType = 'success' | 'error' | 'info'

export function useToast() {
  const [toast, setToast] = useState<{ msg: string; type: ToastType } | null>(null)

  const show = useCallback((msg: string, type: ToastType = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }, [])

  const ToastComponent = toast ? (
    <div style={{
      position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 100,
      padding: '0.85rem 1.25rem', borderRadius: 10, maxWidth: 360,
      background: toast.type === 'error' ? 'rgba(239,68,68,0.15)' : toast.type === 'success' ? 'rgba(0,230,118,0.12)' : 'rgba(66,165,245,0.12)',
      border: `1px solid ${toast.type === 'error' ? 'rgba(239,68,68,0.4)' : toast.type === 'success' ? 'rgba(0,230,118,0.4)' : 'rgba(66,165,245,0.4)'}`,
      color: toast.type === 'error' ? '#ef4444' : toast.type === 'success' ? 'var(--green)' : '#42a5f5',
      fontSize: 13, fontWeight: 500,
      boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
      display: 'flex', alignItems: 'center', gap: '0.65rem',
    }}>
      <span>{toast.type === 'error' ? '✕' : toast.type === 'success' ? '✓' : 'ℹ'}</span>
      {toast.msg}
    </div>
  ) : null

  return { show, ToastComponent }
}

// ── ConfirmDialog ─────────────────────────────────────────────────────────
export function ConfirmDialog({
  open, onClose, onConfirm, title, message, confirmLabel = 'Confirmar', danger = false,
}: {
  open: boolean; onClose: () => void; onConfirm: () => void; title: string; message: string; confirmLabel?: string; danger?: boolean
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} maxWidth={400}>
      <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: '1.5rem', lineHeight: 1.6 }}>{message}</p>
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
        <button onClick={onClose} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid var(--border)', background: 'none', color: 'var(--slate)', cursor: 'pointer', fontSize: 13 }}>
          Cancelar
        </button>
        <button
          onClick={() => { onConfirm(); onClose() }}
          style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: danger ? '#ef4444' : 'var(--green)', color: danger ? '#fff' : 'var(--navy)', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  )
}

// ── FormField helper ──────────────────────────────────────────────────────
export function FormField({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div>
      <label style={{ fontSize: 11, color: 'var(--silver)', letterSpacing: '0.5px', display: 'block', marginBottom: '0.35rem', textTransform: 'uppercase' }}>
        {label}{required && ' *'}
      </label>
      {children}
    </div>
  )
}

// ── PageHeader ────────────────────────────────────────────────────────────
export function PageHeader({
  supra = 'Portal do Cliente', title, sub, action,
}: {
  supra?: string; title: string; sub?: string; action?: React.ReactNode
}) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
      <div>
        <div style={{ fontSize: 11, color: 'var(--slate)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: '0.25rem' }}>{supra}</div>
        <h1 className="font-rajdhani font-black" style={{ fontSize: 28, color: 'var(--text)', letterSpacing: 1 }}>{title}</h1>
        {sub && <p style={{ fontSize: 13, color: 'var(--slate)', marginTop: 4 }}>{sub}</p>}
      </div>
      {action}
    </div>
  )
}

// ── SearchBar ─────────────────────────────────────────────────────────────
export function SearchBar({ value, onChange, placeholder = 'Pesquisar...' }: {
  value: string; onChange: (v: string) => void; placeholder?: string
}) {
  return (
    <div style={{ position: 'relative' }}>
      <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate)', fontSize: 14, pointerEvents: 'none' }}>🔍</span>
      <input
        className="input-field"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ paddingLeft: '2.25rem' }}
      />
    </div>
  )
}

// ── shimmer keyframes injected once ──────────────────────────────────────
if (typeof document !== 'undefined') {
  const id = 'bx-shimmer-style'
  if (!document.getElementById(id)) {
    const s = document.createElement('style')
    s.id = id
    s.textContent = '@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }'
    document.head.appendChild(s)
  }
}
