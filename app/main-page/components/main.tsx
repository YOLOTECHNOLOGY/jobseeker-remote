// 'use client'
import React from 'react'
import TopModule from './TopModule'
import Tabs from './Tabs/Tabs'
import Companies from './companies'
import MobileHome from './mobileHome'

const Main = (props) => {
  return (
    <>
      
      <TopModule {...props} />
      <Tabs />
      {/* @ts-expect-error Async Server Component */}
      <Companies />
      {/* @ts-expect-error Async Server Component */}
      <MobileHome />
    </>
  )
}

export default Main
