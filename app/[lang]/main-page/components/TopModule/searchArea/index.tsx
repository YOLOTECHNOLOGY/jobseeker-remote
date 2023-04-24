import { serverDataScript } from 'app/[lang]/abstractModels/FetchServierComponents'
import { buildComponentScript } from 'app/[lang]/abstractModels/util'
import interpreter from 'app/[lang]/main-page/intepreter'
import React from 'react'
import SearchArea from './searchArea'

const ServerSearchArea = props => {
    return <SearchArea {...props} />
}

export default interpreter(
    serverDataScript()
        .chain(props => buildComponentScript(props, ServerSearchArea))
).run