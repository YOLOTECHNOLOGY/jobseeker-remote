import React from 'react'
import Link from 'components/Link'

import Image from 'next/image'

/* Images */
import { footer_apple_download, footer_googleplay_download } from 'images'

import styles from '../../Footer.module.scss'

const DownloadApp = (props: any) => {
  const { data } = props
  const { downloadBossjobApp } = data?.foot || {}

  return (
    <div className={styles.footerDownloadApp}>
      <p className={styles.footerDownloadAppText}>{downloadBossjobApp}</p>
      <div className={styles.footerDesktopAppList}>
        <Link to={process.env.APP_STORE_LINK} external>
          <Image src={footer_apple_download} alt='AppStore' width={140} height={42} />
        </Link>
        <Link to={process.env.GOOGLE_PLAY_STORE_LINK} external>
          <Image src={footer_googleplay_download} alt='GooglePlay' width={140} height={42} />
        </Link>
      </div>
    </div>
  )
}

export default DownloadApp
