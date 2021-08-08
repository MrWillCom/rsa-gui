import React from 'react'
import Store from 'electron-store'

import TitleBar from './components/TitleBar';
import Segment from './components/Segment';


class App extends React.Component {
    constructor(props) {
        super(props)

        this.store = new Store()
        this.state = {
            mode: this.store.get('app.mode')
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
