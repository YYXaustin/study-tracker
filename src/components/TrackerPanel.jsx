import { useState } from 'react'
import SubjectCard from './SubjectCard'

export default function TrackerPanel({ subjects, onTimeUpdate, onDelete, onEdit, onOpenCreate, onViewDetail }) {
  const [search, setSearch] = useState('')

  const filtered = subjects.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    (s.description || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <aside style={{
      width: 280, minWidth: 280,
      background: 'var(--surface)', borderLeft: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column',
      height: '100%', overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 16px 12px', borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 2 }}>
            Tracker
          </div>
          <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text)' }}>
            {subjects.length} Subject{subjects.length !== 1 ? 's' : ''}
          </h2>
        </div>
        <button onClick={onOpenCreate} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '7px 14px', borderRadius: 8,
          background: 'var(--accent)', border: 'none',
          color: '#0d0d0f', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer',
        }}>+ New</button>
      </div>

      {/* Search */}
      <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ position: 'relative' }}>
          <span style={{
            position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
            fontSize: '0.85rem', color: 'var(--text-dim)', pointerEvents: 'none',
          }}>🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search subjects..."
            style={{
              width: '100%', padding: '8px 32px 8px 32px',
              background: 'var(--bg)', border: '1px solid var(--border)',
              borderRadius: 8, color: 'var(--text)',
              fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box',
            }}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{
              position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', color: 'var(--text-dim)',
              fontSize: '0.85rem', cursor: 'pointer', padding: 0, lineHeight: 1,
            }}>×</button>
          )}
        </div>
        {search && (
          <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: 6 }}>
            {filtered.length} result{filtered.length !== 1 ? 's' : ''} for "{search}"
          </div>
        )}
      </div>

      {/* Subject list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {subjects.length === 0 ? (
          <div style={{ color: 'var(--text-dim)', fontSize: '0.85rem', textAlign: 'center', paddingTop: 40 }}>
            <div style={{ fontSize: '2rem', marginBottom: 8 }}>📚</div>
            Click <strong style={{ color: 'var(--accent)' }}>+ New</strong> to add a subject.
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ color: 'var(--text-dim)', fontSize: '0.85rem', textAlign: 'center', paddingTop: 40 }}>
            <div style={{ fontSize: '2rem', marginBottom: 8 }}>🔍</div>
            No subjects match "{search}".
          </div>
        ) : filtered.map(s => (
          <SubjectCard
            key={s.id}
            subject={s}
            onTimeUpdate={onTimeUpdate}
            onDelete={onDelete}
            onEdit={() => onEdit(s)}
            onViewDetail={() => onViewDetail(s.id)}
          />
        ))}
      </div>
    </aside>
  )
}