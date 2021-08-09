import React from 'react'
import ReactDOM from 'react-dom'

import App from './App'

const domContainer = document.querySelector('#app');
ReactDOM.render(<App />, domContainer);

import os from 'os'

document.body.setAttribute('platform', os.platform());

(() => {
    var style = document.createElement('link');
    style.setAttribute("rel", "stylesheet");
    style.setAttribute("href", `./styles/${os.platform() == 'win32' ? 'win32' : 'darwin'}/main.css`);
    document.head.appendChild(style);
})()
