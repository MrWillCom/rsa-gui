import electron from 'electron'
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
import BootstrapIcon from './components/BootstrapIcon';

class App extends React.Component {
    constructor(props) {
        super(props)

        this.store = new Store()
        this.state = {
            mode: this.store.get('app.mode') || (() => { this.store.set('app.mode', 0); return 0 })(),
            input: '',
            output: '',
            isDialogOpen: {
                password: false,
                generate: false,
            },
            isSettingsPageOpen: false,
            settingsPageNavigationIndex: 0,
            generateDialog: {
                keyName: '',
                modulusLength: '',
            },
            keyList: {
                public: [],
                private: [],
            },
            passwordEnabled: false,
            password: '',
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
                                    this.execute(ev.target.value)
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
                            options={this.getDropdownButtonOptionsFromArray(this.state.keyList.public)}
                            selected={this.state.publicKey}
                            label="Public Key"
                            onSelect={(option) => {
                                this.setState({ publicKey: option.value });
                                this.store.set('app.publicKey', option.value);
                            }}
                            onToggle={() => { this.updateKeyList() }}
                        />
                        <DropdownButton
                            options={this.getDropdownButtonOptionsFromArray(this.state.keyList.private)}
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
                                { label: 'Copy Output', value: 'copy' },
                                { label: 'Paste Input', value: 'paste' },
                            ]}
                            selected={<BootstrapIcon name="clipboard" />}
                            onSelect={(option) => {
                                switch (option.value) {
                                    case 'copy':
                                        this.copyOutput()
                                        break;
                                    case 'paste':
                                        this.pasteInput()
                                        break;
                                }
                            }}
                        />
                        <DropdownButton
                            options={(() => {
                                var options = []
                                if (this.state.passwordEnabled == true) {
                                    options.push({ label: 'Password', value: 'password' })
                                }
                                options = options.concat([
                                    { label: 'Generate', value: 'generate' },
                                    { label: 'Settings', value: 'settings' },
                                ])
                                return options
                            })()}
                            selected={<i className="bi bi-three-dots"></i>}
                            onSelect={(option) => {
                                switch (option.value) {
                                    case 'password':
                                        this.togglePasswordDialog(true)
                                        break;
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
                                value={this.state.generateDialog.keyName}
                                label="Key Name"
                                onChange={(ev) => { this.setState({ generateDialog: { keyName: ev.target.value } }) }}
                            />
                            <Input
                                value={this.state.generateDialog.modulusLength}
                                label="Modulus Length"
                                placeholder="2048"
                                type="number"
                                onChange={(ev) => { this.setState({ generateDialog: { modulusLength: ev.target.value } }) }}
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
                <Dialog
                    open={this.state.isDialogOpen.password}
                    header={<DialogHeader title="Enter Password" />}
                    content={
                        <DialogContent>
                            <p>Enter password to access your private keys.</p>
                            <Input
                                value={this.state.password}
                                type="password"
                                onChange={(ev) => {
                                    this.setState({ password: ev.target.value })
                                }}
                                onKeyDown={(ev) => {
                                    if (ev.code == 'Enter' || ev.code == 'NumpadEnter') {
                                        this.togglePasswordDialog()
                                    }
                                }}
                            />
                        </DialogContent>
                    }
                    footer={<DialogFooter actions={<>
                        <Button color={this.state.passwordEnabled == true && this.state.password == '' ? '' : 'Primary'} onClick={this.togglePasswordDialog}>Confirm</Button>
                        {this.state.passwordEnabled == true ? <></> : <Button onClick={this.togglePasswordDialog}>Cancel</Button>}
                    </>} />}
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
        window.addEventListener('keydown', this.keyboardShortcutsHandler)
        this.getPasswordStatus().then(() => {
            if (this.state.passwordEnabled == true) {
                this.togglePasswordDialog(true)
            }
        })
    }
    componentWillUnmount = () => {
        window.removeEventListener('keydown', this.keyboardShortcutsHandler)
    }
    keyboardShortcutsHandler = (ev) => {
        if (ev.ctrlKey === true) {
            switch (ev.code) {
                case 'Comma':
                    this.toggleSettingsPage()
                    break;
                default:
                    break;
            }
        }
    }
    getPasswordStatus = async () => {
        const passwordStatus = await RSA_CLI.password({ keyName: 'status', params: { quiet: true } })
        this.setState({ passwordEnabled: passwordStatus })
    }
    updateKeyList = async () => {
        const list = await RSA_CLI.list({ params: { quiet: true } })
        var result = {
            public: [],
            private: [],
        }
        for (const i in list) {
            const key = list[i];
            if (key.public == true) {
                result.public.push(i)
            }
            if (key.private == true) {
                result.private.push(i)
            }
        }
        this.setState({ keyList: result })
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
    copyOutput() {
        electron.clipboard.writeText(this.state.output)
    }
    pasteInput() {
        this.setState({ input: electron.clipboard.readText() })
    }
    execute(input) {
        if (this.state.mode === 0) {
            this.encrypt(input)
        } else if (this.state.mode === 1) {
            this.decrypt(input)
        }
    }
    generate = () => {
        RSA_CLI.generate({
            keyName: this.state.generateDialog.keyName,
            params: {
                'modulus-length': this.state.generateDialog.modulusLength,
                quiet: true,
                password: this.state.password,
            }
        }).then(() => {
            this.updateKeyList()
        }).catch((err) => {
            console.error(err)
        })
    }
    encrypt = async () => {
        RSA_CLI.encrypt({
            keyName: this.state.publicKey,
            object: this.state.input,
            params: { quiet: true }
        }).then((encrypted) => {
            this.setState({ output: encrypted })
        }).catch((err) => {
            if (err.code == 'RSA_CLI:DATA_TOO_LARGE_FOR_KEY_SIZE') {
                this.setState({ output: 'Data too large for key size.' })
            }
        })
    }
    decrypt = (input) => {
        RSA_CLI.decrypt({
            keyName: this.state.privateKey,
            object: input ?? this.state.input,
            params: { quiet: true, password: this.state.password }
        }).then((decrypted) => {
            this.setState({ output: decrypted })
        }).catch((err) => {
            if (err.code == 'ERR_OSSL_RSA_DATA_LEN_NOT_EQUAL_TO_MOD_LEN' || err.code == 'ERR_OSSL_RSA_OAEP_DECODING_ERROR' || err.code == 'RSA_CLI:FAILED_TO_DECRYPT') {
                this.setState({ output: 'Failed to decrypt.' })
            } else if (err.code == 'RSA_CLI:PASSWORD_INCORRECT') {
                this.setState({ output: 'Password is incorrect.' })
            }
        })
    }
    togglePasswordDialog = (willBeOpen) => {
        if (typeof willBeOpen == 'boolean') {
            this.setState({ isDialogOpen: { password: willBeOpen } })
        } else {
            this.setState({ isDialogOpen: { password: !this.state.isDialogOpen.password } })
        }
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
