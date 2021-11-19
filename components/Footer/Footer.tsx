import React from 'react'

/* Components */
import Link from 'components/Link'
import Text from 'components/Text'

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
        {/* <Image src={ChevronUpIcon} alt='chevron-up' width='15' height='15' /> */}
      </button>

      <div className={styles.footerContainer}>

        {/* Start of Desktop Footer */}
        <div className={styles.footerDesktopWrapper}>
          <div className={styles.footerDesktopLinksWrapper}>
            <div className={styles.footerDesktopSupportWrapper}>
              <div className={styles.footerColumn}>
                <Text textStyle='sm' bold tagName='p'>
                  Header
                </Text>
                <ul className={styles.footerDesktopLinkList}>
                  <li>
                    <Link
                      className={styles.footerLink}
                      to='/'
                      title='Link 1'
                    >
                      <Text textStyle='sm'>Link 1</Text>
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={styles.footerLink}
                      to='/'
                      title='Link 2'
                    >
                      <Text textStyle='sm'>Link 2</Text>
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={styles.footerLink}
                      to='/'
                      title='Link 3'
                    >
                      <Text textStyle='sm'>Link 3</Text>
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={styles.footerLink}
                      to='/'
                      title='Link 4'
                    >
                      <Text textStyle='sm'>Link 4</Text>
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={styles.footerLink}
                      to='/'
                      title='Link 5'
                    >
                      <Text textStyle='sm'>Link 5</Text>
                    </Link>
                  </li>
                </ul>
              </div>
              <div className={styles.footerColumn}>
                <Text textStyle='sm' bold tagName='p'>
                  Header
                </Text>
                <ul className={styles.footerDesktopLinkList}>
                  <li>
                    <Link
                      className={styles.footerLink}
                      to='/'
                      title='Link 1'
                    >
                      <Text textStyle='sm'>Link 1</Text>
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={styles.footerLink}
                      to='/'
                      title='Link 2'
                    >
                      <Text textStyle='sm'>Link 2</Text>
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={styles.footerLink}
                      to='/'
                      title='Link 3'
                    >
                      <Text textStyle='sm'>Link 3</Text>
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={styles.footerLink}
                      to='/'
                      title='Link 4'
                    >
                      <Text textStyle='sm'>Link 4</Text>
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={styles.footerLink}
                      to='/'
                      title='Link 5'
                    >
                      <Text textStyle='sm'>Link 5</Text>
                    </Link>
                  </li>
                </ul>
              </div>
              <div className={styles.footerColumn}>
                <Text textStyle='sm' bold tagName='p'>
                  Header
                </Text>
                <ul className={styles.footerDesktopLinkList}>
                  <li>
                    <Link
                      className={styles.footerLink}
                      to='/'
                      title='Link 1'
                    >
                      <Text textStyle='sm'>Link 1</Text>
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={styles.footerLink}
                      to='/'
                      title='Link 2'
                    >
                      <Text textStyle='sm'>Link 2</Text>
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={styles.footerLink}
                      to='/'
                      title='Link 3'
                    >
                      <Text textStyle='sm'>Link 3</Text>
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={styles.footerLink}
                      to='/'
                      title='Link 4'
                    >
                      <Text textStyle='sm'>Link 4</Text>
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={styles.footerLink}
                      to='/'
                      title='Link 5'
                    >
                      <Text textStyle='sm'>Link 5</Text>
                    </Link>
                  </li>
                </ul>
              </div>
              <div className={styles.footerColumn}>
                <Text textStyle='sm' bold tagName='p'>
                  Header
                </Text>
                <ul className={styles.footerDesktopLinkList}>
                  <li>
                    <Link
                      className={styles.footerLink}
                      to='/'
                      title='Link 1'
                    >
                      <Text textStyle='sm'>Link 1</Text>
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={styles.footerLink}
                      to='/'
                      title='Link 2'
                    >
                      <Text textStyle='sm'>Link 2</Text>
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={styles.footerLink}
                      to='/'
                      title='Link 3'
                    >
                      <Text textStyle='sm'>Link 3</Text>
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={styles.footerLink}
                      to='/'
                      title='Link 4'
                    >
                      <Text textStyle='sm'>Link 4</Text>
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={styles.footerLink}
                      to='/'
                      title='Link 5'
                    >
                      <Text textStyle='sm'>Link 5</Text>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className={styles.footerDesktopSocialWrapper}>
              <div>
                <div className={styles.footerDesktopSocialLinks}>
                  <Link to='//twitter.com/Bossjobph' external title='Bossjob Twitter'>
                    {/* <img
                      src={Twitter}
                      title='Twitter logo'
                      alt='Twitter logo'
                      height='20'
                      width='25'
                    /> */}
                  </Link>
                  <Link to='//www.instagram.com/Bossjobph' external title='Bossjob Instagram'>
                    {/* <img
                      src={Instagram}
                      title='Instagram logo'
                      alt='Instagram logo'
                      height='20'
                      width='25'
                    /> */}
                  </Link>
                  <Link to='//www.facebook.com/Bossjobph' external title='Bossjob Facebook'>
                    {/* <img
                      src={Facebook}
                      title='Facebook logo'
                      alt='Facebook logo'
                      height='20'
                      width='25'
                    /> */}
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
