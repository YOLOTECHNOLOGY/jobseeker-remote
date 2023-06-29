import React from 'react'
import styles from '../../Footer.module.scss'
import AboutList from '../common/AboutList'

const AboutLink = (props) => {
  const { data } = props
  const { about } = data?.foot || {}

  return (
    <>
      <div className={styles.footerDesktopLinkTitle}>{about}</div>
      <AboutList data={data} />
    </>
  )
}

export default AboutLink
