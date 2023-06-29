import React from 'react'
import Image from 'next/image'

import styles from '../../Footer.module.scss'

/* Images */
import { footer_logo } from 'images'

const Company = () => {
  return (
    <div className={styles.footerMobileCompany}>
      <div className={styles.footerMobileCompanyLogo}>
        <Image alt='Yolo Technology' width={124} height={32} src={footer_logo}></Image>
      </div>
      <div className={styles.footerMobileCompanyDesc}>
        We embarked on the journey of Yolo Technology in 2016 as a forerunner of technological
        evolution and innovation to bring a change in the world.
      </div>
    </div>
  )
}

export default Company
