import React, { useContext } from 'react'

/* Components */
import Link from 'components/Link'
import Text from 'components/Text'
import Accordian from 'components/Accordian'
import { getCountry, getCountryKey, getLang } from 'helpers/country'
import { languageContext } from 'app/components/providers/languageProvider'
import { getCookie } from 'helpers/cookies'
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
import classNames from 'classnames/bind'
import LazyLoad from '../../LazyLoad'

const CountryList = (data) => {
  const countryKey = getCountryKey()
  const { JobsIn1, JobsIn2, JobsIn3 } = data?.lang || {}
  const langKey = data.langKey
  const COUNTRY_MAP = {
    ph: [
      {
        to: `${langKey}/jobs-hiring/manila-jobs`,
        title: JobsIn1
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
    sg: [
      {
        to: `${langKey}/jobs-hiring/downtown-core-jobs`,
        title: JobsIn1
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
      {currentCounties.map((country) => {
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
      })}
    </>
  )
}

const Mobile = (props: any) => {
  const { lang } = props
  const contextLang = useContext(languageContext)
  const isLogin = getCookie('accessToken') ? true : false
  const data = lang ?? contextLang
  const langKey = getLang()
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
  } = data?.foot || {}

  return (
    <div className={styles.footerMobileContainer}>
      <div style={{ padding: '0 20px' }}>
        <Accordian
          paddedLine
          paddedContent
          dark={true}
          title={
            <Text textStyle='sm' bold className={styles.footerMobileLinkTitle}>
              {about}
            </Text>
          }
        >
          <ul className={styles.footerDesktopLinkList}>
            <li>
              <Link
                className={styles.footerLink}
                to={`/${langKey}/company/bossjob-1668`}
                external={false}
                aTag={false}
                title='About Bossjob'
              >
                <Text textStyle='sm'>{aboutBossjob}</Text>
              </Link>
            </li>
            <li>
              <Link
                className={styles.footerLink}
                to={`/${langKey}/terms-and-conditions/  `}
                title='Blog Bossjob'
                external
              >
                <Text textStyle='sm'>{termsConditions}</Text>
              </Link>
            </li>
            <li>
              <Link
                className={styles.footerLink}
                to={`/${langKey}/terms-and-conditions/  `}
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
                title='FAQs'
                external
              >
                <Text textStyle='sm'>{FAQ}</Text>
              </Link>
            </li>
          </ul>
        </Accordian>
        <Accordian
          paddedLine
          paddedContent
          dark={true}
          title={
            <Text textStyle='sm' bold className={styles.footerMobileLinkTitle}>
              {talents}
            </Text>
          }
        >
          <ul className={styles.footerDesktopLinkList}>
            <li>
              <Link
                className={styles.footerLink}
                to={`/${langKey}/jobs-hiring/job-search`}
                title={`Jobs in ${getCountry()}`}
              >
                <Text textStyle='sm'>{allJobs}</Text>
              </Link>
            </li>
            <li>
              <Link
                className={styles.footerLink}
                to={`/${langKey}/jobs-hiring/job-search`}
                title='Create Job Alert'
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
                to='https://blog.bossjob.ph'
                title='Career Guide'
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
        </Accordian>
        <Accordian
          paddedLine
          paddedContent
          dark={true}
          title={
            <Text textStyle='sm' bold className={styles.footerMobileLinkTitle}>
              {recruiter}
            </Text>
          }
        >
          <ul className={styles.footerDesktopLinkList}>
            <li>
              <Link
                className={styles.footerLink}
                to={`${process.env.BOSSHUNT_URL}`}
                external
                title='Get started'
              >
                <Text textStyle='sm'>{getStarted}</Text>
              </Link>
            </li>
          </ul>
        </Accordian>
        <Accordian
          paddedLine
          paddedContent
          dark={true}
          title={
            <Text textStyle='sm' bold className={styles.footerMobileLinkTitle}>
              {popularJobs}
            </Text>
          }
        >
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
                to={`/${langKey}/jobs-hiring/finance-accounting-jobs`}
                title='Finance Jobs'
                external={false}
                aTag={false}
              >
                <Text textStyle='sm'>{financeJobs}</Text>
              </Link>
            </li>
            <li>
              <Link
                className={styles.footerLink}
                to={`/${langKey}/jobs-hiring/customer-service-jobs`}
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
                to={`/${langKey}/jobs-hiring/sales-marketing-jobs`}
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
                to={`/${langKey}/jobs-hiring/healthcare-medical-jobs`}
                title='Healthcare jobs'
                external={false}
                aTag={false}
              >
                <Text textStyle='sm'>{healthcareJobs}</Text>
              </Link>
            </li>
          </ul>
        </Accordian>

        <div className={styles.footerMobileCompany}>
          <div className={styles.footerMobileCompanyLogo}>
            <Image alt='Yolo Technology' width={124} height={32} src={footer_logo}></Image>
          </div>
          <div className={styles.footerMobileCompanyDesc}>
            We embarked on the journey of Yolo Technology in 2016 as a forerunner of technological
            evolution and innovation to bring a change in the world.
          </div>
        </div>

        <div className={styles.footerMobileDownload}>
          <Text textStyle='sm' className={styles.footerMobileDownloadText}>
            {downloadBossjobApp}
          </Text>
          <div className={styles.footerMobileDownloadApp}>
            <div style={{ marginRight: '15px' }}>
              <Link to={process.env.APP_STORE_LINK} external>
                <LazyLoad>
                  <img src={footer_apple_download} alt='AppStore' width='140' height='42' />
                </LazyLoad>
              </Link>
            </div>
            <div>
              <Link to={process.env.GOOGLE_PLAY_STORE_LINK} external>
                <LazyLoad>
                  <img src={footer_googleplay_download} alt='GooglePlay' width='140' height='42' />
                </LazyLoad>
              </Link>
            </div>
          </div>
        </div>
        <div className={styles.footerMobileSocialLinks}>
          <Text textStyle='sm' bold className={styles.footerMobileSocialLinksText}>
            {followUs}
          </Text>
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

      <div className={styles.footerCopyrightWrapper}>
        <div className={classNames([styles.copyrightWrapper, styles.mobile])}>
          <div className={styles.copyrightCompanies}>
            <Text tagName='p' textStyle='sm'>
              Copyright © {new Date().getFullYear()}&nbsp;Singapore: Yolo Technology Pte Ltd. All Rights Reserved.
              <br />
              <span>Philippines: Etos Adtech Corporation</span>
            </Text>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Mobile
