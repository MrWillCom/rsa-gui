import React from 'react'
import Store from 'electron-store'
import RSA_CLI from 'rsa-cli'

import TitleBar from './components/TitleBar';
import Segment from './components/Segment';
import TextArea from './components/TextArea';
import DropdownButton from './components/DropdownButton';
import Dialog, { DialogHeader, DialogContent, DialogFooter } from './components/Dialog';

class App extends React.Component {
    constructor(props) {
        super(props)

        this.store = new Store()
        this.state = {
            mode: this.store.get('app.mode') || (() => { this.store.set('app.mode', 0); return 0 })(),
            input: '',
            output: '',
            isDialogOpen: false,
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
                            onChange={(ev) => this.setState({ input: ev.target.value })}
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
                                { label: 'Import', value: 'import' },
                                { label: 'Manage', value: 'manage' },
                            ]}
                            label="More"
                            selected={<i className="bi bi-three-dots"></i>}
                            onSelect={(option) => {
                                switch (option.value) {
                                    case 'generate':
                                        this.setState({ isDialogOpen: !this.state.isDialogOpen })
                                        break;
                                    case 'import':
                                        break;
                                    case 'manage':
                                        break;
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
            <Dialog
                open={this.state.isDialogOpen}
                header={<DialogHeader title="Generate a Key Pair" />}
                content={<DialogContent>
                    <p>Generate a new key pair to encrypt and decrypt your data.</p>
                </DialogContent>}
                footer={<DialogFooter actions="Working in Progress..." />}
                maskOnClick={this.closeDialog}
            />
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
    closeDialog = () => {
        this.setState({ isDialogOpen: false })
    }
}

export default App
