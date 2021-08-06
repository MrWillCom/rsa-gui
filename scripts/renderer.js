const electron = require('electron')

const ipcRenderer = electron.ipcRenderer;

win32WindowControls.minimize.addEventListener('click', () => {
    ipcRenderer.send('minimize');
})

win32WindowControls.maximize.addEventListener('click', () => {
    ipcRenderer.send('maximize');
})

ipcRenderer.on('maximize', (event, value) => {
    if (value) {
        win32WindowControls.maximize.classList.add('codicon-chrome-maximize');
    } else {
        win32WindowControls.maximize.classList.remove('codicon-chrome-maximize');
    }

    if (!value) {
        win32WindowControls.maximize.classList.add('codicon-chrome-restore');
    } else {
        win32WindowControls.maximize.classList.remove('codicon-chrome-restore');
    }
})

win32WindowControls.close.addEventListener('click', () => {
    ipcRenderer.send('close');
})
