import React from 'react';

class Dialog extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div
                className={`Dialog-Mask ${this.props.open === true ? 'Open' : ''}`}
                onClick={() => {
                    if (typeof this.props.maskOnClick == 'function') { this.props.maskOnClick() }
                }}
            >
                <div
                    className="Dialog"
                    onClick={(ev) => {
                        ev.stopPropagation()
                    }}
                >
                    {typeof this.props.header != 'undefined' ? this.props.header : <></>}
                    {typeof this.props.content != 'undefined' ? this.props.content : <></>}
                    {typeof this.props.footer != 'undefined' ? this.props.footer : <></>}
                </div>
            </div>
        )
    }
}

class DialogHeader extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="DialogHeader">
                {typeof this.props.title != 'undefined' ? this.props.title : <></>}
            </div>
        )
    }
}

class DialogContent extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="DialogContent">
                {typeof this.props.children != 'undefined' ? this.props.children : <></>}
            </div>
        )
    }
}

class DialogFooter extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="DialogFooter">
                {typeof this.props.actions != 'undefined' ? this.props.actions : <></>}
            </div>
        )
    }
}

export default Dialog;
export { DialogHeader, DialogContent, DialogFooter };
