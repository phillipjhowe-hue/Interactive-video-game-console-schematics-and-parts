const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("atlas", {
  openExternal: url => ipcRenderer.invoke("open-external", url),
  getPhoto: key => ipcRenderer.invoke("get-photo", key),
  pickPhoto: key => ipcRenderer.invoke("pick-photo", key),
  removePhoto: key => ipcRenderer.invoke("remove-photo", key)
});
