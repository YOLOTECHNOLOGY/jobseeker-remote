'use client'
import React from 'react'
import { useDispatch, Provider } from 'react-redux'

import SearchArea from './components/searchArea'


const Main = props => {
    console.log({ props })

    return <SearchArea />
}

export default Main