const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  openFolder: (folderPath) => ipcRenderer.invoke('open-folder', folderPath),
  showItemInFolder: (itemPath) => ipcRenderer.invoke('show-item-in-folder', itemPath),
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  isElectron: true
});