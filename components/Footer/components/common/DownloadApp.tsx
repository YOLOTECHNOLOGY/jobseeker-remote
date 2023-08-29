import React from 'react'
import Image from 'next/image'
import Link from 'components/Link'

import { getAppStoreLink, getCountryKey } from 'helpers/country'

/* Images */
import { footer_apple_download, footer_googleplay_download, FooterGalaxyAppStore, FooterHuaweiAppStore, FooterXiaomiAppStore } from 'images'

import styles from '../../Footer.module.scss'

const DownloadApp = (props: any) => {
  const { data } = props
  const { downloadBossjobApp } = data?.foot || {}

  return (
    <div className={styles.footerDownloadApp}>
      <p className={styles.footerDownloadAppText}>{downloadBossjobApp}</p>
      <div className={styles.footerDesktopAppList}>
        <Link to={getAppStoreLink()} external>
          <Image src={footer_apple_download} alt='AppStore' width={140} height={42} />
        </Link>
        <Link to={process.env.GOOGLE_PLAY_STORE_LINK} external>
          <Image src={footer_googleplay_download} alt='GooglePlay' width={140} height={42} />
        </Link>
        <Link to={process.env.GALAXY_APP_STORE_LINK} external>
          <Image src={FooterGalaxyAppStore} alt='GalaxyStore' width={140} height={42} />
        </Link>
        <Link to={process.env.HUAWEI_APP_STORE_LINK} external>
          <Image src={FooterHuaweiAppStore} alt='HuaweiStore' width={140} height={42} />
        </Link>
        <Link to={process.env.XIAOMI_APP_STORE_LINK} external>
          <Image src={FooterXiaomiAppStore} alt='XiaomiStore' width={140} height={42} />
        </Link>
      </div>
    </div>
  )
}

export default DownloadApp
