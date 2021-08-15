import React from 'react'
import Store from 'electron-store'
import RSA_CLI from 'rsa-cli'

import TitleBar from './components/TitleBar';
import Segment from './components/Segment';
import TextArea from './components/TextArea';
import DropdownButton from './components/DropdownButton';
import Dialog, { DialogHeader, DialogContent, DialogFooter } from './components/Dialog';
import Button from './components/Button';
import Input from './components/Input';
import Page from './components/Page';
import SettingsPage from './pages/Settings';

class App extends React.Component {
    constructor(props) {
        super(props)

        this.store = new Store()
        this.state = {
            mode: this.store.get('app.mode') || (() => { this.store.set('app.mode', 0); return 0 })(),
            input: '',
            output: '',
            isDialogOpen: {
                generate: false,
                import: false,
            },
            isSettingsPageOpen: false,
            settingsPageNavigationIndex: 0,
            data: {
                generate: {
                    keyName: '',
                    modulusLength: '',
                },
            },
            keyList: [],
            publicKey: this.store.get('app.publicKey') || <i className="bi bi-chevron-down"></i>,
            privateKey: this.store.get('app.privateKey') || <i className="bi bi-chevron-down"></i>,
        }
    }
    render() {
        return <>
            <TitleBar />
            <div className="main">
                <Segment
                    options={['Encrypt', 'Decrypt']}
                    onChange={(mode) => {
                        if (this.state.mode == mode) {
                            this.state.mode == 0 ? this.encrypt() : this.decrypt()
                        } else {
                            this.setMode(mode)
                        }
                    }}
                    selected={this.state.mode}
                    className="mode-segment"
                />
                <div className="io-area">
                    <div className="top">
                        <TextArea
                            placeholder={`Type here to ${['encrypt', 'decrypt'][this.state.mode]}...`}
                            className={`input ${this.state.mode == 0 ? '' : 'text-smaller'}`}
                            value={this.state.input}
                            onChange={(ev) => {
                                this.setState({ input: ev.target.value })
                                if (ev.target.value != '') {
                                    this.execute()
                                } else {
                                    this.setState({ output: '' })
                                }
                            }}
                            onKeyDown={(ev) => {
                                if (ev.code == 'Enter' && ev.ctrlKey === true) {
                                    this.execute()
                                }
                            }}
                        />
                        <p className={`output ${this.state.mode == 1 ? '' : 'text-smaller'}`}>{this.state.output}</p>
                    </div>
                    <div className="bottom">
                        <DropdownButton
                            options={this.getDropdownButtonOptionsFromArray(this.state.keyList)}
                            selected={this.state.publicKey}
                            label="Public Key"
                            onSelect={(option) => {
                                this.setState({ publicKey: option.value });
                                this.store.set('app.publicKey', option.value);
                            }}
                            onToggle={() => { this.updateKeyList() }}
                        />
                        <DropdownButton
                            options={this.getDropdownButtonOptionsFromArray(this.state.keyList)}
                            selected={this.state.privateKey}
                            label="Private Key"
                            onSelect={(option) => {
                                this.setState({ privateKey: option.value });
                                this.store.set('app.privateKey', option.value);
                            }}
                            onToggle={() => { this.updateKeyList() }}
                        />
                        <DropdownButton
                            options={[
                                { label: 'Generate', value: 'generate' },
                                { label: 'Settings', value: 'settings' },
                            ]}
                            label="More"
                            selected={<i className="bi bi-three-dots"></i>}
                            onSelect={(option) => {
                                switch (option.value) {
                                    case 'generate':
                                        this.toggleGenerateDialog(true)
                                        break;
                                    case 'settings':
                                        this.toggleSettingsPage(true)
                                        break;
                                }
                            }}
                        />
                    </div>
                </div>
                <Dialog
                    open={this.state.isDialogOpen.generate}
                    header={<DialogHeader title="Generate a Key Pair" />}
                    content={
                        <DialogContent>
                            <p>Generate a new key pair to encrypt and decrypt your data.</p>
                            <Input
                                value={this.state.data.generate.keyName}
                                label="Key Name"
                                onChange={(ev) => { this.setState({ data: { generate: { keyName: ev.target.value } } }) }}
                            />
                            <Input
                                value={this.state.data.generate.modulusLength}
                                label="Modulus Length"
                                placeholder="2048"
                                type="number"
                                onChange={(ev) => { this.setState({ data: { generate: { modulusLength: ev.target.value } } }) }}
                            />
                        </DialogContent>
                    }
                    footer={<DialogFooter actions={<>
                        <Button color="Primary" onClick={() => {
                            this.toggleGenerateDialog()
                            this.generate()
                        }}>Generate</Button>
                        <Button onClick={this.toggleGenerateDialog}>Cancel</Button>
                    </>} />}
                    maskOnClick={this.toggleGenerateDialog}
                />
                <Page
                    open={this.state.isSettingsPageOpen}
                    includeTitleBar={true}
                    showBackButton={true}
                    backButtonOnClick={() => { this.toggleSettingsPage(false) }}>
                    <SettingsPage />
                </Page>
            </div>
        </>
    }
    componentDidMount = () => {
        this.updateKeyList()
    }
    updateKeyList = async () => {
        const keyList = await RSA_CLI.list({ params: { quiet: true } })
        this.setState({ keyList: keyList })
    }
    getDropdownButtonOptionsFromArray(arr, suffix) {
        if (suffix === undefined) { suffix = [] }
        var options = []
        for (const item of arr) {
            options.push({
                label: item,
                value: item,
            })
        }
        for (const item of suffix) {
            options.push(item)
        }
        return options
    }
    setMode(mode) {
        mode = parseInt(mode, 10)
        this.setState({ mode: mode })
        this.store.set('app.mode', mode);
    }
    execute() {
        if (this.state.mode === 0) {
            this.encrypt()
        } else if (this.state.mode === 1) {
            this.decrypt()
        }
    }
    generate = async () => {
        await RSA_CLI.generate({
            keyName: this.state.data.generate.keyName,
            params: {
                'modulus-length': this.state.data.generate.modulusLength,
                quiet: true,
            }
        })
        this.updateKeyList()
    }
    encrypt = async () => {
        const encrypted = await RSA_CLI.encrypt({
            keyName: this.state.publicKey,
            object: this.state.input,
            params: { quiet: true }
        })
        this.setState({ output: encrypted })
    }
    decrypt = async () => {
        const decrypted = await RSA_CLI.decrypt({
            keyName: this.state.privateKey,
            object: this.state.input,
            params: { quiet: true }
        })
        this.setState({ output: decrypted })
    }
    toggleGenerateDialog = (willBeOpen) => {
        if (typeof willBeOpen == 'boolean') {
            this.setState({ isDialogOpen: { generate: willBeOpen } })
        } else {
            this.setState({ isDialogOpen: { generate: !this.state.isDialogOpen.generate } })
        }
    }
    toggleSettingsPage = (willBeOpen) => {
        if (typeof willBeOpen == 'boolean') {
            this.setState({ isSettingsPageOpen: willBeOpen })
        } else {
            this.setState({ isSettingsPageOpen: !this.state.isSettingsPageOpen })
        }
    }
}

export default App
