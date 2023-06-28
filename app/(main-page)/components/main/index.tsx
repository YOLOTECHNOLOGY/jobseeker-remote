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
import getConfigs from 'app/models/interpreters/config'
import styles from '../../../index.module.scss'
import { serverDataScript } from 'app/models/abstractModels/FetchServierComponents'
const configs = getConfigs([
  ['location_lists'],
  ['main_functions'],
  ['job_functions'],
  ['function_titles'],
  ['job_function_lists'],
  ['xp_lvls'],
  ['job_types'],
  ['company_sizes'],
  ['industry_lists'],
  ['company_financing_stage_lists'],
  ['educations'],
  ['salary_range_filters'],
  ['job_benefit_lists'],
  ['main_job_function_lists'],
  ['degrees'],
  ['salary_ranges'],
  ['country_lists']
])
const Main = async (props: any) => {
  const location = cookies().get('location')?.value
  let locationId = '63'
  if (location?.length) {
    try {
      const locationArr = JSON.parse(location)
      const locations = Array.isArray(locationArr) ? locationArr : [locationArr].filter(a => a)
      // locationId = locations?.map(loc=>loc.id).join(',')
      if (locations?.length) {
        locationId = locations?.map(e=>e.id)?.join(',')
      }
    } catch (error) {
      console.log({ error })
    }
  }
  const langKey = props?.params?.lang || (cookies().get('geoConfiguration') as any)?.split?.('_')?.[1] || 'en-US'
  console.log({ locationId, location })
  const {
    lang: { home }
  } = props || {}
  const { config } = await configs(serverDataScript()).run(props)

  return (
    <>
      <div className={styles.main}>
        <div className={styles.title}>{home.title}</div>
        <TopModule {...props} />
        <Tabs config={config} langKey={langKey} location_id={locationId} />
        {/* @ts-expect-error Async Server Component */}
        <Companies langKey={langKey} lang={props.lang} config={config} location_id={locationId} />
        {/* @ts-expect-error Async Server Component */}
        <MobileHome lang={props.lang} config={config} langKey={langKey} location_id={locationId} />
        {/* Tracker component */}
        <Tracker />
      </div>
      <Footer {...props} />
      <AutoShowModalAppRedirect />
    </>
  )
}

export default Main
