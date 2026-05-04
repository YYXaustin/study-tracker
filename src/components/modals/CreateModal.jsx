import { useState, useEffect, useRef } from 'react'
import { Modal, ModalHeader, ModalActions, FieldLabel, inputStyle } from './ModalShared'

export default function CreateModal({ onClose, onCreate }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [createdAt] = useState(() => new Date().toISOString())
  const [focusedField, setFocusedField] = useState(null)
  const nameRef = useRef(null)

  useEffect(() => { nameRef.current?.focus() }, [])

  const handleSubmit = async () => {
    const trimmed = name.trim()
    if (!trimmed) return
    await onCreate({ name: trimmed, description: description.trim(), createdAt })
    onClose()
  }

  const displayDate = new Date(createdAt).toLocaleString('en-AU', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  })

  return (
    <Modal onClose={onClose}>
      <ModalHeader
        title="New Subject"
        subtitle="Fill in the details for your new study record."
        onClose={onClose}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <FieldLabel>Name <span style={{ color: 'var(--accent)' }}>*</span></FieldLabel>
        <input
          ref={nameRef}
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          placeholder="e.g. Algorithms, Japanese, Physics..."
          style={inputStyle(focusedField === 'name')}
          onFocus={() => setFocusedField('name')}
          onBlur={() => setFocusedField(null)}
        />
        <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
          This name is the key used for searching — keep it descriptive.
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <FieldLabel>Description</FieldLabel>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="What are you studying? Any notes or goals..."
          rows={3}
          style={{ ...inputStyle(focusedField === 'desc'), resize: 'vertical', lineHeight: 1.5 }}
          onFocus={() => setFocusedField('desc')}
          onBlur={() => setFocusedField(null)}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <FieldLabel>Created At</FieldLabel>
        <div style={{
          padding: '10px 14px',
          background: 'var(--surface2)', border: '1px solid var(--border)',
          borderRadius: 8, color: 'var(--text-dim)', fontSize: '0.85rem',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span>🕐</span> {displayDate}
        </div>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
          Automatically retrieved from your system clock.
        </span>
      </div>

      <ModalActions
        onCancel={onClose}
        onConfirm={handleSubmit}
        confirmLabel="Create Subject"
        disabled={!name.trim()}
      />
    </Modal>
  )
}