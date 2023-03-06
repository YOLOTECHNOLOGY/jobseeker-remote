// 'use client'

import { serverDataScript } from '../abstractModels/FetchServierComponents'
import { buildComponentScript } from '../abstractModels/util'
import intepreter from './intepreter'
import Main from './components/main'

export default intepreter(
    serverDataScript()
        .chain(props => buildComponentScript(props, Main))
).run
