const electron = require('electron')

window.addEventListener('DOMContentLoaded', () => {
    document.body.setAttribute('data-platform', process.platform)
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) { document.body.classList.add('dark') }
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (ev) => {
        if (ev.matches) {
            document.body.classList.add('dark')
        } else {
            document.body.classList.remove('dark')
        }
    })
})
