import React from 'react'
import PopularJob from './popularJobs'
// import Ad from '../Ad/Ad'
import dynamic from 'next/dynamic'
const SearchArea = dynamic(() => import('./searchArea'))
// const ServerFunctionFilter = dynamic(() => import('./functionFilter/server'))
import styles from 'app/index.module.scss'
import HomeBanner from './HomeBanner'

const TopModule = ({ lang, langKey, config }) => {
  const { home } = lang || {}

  return (
    <>
      <div className={styles.searchMain}>
        <div className={styles.searchMainContainer}>
          <HomeBanner />
          <div className={styles.title}>
            <p className={styles.titleText}>Find Remote Job. Talk to Boss</p>
          </div>
          <SearchArea config={config} langKey={langKey} />
        </div>
      </div>
      <PopularJob langKey={langKey} />
      {/* <Ad>
        <ServerFunctionFilter langKey={langKey} config={config} />
      </Ad> */}
    </>
  )
}
export default TopModule
