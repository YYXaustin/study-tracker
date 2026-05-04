import { useState, useEffect, useCallback } from 'react'
import Sidebar            from './components/Sidebar'
import TrackerPanel       from './components/TrackerPanel'
import CreateModal        from './components/modals/CreateModal'
import EditModal          from './components/modals/EditModal'
import ConfirmModal       from './components/modals/ConfirmModal'
import HomePage           from './pages/HomePage'
import RecordsPage        from './pages/RecordsPage'
import SubjectDetailPage  from './pages/SubjectDetailPage'
import PersonalPage       from './pages/PersonalPage'

const api = window.api

export default function App() {
  const [subjects, setSubjects]             = useState([])
  const [loading, setLoading]               = useState(true)
  const [activePage, setActivePage]         = useState('home')
  const [showCreate, setShowCreate]         = useState(false)
  const [editingSubject, setEditingSubject] = useState(null)
  const [confirmDelete, setConfirmDelete]   = useState(null)
  const [detailSubject, setDetailSubject]   = useState(null) // subject object being viewed

  useEffect(() => {
    api.getSubjects().then(data => {
      setSubjects(data)
      setLoading(false)
    })
  }, [])

  const handleCreate = async ({ name, description, createdAt }) => {
    const subject = await api.addSubject(name, description, createdAt)
    setSubjects(prev => [subject, ...prev])
  }

  // Called whenever a subject's data changes (time tick or session saved)
  // Merges carefully — sessions from server always win (addSession returns them),
  // but we never let a time-tick response wipe out sessions already in state.
  const handleTimeUpdate = useCallback((updated) => {
    if (!updated || !updated.id) return
    setSubjects(prev => prev.map(s => {
      if (s.id !== updated.id) return s
      return {
        ...s,
        ...updated,
        // Keep whichever sessions array is longer — prevents time-tick wiping addSession result
        sessions: (updated.sessions && updated.sessions.length >= (s.sessions || []).length)
          ? updated.sessions
          : (s.sessions || []),
      }
    }))
    setDetailSubject(prev => {
      if (!prev || prev.id !== updated.id) return prev
      return {
        ...prev,
        ...updated,
        sessions: (updated.sessions && updated.sessions.length >= (prev.sessions || []).length)
          ? updated.sessions
          : (prev.sessions || []),
      }
    })
  }, [])

  const handleDeleteRequest = (id) => setConfirmDelete(id)

  const handleDeleteConfirm = async () => {
    if (!confirmDelete) return
    await api.deleteSubject(confirmDelete)
    setSubjects(prev => prev.filter(s => s.id !== confirmDelete))
    // If deleted subject was being viewed, go back to records
    if (detailSubject && detailSubject.id === confirmDelete) {
      setDetailSubject(null)
    }
    setConfirmDelete(null)
  }

  const handleEdit = async (id, updates) => {
    const updated = await api.updateSubject(id, updates)
    setSubjects(prev => prev.map(s => s.id === id ? updated : s))
    // Update detail view if open
    if (detailSubject && detailSubject.id === id) setDetailSubject(updated)
  }

  // Navigate to detail page — works from tracker panel or records list
  const handleViewDetail = (subjectOrId) => {
    const subject = typeof subjectOrId === 'object'
      ? subjectOrId
      : subjects.find(s => s.id === subjectOrId)
    if (!subject) return
    setDetailSubject(subject)
    setActivePage('records')
  }

  const handleNavigate = (page) => {
    if (page !== 'records') setDetailSubject(null)
    setActivePage(page)
  }

  const renderCenter = () => {
    if (loading) return <div style={{ padding: 40, color: 'var(--text-dim)' }}>Loading...</div>

    if (activePage === 'home')    return <HomePage subjects={subjects} />
    if (activePage === 'profile') return <PersonalPage />

    if (activePage === 'records') {
      // Show detail page if a subject is selected
      if (detailSubject) {
        // Always get the freshest version from subjects array
        const fresh = subjects.find(s => s.id === detailSubject.id) || detailSubject
        return (
          <SubjectDetailPage
            subject={fresh}
            onBack={() => setDetailSubject(null)}
          />
        )
      }
      return (
        <RecordsPage
          subjects={subjects}
          onSelectSubject={handleViewDetail}
        />
      )
    }

    return null
  }

  const deletingSubject = subjects.find(s => s.id === confirmDelete)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>

      {showCreate && (
        <CreateModal onClose={() => setShowCreate(false)} onCreate={handleCreate} />
      )}
      {editingSubject && (
        <EditModal
          subject={editingSubject}
          onClose={() => setEditingSubject(null)}
          onSave={handleEdit}
        />
      )}
      {confirmDelete && (
        <ConfirmModal
          title="Delete subject?"
          message={deletingSubject ? `"${deletingSubject.name}" and all its sessions will be permanently removed.` : undefined}
          confirmLabel="Delete"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      {/* Title bar */}
      <div style={{
        WebkitAppRegion: 'drag',
        height: 40, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px', background: '#0d0d0f',
        borderBottom: '1px solid var(--border)', flexShrink: 0, zIndex: 1000,
      }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Study Tracker</span>
        <div style={{ display: 'flex', gap: 8, WebkitAppRegion: 'no-drag' }}>
          <button onClick={() => window.api.minimize()} style={{
            width: 12, height: 12, borderRadius: '50%', background: '#f5a623', border: 'none', cursor: 'pointer',
          }} />
          <button onClick={() => window.api.close()} style={{
            width: 12, height: 12, borderRadius: '50%', background: '#ff5f57', border: 'none', cursor: 'pointer',
          }} />
        </div>
      </div>

      {/* Three-panel layout */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar activePage={activePage} onNavigate={handleNavigate} />
        <main style={{ flex: 1, overflowY: 'auto', background: 'var(--bg)' }}>
          {renderCenter()}
        </main>
        <TrackerPanel
          subjects={subjects}
          onTimeUpdate={handleTimeUpdate}
          onDelete={handleDeleteRequest}
          onEdit={setEditingSubject}
          onOpenCreate={() => setShowCreate(true)}
          onViewDetail={handleViewDetail}
        />
      </div>
    </div>
  )
}