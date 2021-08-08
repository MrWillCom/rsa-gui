import React from 'react'

class TextArea extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            text: ''
        }
    }
    render() {
        return <textarea
            className={`TextArea ${this.props.className}`}
            placeholder={this.props.placeholder ? this.props.placeholder : ''}
        ></textarea>
    }
}

export default TextArea
