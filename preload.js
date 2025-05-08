const { contextBridge, ipcRenderer } = require("electron");

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("api", {
  // Database operations
  getWorkflows: () => ipcRenderer.invoke("get-workflows"),
  getWorkflow: (id) => ipcRenderer.invoke("get-workflow", id),
  saveWorkflow: (workflow) => ipcRenderer.invoke("save-workflow", workflow),
  deleteWorkflow: (id) => ipcRenderer.invoke("delete-workflow", id),

  // Action operations
  getActions: () => ipcRenderer.invoke("get-actions"),
  getAction: (id) => ipcRenderer.invoke("get-action", id),
  saveAction: (action) => ipcRenderer.invoke("save-action", action),
  deleteAction: (id) => ipcRenderer.invoke("delete-action", id),

  // Python script execution
  runPythonScript: (scriptName, args) =>
    ipcRenderer.invoke("run-python-script", scriptName, args),
});

window.addEventListener("DOMContentLoaded", () => {
  // Preload logic
});
