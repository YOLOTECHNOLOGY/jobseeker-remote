'use client'

import AdSlot from 'app/components/AdSlot/index'

import styles from '../../../index.module.scss'

const Ad = ({children}:any) => {
  return (
    <div className={styles.recommendContainer}>
      <div className={styles.mainFunction}>{children}</div>
      <div className={styles.recommend}>
        <div className={styles.recommend_container}>
          <AdSlot adSlot={'homepage/rectangle-banner-1'} />
        </div>
        <div className={styles.recommend_container}>
          <AdSlot adSlot={'homepage/rectangle-banner-2'} />
        </div>
      </div>
    </div>
  )
}

export default Ad
