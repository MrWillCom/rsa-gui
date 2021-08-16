import React from 'react';

class NavigationView extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <div className="NavigationView">
            <div className="Navigation">
                {(() => {
                    var navigationList = []
                    for (const key in this.props.navigation) {
                        const item = this.props.navigation[key];
                        navigationList.push(
                            <button
                                className={`Navigation-Item ${this.props.index == key ? 'Selected' : ''}`}
                                onClick={() => this.props.onNavigate(key)}
                                key={key}
                            >
                                {item.icon ? <span className="Navigation-Item-Icon">{item.icon}</span> : <></>}
                                <span>{item.label}</span>
                            </button>
                        );
                    }
                    return navigationList;
                })()}
            </div>
            <div className="Navigation-Frame">
                {this.props.frames[this.props.index]}
            </div>
        </div>
    }
}

export default NavigationView
