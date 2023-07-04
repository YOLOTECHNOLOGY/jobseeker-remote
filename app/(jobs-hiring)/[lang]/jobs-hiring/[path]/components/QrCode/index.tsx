import React from 'react'
import Image from 'next/image'

import styles from '../../index.module.scss'

import { AppDownQRCode } from 'images'

interface IProps {
  lang: any
}

const QrCode = (props: IProps) => {

  const { lang } = props

  return (
    <div className={styles.qrCode}>
      <Image src={AppDownQRCode} alt='app download' width={98} height={98} />
      <div className={styles.qrCodeText}>
        <span>{lang?.downloadAppWithQrCode}</span>
      </div>
    </div>
  )
}

export default QrCode
