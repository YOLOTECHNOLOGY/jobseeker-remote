import React, { useContext } from 'react'

import { getLang } from 'helpers/country'
import { languageContext } from 'app/components/providers/languageProvider'

import styles from '../Footer.module.scss'

/* Components */
import SocialLink from './Mobile/SocialLink'
import DownloadApp from './common/DownloadApp'
import Company from './Mobile/Company'
import PopularJobsLink from './Mobile/PopularJobsLink'
import RecruiterLink from './Mobile/RecruiterLink'
import TalentsLink from './Mobile/TalentsLink'
import AboutLink from './Mobile/AboutLink'
import Copyright from './common/Copyright'

const Mobile = (props: any) => {
  const { lang } = props
  const contextLang = useContext(languageContext)
  const data = lang ?? contextLang
  const langKey = getLang()

  return (
    <div className={styles.footerMobileContainer}>
      <AboutLink data={data} langKey={langKey} />

      <TalentsLink data={data} langKey={langKey} />

      <RecruiterLink data={data} />

      <PopularJobsLink data={data} langKey={langKey} />

      <Company data={data} />

      <DownloadApp data={data} />

      <SocialLink data={data} />

      <Copyright data={data} />
    </div>
  )
}

export default Mobile
