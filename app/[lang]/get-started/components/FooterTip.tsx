import React from 'react'
import styles from '../index.module.scss'
import Link from 'next/link'
import linkToHunt from 'helpers/linkToHunt'

interface IProps {
  lang: any
}

const FooterTip = (props: IProps) => {
  const { lang } = props

  const { newGetStarted } = lang

  return (
    <>
      <p className={styles.tips}>
        {newGetStarted.tips}
        <Link
          href={linkToHunt('')}
          className={styles.AuthCTALink}
        >
          {newGetStarted.employer}
        </Link>
      </p>
    </>
  )
}

export default FooterTip
