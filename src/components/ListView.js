import React from 'react'

class ListView extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return <div className={`ListView ${typeof this.props.className != 'undefined' ? this.props.className : ''}`}>{this.props.children}</div>
    }
}

class ListItem extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return <div
            className={`ListItem ${this.props.selected ? 'Selected' : ''} ${typeof this.props.className != 'undefined' ? this.props.className : ''}`}
            onClick={this.props.onSelect ? this.props.onSelect : null}
        >{this.props.children}</div>
    }
}

export default ListView;
export { ListItem };
