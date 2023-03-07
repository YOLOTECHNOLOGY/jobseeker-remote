// 'use client'
import React from 'react'
import SearchArea from './searchArea'
import Companies from './companies'

const Main = props => {
    console.log({ props })
    return (<>
     <SearchArea /> 
     {/* @ts-expect-error Async Server Component */}
     <Companies/>
    </>)
}

export default Main

