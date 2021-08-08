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
                        <DropdownButton options={{
                            'test-key-0': 'test-key-0',
                            'test-key-1': 'test-key-1',
                            'test-key-2': 'test-key-2',
                        }} />
                    </div>
                    <div className="right">
                        <p className="output">Hello, World</p>
                    </div>
                </div>
            </div>
        </>
    }
    setMode(mode) {
        mode = parseInt(mode, 10)
        this.setState({ mode: mode })
        this.store.set('app.mode', mode);
    }
}

export default App
