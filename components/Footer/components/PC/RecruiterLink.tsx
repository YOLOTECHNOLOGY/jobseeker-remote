import React from 'react'
import styles from '../../Footer.module.scss'
import RecruiterList from '../common/RecruiterList'

const RecruiterLink = (props:any) => {
  const { data } = props
  const { recruiter } = data?.foot || {}

  return (
    <>
      <div className={styles.footerDesktopLinkTitle}>{recruiter}</div>
      <RecruiterList data={data} />
    </>
  )
}

export default RecruiterLink
