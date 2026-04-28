const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const Store = require('electron-store')


const isDev = !app.isPackaged

const store = new Store()

// Helpers
function getSubjects() {
  return store.get('subjects', [])
}
function saveSubjects(subjects) {
  store.set('subjects', subjects)
}

// IPC handlers
ipcMain.handle('get-subjects', () => {
  return getSubjects()
})

ipcMain.handle('minimize', () => {
  BrowserWindow.getFocusedWindow().minimize()
})
ipcMain.handle('close', () => {
  BrowserWindow.getFocusedWindow().close()
})

ipcMain.handle('add-subject', (_, name) => {
  const subjects = getSubjects()
  const newSubject = {
    id: Date.now(),
    name,
    total_seconds: 0,
    created_at: new Date().toISOString(),
  }
  subjects.unshift(newSubject)
  saveSubjects(subjects)
  return newSubject
})

ipcMain.handle('update-time', (_, { id, seconds }) => {
  const subjects = getSubjects()
  const subject = subjects.find(s => s.id === id)
  if (subject) {
    subject.total_seconds += seconds
    saveSubjects(subjects)
    return subject
  }
})

ipcMain.handle('delete-subject', (_, id) => {
  const subjects = getSubjects().filter(s => s.id !== id)
  saveSubjects(subjects)
  return { success: true }
})

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    minWidth: 700,
    minHeight: 500,
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