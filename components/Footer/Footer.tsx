import React from 'react'

/* Components */
import Link from 'components/Link'
import Text from 'components/Text'
import Accordian from 'components/Accordian'

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
                    to={`${process.env.NEW_PROJECT_URL}/company/bossjob-1668`}
                    external
                    title='About Bossjob'
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
                    to={`${process.env.OLD_PROJECT_URL}/faq`}
                    title='FAQs'
                    external
                  >
                    <Text textStyle='sm'>FAQ</Text>
                  </Link>
                </li>
                <li>
                  <Link className={styles.footerLink} to='/sitemap' title='Sitemap'>
                    <Text textStyle='sm'>Sitemap</Text>
                  </Link>
                </li>
              </ul>
            </Accordian>
            <Accordian
              paddedLine
              paddedContent
              title={
                <Text textStyle='sm' bold>
                  Jobseekers
                </Text>
              }
            >
              <ul className={styles.footerDesktopLinkList}>
                <li>
                  <Link
                    className={styles.footerLink}
                    to='/jobs-hiring/job-search'
                    title='Jobs in Philippines'
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
                  Employers
                </Text>
              }
            >
              <ul className={styles.footerDesktopLinkList}>
                <li>
                  <Link
                    className={styles.footerLink}
                    to={`${process.env.OLD_PROJECT_URL}/employer/post-a-job`}
                    external
                    title='Post a job'
                  >
                    <Text textStyle='sm'>Post a job</Text>
                  </Link>
                </li>
                <li>
                  <Link
                    className={styles.footerLink}
                    to={`${process.env.OLD_PROJECT_URL}/employer#pricing`}
                    external
                    title='Prices & packages'
                  >
                    <Text textStyle='sm'>Prices & packages</Text>
                  </Link>
                </li>
                <li>
                  <Link
                    className={styles.footerLink}
                    to={`${process.env.OLD_PROJECT_URL}/employer#partners`}
                    external
                    title='Partners'
                  >
                    <Text textStyle='sm'>Partners</Text>
                  </Link>
                </li>
                <li>
                  <Link
                    className={styles.footerLink}
                    to={'https://hunt.bossjob.ph'}
                    external
                    title='Bosshunt ATS'
                  >
                    <Text textStyle='sm'>Bosshunt ATS</Text>
                  </Link>
                </li>
              </ul>
            </Accordian>
            <Accordian
              paddedLine
              paddedContent
              title={
                <Text textStyle='sm' bold>
                  Popular jobs
                </Text>
              }
            >
              <ul className={styles.footerDesktopLinkList}>
                <li>
                  <Link
                    className={styles.footerLink}
                    to={`${process.env.NEW_PROJECT_URL}/jobs-hiring/manila-jobs`}
                    title='Jobs in Manila'
                    external
                  >
                    <Text textStyle='sm'>Jobs in Manila</Text>
                  </Link>
                </li>
                <li>
                  <Link
                    className={styles.footerLink}
                    to={`${process.env.NEW_PROJECT_URL}/jobs-hiring/makati-jobs`}
                    title='Jobs in Makati'
                    external
                  >
                    <Text textStyle='sm'>Jobs in Makati</Text>
                  </Link>
                </li>
                <li>
                  <Link
                    className={styles.footerLink}
                    to={`${process.env.NEW_PROJECT_URL}/jobs-hiring/cebu-city-jobs`}
                    title='Jobs in Cebu'
                    external
                  >
                    <Text textStyle='sm'>Jobs in Cebu</Text>
                  </Link>
                </li>
                <li>
                  <Link
                    className={styles.footerLink}
                    to={`${process.env.NEW_PROJECT_URL}/jobs-hiring/information-technology-jobs?page=1`}
                    title='IT Jobs'
                    external
                  >
                    <Text textStyle='sm'>IT Jobs</Text>
                  </Link>
                </li>
                <li>
                  <Link
                    className={styles.footerLink}
                    to={`${process.env.NEW_PROJECT_URL}/jobs-hiring/finance-accounting-jobs`}
                    title='Finance Jobs'
                    external
                  >
                    <Text textStyle='sm'>Finance Jobs</Text>
                  </Link>
                </li>
                <li>
                  <Link
                    className={styles.footerLink}
                    to={`${process.env.NEW_PROJECT_URL}/jobs-hiring/customer-service-jobs`}
                    title='Customer Service Jobs'
                    external
                  >
                    <Text textStyle='sm'>Customer Service Jobs</Text>
                  </Link>
                </li>
                <li>
                  <Link
                    className={styles.footerLink}
                    to={`${process.env.NEW_PROJECT_URL}/jobs-hiring/bpo-jobs`}
                    title='BPO Jobs'
                    external
                  >
                    <Text textStyle='sm'>BPO Jobs</Text>
                  </Link>
                </li>
                <li>
                  <Link
                    className={styles.footerLink}
                    to={`${process.env.NEW_PROJECT_URL}/jobs-hiring/sales-marketing-jobs`}
                    title='Sales Jobs'
                    external
                  >
                    <Text textStyle='sm'>Sales Jobs</Text>
                  </Link>
                </li>
                <li>
                  <Link
                    className={styles.footerLink}
                    to={`${process.env.NEW_PROJECT_URL}/jobs-hiring/healthcare-medical-jobs`}
                    title='Healthcare Jobs'
                    external
                  >
                    <Text textStyle='sm'>Healthcare Jobs</Text>
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
                      to={`${process.env.NEW_PROJECT_URL}/company/bossjob-1668`}
                      title='About Bossjob'
                      external
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
                      to={`${process.env.OLD_PROJECT_URL}/faq`}
                      title='faq'
                      external
                    >
                      <Text textStyle='sm'>FAQ</Text>
                    </Link>
                  </li>
                  <li>
                    <Link className={styles.footerLink} to='/sitemap' title='sitemap'>
                      <Text textStyle='sm'>Sitemap</Text>
                    </Link>
                  </li>
                </ul>
              </div>
              <div className={styles.footerColumn}>
                <Text textStyle='sm' bold tagName='p'>
                  Jobseeker
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
                  Employers
                </Text>
                <ul className={styles.footerDesktopLinkList}>
                  <li>
                    <Link
                      className={styles.footerLink}
                      to={`${process.env.OLD_PROJECT_URL}/employer/post-a-job`}
                      title='Post a job'
                      external
                    >
                      <Text textStyle='sm'>Post a job</Text>
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={styles.footerLink}
                      to={`${process.env.OLD_PROJECT_URL}/employer#pricing`}
                      title='Prices & packages'
                    >
                      <Text textStyle='sm'>Prices & packages</Text>
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={styles.footerLink}
                      to={`${process.env.OLD_PROJECT_URL}/employer#partners`}
                      title='Partners'
                    >
                      <Text textStyle='sm'>Partners</Text>
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={styles.footerLink}
                      to='https://hunt.bossjob.ph/'
                      title='Bosshunt'
                    >
                      <Text textStyle='sm'>Bosshunt ATS</Text>
                    </Link>
                  </li>
                </ul>
              </div>
              <div className={styles.footerColumn}>
                <Text textStyle='sm' bold tagName='p'>
                  Popular Jobs
                </Text>
                <ul className={styles.footerDesktopLinkList}>
                  <li>
                    <Link
                      className={styles.footerLink}
                      to={`${process.env.NEW_PROJECT_URL}/jobs-hiring/manila-jobs`}
                      title='Jobs in Manila'
                      external
                    >
                      <Text textStyle='sm'>Jobs in Manila</Text>
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={styles.footerLink}
                      to={`${process.env.NEW_PROJECT_URL}/jobs-hiring/makati-jobs`}
                      title='Jobs in Makati'
                      external
                    >
                      <Text textStyle='sm'>Jobs in Makati</Text>
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={styles.footerLink}
                      to={`${process.env.NEW_PROJECT_URL}/jobs-hiring/cebu-city-jobs`}
                      title='Jobs in Cebu'
                      external
                    >
                      <Text textStyle='sm'>Jobs in Cebu</Text>
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={styles.footerLink}
                      to={`${process.env.NEW_PROJECT_URL}/jobs-hiring/information-technology-jobs?page=1`}
                      title='IT Jobs'
                      external
                    >
                      <Text textStyle='sm'>IT Jobs</Text>
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={styles.footerLink}
                      to={`${process.env.NEW_PROJECT_URL}/jobs-hiring/finance-audit-tax-jobs?page=1`}
                      title='Finance Jobs'
                      external
                    >
                      <Text textStyle='sm'>Finance Jobs</Text>
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={styles.footerLink}
                      to={`${process.env.NEW_PROJECT_URL}/jobs-hiring/customer-service-operations-jobs?page=1`}
                      title='Customer Service Jobs'
                      external
                    >
                      <Text textStyle='sm'>Customer Service Jobs</Text>
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={styles.footerLink}
                      to={`${process.env.NEW_PROJECT_URL}/jobs-hiring/bpo-jobs`}
                      title='BPO Jobs'
                      external
                    >
                      <Text textStyle='sm'>BPO Jobs</Text>
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={styles.footerLink}
                      to={`${process.env.NEW_PROJECT_URL}/jobs-hiring/sales-jobs?page=1`}
                      title='Sales Jobs'
                      external
                    >
                      <Text textStyle='sm'>Sales Jobs</Text>
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={styles.footerLink}
                      to={`${process.env.NEW_PROJECT_URL}/jobs-hiring/healthcare-medical-jobs?page=1`}
                      title='Healthcare Jobs'
                      external
                    >
                      <Text textStyle='sm'>Healthcare Jobs</Text>
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
