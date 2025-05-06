const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { PythonShell } = require("python-shell");
const fetch = require("node-fetch");
const isDev = process.env.NODE_ENV === "development";

let mainWindow = null;

function createWindow() {
  if (mainWindow) {
    mainWindow.focus();
    return;
  }

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  if (isDev) {
    // In development, load from React dev server
    mainWindow.loadURL("http://localhost:3000");
    mainWindow.webContents.openDevTools();
  } else {
    // In production, load from the built files
    mainWindow.loadFile(path.join(__dirname, "renderer/build/index.html"));
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", function () {
  if (mainWindow === null) createWindow();
});

ipcMain.handle("run-python-script", async (event, scriptName, args) => {
  return new Promise((resolve, reject) => {
    PythonShell.run(scriptName, { args }, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
});
