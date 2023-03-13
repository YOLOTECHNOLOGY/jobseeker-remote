import { serverDataScript } from 'app/abstractModels/FetchServierComponents'
import { buildComponentScript } from 'app/abstractModels/util'
import interpreter from 'app/main-page/intepreter'
import React from 'react'
import SearchArea from './searchArea'

const ServerSearchArea = props => {
    return <SearchArea {...props} />
}

export default interpreter(
    serverDataScript()
        .chain(props => buildComponentScript(props, ServerSearchArea))
).run