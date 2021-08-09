import React from 'react'
import Store from 'electron-store'
import { ipcRenderer } from 'electron';

import TitleBar from './components/TitleBar';
import Segment from './components/Segment';
import TextArea from './components/TextArea';
import DropdownButton from './components/DropdownButton';

class App extends React.Component {
    constructor(props) {
        super(props)

        this.store = new Store()
        this.state = {
            mode: this.store.get('app.mode'),
            input: '',
            output: '',
            keyList: {},
            publicKey: this.store.get('app.publicKey') || '',
            privateKey: this.store.get('app.privateKey') || '',
        }
        this.RSA_CLI = {
            help: require('../rsa-cli/src/commands/help'),
            version: require('../rsa-cli/src/commands/version'),
            generate: require('../rsa-cli/src/commands/generate'),
            import: require('../rsa-cli/src/commands/import'),
            encrypt: require('../rsa-cli/src/commands/encrypt'),
            decrypt: require('../rsa-cli/src/commands/decrypt'),
            get: require('../rsa-cli/src/commands/get'),
            list: require('../rsa-cli/src/commands/list'),
            remove: require('../rsa-cli/src/commands/remove'),
        }
    }
    render() {
        return <>
            <TitleBar />
            <div className="main">
                <Segment
                    options={['Encrypt', 'Decrypt']}
                    onChange={mode => this.setMode(mode)}
                    selected={this.state.mode}
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
                            options={this.state.keyList}
                            selected={this.state.publicKey}
                            label="Public Key"
                            onSelect={(key) => {
                                this.setState({ publicKey: key });
                                this.store.set('app.publicKey', key);
                            }}
                        />
                        <DropdownButton
                            options={this.state.keyList}
                            selected={this.state.privateKey}
                            label="Private Key"
                            onSelect={(key) => {
                                this.setState({ privateKey: key });
                                this.store.set('app.privateKey', key);
                            }}
                        />
                    </div>
                </div>
            </div>
        </>
    }
    componentDidMount = async () => {
        const keyList = await this.RSA_CLI.list()
        var options = {}
        for (const item of keyList) {
            options[item] = item
        }
        this.setState({ keyList: options })
        if (this.state.publicKey === '') {
            this.setState({ publicKey: keyList[0] })
        }
        if (this.state.privateKey === '') {
            this.setState({ privateKey: keyList[0] })
        }
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
        const encrypted = await this.RSA_CLI.encrypt({
            keyName: this.state.publicKey,
            object: this.state.input,
            params: { input: false }
        })
        this.setState({ output: encrypted })
    }
    decrypt = async () => {
        const decrypted = await this.RSA_CLI.decrypt({
            keyName: this.state.privateKey,
            object: this.state.input,
            params: { input: false }
        })
        this.setState({ output: decrypted })
    }
}

export default App
