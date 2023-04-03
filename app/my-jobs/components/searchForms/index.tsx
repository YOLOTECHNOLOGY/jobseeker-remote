import React from 'react'
import Mobile from './index.moble'
import { isMobile } from 'react-device-detect'

import PC from './index.pc'
const SearchForms = props => {

    return <>
        {/* <PC {...props} /> */}
        {isMobile ? <Mobile {...props} /> : <PC {...props} />}
    </>
}

export default SearchForms