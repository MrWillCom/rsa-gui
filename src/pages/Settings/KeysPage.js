import React from 'react';

import RSA_CLI from 'rsa-cli'
import QRCode from 'qrcode'

import Frame from '../../components/Frame';
import ListView, { ListItem } from '../../components/ListView';
import Segment from '../../components/Segment';

class KeysPage extends React.Component {
    constructor(props) {
        super(props)

        this.state = { keyList: [], selectedKey: '', keyType: 0 }
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
                    <Segment
                        options={['Public', 'Private']}
                        onChange={(index) => {
                            this.setKeyType(index)
                        }}
                        selected={this.state.keyType}
                    />
                    <canvas className={`qr ${this.state.keyType == '1' ? 'private' : ''}`} ref={this.qr}></canvas>
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
    setSelectedKey = (keyName) => {
        this.setState({ selectedKey: keyName })

        this.updatePreview(keyName, this.state.keyType)
    }
    updatePreview = async (keyName, keyType) => {
        try {
            const keyPair = await RSA_CLI.get({ keyName, params: { quiet: true, private: keyType == "1", password: this.props.password } })

            QRCode.toCanvas(this.qr.current, keyType == "0" ? keyPair.public : keyPair.private, (err) => {
                if (err) throw err
            })
        } catch (error) {
            this.qr.current.getContext('2d').clearRect(0, 0, this.qr.current.width, this.qr.current.height)

            console.error(error)
        }
    }
    setKeyType = (keyType) => {
        this.setState({ keyType })

        this.updatePreview(this.state.selectedKey, keyType)
    }
}

export default KeysPage
