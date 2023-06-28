import React from 'react'
import Link from 'components/Link'
import Text from 'components/Text'
import styles from '../../Footer.module.scss'

const RecruiterLink = (props) => {
  const { data } = props
  const {
    recruiter,
    getStarted,
  } = data?.foot || {}

  return (
    <>
      <div className={styles.footerDesktopLinkTitle}>{recruiter}</div>
      <ul className={styles.footerDesktopLinkList}>
        <li>
          <Link
            className={styles.footerLink}
            to={`${process.env.BOSSHUNT_URL}`}
            title='Get started'
            external
          >
            <span>{getStarted}</span>
          </Link>
        </li>
      </ul>
    </>
  )
}

export default RecruiterLink
