import React from 'react';
import electron from 'electron';

import NavigationView from '../components/NavigationView';
import BootstrapIcon from '../components/BootstrapIcon';

import AboutPage from './Settings/AboutPage';
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
                { icon: <BootstrapIcon name="key" />, label: 'Keys' },
                { icon: <BootstrapIcon name="info-circle" />, label: 'About' },
            ]}
            frames={[
                <KeysPage password={this.props.password} />,
                <AboutPage />,
            ]}
        />
    }
    componentDidMount = () => {
        electron.ipcRenderer.on('menu:about', () => {
            this.setState({ index: 1 })
        })
    }
    componentWillUnmount = () => {
        electron.ipcRenderer.removeAllListeners('menu:about')
    }
}

export default SettingsPage;
