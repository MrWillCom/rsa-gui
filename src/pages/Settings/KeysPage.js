import React from 'react';

import RSA_CLI from 'rsa-cli'
import QRCode from 'qrcode'

import Frame from '../../components/Frame';
import ListView, { ListItem } from '../../components/ListView';

class KeysPage extends React.Component {
    constructor(props) {
        super(props)

        this.state = { keyList: [], selectedKey: '' }
        this.qr = React.createRef()
    }
    render() {
        return <Frame title="Keys" className="Settings-KeysPage">
            <div className="viewer">
                <div className="list">
                    <ListView className="key-list">
                        {this.getListItems()}
                    </ListView>
                </div>
                <div className="preview">
                    <canvas className="qr" ref={this.qr}></canvas>
                </div>
            </div>
        </Frame>
    }
    componentDidMount() {
        this.updateKeyList()
    }
    async updateKeyList() {
        const list = await RSA_CLI.list({ params: { quiet: true } })

        this.setState({ keyList: list })
    }
    getListItems() {
        var items = []

        for (const keyName in this.state.keyList) {
            items.push(<ListItem
                key={keyName}
                selected={keyName == this.state.selectedKey}
                onSelect={() => { this.setSelectedKey(keyName) }}
            >{keyName}</ListItem>)
        }

        return items
    }
    setSelectedKey = async (keyName) => {
        this.setState({ selectedKey: keyName })

        const keyPair = await RSA_CLI.get({ keyName, params: { quiet: true } })

        QRCode.toCanvas(this.qr.current, keyPair.public, (error) => {
            if (error) console.error(error)
        })
    }
}

export default KeysPage
