import React from 'react';

import NavigationView from '../components/NavigationView';
import BootstrapIcon from '../components/BootstrapIcon';

import AboutPage from './Settings/AboutPage';

class SettingsPage extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            index: 0,
        }
    }
    render() {
        return <NavigationView
            index={this.state.index}
            onNavigate={(index) => {
                this.setState({ index: index })
            }}
            navigation={[
                { icon: <BootstrapIcon name="info-circle" />, label: 'About' },
            ]}
            frames={[
                <AboutPage />,
            ]}
        />
    }
}

export default SettingsPage;
