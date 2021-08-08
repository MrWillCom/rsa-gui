import React from 'react';

class DropdownButton extends React.Component {
    constructor(props) {
        super(props);

        this.optionsListRef = React.createRef();

        this.state = {
            open: false,
            selected: this.props.selected || Object.keys(this.props.options)[0],
            optionsListHeight: 0,
        }
    }
    render() {
        var optionsList = []
        for (const option in this.props.options) {
            optionsList.push(
                <li className="DropdownButton-Option" key={option}>
                    <button className="DropdownButton-Option-Button" onClick={() => { this.select(option) }}>{this.props.options[option]}</button>
                </li>
            )
        }

        return <div className={`DropdownButton ${typeof this.props.className == 'string' ? this.props.className : ''}`}>
            <button className="DropdownButton-Button" onClick={this.toggleDropdown}>{this.state.selected}</button>
            <ul
                className={`DropdownButton-Options ${this.state.open ? 'open' : ''}`}
                ref={this.optionsListRef}
                style={{ '--dropdown-height': `${this.state.optionsListHeight}px` }}
            >{optionsList}</ul>
        </div>
    }
    toggleDropdown = () => {
        this.setState({ open: !this.state.open });
        this.setState({ optionsListHeight: this.optionsListRef.current.clientHeight })
    }
    select = (selected) => {
        this.setState({ open: false, selected: selected });
    }
}

export default DropdownButton
