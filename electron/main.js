const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const Database = require('better-sqlite3')

const isDev = process.env.NODE_ENV !== 'production'

// DB lives next to the app data folder
const dbPath = path.join(app.getPath('userData'), 'studytracker.db')
const db = new Database(dbPath)

// Init schema
db.exec(`
  CREATE TABLE IF NOT EXISTS subjects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    total_seconds INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now'))
  )
`)

// IPC handlers
ipcMain.handle('get-subjects', () => {
  return db.prepare('SELECT * FROM subjects ORDER BY created_at DESC').all()
})

ipcMain.handle('add-subject', (_, name) => {
  const stmt = db.prepare('INSERT INTO subjects (name) VALUES (?)')
  const result = stmt.run(name)
  return db.prepare('SELECT * FROM subjects WHERE id = ?').get(result.lastInsertRowid)
})

ipcMain.handle('update-time', (_, { id, seconds }) => {
  db.prepare('UPDATE subjects SET total_seconds = total_seconds + ? WHERE id = ?').run(seconds, id)
  return db.prepare('SELECT * FROM subjects WHERE id = ?').get(id)
})

ipcMain.handle('delete-subject', (_, id) => {
  db.prepare('DELETE FROM subjects WHERE id = ?').run(id)
  return { success: true }
})

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    minWidth: 700,
    minHeight: 500,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    titleBarStyle: 'hiddenInset',
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