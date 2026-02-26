const { app, BrowserWindow, ipcMain, shell, dialog, Tray, Menu, nativeImage } = require('electron');
const path = require('path');
const fs = require('fs');
const express = require('express');

const PORT = 19283;
const server = express();
let engine = require('ejs-locals');

// ── Settings ──────────────────────────────────────────────────────────────────

const settingsPath = path.join(app.getPath('userData'), 'settings.json');

function loadSettings() {
  try {
    if (fs.existsSync(settingsPath)) {
      return JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));
    }
  } catch (e) {}
  return { rootDir: '' };
}

function saveSettings(settings) {
  fs.mkdirSync(path.dirname(settingsPath), { recursive: true });
  fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
}

function resolvePath(filePath) {
  if (!filePath) return '';
  if (path.isAbsolute(filePath)) return filePath;
  const { rootDir } = loadSettings();
  if (rootDir) return path.join(rootDir, filePath);
  return filePath;
}

// ── Routes ────────────────────────────────────────────────────────────────────

server.get('/open-file', (req, res) => {
  const filePath = resolvePath(req.query.path);
  if (!filePath) { res.render('no_path'); return; }
  shell.openPath(filePath).then(() => {
    res.render('open_success', { open_file_path: filePath });
  }).catch(() => {
    res.render('open_fail', { open_file_path: filePath });
  });
});

server.get('/open-or-create', (req, res) => {
  const filePath = resolvePath(req.query.path);
  const isFolder = req.query.type === 'folder';

  if (!filePath) { res.render('no_path'); return; }

  const exists = fs.existsSync(filePath);
  if (!exists) {
    try {
      if (isFolder) {
        fs.mkdirSync(filePath, { recursive: true });
      } else {
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
        fs.writeFileSync(filePath, '');
      }
    } catch (err) {
      res.render('open_fail', { open_file_path: filePath });
      return;
    }
  }

  shell.openPath(filePath).then(() => {
    if (exists) {
      res.render('open_success', { open_file_path: filePath });
    } else {
      res.render('create_success', { open_file_path: filePath, item_type: isFolder ? 'Folder' : 'File' });
    }
  }).catch(() => {
    res.render('open_fail', { open_file_path: filePath });
  });
});

server.get('/obsidian-open-or-create', (req, res) => {
  const file = req.query.file;
  if (!file) { res.render('no_path'); return; }
  const { obsidianVaultPath } = loadSettings();
  if (!obsidianVaultPath) { res.render('no_path'); return; }
  const vaultName = path.basename(obsidianVaultPath);
  const fullPath = path.join(obsidianVaultPath, file);
  const exists = fs.existsSync(fullPath);
  const action = exists ? 'open' : 'new';
  const url = `obsidian://${action}?vault=${encodeURIComponent(vaultName)}&file=${encodeURIComponent(file)}`;
  shell.openExternal(url).then(() => {
    res.render('redirect_success', { url });
  }).catch(() => {
    res.render('redirect_fail', { url });
  });
});

server.engine('ejs', engine);
server.set('views', __dirname + '/views');
server.set('view engine', 'ejs');
server.use(express.static(__dirname + '/views'));

server.listen(PORT, () => {
  console.log(`AnchorLink running on http://localhost:${PORT}`);
});

// ── Window & Tray ─────────────────────────────────────────────────────────────

let mainWindow;
let tray;
let isQuitting = false;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 540,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    resizable: false,
    title: 'AnchorLink',
    backgroundColor: '#f2f2f7',
  });

  mainWindow.loadFile('index.html');

  // 关闭按钮只隐藏窗口，服务继续运行
  mainWindow.on('close', (e) => {
    if (!isQuitting) {
      e.preventDefault();
      mainWindow.hide();
      app.dock.hide();
    }
  });
}

function openSettings() {
  if (!mainWindow) createWindow();
  mainWindow.show();
  mainWindow.focus();
  app.dock.show();
}

function createTray() {
  let icon = nativeImage.createFromPath(path.join(__dirname, 'icons/trayTemplate.png'));
  icon.setTemplateImage(true);

  tray = new Tray(icon);
  tray.setToolTip('AnchorLink');
  tray.on('click', openSettings);

  tray.setContextMenu(Menu.buildFromTemplate([
    { label: `AnchorLink  ·  localhost:${PORT}`, enabled: false },
    { type: 'separator' },
    { label: '设置', click: openSettings },
    { type: 'separator' },
    { label: '退出', click: () => { isQuitting = true; app.quit(); } },
  ]));
}

app.whenReady().then(() => {
  app.dock.hide();
  createTray();
  createWindow(); // 首次启动显示设置页
  app.dock.show();
});

app.on('before-quit', () => { isQuitting = true; });

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// ── IPC ───────────────────────────────────────────────────────────────────────

ipcMain.handle('get-settings', () => loadSettings());

ipcMain.handle('save-settings', (event, settings) => {
  saveSettings(settings);
  return true;
});

ipcMain.handle('open-external', (event, url) => {
  shell.openExternal(url);
});

ipcMain.handle('select-directory', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
    title: '选择根目录',
  });
  return result.canceled ? null : result.filePaths[0];
});
