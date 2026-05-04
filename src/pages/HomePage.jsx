import { formatTime } from '../utils/format'

export default function HomePage({ subjects }) {
  const totalAll = subjects.reduce((sum, s) => sum + s.total_seconds, 0)
  const topSubjects = [...subjects].sort((a, b) => b.total_seconds - a.total_seconds).slice(0, 5)
  const today = new Date().toLocaleDateString('en-AU', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <div style={{ padding: '40px 48px', maxWidth: 720 }}>
      {/* Greeting */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          {today}
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--text)' }}>
          Welcome back 👋
        </h1>
        <p style={{ color: 'var(--text-dim)', marginTop: 8, fontSize: '0.92rem' }}>
          Here's an overview of your study progress.
        </p>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 40 }}>
        {[
          { label: 'Total Time',      value: formatTime(totalAll), icon: '⏱' },
          { label: 'Subjects',        value: subjects.length,      icon: '📚' },
          { label: 'Avg per Subject', value: subjects.length ? formatTime(Math.round(totalAll / subjects.length)) : '—', icon: '📊' },
        ].map(stat => (
          <div key={stat.label} style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius)', padding: '20px',
          }}>
            <div style={{ fontSize: '1.3rem', marginBottom: 8 }}>{stat.icon}</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--accent)', fontVariantNumeric: 'tabular-nums' }}>
              {stat.value}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Top subjects */}
      {topSubjects.length > 0 && (
        <div>
          <h2 style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>
            Top Subjects
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {topSubjects.map((s, i) => {
              const pct = totalAll > 0 ? Math.round((s.total_seconds / totalAll) * 100) : 0
              return (
                <div key={s.id} style={{
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  borderRadius: 10, padding: '14px 18px',
                  display: 'flex', alignItems: 'center', gap: 14,
                }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', width: 16, textAlign: 'center' }}>{i + 1}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>{s.name}</div>
                    <div style={{ height: 4, borderRadius: 2, background: 'var(--surface2)', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: 'var(--accent)', borderRadius: 2, transition: 'width 0.5s ease' }} />
                    </div>
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent)', fontVariantNumeric: 'tabular-nums', minWidth: 70, textAlign: 'right' }}>
                    {formatTime(s.total_seconds)}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', width: 32, textAlign: 'right' }}>{pct}%</div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {subjects.length === 0 && (
        <div style={{ textAlign: 'center', color: 'var(--text-dim)', paddingTop: 60 }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>📚</div>
          <p>Click <strong style={{ color: 'var(--accent)' }}>+ New</strong> in the tracker panel to add your first subject.</p>
        </div>
      )}
    </div>
  )
}