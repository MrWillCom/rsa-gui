const segment = document.querySelector('#segment')
const input = document.querySelector('#input')

const win32WindowControls = {
    minimize: document.querySelector('#minimize'),
    maximize: document.querySelector('#maximize'),
    close: document.querySelector('#close'),
}

segment.value = 'encrypt'
input.placeholder = `Type here to ${segment.value}...`

segment.addEventListener('ionChange', (ev) => {
    input.placeholder = `Type here to ${segment.value}...`
})