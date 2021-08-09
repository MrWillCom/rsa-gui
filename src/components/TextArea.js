import React from 'react'

class TextArea extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return <textarea
            className={`TextArea ${this.props.className}`}
            placeholder={this.props.placeholder ? this.props.placeholder : ''}
            value={this.props.value}
            onChange={this.props.onChange}
            onKeyDown={this.props.onKeyDown}
        ></textarea>
    }
}

export default TextArea
