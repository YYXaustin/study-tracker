const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const Store = require('electron-store')

const isDev = !app.isPackaged
const store = new Store()

function getSubjects() { return store.get('subjects', []) }
function saveSubjects(s) { store.set('subjects', s) }

function findById(subjects, id) {
  return subjects.find(s => String(s.id) === String(id))
}

ipcMain.handle('get-subjects', () => getSubjects())
ipcMain.handle('minimize', () => BrowserWindow.getFocusedWindow()?.minimize())
ipcMain.handle('close',    () => BrowserWindow.getFocusedWindow()?.close())

ipcMain.handle('add-subject', (_, name, description = '', createdAt = null) => {
  const subjects = getSubjects()
  const subject = {
    id: Date.now(),
    name,
    description,
    createdAt: createdAt || new Date().toISOString(),
    total_seconds: 0,
    sessions: [],
  }
  subjects.unshift(subject)
  saveSubjects(subjects)
  return subject
})

ipcMain.handle('update-time', (_, { id, seconds }) => {
  const subjects = getSubjects()
  const subject = findById(subjects, id)
  if (!subject) return null
  subject.total_seconds += seconds
  if (!Array.isArray(subject.sessions)) subject.sessions = []
  saveSubjects(subjects)
  return subject
})

ipcMain.handle('add-session', (_, { id, session }) => {
  const subjects = getSubjects()
  const subject = findById(subjects, id)
  if (!subject) {
    console.error('[add-session] subject not found for id:', id, 'type:', typeof id)
    return null
  }
  if (!Array.isArray(subject.sessions)) subject.sessions = []
  subject.sessions.push(session)
  saveSubjects(subjects)
  console.log('[add-session] saved session for:', subject.name, '| total sessions:', subject.sessions.length)
  return subject
})

ipcMain.handle('update-subject', (_, { id, updates }) => {
  const subjects = getSubjects()
  const subject = findById(subjects, id)
  if (!subject) return null
  if (updates.name        != null) subject.name        = updates.name
  if (updates.description != null) subject.description = updates.description
  if (updates.createdAt   != null) subject.createdAt   = updates.createdAt
  if (updates.sessions    != null) subject.sessions    = updates.sessions
  saveSubjects(subjects)
  return subject
})

ipcMain.handle('delete-subject', (_, id) => {
  saveSubjects(getSubjects().filter(s => String(s.id) !== String(id)))
  return { success: true }
})

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 900,
    minHeight: 600,
    center: true,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    backgroundColor: '#0d0d0f',
  })

  if (isDev) {
    win.loadURL('http://localhost:5173')
  } else {
    win.loadFile(path.join(__dirname, '../dist/index.html'))
  }

}

app.whenReady().then(createWindow)
app.on('window-all-closed', () => app.quit())