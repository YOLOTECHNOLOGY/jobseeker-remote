import React from 'react'
import Link from 'components/Link'
import styles from '../../Footer.module.scss'

const AboutLink = (props) => {
  const { data, langKey } = props
  const { about, aboutBossjob, termsConditions, legal, FAQ } = data?.foot || {}

  return (
    <>
      <div className={styles.footerDesktopLinkTitle}>{about}</div>
      <ul className={styles.footerDesktopLinkList}>
        <li>
          <Link
            className={styles.footerLink}
            to={`${langKey}/company/bossjob-1668`}
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
    </>
  )
}

export default AboutLink
