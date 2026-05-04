const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
  // Window controls
  minimize: ()                    => ipcRenderer.invoke('minimize'),
  close:    ()                    => ipcRenderer.invoke('close'),

  // Subjects
  getSubjects: ()                 => ipcRenderer.invoke('get-subjects'),
  addSubject:  (name, desc, at)   => ipcRenderer.invoke('add-subject', name, desc, at),
  updateTime:  (id, seconds)      => ipcRenderer.invoke('update-time', { id, seconds }),
  deleteSubject: (id)             => ipcRenderer.invoke('delete-subject', id),
  updateSubject: (id, updates)    => ipcRenderer.invoke('update-subject', { id, updates }),

  // Sessions
  addSession: (id, session)       => ipcRenderer.invoke('add-session', { id, session }),
})