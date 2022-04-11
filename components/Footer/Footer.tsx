import React from 'react'
import Image from 'next/image'

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
} from 'images'

import styles from './Footer.module.scss'
import classNames from 'classnames/bind'

const scrollToBottom = () => document.body.scrollIntoView({ behavior: 'smooth', block: 'start' })

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <button
        style={{ display: 'block' }}
        className={styles.scrollUpButton}
        onClick={() => scrollToBottom()}
      >
        <Image src={ChevronUpIcon} alt='chevron-up' width='15' height='15' />
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
                    to={`${process.env.OLD_PROJECT_URL}/company/bossjob-1668`}
                    external
                    title='About Bossjob'
                  >
                    <Text textStyle='sm'>About Bossjob</Text>
                  </Link>
                </li>
                <li>
                  <Link
                    className={styles.footerLink}
                    to={`${process.env.OLD_PROJECT_URL}/legal`}
                    title='Legal'
                    external
                  >
                    <Text textStyle='sm'>Terms & Conditions</Text>
                  </Link>
                </li>
                <li>
                  <Link
                    className={styles.footerLink}
                    to={`${process.env.OLD_PROJECT_URL}/legal`}
                    title='Legal'
                    external
                  >
                    <Text textStyle='sm'>Legal</Text>
                  </Link>
                </li>
                <li>
                  <Link
                    className={styles.footerLink}
                    to={`${process.env.OLD_PROJECT_URL}/bosspoints`}
                    title='BossPoints'
                    external
                  >
                    <Text textStyle='sm'>BossPoints</Text>
                  </Link>
                </li>
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
                  <Link
                    className={styles.footerLink}
                    to={`${process.env.OLD_PROJECT_URL}/sitemap`}
                    title='Sitemap'
                    external
                  >
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
                  <Link
                    className={styles.footerLink}
                    to={`${process.env.OLD_PROJECT_URL}/resumetemplate`}
                    title='Create Job Alert'
                  >
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
                    to={`${process.env.NEW_PROJECT_URL}/jobs-hiring/job-search/?category=it-hardware,it-network-sys-db-admin,it-software-engineering,sales-eng-tech-it,tech-helpdesk-support`}
                    title='IT Jobs'
                    external
                  >
                    <Text textStyle='sm'>IT Jobs</Text>
                  </Link>
                </li>
                <li>
                  <Link
                    className={styles.footerLink}
                    to={`${process.env.NEW_PROJECT_URL}/jobs-hiring/job-search/?category=audit-taxation,banking-financial,corporate-finance-investment,sales-financial-services,general-cost-accounting`}
                    title='Finance Jobs'
                    external
                  >
                    <Text textStyle='sm'>Finance Jobs</Text>
                  </Link>
                </li>
                <li>
                  <Link
                    className={styles.footerLink}
                    to={`${process.env.NEW_PROJECT_URL}/jobs-hiring/job-search/?category=customer-service-relations,tech-helpdesk-support`}
                    title='Customer Service Jobs'
                    external
                  >
                    <Text textStyle='sm'>Customer Service Jobs</Text>
                  </Link>
                </li>
                <li>
                  <Link
                    className={styles.footerLink}
                    to={`${process.env.NEW_PROJECT_URL}/jobs-hiring/job-search/?industry=BPO`}
                    title='BPO Jobs'
                    external
                  >
                    <Text textStyle='sm'>BPO Jobs</Text>
                  </Link>
                </li>
                <li>
                  <Link
                    className={styles.footerLink}
                    to={`${process.env.NEW_PROJECT_URL}/jobs-hiring/job-search/?category=sales-corporate,sales-eng-tech-it,sales-financial-services,marketing-business-dev`}
                    title='Sales Jobs'
                    external
                  >
                    <Text textStyle='sm'>Sales Jobs</Text>
                  </Link>
                </li>
                <li>
                  <Link
                    className={styles.footerLink}
                    to={`${process.env.NEW_PROJECT_URL}/jobs-hiring/job-search/?category=civil-government-services,doctor-diagnosis,nurse-medical-support,pharmacy`}
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
                  <Image src={DownloadOnAppStore} alt='AppStore' width='112' height='35' />
                </div>
                <div>
                  <Image src={DownloadOnGooglePlay} alt='GooglePlay' width='112' height='35' />
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
                  to='//www.facebook.com/Bossjobph'
                  external
                  title='Bossjob Facebook'
                >
                  <Image src={facebook} alt='facebook' width='32' height='32' />
                </Link>
                <Link
                  className={styles.socialLink}
                  to='//www.linkedin.com/company/bossjob-yolo-technology/'
                  external
                  title='Bossjob LinkedIn'
                >
                  <Image src={linkedin} alt='linkedin' width='32' height='32' />
                </Link>
                <Link
                  className={styles.socialLink}
                  to='//www.instagram.com/Bossjobph'
                  external
                  title='Bossjob Instagram'
                >
                  <Image src={instagram} alt='instagram' width='32' height='32' />
                </Link>
                <Link
                  className={styles.socialLink}
                  to='//www.youtube.com/channel/UCszmY1TPgEyikxF9w2a2vdw'
                  external
                  title='Bossjob Youtube'
                >
                  <Image src={youtube} alt='youtube' width='32' height='32' />
                </Link>
                <Link
                  className={styles.socialLink}
                  to='//twitter.com/Bossjobph'
                  external
                  title='Bossjob Twitter'
                >
                  <Image src={twitter} alt='twitter' width='32' height='32' />
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
                      to={`${process.env.OLD_PROJECT_URL}/company/bossjob-1668`}
                      title='About Bossjob'
                      external
                    >
                      <Text textStyle='sm'>About Bossjob</Text>
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={styles.footerLink}
                      to={`${process.env.OLD_PROJECT_URL}/legal`}
                      title='Terms & Conditions'
                      external
                    >
                      <Text textStyle='sm'>Terms & Conditions</Text>
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={styles.footerLink}
                      to={`${process.env.OLD_PROJECT_URL}/legal`}
                      title='Legal'
                      external
                    >
                      <Text textStyle='sm'>Legal</Text>
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={styles.footerLink}
                      to={`${process.env.OLD_PROJECT_URL}/bosspoints`}
                      title='BossPoints'
                      external
                    >
                      <Text textStyle='sm'>BossPoints</Text>
                    </Link>
                  </li>
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
                    <Link
                      className={styles.footerLink}
                      to={`${process.env.OLD_PROJECT_URL}/sitemap`}
                      title='sitemap'
                      external
                    >
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
                      aTag
                      className={styles.footerLink}
                      to='/resumetemplate'
                      title='Create resume'
                    >
                      <Text textStyle='sm'>Create resume</Text>
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
                      to={`${process.env.NEW_PROJECT_URL}/jobs-hiring/job-search/?category=it-hardware,it-network-sys-db-admin,it-software-engineering,sales-eng-tech-it,tech-helpdesk-support`
                      }
                      title='IT Jobs'
                      external
                    >
                      <Text textStyle='sm'>IT Jobs</Text>
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={styles.footerLink}
                      to={`${process.env.NEW_PROJECT_URL}/jobs-hiring/job-search/?category=audit-taxation,banking-financial,corporate-finance-investment,sales-financial-services,general-cost-accounting`
                      }
                      title='Finance Jobs'
                      external
                    >
                      <Text textStyle='sm'>Finance Jobs</Text>
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={styles.footerLink}
                      to={`${process.env.NEW_PROJECT_URL}/jobs-hiring/job-search/?category=customer-service-relations,tech-helpdesk-support`
                      }
                      title='Customer Service Jobs'
                      external
                    >
                      <Text textStyle='sm'>Customer Service Jobs</Text>
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={styles.footerLink}
                      to={`${process.env.NEW_PROJECT_URL}/jobs-hiring/job-search/?industry=BPO`}
                      title='BPO Jobs'
                      external
                    >
                      <Text textStyle='sm'>BPO Jobs</Text>
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={styles.footerLink}
                      to={`${process.env.NEW_PROJECT_URL}/jobs-hiring/job-search/?category=sales-corporate,sales-eng-tech-it,sales-financial-services,marketing-business-dev`}
                      title='Sales Jobs'
                      external
                    >
                      <Text textStyle='sm'>Sales Jobs</Text>
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={styles.footerLink}
                      to={`${process.env.NEW_PROJECT_URL}/jobs-hiring/job-search/?category=civil-government-services,doctor-diagnosis,nurse-medical-support,pharmacy`}
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
                  <Image src={DownloadOnAppStore} alt='AppStore' width='112' height='35' />
                </div>
                <div>
                  <Image src={DownloadOnGooglePlay} alt='GooglePlay' width='112' height='35' />
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
                        to='//www.facebook.com/Bossjobph'
                        external
                        title='Bossjob Facebook'
                      >
                        <Image src={facebook} alt='facebook' width='32' height='32' />
                      </Link>
                      <Link
                        className={styles.socialLink}
                        to='//www.linkedin.com/company/bossjob-yolo-technology/'
                        external
                        title='Bossjob LinkedIn'
                      >
                        <Image src={linkedin} alt='linkedin' width='32' height='32' />
                      </Link>
                      <Link
                        className={styles.socialLink}
                        to='//www.instagram.com/Bossjobph'
                        external
                        title='Bossjob Instagram'
                      >
                        <Image src={instagram} alt='instagram' width='32' height='32' />
                      </Link>
                      <Link
                        className={styles.socialLink}
                        to='//www.youtube.com/channel/UCszmY1TPgEyikxF9w2a2vdw'
                        external
                        title='Bossjob Youtube'
                      >
                        <Image src={youtube} alt='youtube' width='32' height='32' />
                      </Link>
                      <Link
                        className={styles.socialLink}
                        to='//twitter.com/Bossjobph'
                        external
                        title='Bossjob Twitter'
                      >
                        <Image src={twitter} alt='twitter' width='32' height='32' />
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
