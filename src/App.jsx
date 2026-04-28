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
      borderRadius: 'var(--radius)',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      transition: 'border-color 0.2s, box-shadow 0.2s',
      boxShadow: running ? '0 0 20px rgba(200,240,90,0.1)' : 'none',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text)' }}>{subject.name}</h2>
        <button
          onClick={() => onDelete(subject.id)}
          style={{
            background: 'none', border: 'none',
            color: 'var(--text-dim)', fontSize: '1.2rem',
            lineHeight: 1, padding: '2px 6px', borderRadius: 4,
          }}
          title="Delete"
        >×</button>
      </div>

      <div>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Total studied</div>
        <div style={{ fontSize: '1.5rem', fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: 'var(--text)' }}>
          {formatTime(subject.total_seconds)}
        </div>
      </div>

      {(running || sessionSecs > 0) && (
        <div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>This session</div>
          <div style={{ fontSize: '1rem', fontVariantNumeric: 'tabular-nums', color: 'var(--accent)' }}>
            +{formatTime(sessionSecs)}
          </div>
        </div>
      )}

      <button
        onClick={toggle}
        style={{
          marginTop: 4,
          padding: '10px 0',
          borderRadius: 8,
          border: 'none',
          fontWeight: 700,
          fontSize: '0.9rem',
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

export default function App() {
  const [subjects, setSubjects] = useState([])
  const [newName, setNewName] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getSubjects().then(data => {
      setSubjects(data)
      setLoading(false)
    })
  }, [])

  const addSubject = async () => {
    const name = newName.trim()
    if (!name) return
    const subject = await api.addSubject(name)
    setSubjects(prev => [subject, ...prev])
    setNewName('')
  }

  const handleTimeUpdate = useCallback((updated) => {
    setSubjects(prev => prev.map(s => s.id === updated.id ? updated : s))
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this subject?')) return
    await api.deleteSubject(id)
    setSubjects(prev => prev.filter(s => s.id !== id))
  }

  const totalAll = subjects.reduce((sum, s) => sum + s.total_seconds, 0)

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '56px 24px 40px' }}>

      {/* Custom title bar */}
      <div style={{
        WebkitAppRegion: 'drag',
        height: '40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 16px',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: '#0d0d0f',
      }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Study Tracker</span>
        <div style={{ display: 'flex', gap: '8px', WebkitAppRegion: 'no-drag' }}>
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

      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
          Study Tracker
        </h1>
        {totalAll > 0 && (
          <p style={{ color: 'var(--text-dim)', marginTop: 6 }}>
            Total across all subjects: <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{formatTime(totalAll)}</span>
          </p>
        )}
      </div>

      {/* Add new subject */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 40 }}>
        <input
          value={newName}
          onChange={e => setNewName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addSubject()}
          placeholder="Subject name (e.g. Algorithms, Japanese...)"
          style={{
            flex: 1, padding: '12px 16px',
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius)', color: 'var(--text)',
            fontSize: '0.95rem', outline: 'none',
          }}
        />
        <button
          onClick={addSubject}
          style={{
            padding: '12px 24px', borderRadius: 'var(--radius)',
            background: 'var(--accent)', border: 'none',
            fontWeight: 700, fontSize: '0.9rem', color: '#0d0d0f',
          }}
        >
          + Add
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <p style={{ color: 'var(--text-dim)' }}>Loading...</p>
      ) : subjects.length === 0 ? (
        <div style={{ textAlign: 'center', color: 'var(--text-dim)', paddingTop: 60 }}>
          <div style={{ fontSize: '3rem', marginBottom: 12 }}>📚</div>
          <p>Add your first subject to start tracking.</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: 20,
        }}>
          {subjects.map(s => (
            <SubjectCard
              key={s.id}
              subject={s}
              onTimeUpdate={handleTimeUpdate}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}