import React from 'react'
import styles from '../../Footer.module.scss'
import PopularList from '../common/PopularList'

const PopularJobsLink = (props) => {
  const { data, langKey } = props
  const {
    popularJobs,
  } = data?.foot || {}

  return (
    <>
      <div className={styles.footerDesktopLinkTitle}>{popularJobs}</div>
      <PopularList data={data} langKey={langKey} />
    </>
  )
}

export default PopularJobsLink
