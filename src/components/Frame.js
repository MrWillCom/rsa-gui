import React from 'react';

class Frame extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return <div className={`Frame ${typeof this.props.className != 'undefined' ? this.props.className : ''}`}>
            <h2 className="Frame-Title">{this.props.title}</h2>
            <div className="Frame-Content">
                {this.props.children}
            </div>
        </div>
    }
}

class FrameContentTitle extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return <h3 className={`FrameContentTitle ${typeof this.props.className == 'string' ? this.props.className : ''}`}>{this.props.children}</h3>
    }
}

export default Frame;
export { FrameContentTitle };
