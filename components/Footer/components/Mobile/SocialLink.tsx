import React from 'react'
import styles from '../../Footer.module.scss'

import SocialList from '../common/SocialList'

const SocialLink = (props: any) => {
  const { data } = props
  const { followUs, workingDate } = data?.foot || {}

  return (
    <div className={styles.footerMobileSocialLinks}>
      <div className={styles.footerMobileSocialDate}>{workingDate}</div>
      <div className={styles.footerMobileSocialList}>
        <div className={styles.footerMobileSocialLinksText}>{followUs}</div>
        <SocialList />
      </div>
    </div>
  )
}

export default SocialLink
