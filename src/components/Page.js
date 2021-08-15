import React from 'react'
import TitleBar from './TitleBar'

class Page extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return <div className={`Page ${this.props.showBackButton ? 'showBackButton': ''} ${this.props.open ? 'Open' : ''} ${typeof this.props.className != 'undefined' ? this.props.className : ''}`}>
            {this.props.includeTitleBar ? <TitleBar /> : <></>}
            {this.props.showBackButton === true ?
                <button
                    className="Page-BackButton"
                    onClick={() => {
                        this.props.backButtonOnClick()
                    }}>
                    <i className="bi bi-arrow-left"></i>
                </button> : <></>}
            <div className="Page-Content">
                {this.props.children}
            </div>
        </div>
    }
}

export default Page
