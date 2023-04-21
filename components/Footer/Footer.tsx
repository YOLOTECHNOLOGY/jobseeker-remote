'use client'
import React from 'react'

/* Components */
import Link from 'components/Link'
import Text from 'components/Text'
import Accordian from 'components/Accordian'
import { getCountry, getCountryKey } from 'helpers/country'

/* Images */
import {
  ChevronUpIcon,
  DownloadOnAppStore,
  DownloadOnGooglePlay,
  facebook,
  instagram,
  twitter,
  linkedin,
  youtube,
  tiktok
} from 'images'

import styles from './Footer.module.scss'
import classNames from 'classnames/bind'
import LazyLoad from '../LazyLoad'

const scrollToBottom = () => document.body.scrollIntoView({ behavior: 'smooth', block: 'start' })

const COUNTRY_MAP = {
  'ph': [
    {
      to: `/jobs-hiring/manila-jobs`,
      title: 'Jobs in Manila',
    },
    {
      to: `/jobs-hiring/makati-jobs`,
      title: 'Jobs in Makati'
    },
    {
      to: `/jobs-hiring/cebu-city-jobs`,
      title: 'Jobs in Cebu'
    }
  ],
  'sg': [
    {
      to: `/jobs-hiring/downtown-core-jobs`,
      title: 'Jobs in Downtown Core',
    },
    {
      to: `/jobs-hiring/kallang-jobs`,
      title: 'Jobs in Kallang'
    },
    {
      to: `/jobs-hiring/jurong-east-jobs`,
      title: 'Jobs in Jurong East'
    }
  ]
}

const CountryList = () => {
  const countryKey = getCountryKey()
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


const Footer = () => {
  return (
    <footer className={styles.footer}>
      <button
        style={{ display: 'block' }}
        className={styles.scrollUpButton}
        onClick={() => scrollToBottom()}
      >
        <LazyLoad>
          <img src={ChevronUpIcon} alt='chevron-up' width='15' height='15' />
        </LazyLoad>
      </button>

      <div className={styles.footerContainer}>
        {/* Start of Mobile Footer */}

        <div className={styles.footerMobileContainer}>
          <div style={{ padding: '0 20px' }}>
            <Accordian
              paddedLine
              paddedContent
              title={
                <Text textStyle='sm' bold>
                  About
                </Text>
              }
            >
              <ul className={styles.footerDesktopLinkList}>
                <li>
                  <Link
                    className={styles.footerLink}
                    to={`/company/bossjob-1668`}
                    external={false}
                    aTag={false}
                    title='About Bossjob'
                  >
                    <Text textStyle='sm'>About Bossjob</Text>
                  </Link>
                </li>
                <li>
                  <Link
                    className={styles.footerLink}
                    to={`/terms-and-conditions/  `}
                    title='Blog Bossjob'
                    external
                  >
                    <Text textStyle='sm'>Terms & Conditions</Text>
                  </Link>
                </li>
                <li>
                  <Link
                    className={styles.footerLink}
                    to={`/terms-and-conditions/  `}
                    title='Legal'
                    external
                  >
                    <Text textStyle='sm'>Legal</Text>
                  </Link>
                </li>
                {/* <li>
                  <Link
                    className={styles.footerLink}
                    to={`${process.env.OLD_PROJECT_URL}/bosspoints`}
                    title='BossPoints'
                    external
                  >
                    <Text textStyle='sm'>BossPoints</Text>
                  </Link>
                </li> */}
                <li>
                  <Link
                    className={styles.footerLink}
                    to={`${process.env.BOSS_BLOG_URL}/category/faq/`}
                    title='FAQs'
                    external
                  >
                    <Text textStyle='sm'>FAQ</Text>
                  </Link>
                </li>
                {/* <li>
                  <Link className={styles.footerLink} to='/sitemap' title='Sitemap'>
                    <Text textStyle='sm'>Sitemap</Text>
                  </Link>
                </li> */}
              </ul>
            </Accordian>
            <Accordian
              paddedLine
              paddedContent
              title={
                <Text textStyle='sm' bold>
                  Talents
                </Text>
              }
            >
              <ul className={styles.footerDesktopLinkList}>
                <li>
                  <Link
                    className={styles.footerLink}
                    to='/jobs-hiring/job-search'
                    title={`Jobs in ${getCountry()}`}
                  >
                    <Text textStyle='sm'>All jobs</Text>
                  </Link>
                </li>
                <li>
                  <Link className={styles.footerLink} to='/jobs-hiring' title='Create Job Alert'>
                    <Text textStyle='sm'>Create job alert</Text>
                  </Link>
                </li>
                <li>
                  <Link
                    className={styles.footerLink}
                    to='/resumetemplate'
                    title='Create Free Resume'
                  >
                    <Text textStyle='sm'>Create free resume</Text>
                  </Link>
                </li>
                <li>
                  <Link
                    className={styles.footerLink}
                    to='https://blog.bossjob.ph'
                    title='Career Guide'
                    external
                  >
                    <Text textStyle='sm'>Career guide</Text>
                  </Link>
                </li>
                <li>
                  <Link
                    className={styles.footerLink}
                    to='https://academy.bossjob.ph/courses/search-courses'
                    title='Courses'
                    external
                  >
                    <Text textStyle='sm'>Courses</Text>
                  </Link>
                </li>
              </ul>
            </Accordian>
            <Accordian
              paddedLine
              paddedContent
              title={
                <Text textStyle='sm' bold>
                  Recruiter
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
                    <Text textStyle='sm'>Get started</Text>
                  </Link>
                </li>
              </ul>
            </Accordian>
            <Accordian
              paddedLine
              paddedContent
              title={
                <Text textStyle='sm' bold>
                  Popular Jobs
                </Text>
              }
            >
              <ul className={styles.footerDesktopLinkList}>
                <CountryList />
                <li>
                  <Link
                    className={styles.footerLink}
                    to={`/jobs-hiring/information-technology-jobs?page=1`}
                    title='IT jobs'
                    external={false}
                    aTag={false}
                  >
                    <Text textStyle='sm'>IT jobs</Text>
                  </Link>
                </li>
                <li>
                  <Link
                    className={styles.footerLink}
                    to={`/jobs-hiring/finance-accounting-jobs`}
                    title='Finance Jobs'
                    external={false}
                    aTag={false}
                  >
                    <Text textStyle='sm'>Finance jobs</Text>
                  </Link>
                </li>
                <li>
                  <Link
                    className={styles.footerLink}
                    to={`/jobs-hiring/customer-service-jobs`}
                    title='Customer Service jobs'
                    external={false}
                    aTag={false}
                  >
                    <Text textStyle='sm'>Customer Service jobs</Text>
                  </Link>
                </li>
                <li>
                  <Link
                    className={styles.footerLink}
                    to={`/jobs-hiring/bpo-jobs`}
                    title='BPO jobs'
                    external={false}
                    aTag={false}
                  >
                    <Text textStyle='sm'>BPO jobs</Text>
                  </Link>
                </li>
                <li>
                  <Link
                    className={styles.footerLink}
                    to={`/jobs-hiring/sales-marketing-jobs`}
                    title='Sales jobs'
                    external={false}
                    aTag={false}
                  >
                    <Text textStyle='sm'>Sales jobs</Text>
                  </Link>
                </li>
                <li>
                  <Link
                    className={styles.footerLink}
                    to={`/jobs-hiring/healthcare-medical-jobs`}
                    title='Healthcare jobs'
                    external={false}
                    aTag={false}
                  >
                    <Text textStyle='sm'>Healthcare jobs</Text>
                  </Link>
                </li>
              </ul>
            </Accordian>
            <div className={styles.footerMobileSections}>
              <Text textStyle='sm' bold>
                Download Bossjob App
              </Text>
              <div className={styles.footerMobileDownloadApp}>
                <div style={{ marginRight: '15px' }}>
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
            </div>
            <div className={styles.footerMobileSections}>
              <Text textStyle='sm' bold>
                Follow us
              </Text>
              <div className={styles.footerMobileSocialLinks}>
                <Link
                  className={styles.socialLink}
                  to='www.facebook.com/Bossjobph'
                  external
                  title='Bossjob Facebook'
                >
                  <LazyLoad>
                    <img src={facebook} alt='facebook' width='32' height='32' />
                  </LazyLoad>
                </Link>
                <Link
                  className={styles.socialLink}
                  to='www.linkedin.com/company/bossjob-yolo-technology/'
                  external
                  title='Bossjob LinkedIn'
                >
                  <LazyLoad>
                    <img src={linkedin} alt='linkedin' width='32' height='32' />
                  </LazyLoad>
                </Link>
                <Link
                  className={styles.socialLink}
                  to='www.instagram.com/Bossjobph'
                  external
                  title='Bossjob Instagram'
                >
                  <LazyLoad>
                    <img src={instagram} alt='instagram' width='32' height='32' />
                  </LazyLoad>
                </Link>
                <Link
                  className={styles.socialLink}
                  to='www.youtube.com/channel/UCszmY1TPgEyikxF9w2a2vdw'
                  external
                  title='Bossjob Youtube'
                >
                  <LazyLoad>
                    <img src={youtube} alt='youtube' width='32' height='32' />
                  </LazyLoad>
                </Link>
                <Link
                  className={styles.socialLink}
                  to='twitter.com/Bossjobph'
                  external
                  title='Bossjob Twitter'
                >
                  <LazyLoad>
                    <img src={twitter} alt='twitter' width='32' height='32' />
                  </LazyLoad>
                </Link>
                <Link
                  className={styles.socialLink}
                  to='tiktok.com/@bossjobph'
                  external
                  title='Bossjob Tiktok'
                >
                  <img src={tiktok} alt='tiktok' width='32' height='32' />
                </Link>
              </div>
            </div>
          </div>
          <div className={styles.footerCopyrightWrapper}>
            <div className={classNames([styles.copyrightWrapper, styles.mobile])}>
              <Text tagName='p' textStyle='sm'>
                Copyright © {new Date().getFullYear()}&nbsp;
              </Text>
              <div className={styles.copyrightCompanies}>
                <Text tagName='p' textStyle='sm'>
                  Singapore: Yolo Technology Pte Ltd. All Rights Reserved.
                  <br />
                  <span>Philippines: Etos Adtech Corporation</span>
                </Text>
              </div>
            </div>
          </div>
        </div>

        {/* End of Mobile Footer */}
        {/* Start of Desktop Footer */}
        <div className={styles.footerDesktopWrapper}>
          <div className={styles.footerDesktopLinksWrapper}>
            <div className={styles.footerDesktopSupportWrapper}>
              <div className={styles.footerColumn}>
                <Text textStyle='sm' bold tagName='p'>
                  About
                </Text>
                <ul className={styles.footerDesktopLinkList}>
                  <li>
                    <Link
                      className={styles.footerLink}
                      to={`/company/bossjob-1668`}
                      title='About Bossjob'
                      aTag={false}
                      external={false}
                    >
                      <Text textStyle='sm'>About Bossjob</Text>
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={styles.footerLink}
                      to={`${process.env.BLOG_BOSSJOB}/terms-and-conditions/  `}
                      title='Blog Bossjob'
                      external
                    >
                      <Text textStyle='sm'>Terms & Conditions</Text>
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={styles.footerLink}
                      to={`${process.env.BLOG_BOSSJOB}/terms-and-conditions/  `}
                      title='Legal'
                      external
                    >
                      <Text textStyle='sm'>Legal</Text>
                    </Link>
                  </li>
                  {/* <li>
                    <Link
                      className={styles.footerLink}
                      to={`${process.env.OLD_PROJECT_URL}/bosspoints`}
                      title='BossPoints'
                      external
                    >
                      <Text textStyle='sm'>BossPoints</Text>
                    </Link>
                  </li> */}
                  <li>
                    <Link
                      className={styles.footerLink}
                      to={`${process.env.BOSS_BLOG_URL}/category/faq/`}
                      title='faq'
                      external
                    >
                      <Text textStyle='sm'>FAQ</Text>
                    </Link>
                  </li>
                  {/* <li>
                    <Link className={styles.footerLink} to='/sitemap' title='sitemap'>
                      <Text textStyle='sm'>Sitemap</Text>
                    </Link>
                  </li> */}
                </ul>
              </div>
              <div className={styles.footerColumn}>
                <Text textStyle='sm' bold tagName='p'>
                  Talents
                </Text>
                <ul className={styles.footerDesktopLinkList}>
                  <li>
                    <Link
                      className={styles.footerLink}
                      to='/jobs-hiring/job-search'
                      title='All jobs'
                    >
                      <Text textStyle='sm'>All jobs</Text>
                    </Link>
                  </li>
                  <li>
                    <Link className={styles.footerLink} to='/jobs-hiring' title='Create job alert'>
                      <Text textStyle='sm'>Create job alert</Text>
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={styles.footerLink}
                      to='/resumetemplate'
                      title='Create Free Resume'
                    >
                      <Text textStyle='sm'>Create free resume</Text>
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={styles.footerLink}
                      to='https://blog.bossjob.ph/category/career-advice/'
                      title='Career guide'
                      external
                    >
                      <Text textStyle='sm'>Career guide</Text>
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={styles.footerLink}
                      to='https://academy.bossjob.ph/courses/search-courses'
                      title='Courses'
                      external
                    >
                      <Text textStyle='sm'>Courses</Text>
                    </Link>
                  </li>
                </ul>
              </div>
              <div className={styles.footerColumn}>
                <Text textStyle='sm' bold tagName='p'>
                 Recruiter
                </Text>
                <ul className={styles.footerDesktopLinkList}>
                  <li>
                    <Link
                      className={styles.footerLink}
                      to={`${process.env.BOSSHUNT_URL}`}
                      title='Get started'
                      external
                    >
                      <Text textStyle='sm'>Get started</Text>
                    </Link>
                  </li>
                </ul>
              </div>
              <div className={styles.footerColumn}>
                <Text textStyle='sm' bold tagName='p'>
                  Popular Jobs
                </Text>
                <ul className={styles.footerDesktopLinkList}>
                  <CountryList />
                  <li>
                    <Link
                      className={styles.footerLink}
                      to={`/jobs-hiring/information-technology-jobs?page=1`}
                      title='IT jobs'
                      external={false}
                      aTag={false}
                    >
                      <Text textStyle='sm'>IT jobs</Text>
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={styles.footerLink}
                      to={`/jobs-hiring/finance-audit-tax-jobs?page=1`}
                      title='Finance jobs'
                      external={false}
                      aTag={false}
                    >
                      <Text textStyle='sm'>Finance jobs</Text>
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={styles.footerLink}
                      to={`/jobs-hiring/customer-service-operations-jobs?page=1`}
                      title='Customer Service jobs'
                      external={false}
                      aTag={false}
                    >
                      <Text textStyle='sm'>Customer Service jobs</Text>
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={styles.footerLink}
                      to={`/jobs-hiring/bpo-jobs`}
                      title='BPO jobs'
                      external={false}
                      aTag={false}
                    >
                      <Text textStyle='sm'>BPO jobs</Text>
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={styles.footerLink}
                      to={`/jobs-hiring/sales-jobs?page=1`}
                      title='Sales jobs'
                      external={false}
                      aTag={false}
                    >
                      <Text textStyle='sm'>Sales jobs</Text>
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={styles.footerLink}
                      to={`/jobs-hiring/healthcare-medical-jobs?page=1`}
                      title='Healthcare jobs'
                      external={false}
                      aTag={false}
                    >
                      <Text textStyle='sm'>Healthcare jobs</Text>
                    </Link>
                  </li>
                </ul>
              </div>
              <div className={styles.footerColumn}>
                <Text textStyle='sm' bold tagName='p'>
                  Download Bossjob App
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
                  Follow Us
                </Text>
                <div className={styles.footerDesktopSocialWrapper}>
                  <div>
                    <div className={styles.footerDesktopSocialLinks}>
                      <Link
                        className={styles.socialLink}
                        to='www.facebook.com/Bossjobph'
                        external
                        title='Bossjob Facebook'
                      >
                        <LazyLoad>
                          <img src={facebook} alt='facebook' width='32' height='32' />
                        </LazyLoad>
                      </Link>
                      <Link
                        className={styles.socialLink}
                        to='www.linkedin.com/company/bossjob-yolo-technology/'
                        external
                        title='Bossjob LinkedIn'
                      >
                        <LazyLoad>
                          <img src={linkedin} alt='linkedin' width='32' height='32' />
                        </LazyLoad>
                      </Link>
                      <Link
                        className={styles.socialLink}
                        to='www.instagram.com/Bossjobph'
                        external
                        title='Bossjob Instagram'
                      >
                        <LazyLoad>
                          <img src={instagram} alt='instagram' width='32' height='32' />
                        </LazyLoad>
                      </Link>
                      <Link
                        className={styles.socialLink}
                        to='www.youtube.com/channel/UCszmY1TPgEyikxF9w2a2vdw'
                        external
                        title='Bossjob Youtube'
                      >
                        <LazyLoad>
                          <img src={youtube} alt='youtube' width='32' height='32' />
                        </LazyLoad>
                      </Link>
                      <Link
                        className={styles.socialLink}
                        to='twitter.com/Bossjobph'
                        external
                        title='Bossjob Twitter'
                      >
                        <LazyLoad>
                          <img src={twitter} alt='twitter' width='32' height='32' />
                        </LazyLoad>
                      </Link>
                      <Link
                        className={styles.socialLink}
                        to='tiktok.com/@bossjobph'
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
        <Text textStyle='sm' className={styles.copyright}>
          <div className={styles.copyrightWrapper}>
            <Text tagName='p' textStyle='sm'>
              Copyright © 2016-{new Date().getFullYear()}&nbsp;
            </Text>
            <div className={styles.copyrightCompanies}>
              <Text tagName='p' textStyle='sm'>
                Singapore: Yolo Technology Pte Ltd. All Rights Reserved.
                <br />
                <span>Philippines: Etos Adtech Corporation</span>
              </Text>
            </div>
          </div>
        </Text>
        {/* End of Desktop Footer */}
      </div>
    </footer>
  )
}

export default Footer
