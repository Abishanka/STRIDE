window.onload = () => {
  const { contextBridge, ipcRenderer } = require("electron");

  contextBridge.exposeInMainWorld("ipcRenderer", {
    send: (channel, data) => {
      ipcRenderer.send(channel, data);
    },
    receive: (channel, data) => {
      ipcRenderer.on(channel, data);
    },
  });
};
