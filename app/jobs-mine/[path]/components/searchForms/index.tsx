import React from 'react'
import Mobile from './index.moble'
import PC from './index.pc'
const SearchForms = props => {

    return <><PC {...props} /><Mobile {...props} /></>
}

export default SearchForms