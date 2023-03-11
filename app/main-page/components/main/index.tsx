// 'use client'
import React from 'react'
import TopModule from '../TopModule'
import Tabs from '../Tabs/Tabs'
import Companies from '../companies'
import MobileHome from '../mobileComponents/mobileHome'
import styles from './index.module.scss'
const Main = (props) => {
  return (
    <>
      <div className={styles.main}>
        <div className={styles.title}>Find Job. Talk to Boss.</div>
        <TopModule {...props} />
        <Tabs />
        {/* @ts-expect-error Async Server Component */}
        <Companies />
        {/* @ts-expect-error Async Server Component */}
        <MobileHome />
      </div>

    </>
  )
}

export default Main
