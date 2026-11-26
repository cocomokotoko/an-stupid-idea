const path = require("node:path");
const { app, BrowserWindow, shell } = require("electron");

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
      sandbox: true
    }
  });

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
