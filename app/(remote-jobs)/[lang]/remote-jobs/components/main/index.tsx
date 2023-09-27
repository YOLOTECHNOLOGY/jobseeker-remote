import React from 'react'
import Footer from 'components/Footer'
import AutoShowModalAppRedirect from '../AutoShowModalAppRedirect'
import TopModule from '../TopModule'
import Tabs from '../Tabs/Tabs'
import Companies from '../companies'
import MobileHome from '../mobileComponents/mobileHome'
import Tracker from '../tracker'
import getConfigs from 'app/models/interpreters/config'
import styles from 'app/index.module.scss'
import { serverDataScript } from 'app/models/abstractModels/FetchServierComponents'
import { cookies } from 'next/headers'

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

const getLocationId = () => {
  const location = cookies().get('location')?.value
  let locationId = '63'
  if (location?.length) {
    try {
      const locationArr = JSON.parse(location)
      const locations = Array.isArray(locationArr) ? locationArr : [locationArr].filter((a) => a)
      if (locations?.length) {
        locationId = locations?.map((e) => e.id)?.join(',')
      }
    } catch (error) {
      console.error('Error parsing location:', error)
      locationId = '63' // default locationId
    }
  }
  return locationId
}

const getLangKey = (props) => {
  let langKey = props?.params?.lang
  if (!langKey) {
    langKey = (cookies().get('geoConfiguration') as any)?.split?.('_')?.[1] || 'en-US'
  }
  return langKey
}

const Main = async (props: any) => {
  const locationId = getLocationId()
  const langKey = getLangKey(props)
  const { config } = await configs(serverDataScript()).run(props)

  return (
    <>
      <div className={styles.main}>
        <TopModule langKey={langKey} lang={props.lang} config={config} />
        <Tabs config={config} langKey={langKey} location_id={locationId} />
        {/* @ts-expect-error Async Server Component */}
        <Companies langKey={langKey} lang={props.lang} config={config} location_id={locationId} />
        {/* @ts-expect-error Async Server Component */}
        <MobileHome lang={props.lang} config={config} langKey={langKey} location_id={locationId} />
        <Tracker />
      </div>
      <Footer {...props} />
    </>
  )
}

export default Main
