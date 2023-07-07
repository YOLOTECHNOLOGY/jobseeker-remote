import React from 'react'
import styles from '../../Footer.module.scss'

import SocialList from '../common/SocialList'

const SocialLink = (props: any) => {
  const { data } = props
  const { followUs } = data?.foot || {}

  return (
    <div className={styles.footerMobileSocialLinks}>
      <div className={styles.footerMobileSocialLinksText}>{followUs}</div>
      <SocialList />
    </div>
  )
}

export default SocialLink
