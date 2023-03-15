// 'use client'
import React from 'react'
import TopModule from '../TopModule'
import Tabs from '../Tabs/Tabs'
import Companies from '../companies'
import MobileHome from '../mobileComponents/mobileHome'
import styles from './index.module.scss'
import { cookies } from 'next/headers'
import Footer from 'components/Footer'
const Main = (props) => {
  const location = cookies().get('location')?.value
  const city = location ? JSON.parse(location)?.value : 'Manila'
  return (
    <>
      <div className={styles.main}>
        <div className={styles.title}>Find Job. Talk to Boss.</div>
        <TopModule {...props} />
        <Tabs location={city} />
        {/* @ts-expect-error Async Server Component */}
        <Companies location={city} />
        {/* @ts-expect-error Async Server Component */}
        <MobileHome location={city} />
      </div>
      <Footer />
    </>
  )
}

export default Main
