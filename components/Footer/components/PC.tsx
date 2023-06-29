import React, { useContext } from 'react'
import { getLang } from 'helpers/country'
import { languageContext } from 'app/components/providers/languageProvider'

import styles from '../Footer.module.scss'

/* Components */
import AboutLink from './PC/AboutLink'
import TalentsLink from './PC/TalentsLink'
import RecruiterLink from './PC/RecruiterLink'
import PopularJobsLink from './PC/PopularJobsLink'
import SocialLink from './PC/SocialLink'
import Copyright from './common/Copyright'
import DownloadApp from './common/DownloadApp'
import Company from './PC/Company'

const PC = (props: any) => {
  const { lang } = props
  const contextLang = useContext(languageContext)
  const data = lang ?? contextLang
  const langKey = getLang()

  return (
    <div className={styles.footerDesktopWrapper}>
      {/* top */}
      <div className={styles.footerDesktopTop}>
        <div className={styles.footerDesktopLeft}>
          <Company data={data} />

          <DownloadApp  data={data} />
        </div>

        <div className={styles.footerDesktopRight}>
          <div className={styles.footerDesktopRightLink}>
            <AboutLink data={data} langKey={langKey} />
          </div>
          <div className={styles.footerDesktopRightLink}>
            <TalentsLink data={data} langKey={langKey} />
          </div>
          <div className={styles.footerDesktopRightLink}>
            <RecruiterLink data={data} langKey={langKey} />
          </div>
          <div className={styles.footerDesktopRightLink}>
            <PopularJobsLink data={data} lang={lang} langKey={langKey} />
          </div>
        </div>
      </div>

      {/* divider Line */}
      <div className={styles.footerDesktopDividerLine}></div>

      {/* bottom */}
      <div className={styles.footerDesktopBottom}>
        <Copyright data={data} />
        <SocialLink data={data} />
      </div>
    </div>
  )
}

export default PC
