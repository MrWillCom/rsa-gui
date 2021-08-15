import React from 'react';

import NavigationView from '../components/NavigationView';

import AppearancePage from './Settings/AppearancePage';
import BehaviorPage from './Settings/BehaviorPage';
import KeysPage from './Settings/KeysPage';

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
                { label: 'Appearance' },
                { label: 'Behavior' },
                { label: 'Keys' },
            ]}
            frames={[
                <AppearancePage />,
                <BehaviorPage />,
                <KeysPage />,
            ]}
        />
    }
}

export default SettingsPage;
