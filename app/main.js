const { app, BrowserWindow, ipcMain, shell, dialog, Menu } = require("electron");
const path = require("path");
const fs = require("fs");

const photoDir = () => path.join(app.getPath("userData"), "photos");
const safeKey = k => String(k).replace(/[^a-z0-9_-]/gi, "_");
const MIME = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".gif": "image/gif", ".bmp": "image/bmp" };

function findPhoto(key) {
  const dir = photoDir();
  if (!fs.existsSync(dir)) return null;
  const base = safeKey(key);
  const f = fs.readdirSync(dir).find(n => path.parse(n).name === base);
  return f ? path.join(dir, f) : null;
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1500, height: 920, minWidth: 1100, minHeight: 680,
    backgroundColor: "#0d1014", title: "Console Repair Atlas",
    icon: path.join(__dirname, "icon.png"),
    webPreferences: { preload: path.join(__dirname, "preload.js"), contextIsolation: true, nodeIntegration: false, sandbox: true }
  });
  win.loadFile(path.join(__dirname, "index.html"));
  win.webContents.setWindowOpenHandler(({ url }) => { if (/^https?:/.test(url)) shell.openExternal(url); return { action: "deny" }; });
  win.webContents.on("will-navigate", (e, url) => { if (!url.startsWith("file:")) { e.preventDefault(); if (/^https?:/.test(url)) shell.openExternal(url); } });
}

ipcMain.handle("open-external", (_e, url) => { if (/^https:\/\//.test(url)) shell.openExternal(url); });
ipcMain.handle("get-photo", (_e, key) => {
  const f = findPhoto(key); if (!f) return null;
  const mime = MIME[path.extname(f).toLowerCase()] || "image/jpeg";
  return `data:${mime};base64,${fs.readFileSync(f).toString("base64")}`;
});
ipcMain.handle("pick-photo", async (e, key) => {
  const win = BrowserWindow.fromWebContents(e.sender);
  const r = await dialog.showOpenDialog(win, { title: "Choose a photo of this part", properties: ["openFile"], filters: [{ name: "Images", extensions: ["jpg", "jpeg", "png", "webp", "gif", "bmp"] }] });
  if (r.canceled || !r.filePaths[0]) return false;
  fs.mkdirSync(photoDir(), { recursive: true });
  const old = findPhoto(key); if (old) fs.unlinkSync(old);
  fs.copyFileSync(r.filePaths[0], path.join(photoDir(), safeKey(key) + path.extname(r.filePaths[0]).toLowerCase()));
  return true;
});
ipcMain.handle("remove-photo", (_e, key) => { const f = findPhoto(key); if (f) fs.unlinkSync(f); return true; });

Menu.setApplicationMenu(null);
app.whenReady().then(createWindow);
app.on("window-all-closed", () => app.quit());
