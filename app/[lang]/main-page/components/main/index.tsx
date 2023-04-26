// 'use client'
import React from 'react'

import { cookies } from 'next/headers'
import Footer from 'components/Footer'

import AutoShowModalAppRedirect from '../AutoShowModalAppRedirect'
import TopModule from '../TopModule'
import Tabs from '../Tabs/Tabs'
import Companies from '../companies'
import MobileHome from '../mobileComponents/mobileHome'
import Tracker from '../tracker'

import styles from '../../../index.module.scss'

const Main = (props) => {
  const location = cookies().get('location')?.value
  const city = location ? JSON.parse(location)?.value : 'Manila'
  console.log(props,'homeIdex')
  // eslint-disable-next-line react/prop-types
  const { 
    LG:{
      home:{
        h1
      } 
    }
 } = props ||{}
  return (
    <>
      <div className={styles.main}>
        <div className={styles.title}>{h1}</div>
        <TopModule {...props} />
        <Tabs location={city} />
        {/* @ts-expect-error Async Server Component */}
        <Companies location={city} />
        {/* @ts-expect-error Async Server Component */}
        <MobileHome location={city} />
        {/* Tracker component */}
        <Tracker />
      </div>
      <Footer {...props}/>
      <AutoShowModalAppRedirect />
    </>
  )
}

export default Main
