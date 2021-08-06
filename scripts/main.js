const segment = document.querySelector('#segment')
const segmentButtons = document.querySelectorAll('#segment>ion-segment-button')

class popupSelector {
    constructor(el) {
        this.selector = el
        this.mask = el.parentElement
        this.items = [
            {
                text: 'test-key-0',
            },
            {
                text: 'test-key-1',
            },
            {
                text: 'test-key-2',
            },
        ]
        this.show = this.mask.classList.contains('show')
        this.position = {
            x: 0,
            y: 0,
        }

        this.mask.addEventListener('click', () => { this.show = false })
        this.selector.addEventListener('click', (ev) => {
            ev.stopPropagation()
        })
    }

    get items() { return items }
    set items(value) {
        while (this.selector.hasChildNodes()) {
            this.selector.removeChild(this.selector.firstChild)
        }
        for (const item of value) {
            var itemEl = document.createElement('button')

            itemEl.innerHTML = item.text

            itemEl.classList.add('popup-selector-item')

            if (item.classList && typeof item.classList == 'object') {
                for (const className of item.classList) {
                    itemEl.classList.add(className)
                }
            }

            if (item.events && typeof item.events == 'object') {
                for (const event in item.events) {
                    itemEl.addEventListener(event, item.events[event])
                }
            }

            this.selector.appendChild(itemEl)
        }
    }

    get show() { return this.mask.classList.contains('show') }
    set show(value) {
        if (value) {
            this.mask.classList.add('show')
            this.selector.classList.add('show')
        } else {
            this.mask.classList.remove('show')
            this.selector.classList.remove('show')
        }
    }

    get position (){ return this.position }
    set position (value){
        this.selector.style.setProperty('--left', `${value.x}px`)
        this.selector.style.setProperty('--top', `${value.y}px`)
    }
}

const keySelector = new popupSelector(document.querySelector('#key-selector'))

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

var historySegmentValue = segment.value

for (const button of segmentButtons) {
    button.addEventListener('click', (ev) => {
        if (historySegmentValue === ev.target.value) {
            keySelector.show = true
        }
        historySegmentValue = segment.value
    })
}
