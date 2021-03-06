import React from 'react'
import os from 'os'

import Win32TitleBar from './Win32TitleBar'
import DragArea from './DragArea'

export default () => {
    return os.platform() == 'win32' ? <Win32TitleBar /> : <DragArea />
}
