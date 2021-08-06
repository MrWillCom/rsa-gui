// const { app, BrowserWindow } = require('electron')
const electron = require('electron')
const path = require('path')
const Store = require('electron-store')

const store = new Store();

class Background {
  constructor() {
    this.window = null;
    this.tray = null;
    this.store = new Store({
      windowWidth: {
        width: { type: 'number', default: 1440 },
        height: { type: 'number', default: 840 },
      },
    });

    this.init();
  }

  init() {
    this.handleAppEvents()
  }

  createWindow() {
    const win = new electron.BrowserWindow({
      width: 800,
      height: 600,
      titleBarStyle: 'hiddenInset',
      title: 'RSA',
      frame: process.platform !== 'win32',
      show: false,
      backgroundColor: electron.nativeTheme.shouldUseDarkColors ? '#fff' : '#000',
      webPreferences: {
        preload: path.join(__dirname, 'scripts/preload.js'),
        webSecurity: false,
        nodeIntegration: true,
        enableRemoteModule: true,
        contextIsolation: false,
      },
    })

    win.loadFile('index.html')

    this.window = win
  }

  handleAppEvents() {
    electron.app.whenReady().then(() => {
      this.createWindow()
      this.handleWindowEvents();
      this.handleIpcMainEvents();

      electron.app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
          this.createWindow()
        }
      })
    })

    electron.app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        electron.app.quit()
      }
    })
  }

  handleWindowEvents() {
    this.window.once('ready-to-show', () => {
      this.window.show();
    });
  }

  handleIpcMainEvents() {
    electron.ipcMain.on('minimize', () => {
      this.window.minimize()
    })

    this.window.webContents.send('maximize', this.window.isMaximized());
    electron.ipcMain.on('maximize', () => {
      const isMaximized = this.window.isMaximized();
      isMaximized ? this.window.unmaximize() : this.window.maximize();
      this.window.webContents.send('maximize', isMaximized);
    });

    electron.ipcMain.on('close', () => {
      this.window.close()
    })
  }
}

new Background()
