import React from 'react'
import Image from 'next/image'

/* Components */
import Link from 'components/Link'
import Text from 'components/Text'

/* Images */
import {
  FacebookIconGrey,
  InstagramIconGrey,
  TwitterIconGrey,
  ChevronUpIcon
} from 'images'

import styles from './Footer.module.scss'

const scrollToBottom = () => document.body.scrollIntoView({ behavior: 'smooth', block: 'start' })
interface FooterProps {
  showButton?: boolean
}

const Footer = ({ showButton }: FooterProps) => {
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
                      to='/'
                      title='Terms & Conditions'
                    >
                      <Text textStyle='sm'>Terms & Conditions</Text>
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={styles.footerLink}
                      to='/'
                      title='Legal'
                    >
                      <Text textStyle='sm'>Legal</Text>
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={styles.footerLink}
                      to='/'
                      title='Mobile'
                    >
                      <Text textStyle='sm'>Mobile</Text>
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
                      to='/'
                      title='All jobs'
                    >
                      <Text textStyle='sm'>All jobs</Text>
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={styles.footerLink}
                      to='/'
                      title='Jobs in Makati'
                    >
                      <Text textStyle='sm'>Jobs in Makati</Text>
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={styles.footerLink}
                      to='/'
                      title='Jobs in Manila'
                    >
                      <Text textStyle='sm'>Jobs in Manila</Text>
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={styles.footerLink}
                      to='/'
                      title='Create job alert'
                    >
                      <Text textStyle='sm'>Create job alert</Text>
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={styles.footerLink}
                      to='/'
                      title='Create resume'
                    >
                      <Text textStyle='sm'>Create resume</Text>
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
                      to='/'
                      title='Post a job'
                    >
                      <Text textStyle='sm'>Post a job</Text>
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={styles.footerLink}
                      to='/'
                      title='Prices & packages'
                    >
                      <Text textStyle='sm'>Prices & packages</Text>
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={styles.footerLink}
                      to='/'
                      title='Partners'
                    >
                      <Text textStyle='sm'>Partners</Text>
                    </Link>
                  </li>
                </ul>
              </div>
              <div className={styles.footerColumn}>
                <Text textStyle='sm' bold tagName='p'>
                  Headhunters
                </Text>
                <ul className={styles.footerDesktopLinkList}>
                  <li>
                    <Link
                      className={styles.footerLink}
                      to='/'
                      title='Bosshunt'
                    >
                      <Text textStyle='sm'>Bosshunt</Text>
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={styles.footerLink}
                      to='/'
                      title='Request Demo'
                    >
                      <Text textStyle='sm'>Request Demo</Text>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className={styles.footerDesktopSocialWrapper}>
              <div>
                <div className={styles.footerDesktopSocialLinks}>
                  <Link to='//twitter.com/Bossjobph' external title='Bossjob Twitter'>
                    <img
                      src={TwitterIconGrey}
                      title='Twitter logo'
                      alt='Twitter logo'
                      height='20'
                      width='25'
                    />
                  </Link>
                  <Link to='//www.instagram.com/Bossjobph' external title='Bossjob Instagram'>
                    <img
                      src={InstagramIconGrey}
                      title='Instagram logo'
                      alt='Instagram logo'
                      height='20'
                      width='25'
                    />
                  </Link>
                  <Link to='//www.facebook.com/Bossjobph' external title='Bossjob Facebook'>
                    <img
                      src={FacebookIconGrey}
                      title='Facebook logo'
                      alt='Facebook logo'
                      height='20'
                      width='25'
                    />
                  </Link>
                </div>
              </div>

              <Text
                textStyle='sm'
                style={{
                  marginTop: '0.3rem',
                  display: 'block',
                  textAlign: 'right',
                  fontSize: '11px',
                }}
              >
                <div className={styles.copyrightWrapper}>
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
              </Text>
            </div>
          </div>
        </div>

        {/* End of Desktop Footer */}
      </div>
    </footer>
  )
}

export default Footer
