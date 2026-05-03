import { useState, useEffect, useRef, useCallback } from 'react'

const api = window.api

function formatTime(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  if (h > 0) return `${h}h ${m}m ${s}s`
  if (m > 0) return `${m}m ${s}s`
  return `${s}s`
}

// ─── Left Sidebar ────────────────────────────────────────────────────────────
function Sidebar({ activePage, onNavigate }) {
  const navItems = [
    { id: 'home',     icon: '⌂',  label: 'Home'        },
    { id: 'records',  icon: '📋', label: 'Records'     },
    { id: 'profile',  icon: '👤', label: 'Personal'    },
  ]

  return (
    <aside style={{
      width: 220,
      minWidth: 220,
      background: 'var(--surface)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      padding: '16px 0',
      gap: 0,
      height: '100%',
      overflowY: 'auto',
    }}>
      {/* App logo / name */}
      <div style={{
        padding: '12px 20px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: 'var(--accent)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1rem', color: '#0d0d0f', fontWeight: 800,
        }}>S</div>
        <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text)', letterSpacing: '-0.01em' }}>
          Study Tracker
        </span>
      </div>

      {/* Nav items */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '0 8px' }}>
        {navItems.map(item => {
          const active = activePage === item.id
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 14px',
                borderRadius: 8,
                border: 'none',
                background: active ? 'var(--surface2)' : 'transparent',
                color: active ? 'var(--accent)' : 'var(--text-dim)',
                fontSize: '0.88rem',
                fontWeight: active ? 600 : 400,
                textAlign: 'left',
                transition: 'background 0.15s, color 0.15s',
                cursor: 'pointer',
                width: '100%',
              }}
            >
              <span style={{ fontSize: '1rem', width: 20, textAlign: 'center' }}>{item.icon}</span>
              {item.label}
              {active && (
                <span style={{
                  marginLeft: 'auto',
                  width: 4, height: 4,
                  borderRadius: '50%',
                  background: 'var(--accent)',
                }} />
              )}
            </button>
          )
        })}
      </nav>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Bottom hint */}
      <div style={{ padding: '16px 20px', fontSize: '0.72rem', color: 'var(--text-dim)', lineHeight: 1.5 }}>
        More features coming soon.
      </div>
    </aside>
  )
}

// ─── Home Page (center) ──────────────────────────────────────────────────────
function HomePage({ subjects }) {
  const totalAll = subjects.reduce((sum, s) => sum + s.total_seconds, 0)
  const topSubjects = [...subjects].sort((a, b) => b.total_seconds - a.total_seconds).slice(0, 5)

  const today = new Date().toLocaleDateString('en-AU', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <div style={{ padding: '40px 48px', maxWidth: 720 }}>
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

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 40 }}>
        {[
          { label: 'Total Time',    value: formatTime(totalAll),       icon: '⏱' },
          { label: 'Subjects',      value: subjects.length,            icon: '📚' },
          { label: 'Avg per Subject', value: subjects.length ? formatTime(Math.round(totalAll / subjects.length)) : '—', icon: '📊' },
        ].map(stat => (
          <div key={stat.label} style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: '20px',
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
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 10,
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', width: 16, textAlign: 'center' }}>
                    {i + 1}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>
                      {s.name}
                    </div>
                    <div style={{ height: 4, borderRadius: 2, background: 'var(--surface2)', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        width: `${pct}%`,
                        background: 'var(--accent)',
                        borderRadius: 2,
                        transition: 'width 0.5s ease',
                      }} />
                    </div>
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent)', fontVariantNumeric: 'tabular-nums', minWidth: 70, textAlign: 'right' }}>
                    {formatTime(s.total_seconds)}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', width: 32, textAlign: 'right' }}>
                    {pct}%
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {subjects.length === 0 && (
        <div style={{ textAlign: 'center', color: 'var(--text-dim)', paddingTop: 60 }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>📚</div>
          <p>Add your first subject in the tracker panel →</p>
        </div>
      )}
    </div>
  )
}

// ─── Records Page (center) ───────────────────────────────────────────────────
function RecordsPage({ subjects }) {
  const sorted = [...subjects].sort((a, b) => b.total_seconds - a.total_seconds)
  return (
    <div style={{ padding: '40px 48px', maxWidth: 720 }}>
      <h1 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 8 }}>Records</h1>
      <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginBottom: 32 }}>All your subjects and study time.</p>

      {sorted.length === 0 ? (
        <p style={{ color: 'var(--text-dim)' }}>No records yet.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {sorted.map((s, i) => (
            <div key={s.id} style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', width: 20, textAlign: 'center' }}>#{i + 1}</span>
                <span style={{ fontWeight: 600, color: 'var(--text)' }}>{s.name}</span>
              </div>
              <span style={{ fontWeight: 700, color: 'var(--accent)', fontVariantNumeric: 'tabular-nums' }}>
                {formatTime(s.total_seconds)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Personal Page (center) ──────────────────────────────────────────────────
function PersonalPage() {
  return (
    <div style={{ padding: '40px 48px', maxWidth: 720 }}>
      <h1 style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 8 }}>Personal Data</h1>
      <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginBottom: 32 }}>Your profile and preferences.</p>
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius)', padding: '32px',
        color: 'var(--text-dim)', fontSize: '0.9rem',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
      }}>
        <div style={{ fontSize: '3rem' }}>🚧</div>
        <p>Personal data settings coming soon.</p>
      </div>
    </div>
  )
}

// ─── Right Panel: Tracker ────────────────────────────────────────────────────
function SubjectCard({ subject, onTimeUpdate, onDelete }) {
  const [running, setRunning] = useState(false)
  const [sessionSecs, setSessionSecs] = useState(0)
  const intervalRef = useRef(null)
  const lastSaveRef = useRef(0)

  const tick = useCallback(() => {
    setSessionSecs(prev => {
      const next = prev + 1
      if (next - lastSaveRef.current >= 5) {
        const toSave = next - lastSaveRef.current
        lastSaveRef.current = next
        api.updateTime(subject.id, toSave).then(onTimeUpdate)
      }
      return next
    })
  }, [subject.id, onTimeUpdate])

  const toggle = () => {
    if (running) {
      clearInterval(intervalRef.current)
      const unsaved = sessionSecs - lastSaveRef.current
      if (unsaved > 0) {
        api.updateTime(subject.id, unsaved).then(onTimeUpdate)
        lastSaveRef.current = sessionSecs
      }
      setRunning(false)
    } else {
      intervalRef.current = setInterval(tick, 1000)
      setRunning(true)
    }
  }

  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current)
      const unsaved = sessionSecs - lastSaveRef.current
      if (unsaved > 0) api.updateTime(subject.id, unsaved)
    }
  }, [])

  return (
    <div style={{
      background: 'var(--surface)',
      border: `1px solid ${running ? 'var(--accent)' : 'var(--border)'}`,
      borderRadius: 10,
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      transition: 'border-color 0.2s, box-shadow 0.2s',
      boxShadow: running ? '0 0 16px rgba(200,240,90,0.08)' : 'none',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text)' }}>{subject.name}</h3>
        <button
          onClick={() => onDelete(subject.id)}
          style={{
            background: 'none', border: 'none',
            color: 'var(--text-dim)', fontSize: '1rem',
            padding: '2px 6px', borderRadius: 4, lineHeight: 1,
          }}
          title="Delete"
        >×</button>
      </div>

      <div>
        <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Total</div>
        <div style={{ fontSize: '1.2rem', fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: 'var(--text)' }}>
          {formatTime(subject.total_seconds)}
        </div>
      </div>

      {(running || sessionSecs > 0) && (
        <div>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Session</div>
          <div style={{ fontSize: '0.9rem', fontVariantNumeric: 'tabular-nums', color: 'var(--accent)' }}>
            +{formatTime(sessionSecs)}
          </div>
        </div>
      )}

      <button
        onClick={toggle}
        style={{
          padding: '8px 0',
          borderRadius: 7,
          border: 'none',
          fontWeight: 700,
          fontSize: '0.8rem',
          letterSpacing: '0.05em',
          background: running ? 'var(--surface2)' : 'var(--accent)',
          color: running ? 'var(--text)' : '#0d0d0f',
          transition: 'background 0.15s',
        }}
      >
        {running ? '⏸  PAUSE' : '▶  START'}
      </button>
    </div>
  )
}

function TrackerPanel({ subjects, onTimeUpdate, onDelete, onAdd }) {
  const [newName, setNewName] = useState('')

  const handleAdd = async () => {
    const name = newName.trim()
    if (!name) return
    await onAdd(name)
    setNewName('')
  }

  return (
    <aside style={{
      width: 280,
      minWidth: 280,
      background: 'var(--surface)',
      borderLeft: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{ padding: '20px 16px 12px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>
          Tracker
        </div>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)' }}>Study Sessions</h2>
      </div>

      {/* Add subject */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', gap: 8 }}>
        <input
          value={newName}
          onChange={e => setNewName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder="New subject..."
          style={{
            flex: 1, padding: '8px 12px',
            background: 'var(--bg)', border: '1px solid var(--border)',
            borderRadius: 8, color: 'var(--text)',
            fontSize: '0.85rem', outline: 'none',
          }}
        />
        <button
          onClick={handleAdd}
          style={{
            padding: '8px 12px', borderRadius: 8,
            background: 'var(--accent)', border: 'none',
            fontWeight: 700, fontSize: '0.85rem', color: '#0d0d0f',
          }}
        >+</button>
      </div>

      {/* Subject list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {subjects.length === 0 ? (
          <div style={{ color: 'var(--text-dim)', fontSize: '0.85rem', textAlign: 'center', paddingTop: 40 }}>
            <div style={{ fontSize: '2rem', marginBottom: 8 }}>📚</div>
            Add a subject to start tracking.
          </div>
        ) : subjects.map(s => (
          <SubjectCard
            key={s.id}
            subject={s}
            onTimeUpdate={onTimeUpdate}
            onDelete={onDelete}
          />
        ))}
      </div>
    </aside>
  )
}

// ─── Root App ────────────────────────────────────────────────────────────────
export default function App() {
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [activePage, setActivePage] = useState('home')

  useEffect(() => {
    api.getSubjects().then(data => {
      setSubjects(data)
      setLoading(false)
    })
  }, [])

  const handleAdd = async (name) => {
    const subject = await api.addSubject(name)
    setSubjects(prev => [subject, ...prev])
  }

  const handleTimeUpdate = useCallback((updated) => {
    setSubjects(prev => prev.map(s => s.id === updated.id ? updated : s))
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this subject?')) return
    await api.deleteSubject(id)
    setSubjects(prev => prev.filter(s => s.id !== id))
  }

  const renderCenter = () => {
    if (loading) return <div style={{ padding: 40, color: 'var(--text-dim)' }}>Loading...</div>
    if (activePage === 'home')    return <HomePage subjects={subjects} />
    if (activePage === 'records') return <RecordsPage subjects={subjects} />
    if (activePage === 'profile') return <PersonalPage />
    return null
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>

      {/* Custom title bar */}
      <div style={{
        WebkitAppRegion: 'drag',
        height: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        background: '#0d0d0f',
        borderBottom: '1px solid var(--border)',
        flexShrink: 0,
        zIndex: 1000,
      }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Study Tracker</span>
        <div style={{ display: 'flex', gap: 8, WebkitAppRegion: 'no-drag' }}>
          <button onClick={() => window.api.minimize()} style={{
            width: 12, height: 12, borderRadius: '50%',
            background: '#f5a623', border: 'none', cursor: 'pointer',
          }} />
          <button onClick={() => window.api.close()} style={{
            width: 12, height: 12, borderRadius: '50%',
            background: '#ff5f57', border: 'none', cursor: 'pointer',
          }} />
        </div>
      </div>

      {/* Three-panel layout */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left: Sidebar */}
        <Sidebar activePage={activePage} onNavigate={setActivePage} />

        {/* Center: Main content */}
        <main style={{ flex: 1, overflowY: 'auto', background: 'var(--bg)' }}>
          {renderCenter()}
        </main>

        {/* Right: Tracker */}
        <TrackerPanel
          subjects={subjects}
          onTimeUpdate={handleTimeUpdate}
          onDelete={handleDelete}
          onAdd={handleAdd}
        />
      </div>
    </div>
  )
}