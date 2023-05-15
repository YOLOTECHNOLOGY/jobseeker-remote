'use client'

import AdSlot from 'app/[lang]/components/AdSlot/index'

import styles from '../../../index.module.scss'

const Ad = ({children}:any) => {
  return (
    <div className={styles.adContainer}>
      <div className={styles.mainFunction}>{children}</div>
      <div className={styles.ad}>
        <div className={styles.ad_container}>
          <AdSlot adSlot={'homepage/rectangle-banner-1'} />
        </div>
        <div className={styles.ad_container}>
          <AdSlot adSlot={'homepage/rectangle-banner-2'} />
        </div>
      </div>
    </div>
  )
}

export default Ad
