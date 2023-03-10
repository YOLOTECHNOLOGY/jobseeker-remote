'use client'

import AdSlot from 'app/components/AdSlot/index'

import styles from './Ad.module.scss'

const Ad = () => {
  return (
    <div className={styles.adContainer}>
      <div className={styles.mainFunction}></div>
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
