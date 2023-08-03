import React from 'react'
// import Image from 'next/image'
import styles from '../../index.module.scss'
// import { AppDownQRCode } from 'images'
import QrCodeDraw from 'app/[lang]/get-started/components/QrCodeDraw'
import {appLinkUrl} from 'helpers/constants'
interface IProps {
  lang: any
}

const QrCode = (props: IProps) => {

  const { lang } = props

  return (
    <div className={styles.qrCode}>
      <div style={{height:'108px'}}>
      <QrCodeDraw   text={appLinkUrl} ecl='H'  width={98} height={98} />
      </div>   
      {/* <Image src={AppDownQRCode} alt='app download' width={98} height={98} /> */}
      <div className={styles.qrCodeText}>
        <span>{lang?.downloadAppWithQrCode}</span>
      </div>
    </div>
  )
}

export default QrCode
