import React from 'react'
import styles from '../../Footer.module.scss'

import Image from 'next/image'

/* Images */
import { footer_logo } from 'images'

const Company = (props: any) => {
  

  return (
    <div className={styles.footerDesktopLeftTop}>
      <div className={styles.footerDesktopLogo}>
        <Image alt='Yolo Technology' width={124} height={32} src={footer_logo}></Image>
      </div>
      <div className={styles.footerDesktopCompanyDesc}>
        We embarked on the journey of Yolo Technology in 2016 as a forerunner of technological
        evolution and innovation to bring a change in the world.
      </div>
    </div>
  )
}

export default Company
