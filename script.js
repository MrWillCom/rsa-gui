const segment = document.querySelector('#segment')
const input = document.querySelector('#input')

segment.value = 'encrypt'
input.placeholder = `Type here to ${segment.value}...`

segment.addEventListener('ionChange', (ev) => {
    input.placeholder = `Type here to ${segment.value}...`
})