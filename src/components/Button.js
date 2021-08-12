import React from 'react'

class Button extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return <button
            className={`Button ${this.props.color ? `Button-${this.props.color}` : ''} ${this.props.className}`}
            onClick={typeof this.props.onClick == 'function' ? this.props.onClick : null}
        >{this.props.children}</button>
    }
}

export default Button
