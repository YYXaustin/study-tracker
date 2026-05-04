import { formatTime, formatDateTime } from '../utils/format'

export default function RecordsPage({ subjects, onSelectSubject }) {
  const sorted = [...subjects].sort((a, b) => b.total_seconds - a.total_seconds)

  return (
    <div style={{ padding: '40px 48px', maxWidth: 760 }}>
      <h1 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 8 }}>Records</h1>
      <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginBottom: 32 }}>
        Click any subject to view full session details.
      </p>

      {sorted.length === 0 ? (
        <p style={{ color: 'var(--text-dim)' }}>No records yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {sorted.map((s, i) => (
            <div
              key={s.id}
              onClick={() => onSelectSubject(s)}
              style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 12, padding: '16px 20px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                cursor: 'pointer', transition: 'border-color 0.15s, background 0.15s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--accent)'
                e.currentTarget.style.background = 'rgba(200,240,90,0.03)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.background = 'var(--surface)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', width: 20, textAlign: 'center' }}>
                  #{i + 1}
                </span>
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>{s.name}</div>
                  {s.description && (
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>{s.description}</div>
                  )}
                  {s.createdAt && (
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span>🕐</span> Created {formatDateTime(s.createdAt)}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, color: 'var(--accent)', fontVariantNumeric: 'tabular-nums', fontSize: '1.05rem' }}>
                    {formatTime(s.total_seconds)}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: 2 }}>
                    {(s.sessions || []).length} session{(s.sessions || []).length !== 1 ? 's' : ''}
                  </div>
                </div>
                <span style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>›</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}