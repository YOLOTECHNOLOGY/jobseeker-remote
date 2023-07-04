import React from 'react'
import Image from 'next/image'
import Link from 'components/Link'
import styles from '../../Footer.module.scss'
import { getLang } from 'helpers/country'

/* Images */
import { footer_logo } from 'images'

const CompanyInfo = (props: any) => {

  const { data } = props

  const langKey = getLang()

  const { companyDesc } = data?.foot || {}

  return (
    <>
      <div className={styles.footerDesktopLogo}>
        <Link to={`/${langKey}/`} className={styles.footerDesktopLogoLink}>
          <Image alt='Yolo Technology' width={124} height={32} src={footer_logo}></Image>
        </Link>
      </div>
      <div className={styles.footerDesktopCompanyDesc}>{companyDesc}</div>
    </>
  )
}

export default CompanyInfo
