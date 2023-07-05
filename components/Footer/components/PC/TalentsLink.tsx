import React from 'react'
import styles from '../../Footer.module.scss'
import TalentsList from '../common/TalentsList'

const TalentsLink = (props) => {
  const { data } = props

  const {
    talents,
  } = data?.foot || {}

  return (
    <>
      <div className={styles.footerDesktopLinkTitle}>{talents}</div>
      <TalentsList data={data} />
    </>
  )
}

export default TalentsLink
