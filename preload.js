const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('anchorlink', {
  getSettings: () => ipcRenderer.invoke('get-settings'),
  saveSettings: (settings) => ipcRenderer.invoke('save-settings', settings),
  selectDirectory: () => ipcRenderer.invoke('select-directory'),
  openExternal: (url) => ipcRenderer.invoke('open-external', url),
});
