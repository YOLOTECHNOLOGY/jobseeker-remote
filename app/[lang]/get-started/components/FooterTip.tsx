import React from 'react'
import styles from '../index.module.scss'
import Link from 'next/link'

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
          href={
            process.env.ENV === 'development'
              ? 'https://dev.employer.bossjob.com'
              : 'https://employer.bossjob.com'
          }
          className={styles.AuthCTALink}
        >
          {newGetStarted.employer}
        </Link>
      </p>
    </>
  )
}

export default FooterTip
