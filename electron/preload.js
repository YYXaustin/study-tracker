const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
  getSubjects: () => ipcRenderer.invoke('get-subjects'),
  addSubject: (name) => ipcRenderer.invoke('add-subject', name),
  updateTime: (id, seconds) => ipcRenderer.invoke('update-time', { id, seconds }),
  deleteSubject: (id) => ipcRenderer.invoke('delete-subject', id),
  minimize: () => ipcRenderer.invoke('minimize'),
  close: () => ipcRenderer.invoke('close'),
})