import React from 'react';

import RSA_CLI from 'rsa-cli'

import Frame from '../../components/Frame';
import ListView, { ListItem } from '../../components/ListView';

class KeysPage extends React.Component {
    constructor(props) {
        super(props)

        this.state = { keyList: [], selectedKey: '' }
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
                    <div className="key-name">{this.state.selectedKey}</div>
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
            const element = this.state.keyList[keyName];
            items.push(<ListItem
                key={keyName}
                selected={keyName == this.state.selectedKey}
                onSelect={() => this.setState({ selectedKey: keyName })}
            >{keyName}</ListItem>)
        }

        return items
    }
}

export default KeysPage
