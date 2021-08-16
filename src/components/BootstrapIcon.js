import React from 'react'

class BootstrapIcon extends React.Component {
    constructor(props) {
        super(props)
    }
    render(){
        return <i className={`bi bi-${this.props.name}`}></i>
    }
}

export default BootstrapIcon;
