import React,{useContext} from 'react'
/* Components */
import Link from 'components/Link'
import Text from 'components/Text'
import { getCountryKey ,getLang} from 'helpers/country'
import { languageContext } from 'app/components/providers/languageProvider'
import { getCookie } from 'helpers/cookies'

/* Images */
import {
  DownloadOnAppStore,
  DownloadOnGooglePlay,
  facebook,
  instagram,
  twitter,
  linkedin,
  youtube,
  tiktok
} from 'images'

import styles from '../Footer.module.scss'
import LazyLoad from '../../LazyLoad'

const CountryList = (data) => {
  const countryKey = getCountryKey()
  const {
    JobsIn1,
    JobsIn2,
    JobsIn3,
  } = data?.lang ||{}
  const langKey = data.langKey
  const COUNTRY_MAP = {
    'ph': [
      {
        to: `${langKey}/jobs-hiring/manila-jobs`,
        title: JobsIn1,
      },
      {
        to: `${langKey}/jobs-hiring/makati-jobs`,
        title: JobsIn2
      },
      {
        to: `${langKey}/jobs-hiring/cebu-jobs`,
        title: JobsIn3
      }
    ],
    'sg': [
      {
        to: `${langKey}/jobs-hiring/downtown-core-jobs`,
        title: JobsIn1,
      },
      {
        to: `${langKey}/jobs-hiring/kallang-jobs`,
        title: JobsIn2
      },
      {
        to: `${langKey}/jobs-hiring/jurong-east-jobs`,
        title: JobsIn3
      }
    ]
  }
  const currentCounties = COUNTRY_MAP[countryKey]

  return (
    <>
      {
        currentCounties.map((country) => {
          return (
            <li key={country.title}>
              <Link
                className={styles.footerLink}
                to={country.to}
                title={country.title}
                external={false}
                aTag={false}
              >
                <Text textStyle='sm'>{country.title}</Text>
              </Link>
            </li>
          )
        })
      }
    </>
  )
}


const PC = (props: any) => {
  const { lang } = props
  const contextLang =  useContext(languageContext)
  const data = lang ?? contextLang
  const langKey = getLang();
  const isLogin = getCookie('accessToken') ? true : false

  const {
    about,
    aboutBossjob,
    termsConditions,
    legal,
    FAQ,
    talents,
    allJobs,
    createJobAlert,
    createFree,
    careerGuide,
    courses,
    recruiter,
    getStarted,
    popularJobs,
    ItJobs,
    financeJobs,
    customerService,
    BpoJobs,
    salesJobs,
    healthcareJobs,
    downloadBossjobApp,
    followUs,
    technology,
    corporation
  } = data?.foot ||{}


  return (
    <div className={styles.footerDesktopWrapper}>
      <div className={styles.footerDesktopLinksWrapper}>
        <div className={styles.footerDesktopSupportWrapper}>
          <div className={styles.footerColumn}>
            <Text textStyle='sm' bold tagName='p'>
              {about}
            </Text>
            <ul className={styles.footerDesktopLinkList}>
              <li>
                <Link
                  className={styles.footerLink}
                  to={`${langKey}/company/bossjob-1668`}
                  title='About Bossjob'
                  aTag={false}
                  external={false}
                >
                  <Text textStyle='sm'>{aboutBossjob}</Text>
                </Link>
              </li>
              <li>
                <Link
                  className={styles.footerLink}
                  to={`${process.env.BLOG_BOSSJOB}/terms-and-conditions/  `}
                  title='Blog Bossjob'
                  external
                >
                  <Text textStyle='sm'>{termsConditions}</Text>
                </Link>
              </li>
              <li>
                <Link
                  className={styles.footerLink}
                  to={`${process.env.BLOG_BOSSJOB}/terms-and-conditions/  `}
                  title='Legal'
                  external
                >
                  <Text textStyle='sm'>{legal}</Text>
                </Link>
              </li>
              <li>
                <Link
                  className={styles.footerLink}
                  to={`${process.env.BOSS_BLOG_URL}/category/faq/`}
                  title='faq'
                  external
                >
                  <Text textStyle='sm'>{FAQ}</Text>
                </Link>
              </li>
            </ul>
          </div>
          <div className={styles.footerColumn}>
            <Text textStyle='sm' bold tagName='p'>
              {talents}
            </Text>
            <ul className={styles.footerDesktopLinkList}>
              <li>
                <Link
                  className={styles.footerLink}
                  to={`/${langKey}/jobs-hiring/job-search`}
                  title='All jobs'
                >
                  <Text textStyle='sm'>{allJobs}</Text>
                </Link>
              </li>
              <li>
                <Link
                  className={styles.footerLink}
                  to={`/${langKey}/jobs-hiring/job-search`}
                  title='Create job alert'
                >
                  <Text textStyle='sm'>{createJobAlert}</Text>
                </Link>
              </li>
              <li>
                <Link
                  className={styles.footerLink}
                  to={
                    isLogin ? `/${langKey}/manage-profile?tab=resume` : `/${langKey}/resumetemplate`
                  }
                  title='Create Free Resume'
                >
                  <Text textStyle='sm'>{createFree}</Text>
                </Link>
              </li>
              <li>
                <Link
                  className={styles.footerLink}
                  to='https://blog.bossjob.ph/category/career-advice/'
                  title='Career guide'
                  external
                >
                  <Text textStyle='sm'>{careerGuide}</Text>
                </Link>
              </li>
              <li>
                <Link
                  className={styles.footerLink}
                  to='https://academy.bossjob.ph/courses/search-courses'
                  title='Courses'
                  external
                >
                  <Text textStyle='sm'>{courses}</Text>
                </Link>
              </li>
            </ul>
          </div>
          <div className={styles.footerColumn}>
            <Text textStyle='sm' bold tagName='p'>
              {recruiter}
            </Text>
            <ul className={styles.footerDesktopLinkList}>
              <li>
                <Link
                  className={styles.footerLink}
                  to={`${process.env.BOSSHUNT_URL}`}
                  title='Get started'
                  external
                >
                  <Text textStyle='sm'>{getStarted}</Text>
                </Link>
              </li>
            </ul>
          </div>
          <div className={styles.footerColumn}>
            <Text textStyle='sm' bold tagName='p'>
              {popularJobs}
            </Text>
            <ul className={styles.footerDesktopLinkList}>
              <CountryList lang={lang?.foot || {}} langKey={langKey} />
              <li>
                <Link
                  className={styles.footerLink}
                  to={`/${langKey}/jobs-hiring/information-technology-jobs?page=1`}
                  title='IT jobs'
                  external={false}
                  aTag={false}
                >
                  <Text textStyle='sm'>{ItJobs}</Text>
                </Link>
              </li>
              <li>
                <Link
                  className={styles.footerLink}
                  to={`/${langKey}/jobs-hiring/finance-audit-tax-jobs?page=1`}
                  title='Finance jobs'
                  external={false}
                  aTag={false}
                >
                  <Text textStyle='sm'>{financeJobs}</Text>
                </Link>
              </li>
              <li>
                <Link
                  className={styles.footerLink}
                  to={`/${langKey}/jobs-hiring/customer-service-operations-jobs?page=1`}
                  title='Customer Service jobs'
                  external={false}
                  aTag={false}
                >
                  <Text textStyle='sm'>{customerService}</Text>
                </Link>
              </li>
              <li>
                <Link
                  className={styles.footerLink}
                  to={`/${langKey}/jobs-hiring/bpo-jobs`}
                  title='BPO jobs'
                  external={false}
                  aTag={false}
                >
                  <Text textStyle='sm'>{BpoJobs}</Text>
                </Link>
              </li>
              <li>
                <Link
                  className={styles.footerLink}
                  to={`/${langKey}/jobs-hiring/sales-jobs?page=1`}
                  title='Sales jobs'
                  external={false}
                  aTag={false}
                >
                  <Text textStyle='sm'>{salesJobs}</Text>
                </Link>
              </li>
              <li>
                <Link
                  className={styles.footerLink}
                  to={`/${langKey}/jobs-hiring/healthcare-medical-jobs?page=1`}
                  title='Healthcare jobs'
                  external={false}
                  aTag={false}
                >
                  <Text textStyle='sm'>{healthcareJobs}</Text>
                </Link>
              </li>
            </ul>
          </div>
          <div className={styles.footerColumn}>
            <Text textStyle='sm' bold tagName='p'>
              {downloadBossjobApp}
            </Text>
            <div style={{ margin: '25px 10px 10px 0' }}>
              <Link to={process.env.APP_STORE_LINK} external>
                <LazyLoad>
                  <img src={DownloadOnAppStore} alt='AppStore' width='112' height='35' />
                </LazyLoad>
              </Link>
            </div>
            <div>
              <Link to={process.env.GOOGLE_PLAY_STORE_LINK} external>
                <LazyLoad>
                  <img src={DownloadOnGooglePlay} alt='GooglePlay' width='112' height='35' />
                </LazyLoad>
              </Link>
            </div>
          </div>
          <div className={styles.footerColumn}>
            <Text textStyle='sm' bold tagName='p'>
              {followUs}
            </Text>
            <div className={styles.footerDesktopSocialWrapper}>
              <div>
                <div className={styles.footerDesktopSocialLinks}>
                  <Link
                    className={styles.socialLink}
                    to='https://www.facebook.com/Bossjobph'
                    external
                    title='Bossjob Facebook'
                  >
                    <LazyLoad>
                      <img src={facebook} alt='facebook' width='32' height='32' />
                    </LazyLoad>
                  </Link>
                  <Link
                    className={styles.socialLink}
                    to='https://www.linkedin.com/company/bossjob-yolo-technology/'
                    external
                    title='Bossjob LinkedIn'
                  >
                    <LazyLoad>
                      <img src={linkedin} alt='linkedin' width='32' height='32' />
                    </LazyLoad>
                  </Link>
                  <Link
                    className={styles.socialLink}
                    to='https://www.instagram.com/Bossjobph'
                    external
                    title='Bossjob Instagram'
                  >
                    <LazyLoad>
                      <img src={instagram} alt='instagram' width='32' height='32' />
                    </LazyLoad>
                  </Link>
                  <Link
                    className={styles.socialLink}
                    to='https://www.youtube.com/channel/UCszmY1TPgEyikxF9w2a2vdw'
                    external
                    title='Bossjob Youtube'
                  >
                    <LazyLoad>
                      <img src={youtube} alt='youtube' width='32' height='32' />
                    </LazyLoad>
                  </Link>
                  <Link
                    className={styles.socialLink}
                    to='https://twitter.com/BossjobOfficial'
                    external
                    title='Bossjob Twitter'
                  >
                    <LazyLoad>
                      <img src={twitter} alt='twitter' width='32' height='32' />
                    </LazyLoad>
                  </Link>
                  <Link
                    className={styles.socialLink}
                    to='https://tiktok.com/@bossjobph'
                    external
                    title='Bossjob Tiktok'
                  >
                    <img src={tiktok} alt='tiktok' width='32' height='32' />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PC
