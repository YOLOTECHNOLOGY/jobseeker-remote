import React from 'react'
import styles from '../../Footer.module.scss'
import Link from 'components/Link'
import Text from 'components/Text'
import linkToHunt from 'helpers/linkToHunt'

const RecruiterLink = (props: any) => {
  const { data } = props

  const { getStarted } = data?.foot || {}

  return (
    <ul className={styles.footerDesktopLinkList}>
      <li>
        <Link
          className={styles.footerLink}
          to={linkToHunt('')}
          external
          title='Get started'
        >
          <Text textStyle='sm'>{getStarted}</Text>
        </Link>
      </li>
    </ul>
  )
}

export default RecruiterLink
