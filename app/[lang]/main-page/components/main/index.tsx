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

const Main = (props: any) => {
  const location = cookies().get('location')?.value
  const city = location ? JSON.parse(location)?.value : 'Manila'
  const locationId = location ? JSON.parse(location)?.id : 63
  const {
    lang: { home }
  } = props || {}
  return (
    <>
      <div className={styles.main}>
        <div className={styles.title}>{home.title}</div>
        <TopModule {...props} />
        <Tabs location={city} />
        {/* @ts-expect-error Async Server Component */}
        <Companies location={city} lang={props.lang} location_id={locationId} />
        {/* @ts-expect-error Async Server Component */}
        <MobileHome lang={props.lang} location={city} location_id={locationId} />
        {/* Tracker component */}
        <Tracker />
      </div>
      <Footer {...props} />
      <AutoShowModalAppRedirect />
    </>
  )
}

export default Main
