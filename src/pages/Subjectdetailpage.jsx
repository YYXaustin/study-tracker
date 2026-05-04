import { formatTime, formatDateTime } from '../utils/format'

export default function SubjectDetailPage({ subject, onBack }) {
  if (!subject) return null

  const sessions = subject.sessions || []
  const totalSecs = subject.total_seconds || 0

  return (
    <div style={{ padding: '40px 48px', maxWidth: 760 }}>

      {/* Back button */}
      <button
        onClick={onBack}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'none', border: 'none',
          color: 'var(--text-dim)', fontSize: '0.82rem',
          cursor: 'pointer', marginBottom: 28, padding: 0,
          transition: 'color 0.15s',
        }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-dim)'}
      >
        ← Back to Records
      </button>

      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text)', marginBottom: 6 }}>
          {subject.name}
        </h1>
        {subject.description && (
          <p style={{ color: 'var(--text-dim)', fontSize: '0.92rem', marginBottom: 8 }}>
            {subject.description}
          </p>
        )}
        {subject.createdAt && (
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <span>🕐</span> Created {formatDateTime(subject.createdAt)}
          </div>
        )}
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 40 }}>
        {[
          { label: 'Total Time',   value: formatTime(totalSecs),          icon: '⏱' },
          { label: 'Sessions',     value: sessions.length,                icon: '📋' },
          { label: 'Avg Session',  value: sessions.length ? formatTime(Math.round(totalSecs / sessions.length)) : '—', icon: '📊' },
        ].map(stat => (
          <div key={stat.label} style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius)', padding: '18px',
          }}>
            <div style={{ fontSize: '1.2rem', marginBottom: 8 }}>{stat.icon}</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--accent)', fontVariantNumeric: 'tabular-nums' }}>
              {stat.value}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Sessions */}
      <div>
        <h2 style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>
          Session History
        </h2>

        {sessions.length === 0 ? (
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 12, padding: '40px',
            textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.9rem',
          }}>
            <div style={{ fontSize: '2rem', marginBottom: 10 }}>📭</div>
            No sessions recorded yet. Start a timer to track your first session.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[...sessions].reverse().map((sess, idx) => {
              const sessionNum = sessions.length - idx
              return (
                <div key={idx} style={{
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 12, padding: '16px 20px',
                  display: 'flex', alignItems: 'flex-start', gap: 16,
                }}>
                  {/* Session number */}
                  <div style={{
                    width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                    background: 'var(--surface2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-dim)',
                  }}>
                    #{sessionNum}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                        {formatDateTime(sess.startedAt)}
                      </span>
                      <span style={{
                        fontSize: '1rem', fontWeight: 700,
                        color: 'var(--accent)', fontVariantNumeric: 'tabular-nums',
                      }}>
                        {formatTime(sess.duration || 0)}
                      </span>
                    </div>
                    {sess.note ? (
                      <div style={{
                        fontSize: '0.88rem', color: 'var(--text)',
                        fontStyle: 'italic', lineHeight: 1.5,
                        background: 'var(--surface2)', borderRadius: 6,
                        padding: '8px 12px',
                      }}>
                        "{sess.note}"
                      </div>
                    ) : (
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', opacity: 0.5 }}>
                        No note for this session
                      </div>
                    )}
                  </div>
                </div>
              )
            })}

            {/* Grand total */}
            <div style={{
              background: 'var(--surface2)', border: '1px solid var(--border)',
              borderRadius: 12, padding: '14px 20px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Total across all sessions
              </span>
              <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent)', fontVariantNumeric: 'tabular-nums' }}>
                {formatTime(totalSecs)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}