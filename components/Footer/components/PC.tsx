import React, { useContext } from 'react'
/* Components */
import Link from 'components/Link'
import Text from 'components/Text'
import { getLang } from 'helpers/country'
import { languageContext } from 'app/components/providers/languageProvider'
import Image from 'next/image'

/* Images */
import {
  footer_logo,
  footer_facebook_icon,
  footer_linkedIn_icon,
  footer_instagram_icon,
  footer_tiktok_icon,
  footer_youtube_icon,
  footer_twitter_icon,
  footer_apple_download,
  footer_googleplay_download
} from 'images'

import styles from '../Footer.module.scss'
import LazyLoad from '../../LazyLoad'
import AboutLink from './PC/AboutLink'
import TalentsLink from './PC/TalentsLink'
import RecruiterLink from './PC/RecruiterLink'
import PopularJobsLink from './PC/PopularJobsLink'

const PC = (props: any) => {
  const { lang } = props
  const contextLang = useContext(languageContext)
  const data = lang ?? contextLang
  const langKey = getLang()

  const { downloadBossjobApp, followUs, technology, corporation } = data?.foot || {}

  return (
    <div className={styles.footerDesktopWrapper}>
      {/* top */}
      <div className={styles.footerDesktopTop}>
        <div className={styles.footerDesktopLeft}>
          <div className={styles.footerDesktopLeftTop}>
            <div className={styles.footerDesktopLogo}>
              <Image alt='Yolo Technology' width={124} height={32} src={footer_logo}></Image>
            </div>
            <div className={styles.footerDesktopCompanyDesc}>
              We embarked on the journey of Yolo Technology in 2016 as a forerunner of technological evolution and innovation to bring a change in the world.
            </div>
          </div>
          <div className={styles.footerDesktopLeftBottom}>
            <p>{downloadBossjobApp}</p>
            <div className={styles.footerDesktopApp}>
              <Link to={process.env.APP_STORE_LINK} external>
                <LazyLoad>
                  <img src={footer_apple_download} alt='AppStore' width='140' height='42' />
                </LazyLoad>
              </Link>
              <Link to={process.env.GOOGLE_PLAY_STORE_LINK} external>
                <LazyLoad>
                  <img src={footer_googleplay_download} alt='GooglePlay' width='140' height='42' />
                </LazyLoad>
              </Link>
            </div>
          </div>
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
        <div className={styles.copyright}>
          <div className={styles.copyrightWrapper}>
            <div className={styles.copyrightCompanies}>
                Copyright © 2016-{new Date().getFullYear()}&nbsp;{technology}
                <br />
                <span>{corporation}</span>
            </div>
          </div>
        </div>
        <div className={styles.footerDesktopSocialWrapper}>
          <div className={styles.footerDesktopSocialLinks}>
            <div className={styles.footerDesktopSocialLinkFollow}>
              {followUs}
            </div>
            <Link
              className={styles.socialLink}
              to='https://www.facebook.com/Bossjobph'
              external
              title='Bossjob Facebook'
            >
              <LazyLoad>
                <img src={footer_facebook_icon} alt='facebook' width='32' height='32' />
              </LazyLoad>
            </Link>
            <Link
              className={styles.socialLink}
              to='https://www.linkedin.com/company/bossjob-yolo-technology/'
              external
              title='Bossjob LinkedIn'
            >
              <LazyLoad>
                <img src={footer_linkedIn_icon} alt='linkedin' width='32' height='32' />
              </LazyLoad>
            </Link>
            <Link
              className={styles.socialLink}
              to='https://www.instagram.com/Bossjobph'
              external
              title='Bossjob Instagram'
            >
              <LazyLoad>
                <img src={footer_instagram_icon} alt='instagram' width='32' height='32' />
              </LazyLoad>
            </Link>
            <Link
              className={styles.socialLink}
              to='https://www.youtube.com/channel/UCszmY1TPgEyikxF9w2a2vdw'
              external
              title='Bossjob Youtube'
            >
              <LazyLoad>
                <img src={footer_youtube_icon} alt='youtube' width='32' height='32' />
              </LazyLoad>
            </Link>
            <Link
              className={styles.socialLink}
              to='https://twitter.com/BossjobOfficial'
              external
              title='Bossjob Twitter'
            >
              <LazyLoad>
                <img src={footer_twitter_icon} alt='twitter' width='32' height='32' />
              </LazyLoad>
            </Link>
            <Link
              className={styles.socialLink}
              to='https://tiktok.com/@bossjobph'
              external
              title='Bossjob Tiktok'
            >
              <img src={footer_tiktok_icon} alt='tiktok' width='32' height='32' />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PC
