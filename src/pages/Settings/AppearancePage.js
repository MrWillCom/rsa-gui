import React from 'react';
import Store from 'electron-store';

import Frame, { FrameContentTitle } from '../../components/Frame';
import DropdownButton from '../../components/DropdownButton';

class AppearancePage extends React.Component {
    constructor(props) {
        super(props);

        this.store = new Store();
        this.options= {
            themeMode: [
                { label: 'Light', value: 'light' },
                { label: 'Dark', value: 'dark' },
                { label: 'Follow System', value: 'follow-system' },
            ],
        }
        this.state = {
            themeMode:  this.store.get('settings.appearance.themeMode') || 'follow-system',
        }
    }
    render() {
        return <Frame title="Appearance">
            <FrameContentTitle>Theme Mode</FrameContentTitle>
            <DropdownButton
                options={this.options.themeMode}
                selected={this.getLabelFromOptions(this.state.themeMode, this.options.themeMode)}
                onSelect={(option) => {
                    this.store.set('settings.appearance.themeMode', option.value)
                    this.setState({ themeMode:  option.value  })
                }}
            />
            <p>The settings here won't make changes to the App, but only save the settings to the configuration.</p>
        </Frame>
    }
    getLabelFromOptions(value, options) {
        for (const option of options) {
            if (option.value == value) {
                return option.label
            }
        }
    }
}

export default AppearancePage
