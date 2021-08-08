import React from 'react';

class Segment extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            selected: typeof this.props.selected == 'number' ? this.props.selected : 0
        }
    }
    render() {
        var optionsElement = []
        for (const key in this.props.options) {
            optionsElement.push(
                <button
                    className={`Segment-Option ${this.state.selected == key ? 'Selected' : ''}`}
                    onClick={() => {
                        this.setState({ selected: key })
                        this.props.onChange(key)
                    }}
                    key={key}>
                    {this.props.options[key]}
                </button>
            )
        }
        return <div className={`Segment ${this.props.className ? this.props.className : ''}`}>{optionsElement}</div>
    }
}

export default Segment;
