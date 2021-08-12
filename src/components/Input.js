import React from 'react';

class Input extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return <>
            {typeof this.props.label == 'string' ? <label className="Input-Label">{this.props.label}</label> : <></>}
            <input
                className={`Input ${typeof this.props.className == 'string' ? this.props.className : ''}`}
                type={this.props.type}
                value={this.props.value}
                defaultValue={this.props.defaultValue}
                placeholder={this.props.placeholder}
                onChange={this.props.onChange}
                onKeyDown={this.props.onKeyDown}
            />
        </>
    }
}

export default Input
