const electron = require('electron')

window.addEventListener('DOMContentLoaded', () => {
    document.body.setAttribute('data-platform', process.platform)
})
