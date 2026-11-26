const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("myAppDesktop", {
  getEmojiData: () => ipcRenderer.invoke("emoji-data"),
  checkForUpdate: () => ipcRenderer.invoke("update-check"),
  downloadUpdate: () => ipcRenderer.invoke("update-download"),
  installUpdate: () => ipcRenderer.invoke("update-install"),
  onUpdateStatus: (callback) => {
    const listener = (_event, status) => callback(status);
    ipcRenderer.on("update-status", listener);
    return () => ipcRenderer.removeListener("update-status", listener);
  }
});
