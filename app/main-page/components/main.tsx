// 'use client'
import React from 'react'
import TopModule from './TopModule'
import Tabs from './Tabs/Tabs'

const Main = (props) => {
  console.log({ props })
  return (
    <>
      <TopModule {...props} />
      <Tabs />
    </>
  )
}

export default Main
