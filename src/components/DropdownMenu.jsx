import { useState, useEffect, useRef } from 'react'

export default function DropdownMenu({ onEdit, onDelete }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    // Use setTimeout so the click that opened the menu doesn't immediately close it
    const handler = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false)
    }
    const timer = setTimeout(() => document.addEventListener('mousedown', handler), 0)
    return () => {
      clearTimeout(timer)
      document.removeEventListener('mousedown', handler)
    }
  }, [open])

  return (
    <div ref={ref} style={{ position: 'relative', flexShrink: 0 }}>
      <button
        onClick={e => { e.stopPropagation(); setOpen(p => !p) }}
        title="Options"
        style={{
          background: 'none', border: 'none',
          color: 'var(--text-dim)', cursor: 'pointer',
          padding: '2px 6px', borderRadius: 4,
          fontSize: '1.1rem', lineHeight: 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >⋯</button>

      {open && (
        <div style={{
          position: 'absolute', top: '100%', right: 0, zIndex: 200,
          background: 'var(--surface2)',
          border: '1px solid var(--border)',
          borderRadius: 8, overflow: 'hidden',
          boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          minWidth: 120, marginTop: 4,
        }}>
          <button
            onClick={e => { e.stopPropagation(); setOpen(false); onEdit() }}
            style={{
              display: 'block', width: '100%', padding: '9px 14px',
              background: 'none', border: 'none', textAlign: 'left',
              color: 'var(--text)', fontSize: '0.82rem', cursor: 'pointer',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--border)'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}
          >✏️  Edit</button>
          <button
            onClick={e => {
              e.stopPropagation()
              setOpen(false)
              // Defer so dropdown unmount doesn't interfere with modal mount
              setTimeout(() => onDelete(), 0)
            }}
            style={{
              display: 'block', width: '100%', padding: '9px 14px',
              background: 'none', border: 'none', textAlign: 'left',
              color: '#ff5f57', fontSize: '0.82rem', cursor: 'pointer',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--border)'}
            onMouseLeave={e => e.currentTarget.style.background = 'none'}
          >🗑  Delete</button>
        </div>
      )}
    </div>
  )
}