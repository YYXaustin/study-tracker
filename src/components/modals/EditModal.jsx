import { useState } from 'react'
import { Modal, ModalHeader, ModalActions, FieldLabel, inputStyle } from './ModalShared'
import { formatTime, formatDateTime } from '../../utils/format'

export default function EditModal({ subject, onClose, onSave }) {
  const [name, setName] = useState(subject.name)
  const [description, setDescription] = useState(subject.description || '')
  const [createdAt, setCreatedAt] = useState(
    subject.createdAt ? subject.createdAt.slice(0, 16) : ''
  )
  const [sessions, setSessions] = useState(subject.sessions ? [...subject.sessions] : [])
  const [focusedField, setFocusedField] = useState(null)

  const handleSave = async () => {
    if (!name.trim()) return
    await onSave(subject.id, {
      name: name.trim(),
      description: description.trim(),
      createdAt: createdAt ? new Date(createdAt).toISOString() : subject.createdAt,
      sessions,
    })
    onClose()
  }

  const updateSessionNote = (idx, val) => {
    setSessions(prev => prev.map((s, i) => i === idx ? { ...s, note: val } : s))
  }

  return (
    <Modal onClose={onClose} width={520}>
      <ModalHeader
        title="Edit Subject"
        subtitle="Update the details for this subject."
        onClose={onClose}
      />

      {/* Name */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <FieldLabel>Name <span style={{ color: 'var(--accent)' }}>*</span></FieldLabel>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          style={inputStyle(focusedField === 'name')}
          onFocus={() => setFocusedField('name')}
          onBlur={() => setFocusedField(null)}
        />
      </div>

      {/* Description */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <FieldLabel>Description</FieldLabel>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={3}
          placeholder="Notes or goals for this subject..."
          style={{ ...inputStyle(focusedField === 'desc'), resize: 'vertical', lineHeight: 1.5 }}
          onFocus={() => setFocusedField('desc')}
          onBlur={() => setFocusedField(null)}
        />
      </div>

      {/* Created At */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <FieldLabel>Created At</FieldLabel>
        <input
          type="datetime-local"
          value={createdAt}
          onChange={e => setCreatedAt(e.target.value)}
          style={{ ...inputStyle(focusedField === 'date'), colorScheme: 'dark' }}
          onFocus={() => setFocusedField('date')}
          onBlur={() => setFocusedField(null)}
        />
      </div>

      {/* Sessions */}
      {sessions.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <FieldLabel>Past Sessions ({sessions.length})</FieldLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {sessions.map((sess, idx) => (
              <div key={idx} style={{
                background: 'var(--bg)', border: '1px solid var(--border)',
                borderRadius: 8, padding: '12px 14px',
                display: 'flex', flexDirection: 'column', gap: 6,
              }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                  Session {idx + 1} · {formatDateTime(sess.startedAt)} · {formatTime(sess.duration || 0)}
                </span>
                <input
                  value={sess.note || ''}
                  onChange={e => updateSessionNote(idx, e.target.value)}
                  placeholder="Session note (optional)"
                  style={{
                    ...inputStyle(focusedField === `sess-${idx}`),
                    fontSize: '0.82rem', padding: '7px 10px',
                  }}
                  onFocus={() => setFocusedField(`sess-${idx}`)}
                  onBlur={() => setFocusedField(null)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <ModalActions
        onCancel={onClose}
        onConfirm={handleSave}
        confirmLabel="Save Changes"
        disabled={!name.trim()}
      />
    </Modal>
  )
}