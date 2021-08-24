import React from 'react';

import Frame from '../../components/Frame';

class AboutPage extends React.Component {
    constructor(props) {
        super(props);
    }
    render(){
        return <Frame title="About">
            <p>RSA GUI v0.0.0 by Mr. Will</p>
        </Frame>
    }
}

export default AboutPage
