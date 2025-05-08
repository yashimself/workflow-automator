const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { PythonShell } = require("python-shell");
const fetch = require("node-fetch");
const isDev = process.env.NODE_ENV === "development";
const Database = require("better-sqlite3");

let mainWindow = null;
let db = null;

function initializeDatabase() {
  const userDataPath = app.getPath("userData");
  const dbPath = path.join(userDataPath, "workflow-automator.db");
  db = new Database(dbPath);

  // Create tables if they don't exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS actions (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      name TEXT NOT NULL,
      config TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS workflows (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS workflow_nodes (
      id TEXT PRIMARY KEY,
      workflow_id TEXT NOT NULL,
      node_id TEXT NOT NULL,
      type TEXT NOT NULL,
      position_x REAL NOT NULL,
      position_y REAL NOT NULL,
      config TEXT,
      FOREIGN KEY (workflow_id) REFERENCES workflows(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS workflow_edges (
      id TEXT PRIMARY KEY,
      workflow_id TEXT NOT NULL,
      source TEXT NOT NULL,
      target TEXT NOT NULL,
      FOREIGN KEY (workflow_id) REFERENCES workflows(id) ON DELETE CASCADE
    );
  `);
}

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
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
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

// Initialize database when app is ready
app.whenReady().then(() => {
  initializeDatabase();
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Handle database operations through IPC
ipcMain.handle("get-workflows", () => {
  const stmt = db.prepare("SELECT * FROM workflows ORDER BY created_at DESC");
  return stmt.all();
});

ipcMain.handle("get-workflow", (event, id) => {
  const workflowStmt = db.prepare("SELECT * FROM workflows WHERE id = ?");
  const nodesStmt = db.prepare(
    "SELECT * FROM workflow_nodes WHERE workflow_id = ?"
  );
  const edgesStmt = db.prepare(
    "SELECT * FROM workflow_edges WHERE workflow_id = ?"
  );

  const workflow = workflowStmt.get(id);
  if (!workflow) return null;

  const nodes = nodesStmt.all(id).map((node) => ({
    ...node,
    config: JSON.parse(node.config || "{}"),
  }));
  const edges = edgesStmt.all(id);

  return {
    ...workflow,
    nodes,
    edges,
  };
});

ipcMain.handle("save-workflow", (event, workflow) => {
  const workflowStmt = db.prepare(`
    INSERT OR REPLACE INTO workflows (id, name)
    VALUES (?, ?)
  `);
  workflowStmt.run(workflow.id, workflow.name);

  // Delete existing nodes and edges
  const deleteNodesStmt = db.prepare(
    "DELETE FROM workflow_nodes WHERE workflow_id = ?"
  );
  const deleteEdgesStmt = db.prepare(
    "DELETE FROM workflow_edges WHERE workflow_id = ?"
  );
  deleteNodesStmt.run(workflow.id);
  deleteEdgesStmt.run(workflow.id);

  // Insert new nodes
  const nodeStmt = db.prepare(`
    INSERT INTO workflow_nodes (id, workflow_id, node_id, type, position_x, position_y, config)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  workflow.nodes.forEach((node) => {
    nodeStmt.run(
      `${workflow.id}-${node.id}`,
      workflow.id,
      node.id,
      node.type,
      node.position.x,
      node.position.y,
      JSON.stringify(node.data.config || {})
    );
  });

  // Insert new edges
  const edgeStmt = db.prepare(`
    INSERT INTO workflow_edges (id, workflow_id, source, target)
    VALUES (?, ?, ?, ?)
  `);
  workflow.edges.forEach((edge) => {
    edgeStmt.run(
      `${workflow.id}-${edge.id}`,
      workflow.id,
      edge.source,
      edge.target
    );
  });

  return workflow;
});

ipcMain.handle("delete-workflow", (event, id) => {
  const stmt = db.prepare("DELETE FROM workflows WHERE id = ?");
  stmt.run(id);
  return true;
});

// Handle Python script execution
ipcMain.handle("run-python-script", async (event, scriptName, args) => {
  return new Promise((resolve, reject) => {
    PythonShell.run(scriptName, { args }, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
});

// Handle action-related database operations
ipcMain.handle("get-actions", () => {
  const stmt = db.prepare("SELECT * FROM actions ORDER BY created_at DESC");
  return stmt.all().map((action) => ({
    ...action,
    config: JSON.parse(action.config || "{}"),
  }));
});

ipcMain.handle("get-action", (event, id) => {
  const stmt = db.prepare("SELECT * FROM actions WHERE id = ?");
  const action = stmt.get(id);
  return action
    ? {
        ...action,
        config: JSON.parse(action.config || "{}"),
      }
    : null;
});

ipcMain.handle("save-action", (event, action) => {
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO actions (id, type, name, config)
    VALUES (?, ?, ?, ?)
  `);
  stmt.run(
    action.id,
    action.type,
    action.name,
    JSON.stringify(action.config || {})
  );
  return action;
});

ipcMain.handle("delete-action", (event, id) => {
  const stmt = db.prepare("DELETE FROM actions WHERE id = ?");
  stmt.run(id);
  return true;
});
