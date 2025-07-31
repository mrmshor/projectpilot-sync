const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  openFolder: (folderPath) => {
    console.log('electronAPI.openFolder called with:', folderPath);
    return ipcRenderer.invoke('open-folder', folderPath);
  },
  showItemInFolder: (itemPath) => {
    console.log('electronAPI.showItemInFolder called with:', itemPath);
    return ipcRenderer.invoke('show-item-in-folder', itemPath);
  },
  selectFolder: () => {
    console.log('electronAPI.selectFolder called');
    return ipcRenderer.invoke('select-folder');
  },
  isElectron: true,
  getPlatform: () => {
    return process.platform;
  }
});

console.log('Preload script loaded successfully');