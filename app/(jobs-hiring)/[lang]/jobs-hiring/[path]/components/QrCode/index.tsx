import React from 'react'
import Image from 'next/image'

import styles from '../../index.module.scss'

import { AppDownQRCode } from 'images'

const QrCode = () => {
  return (
    <div className={styles.qrCode}>
      <Image src={AppDownQRCode} alt='app download' width={98} height={98} />
      <div className={styles.qrCodeText}>Download APP chat with Boss</div>
    </div>
  )
}

export default QrCode
