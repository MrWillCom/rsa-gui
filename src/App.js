import React from 'react'
import Store from 'electron-store'

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
            output: '',
            keyList: {},
        }
        this.RSA_CLI = {
            list: require('../rsa-cli/src/commands/list'),
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
                    <div className="left">
                        <TextArea
                            placeholder={`Type here to ${['encrypt', 'decrypt'][this.state.mode]}...`}
                            className="input" />
                        <DropdownButton options={this.state.keyList} />
                    </div>
                    <div className="right">
                        <p className="output">Hello, World</p>
                    </div>
                </div>
            </div>
        </>
    }
    componentDidMount = async () => {
        var options = {}
        for (const item of await this.RSA_CLI.list()) {
            options[item] = item
        }
        this.setState({ keyList: options })
    }
    setMode(mode) {
        mode = parseInt(mode, 10)
        this.setState({ mode: mode })
        this.store.set('app.mode', mode);
    }
}

export default App
