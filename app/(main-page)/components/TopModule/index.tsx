import React from 'react'
import PopularJob from './popularJobs'
import Ad from '../Ad/Ad'
import dynamic from 'next/dynamic'
import { cookies } from 'next/headers'
const SearchArea = dynamic(() => import('./searchArea'))
const ServerFunctionFilter = dynamic(() => import('./functionFilter/server'))
import styles from '../../../index.module.scss'
import { BannerBackground } from 'images'

const TopModule = (props: any) => {
  const langKey = props?.params?.lang || (cookies().get('geoConfiguration') as any)?.split?.('_')?.[1] || 'en-US'

  const {
    lang: { home }
  } = props || {}
  
  return (
    <>
      <div className={styles.searchMain}>
        <div className={styles.searchMainBackground} style={{backgroundImage: `url(${BannerBackground})`}}>
          <div className={styles.title}>
            <p className={styles.titleText}>Find Job. Talk to Boss</p>
            <p className={styles.subTitle}>120 Jobs Found</p>
          </div>
          <SearchArea {...props} langKey={langKey}/>
        </div>
      </div>
      <PopularJob langKey={langKey} />
      <Ad>
        <ServerFunctionFilter  langKey={langKey}  {...props} />
      </Ad>
    </>
  )
}
export default TopModule
