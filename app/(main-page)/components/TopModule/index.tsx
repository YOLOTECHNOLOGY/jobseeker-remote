import React from 'react'
import PopularJob from './popularJobs'
import Ad from '../Ad/Ad'
import dynamic from 'next/dynamic'
import { cookies } from 'next/headers'
const SearchArea = dynamic(() => import('./searchArea'))
const ServerFunctionFilter = dynamic(() => import('./functionFilter/server'))
import styles from '../../../index.module.scss'
import HomeBanner from './HomeBanner'

const TopModule = ({ params, lang, config }) => {
  const langKey =
    params?.lang || (cookies().get('geoConfiguration') as any)?.split?.('_')?.[1] || 'en-US'

  const {
    home
  } = lang || {}

  return (
    <>
      <div className={styles.searchMain}>
        <div className={styles.searchMainContainer}>
          <HomeBanner />
          <div className={styles.title}>
            <p className={styles.titleText}>{home.slog}</p>
          </div>
          <SearchArea config={config} langKey={langKey} />
        </div>
      </div>
      <PopularJob langKey={langKey} />
      <Ad>
        <ServerFunctionFilter langKey={langKey} config={config} />
      </Ad>
    </>
  )
}
export default TopModule
