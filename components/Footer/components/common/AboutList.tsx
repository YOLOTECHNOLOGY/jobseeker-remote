import React from 'react'
import { getLang } from 'helpers/country'
import Link from 'components/Link'
import styles from '../../Footer.module.scss'

const AboutList = (props: any) => {
  const { data } = props

  const { aboutBossjob, termsConditions, legal, FAQ } = data?.foot || {}

  const langKey = getLang()

  return (
    <ul className={styles.footerDesktopLinkList}>
      <li>
        <Link
          className={styles.footerLink}
          to={`/${langKey}/company/bossjob-1668`}
          title='About Bossjob'
          aTag={false}
          external={false}
        >
          <span>{aboutBossjob}</span>
        </Link>
      </li>
      <li>
        <Link
          className={styles.footerLink}
          to={`${process.env.BLOG_BOSSJOB}/terms-and-conditions/  `}
          title='Blog Bossjob'
          external
        >
          <span>{termsConditions}</span>
        </Link>
      </li>
      <li>
        <Link
          className={styles.footerLink}
          to={`${process.env.BLOG_BOSSJOB}/terms-and-conditions/  `}
          title='Legal'
          external
        >
          <span>{legal}</span>
        </Link>
      </li>
      <li>
        <Link
          className={styles.footerLink}
          to={`${process.env.BOSS_BLOG_URL}/category/faq/`}
          title='faq'
          external
        >
          <span>{FAQ}</span>
        </Link>
      </li>
    </ul>
  )
}

export default AboutList
