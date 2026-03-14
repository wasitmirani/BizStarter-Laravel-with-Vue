const { app, BrowserWindow, shell } = require('electron');
const path = require('path');

let mainWindow;

const isDev = !app.isPackaged;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1360,
    height: 840,
    backgroundColor: '#020617',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'electron-preload.cjs'),
    },
    titleBarStyle: 'hiddenInset',
  });

  const appUrl =
    process.env.LARABASEKIT_DESKTOP_URL ||
    (isDev ? 'http://127.0.0.1:8000/app' : 'http://127.0.0.1:8000/app');

  mainWindow.loadURL(appUrl);

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  if (isDev) {
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

