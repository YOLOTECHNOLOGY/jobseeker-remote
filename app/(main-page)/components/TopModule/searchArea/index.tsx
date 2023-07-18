/* eslint-disable import/no-anonymous-default-export */
import { serverDataScript } from 'app/models/abstractModels/FetchServierComponents'
import { buildComponentScript } from 'app/models/abstractModels/util'
import interpreter from 'app/(main-page)/intepreter'
import React from 'react'
import SearchArea from './searchArea'

const ServerSearchArea = (props: any) => {
    return <SearchArea {...props} />
}

export default (props: any) => interpreter(
    serverDataScript()
        .chain((props: any) => buildComponentScript(props, ServerSearchArea))
).run(props)