// 'use client'
import React from 'react'
import TopModule from './TopModule'

const Main = props => {
    console.log({ props })
    return <TopModule {...props} />
}

export default Main

