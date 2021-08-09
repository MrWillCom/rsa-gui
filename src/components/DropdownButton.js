import React from 'react';

class DropdownButton extends React.Component {
    constructor(props) {
        super(props);

        this.optionsListRef = React.createRef();

        this.state = {
            open: false,
            optionsListHeight: 64,
            overflowOffset: 0,
        }
    }
    render() {
        var optionsList = []
        for (const option in this.props.options) {
            optionsList.push(
                <li className="DropdownButton-Option" key={option}>
                    <button className="DropdownButton-Option-Button" onClick={() => { this.setState({ open: false }); this.props.onSelect(option) }}>{this.props.options[option]}</button>
                </li>
            )
        }

        return <div className={`DropdownButton ${typeof this.props.className == 'string' ? this.props.className : ''}`}>
            {this.props.label ? <span className="DropdownButton-Label">{this.props.label}</span> : <></>}
            <button className="DropdownButton-Button" onClick={this.toggleDropdown}>{this.props.selected}</button>
            <ul
                className={`DropdownButton-Options ${this.state.open ? 'open' : ''}`}
                ref={this.optionsListRef}
                style={{
                    '--dropdown-height': `${this.state.optionsListHeight}px`,
                    '--overflow-offset': `${this.state.overflowOffset}px`,
                }}
            >{optionsList}</ul>
        </div>
    }
    toggleDropdown = () => {
        this.updateHeight();
        this.updateOverflowOffset();
        this.setState({ open: !this.state.open });
    }
    componentDidMount = () => {
        this.optionsListRef.current.addEventListener('load', () => {
            this.updateHeight();
            this.updateOverflowOffset();
            console.log('load!')
        })
        window.addEventListener('resize', this.updateOverflowOffset);
    }
    updateHeight = () => {
        this.setState({ optionsListHeight: this.optionsListRef.current.clientHeight })
    }
    updateOverflowOffset = () => {
        const overflowHeight = window.innerHeight - (this.optionsListRef.current.getBoundingClientRect().top + this.optionsListRef.current.clientHeight) - 4;
        if (overflowHeight < 0) {
            this.setState({ overflowOffset: overflowHeight })
        }
    }
}

export default DropdownButton
