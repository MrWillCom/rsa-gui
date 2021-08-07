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

            itemEl.addEventListener('click', (ev) => {
                this.show = false
                this.onSelect(ev)
            })

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

    get position() { return this.position }
    set position(value) {
        this.selector.style.setProperty('--left', `${value.x}px`)
        this.selector.style.setProperty('--top', `${value.y}px`)
    }

    onSelect = () => { }
}

const globalSelector = new popupSelector(document.querySelector('#global-selector'))

const input = document.querySelector('#input')

const win32WindowControls = {
    minimize: document.querySelector('#minimize'),
    maximize: document.querySelector('#maximize'),
    close: document.querySelector('#close'),
}

const presentAlert = async (params) => {
    const alert = document.createElement('ion-alert');
    if (params.className) { alert.cssClass = params.className; }
    if (params.header) { alert.header = params.header; }
    if (params.subHeader) { alert.subHeader = params.subHeader; }
    if (params.message) { alert.message = params.message; }
    if (params.buttons) { alert.buttons = params.buttons; }

    document.body.appendChild(alert);
    await alert.present();

    const { role } = await alert.onDidDismiss();
    if (typeof params.callback == 'function') { params.callback(role) }
}

// Todo: create a state manager
var State = {
    keys: {
        encrypt: 'test.outbound',
        decrypt: 'test.inbound',
    },
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
            require('../rsa-cli/src/commands/list')().then((keys) => {
                var listItems = []
                for (const keyName of keys) {
                    listItems.push({
                        text: keyName,
                    })
                }
                globalSelector.items = listItems
                globalSelector.onSelect = (e) => {
                    State.keys[ev.target.value] = e.target.innerText;
                }
                globalSelector.show = true
            }).catch((err) => {
                switch (err.code) {
                    case 'RSA_CLI:KEY_LIB_EMPTY':
                        presentAlert({
                            header: 'Key library is empty',
                            message: "You don't have any keys in the library.<br>To start encrypting/decrypting, generate/import one first.",
                            buttons: ['OK']
                        })
                        break;

                    default:
                        break;
                }
            })
        }
        historySegmentValue = segment.value
    })
}
