const path = require("node:path");
const fs = require("node:fs");
const { app, BrowserWindow, shell, ipcMain } = require("electron");
const { autoUpdater } = require("electron-updater");

autoUpdater.autoDownload = false;
autoUpdater.allowDowngrade = false;

function sendUpdateStatus(window, status, info = {}) {
  if (!window.isDestroyed()) {
    window.webContents.send("update-status", { status, ...info });
  }
}

function setupAutoUpdater(window) {
  if (setupAutoUpdater.started) return;
  setupAutoUpdater.started = true;

  const sendToWindows = (status, info = {}) => {
    for (const browserWindow of BrowserWindow.getAllWindows()) {
      sendUpdateStatus(browserWindow, status, info);
    }
  };
  autoUpdater.on("checking-for-update", () => sendToWindows("checking"));
  autoUpdater.on("update-available", (info) => sendToWindows("available", { version: info.version }));
  autoUpdater.on("update-not-available", (info) => sendToWindows("current", { version: info.version }));
  autoUpdater.on("download-progress", (progress) => sendToWindows("downloading", { percent: progress.percent }));
  autoUpdater.on("update-downloaded", (info) => sendToWindows("downloaded", { version: info.version }));
  autoUpdater.on("error", (error) => sendToWindows("error", { message: error.message }));

  ipcMain.handle("update-check", async () => {
    if (!app.isPackaged) return { status: "unavailable" };
    await autoUpdater.checkForUpdates();
  });
  ipcMain.handle("update-download", async () => {
    if (!app.isPackaged) return { status: "unavailable" };
    await autoUpdater.downloadUpdate();
  });
  ipcMain.handle("update-install", () => autoUpdater.quitAndInstall());

  ipcMain.handle("emoji-data", () => {
    const file = path.join(__dirname, "..", "emoji-data.json");
    return JSON.parse(fs.readFileSync(file, "utf8"));
  });

  if (app.isPackaged) {
    setTimeout(() => {
      void autoUpdater.checkForUpdates().catch((error) => {
        console.error("Could not check for app updates:", error);
      });
    }, 5000);
  }
}

function createWindow() {
  const window = new BrowserWindow({
    width: 1100,
    height: 760,
    minWidth: 360,
    minHeight: 500,
    autoHideMenuBar: true,
    backgroundColor: "#f5f4f0",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      preload: path.join(__dirname, "preload.cjs")
    }
  });

  setupAutoUpdater(window);

  window.webContents.setWindowOpenHandler(({ url }) => {
    try {
      const destination = new URL(url);
      if (destination.protocol === "https:" || destination.protocol === "http:") {
        void shell.openExternal(destination.href).catch((error) => {
          console.error("Could not open external link:", error);
        });
      } else {
        console.error(`Blocked external link with unsupported protocol: ${destination.protocol}`);
      }
    } catch (error) {
      console.error("Could not open external link:", error);
    }
    return { action: "deny" };
  });

  void window.loadFile(path.join(__dirname, "..", "index.html"), {
    query: { "desktop-app": "1" }
  }).catch((error) => {
    console.error("Could not load the app window:", error);
  });
}

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
}).catch((error) => {
  console.error("Could not start My app space:", error);
  app.quit();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
