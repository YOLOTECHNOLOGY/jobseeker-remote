import React from 'react'

import styles from '../../Footer.module.scss'

import SocialList from '../common/SocialList'

const SocialLink = (props: any) => {
  const { data } = props

  const { followUs, workingDate } = data?.foot || {}

  return (
    <div className={styles.footerDesktopSocialLinks}>
      <div className={styles.footerDesktopSocialDate}>{workingDate}</div>
      <div className={styles.footerDesktopSocialList}>
        <div className={styles.footerDesktopSocialLinkFollow}>{followUs}</div>
        <SocialList />
      </div>
    </div>
  )
}

export default SocialLink
