'use client'
import styles from './index.module.scss'
import { BossjobLogo } from 'images'
export default function Loading() {
  // Or a custom loading skeleton component
  return (
    <div className={styles.loadingWrapper}>
      <div className={styles.loadingLogo}>
        <img src={BossjobLogo} title='Bossjob logo' alt='Bossjob logo' />
      </div>
      <div className={styles.loadingIndicator}>
        error happened!!
      </div>
    </div>
  )
}
// export default TransitionLoader
