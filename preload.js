const { contextBridge, ipcRenderer, shell } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  openFolder: (folderPath) => {
    console.log('electronAPI.openFolder called with:', folderPath);
    return shell.openPath(folderPath);
  },
  showItemInFolder: (itemPath) => {
    console.log('electronAPI.showItemInFolder called with:', itemPath);
    return shell.showItemInFolder(itemPath);
  },
  selectFolder: async () => {
    console.log('electronAPI.selectFolder called');
    const { dialog } = require('@electron/remote') || require('electron').remote;
    if (!dialog) {
      // Fallback to ipcRenderer if remote is not available
      return ipcRenderer.invoke('select-folder');
    }
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory']
    });
    console.log('selectFolder result:', result);
    if (result.canceled) {
      return { canceled: true };
    }
    return { success: true, path: result.filePaths[0] };
  },
  createNote: (content) => {
    console.log('electronAPI.createNote called with content length:', content.length);
    return ipcRenderer.invoke('create-note', content);
  },
  isElectron: true
});

console.log('Preload script loaded successfully');