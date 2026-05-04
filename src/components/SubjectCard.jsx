import { useState, useEffect, useRef } from 'react'
import { formatTime } from '../utils/format'
import DropdownMenu from './DropdownMenu'
import SessionStartModal from './modals/SessionStartModal'

const api = window.api

// ─── End Session Confirmation Modal ──────────────────────────────────────────
function EndConfirmModal({ secs, onCancel, onConfirm }) {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onCancel() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onCancel])

  const h = Math.floor(secs / 3600)
  const m = Math.floor((secs % 3600) / 60)
  const s = secs % 60
  const timeStr = h > 0 ? `${h}h ${m}m ${s}s` : m > 0 ? `${m}m ${s}s` : `${s}s`

  return (
    <div
      onClick={onCancel}
      style={{
        position: 'fixed', inset: 0, zIndex: 3000,
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
          borderRadius: 14, padding: '28px',
          width: 340, maxWidth: '90vw',
          display: 'flex', flexDirection: 'column', gap: 16,
          boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8, flexShrink: 0,
            background: 'rgba(255,95,87,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1rem',
          }}>■</div>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text)' }}>
            End this session?
          </h2>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', lineHeight: 1.5, paddingLeft: 48 }}>
          Your session of{' '}
          <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{timeStr}</span>
          {' '}will be saved to the record.
        </p>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button onClick={onCancel} style={{
            padding: '8px 18px', borderRadius: 8,
            background: 'var(--surface2)', border: '1px solid var(--border)',
            color: 'var(--text-dim)', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
          }}>Keep Going</button>
          <button onClick={onConfirm} style={{
            padding: '8px 18px', borderRadius: 8, border: 'none',
            background: 'rgba(255,95,87,0.18)', color: '#ff5f57',
            fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
          }}>End & Save</button>
        </div>
      </div>
    </div>
  )
}

// ─── Subject Card ─────────────────────────────────────────────────────────────
export default function SubjectCard({ subject, onTimeUpdate, onDelete, onEdit, onViewDetail }) {
  const [timerState, setTimerState]         = useState('idle')
  const [secs, setSecs]                     = useState(0)
  const [showSessionModal, setShowSessionModal] = useState(false)
  const [showEndConfirm, setShowEndConfirm]   = useState(false)

  // Refs for all timer data — immune to stale closures
  const intervalRef  = useRef(null)
  const secsRef      = useRef(0)
  const noteRef      = useRef('')
  const startRef     = useRef(null)

  // Keep latest prop values accessible inside intervals without re-creating them
  const subjectIdRef     = useRef(subject.id)
  const onTimeUpdateRef  = useRef(onTimeUpdate)
  subjectIdRef.current    = subject.id
  onTimeUpdateRef.current = onTimeUpdate

  const startTimer = (note) => {
    secsRef.current  = 0
    noteRef.current  = note
    startRef.current = new Date().toISOString()
    setSecs(0)
    setTimerState('running')
    intervalRef.current = setInterval(() => {
      secsRef.current += 1
      setSecs(secsRef.current)
      api.updateTime(subjectIdRef.current, 1)
        .then(u => { if (u) onTimeUpdateRef.current(u) })
    }, 1000)
  }

  const pauseTimer = () => {
    clearInterval(intervalRef.current)
    setTimerState('paused')
  }

  const resumeTimer = () => {
    setTimerState('running')
    intervalRef.current = setInterval(() => {
      secsRef.current += 1
      setSecs(secsRef.current)
      api.updateTime(subjectIdRef.current, 1)
        .then(u => { if (u) onTimeUpdateRef.current(u) })
    }, 1000)
  }

  const endTimer = () => {
    clearInterval(intervalRef.current)
    const finalSecs = secsRef.current
    const note      = noteRef.current
    const start     = startRef.current
    const id        = subjectIdRef.current
    // Reset immediately so UI goes idle
    secsRef.current  = 0
    noteRef.current  = ''
    startRef.current = null
    setSecs(0)
    setTimerState('idle')
    // Save session
    console.log('[endTimer] saving session — id:', id, 'secs:', finalSecs, 'note:', note, 'start:', start)
    if (finalSecs > 0) {
      api.addSession(id, { note, startedAt: start, duration: finalSecs })
        .then(u => {
          console.log('[endTimer] addSession response:', u)
          if (u) onTimeUpdateRef.current(u)
        })
        .catch(err => console.error('[endTimer] addSession error:', err))
    } else {
      console.warn('[endTimer] finalSecs was 0 — session not saved')
    }
  }

  useEffect(() => { return () => clearInterval(intervalRef.current) }, [])

  const isIdle    = timerState === 'idle'
  const isRunning = timerState === 'running'
  const isPaused  = timerState === 'paused'
  const isActive  = isRunning || isPaused

  const borderColor = isRunning ? 'var(--accent)' : isPaused ? '#f5a623' : 'var(--border)'

  return (
    <>
      {showSessionModal && (
        <SessionStartModal
          subjectName={subject.name}
          onClose={() => setShowSessionModal(false)}
          onStart={(note) => { setShowSessionModal(false); startTimer(note) }}
        />
      )}

      {showEndConfirm && (
        <EndConfirmModal
          secs={secsRef.current}
          onCancel={() => setShowEndConfirm(false)}
          onConfirm={() => { setShowEndConfirm(false); endTimer() }}
        />
      )}

      <style>{`@keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.25} }`}</style>

      <div style={{
        background: 'var(--surface)',
        border: `1px solid ${borderColor}`,
        borderRadius: 10, padding: '16px',
        display: 'flex', flexDirection: 'column', gap: 12,
        transition: 'border-color 0.25s, box-shadow 0.25s',
        boxShadow: isRunning ? '0 0 18px rgba(200,240,90,0.09)' : 'none',
      }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h3
              onClick={onViewDetail}
              title="View details"
              onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text)'}
              style={{
                fontSize: '0.92rem', fontWeight: 600, color: 'var(--text)', marginBottom: 2,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                cursor: 'pointer', transition: 'color 0.15s',
              }}
            >
              {subject.name} <span style={{ fontSize: '0.6rem', opacity: 0.4 }}>↗</span>
            </h3>
            {subject.description && (
              <p style={{
                fontSize: '0.72rem', color: 'var(--text-dim)',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>{subject.description}</p>
            )}
          </div>
          <DropdownMenu onEdit={onEdit} onDelete={() => onDelete(subject.id)} />
        </div>

        {/* Total time */}
        <div>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', marginBottom: 2, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Total</div>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: 'var(--text)' }}>
            {formatTime(subject.total_seconds)}
          </div>
        </div>

        {/* Active session box */}
        {isActive && (
          <div style={{
            background: 'var(--bg)', borderRadius: 6, padding: '8px 10px',
            display: 'flex', flexDirection: 'column', gap: 3,
            border: `1px solid ${isPaused ? 'rgba(245,166,35,0.35)' : 'rgba(200,240,90,0.15)'}`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Session · {isPaused ? 'Paused' : 'Live'}
              </span>
              {isRunning && (
                <span style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: 'var(--accent)', display: 'inline-block',
                  animation: 'blink 1s ease-in-out infinite',
                }} />
              )}
              {isPaused && <span style={{ fontSize: '0.7rem', color: '#f5a623' }}>⏸</span>}
            </div>
            <div style={{
              fontSize: '1rem', fontWeight: 700, fontVariantNumeric: 'tabular-nums',
              color: isPaused ? '#f5a623' : 'var(--accent)',
              opacity: isPaused ? 0.7 : 1,
            }}>
              +{formatTime(secs)}
            </div>
            {/* Note shown via state so it re-renders — stored in ref for endTimer */}
            {noteRef.current ? (
              <div style={{
                fontSize: '0.72rem', color: 'var(--text-dim)', fontStyle: 'italic',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>"{noteRef.current}"</div>
            ) : null}
          </div>
        )}

        {/* ── Buttons ── */}
        {isIdle && (
          <button onClick={() => setShowSessionModal(true)} style={{
            padding: '8px 0', borderRadius: 7, border: 'none',
            fontWeight: 700, fontSize: '0.8rem',
            background: 'var(--accent)', color: '#0d0d0f', cursor: 'pointer',
          }}>▶  START</button>
        )}

        {isRunning && (
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={pauseTimer} style={{
              flex: 1, padding: '8px 0', borderRadius: 7,
              border: '1px solid var(--border)',
              fontWeight: 700, fontSize: '0.8rem',
              background: 'var(--surface2)', color: 'var(--text)', cursor: 'pointer',
            }}>⏸  PAUSE</button>
            <button onClick={() => setShowEndConfirm(true)} style={{
              flex: 1, padding: '8px 0', borderRadius: 7, border: 'none',
              fontWeight: 700, fontSize: '0.8rem',
              background: 'rgba(255,95,87,0.15)', color: '#ff5f57', cursor: 'pointer',
            }}>■  END</button>
          </div>
        )}

        {isPaused && (
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={resumeTimer} style={{
              flex: 1, padding: '8px 0', borderRadius: 7, border: 'none',
              fontWeight: 700, fontSize: '0.8rem',
              background: 'rgba(245,166,35,0.18)', color: '#f5a623', cursor: 'pointer',
            }}>▶  RESUME</button>
            <button onClick={() => setShowEndConfirm(true)} style={{
              flex: 1, padding: '8px 0', borderRadius: 7, border: 'none',
              fontWeight: 700, fontSize: '0.8rem',
              background: 'rgba(255,95,87,0.15)', color: '#ff5f57', cursor: 'pointer',
            }}>■  END</button>
          </div>
        )}
      </div>
    </>
  )
}