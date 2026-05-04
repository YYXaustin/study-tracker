import { useState, useEffect, useRef } from 'react'
import { Modal, ModalHeader, FieldLabel, inputStyle } from './ModalShared'

export default function SessionStartModal({ subjectName, onClose, onStart }) {
  const [note, setNote] = useState('')
  const [focused, setFocused] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  const handleStart = () => onStart(note.trim())

  return (
    <Modal onClose={onClose} width={400}>
      <ModalHeader
        title="Start Session"
        subtitle={`What are you working on for "${subjectName}" today?`}
        onClose={onClose}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <FieldLabel>
          Session Note{' '}
          <span style={{ color: 'var(--text-dim)', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>
            (optional)
          </span>
        </FieldLabel>
        <textarea
          ref={inputRef}
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="e.g. Reviewing chapter 5, practicing kanji, solving LeetCode..."
          rows={3}
          style={{ ...inputStyle(focused), resize: 'none', lineHeight: 1.5 }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleStart() }
          }}
        />
        <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
          This note will be saved in the session record. Press Enter to start.
        </span>
      </div>

      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', paddingTop: 4 }}>
        <button onClick={() => onStart('')} style={{
          padding: '9px 20px', borderRadius: 8,
          background: 'var(--surface2)', border: '1px solid var(--border)',
          color: 'var(--text-dim)', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer',
        }}>Skip</button>
        <button onClick={handleStart} style={{
          padding: '9px 24px', borderRadius: 8,
          background: 'var(--accent)', border: 'none',
          color: '#0d0d0f', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer',
        }}>▶ Start</button>
      </div>
    </Modal>
  )
}