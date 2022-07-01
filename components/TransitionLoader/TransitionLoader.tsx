import React from 'react'
import * as ReactDOM from 'react-dom'
import styles from './TransitionLoader.module.scss'
import LinearProgress from '@mui/material/LinearProgress'
import { BossjobLogo } from '../../images'
import PlaceholderProtectedHeader from '../Header/PlaceholderProtectedHeader'
import PlaceHolderPublicHeader from '../Header/PlaceholderPublicHeader'
import { getCookie } from '../../helpers/cookies'

type TransitionLoaderProps = {
  accessToken?: any
}

function TransitionLoader({ accessToken }: TransitionLoaderProps) {
  const user = getCookie('user')
  return ReactDOM.createPortal(
    <div className={styles.wrapper}>
      <div className={styles.headerWrapper}>
        {accessToken && <PlaceholderProtectedHeader isShowEmailAlert={accessToken && user &&!user.is_email_verify} />}
        {!accessToken && <PlaceHolderPublicHeader />}
      </div>
      <div className={styles.loadingWrapper}>
        <div className={styles.loadingLogo}>
          <img src={BossjobLogo} title='Bossjob logo' alt='Bossjob logo' />
        </div>
        <div className={styles.loadingIndicator}>
          <LinearProgress />
        </div>
      </div>
    </div>,
    document.body
  )
}

export default TransitionLoader
