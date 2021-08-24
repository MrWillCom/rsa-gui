import React from 'react'
import { shell } from 'electron'

class Link extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return <a
            className={`Link ${typeof this.props.className != 'undefined' ? this.props.className : ''}`}
            href={typeof this.props.href == 'string' ? this.props.href : false}
            onClick={(ev)=>{
                ev.preventDefault()
                typeof this.props.href == 'string' ? shell.openExternal(this.props.href) : undefined;
                typeof this.props.onClick == 'function' ? this.props.onClick(ev) : undefined;
            }}
        >{this.props.children}</a>
    }
}

export default Link
