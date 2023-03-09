// 'use client'
import React from 'react'
import SearchArea from './searchArea'
import Companies from './companies'
import MobileHome from './mobileHome'

const Main = props => {
    console.log({ props })
    return (<>
     <SearchArea /> 
     {/* @ts-expect-error Async Server Component */}
     <Companies/>
      {/* @ts-expect-error Async Server Component */}
     <MobileHome/>
    </>)
}

export default Main

