import React from 'react';

import { version } from '../../../package.json';

import Frame from '../../components/Frame';
import Link from '../../components/Link';

class AboutPage extends React.Component {
    constructor(props) {
        super(props)
    }
    render() {
        return <Frame title="About" className="Settings-AboutPage">
            <img src="../build/icon.png" className="icon" />
            <p className="title">RSA GUI</p>
            <p className="version">v{version}</p>
            <p className="author"><span className="by">By</span> Mr. Will</p>
            <p className="tips">For further configuration, switch to <Link href="https://github.com/MrWillCom/rsa-cli">RSA CLI</Link></p>
        </Frame>
    }
}

export default AboutPage
