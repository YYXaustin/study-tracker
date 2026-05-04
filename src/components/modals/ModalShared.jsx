import { useEffect } from 'react'

// ─── Modal shell ──────────────────────────────────────────────────────────────
export function Modal({ onClose, children, width = 460 }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 2000,
        background: 'rgba(0,0,0,0.65)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(4px)',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 16, padding: '28px 32px',
          width, maxWidth: '90vw',
          display: 'flex', flexDirection: 'column', gap: 20,
          boxShadow: '0 24px 60px rgba(0,0,0,0.55)',
          maxHeight: '85vh', overflowY: 'auto',
        }}
      >
        {children}
      </div>
    </div>
  )
}

// ─── Input style helper ───────────────────────────────────────────────────────
export const inputStyle = (focused) => ({
  padding: '10px 14px',
  background: 'var(--bg)',
  border: `1px solid ${focused ? 'var(--accent)' : 'var(--border)'}`,
  borderRadius: 8, color: 'var(--text)',
  fontSize: '0.9rem', outline: 'none',
  width: '100%', boxSizing: 'border-box',
  fontFamily: 'inherit', transition: 'border-color 0.15s',
})

// ─── Field label ──────────────────────────────────────────────────────────────
export function FieldLabel({ children }) {
  return (
    <label style={{
      fontSize: '0.72rem', color: 'var(--text-dim)',
      textTransform: 'uppercase', letterSpacing: '0.08em',
    }}>
      {children}
    </label>
  )
}

// ─── Modal header ─────────────────────────────────────────────────────────────
export function ModalHeader({ title, subtitle, onClose }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{title}</h2>
        {subtitle && <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{subtitle}</p>}
      </div>
      <button onClick={onClose} style={{
        background: 'var(--surface2)', border: 'none',
        color: 'var(--text-dim)', width: 28, height: 28,
        borderRadius: 6, fontSize: '1rem', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>×</button>
    </div>
  )
}

// ─── Modal action buttons ─────────────────────────────────────────────────────
export function ModalActions({ onCancel, onConfirm, confirmLabel, disabled }) {
  return (
    <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 4 }}>
      <button onClick={onCancel} style={{
        padding: '9px 20px', borderRadius: 8,
        background: 'var(--surface2)', border: '1px solid var(--border)',
        color: 'var(--text-dim)', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
      }}>Cancel</button>
      <button onClick={onConfirm} disabled={disabled} style={{
        padding: '9px 24px', borderRadius: 8,
        background: !disabled ? 'var(--accent)' : 'var(--surface2)',
        border: 'none',
        color: !disabled ? '#0d0d0f' : 'var(--text-dim)',
        fontWeight: 700, fontSize: '0.85rem',
        cursor: !disabled ? 'pointer' : 'not-allowed',
        transition: 'background 0.15s, color 0.15s',
      }}>{confirmLabel}</button>
    </div>
  )
}