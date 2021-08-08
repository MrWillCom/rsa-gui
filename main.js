// const { app, BrowserWindow } = require('electron')
const electron = require('electron')
const path = require('path')
const Store = require('electron-store')

class Background {
  constructor() {
    this.window = null;
    this.tray = null;
    this.store = new Store({
      window: {
        width: { type: 'number', default: 800 },
        height: { type: 'number', default: 600 },
      }
    });

    this.init();
  }

  init() {
    this.handleAppEvents()
  }

  createWindow() {
    const win = new electron.BrowserWindow({
      width: this.store.get('window.width') || 800,
      height: this.store.get('window.height') || 600,
      minWidth: 300,
      minHeight: 360,
      titleBarStyle: 'hiddenInset',
      title: 'RSA',
      frame: process.platform !== 'win32',
      show: false,
      backgroundColor: electron.nativeTheme.shouldUseDarkColors ? '#fff' : '#000',
      webPreferences: {
        webSecurity: false,
        nodeIntegration: true,
        enableRemoteModule: true,
        contextIsolation: false,
      },
    })

    win.loadFile('lib/index.html')

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

  handleIpcMainEvents() { }
}

new Background()
