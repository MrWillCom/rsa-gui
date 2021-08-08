import React from 'react'
import { remote } from 'electron'

class Win32TitleBar extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isMaximized: remote.getCurrentWindow().isMaximized(),
        }
    }
    render() {
        remote.getCurrentWindow().addListener('maximize', () => {
            this.setState({ isMaximized: true })
        })

        remote.getCurrentWindow().addListener('unmaximize', () => {
            this.setState({ isMaximized: false })
        })

        return (
            <div className="Win32TitleBar">
                <button onClick={this.minimize} className="control codicon codicon-chrome-minimize"></button>
                <button onClick={this.maximize} className={`control codicon ${this.state.isMaximized ? 'codicon-chrome-restore' : 'codicon-chrome-maximize'}`}></button>
                <button onClick={this.close} className="control close codicon codicon-chrome-close"></button>
            </div>
        )
    }
    minimize() {
        remote.getCurrentWindow().minimize()
    }
    maximize() {
        remote.getCurrentWindow().isMaximized() ? remote.getCurrentWindow().unmaximize() : remote.getCurrentWindow().maximize()
    }
    close() {
        remote.getCurrentWindow().close()
    }
}

export default Win32TitleBar
