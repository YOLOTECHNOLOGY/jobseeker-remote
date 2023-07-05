import React from 'react'

/* Style */
import styles from '../Header.module.scss'

/* components */
import Text from 'components/Text'
// import Button from 'components/Button'
import Hamburger from 'components/Hamburger'
import MaterialButton from 'components/MaterialButton'

/* Images */
import { BossjobLogo } from 'images'

// this Header will be used when user is not logged in
const PlaceHolderPublicHeader = (props:any) => {
  const {lang = {}} =  props
  return (
    <div className={styles.header}>
      <nav className={styles.headerContainer}>
        <div className={styles.headerLogo}>
          <img
            className={styles.headerLogoImage}
            src={BossjobLogo}
            title='Bossjob logo'
            alt='Bossjob logo'
          />
        </div>
        <div className={styles.headerLinksWrapper}>
          <ul className={styles.headerLinksList}>
            <React.Fragment>
              <li className={styles.headerLink}>
                <Text textStyle='base' textColor='darkGrey' className={styles.headerLinkText}>
                  {lang.home}
                </Text>
              </li>        
              <li className={styles.headerLink}>
                <Text textStyle='base' textColor='darkGrey' className={styles.headerLinkText}>
                  {lang.findJobs}
                </Text>
              </li>
              {/* <li className={styles.headerLink}>
                  <Text textStyle='base' textColor='darkGrey' className={styles.headerLinkText}>
                    Headhunt Me
                  </Text>
              </li> */}
              <li className={styles.headerLink}>
                <Text textStyle='base' textColor='darkGrey' className={styles.headerLinkText}>
                {lang.companies}
                </Text>
              </li>
              {/* <li className={styles.headerLink}>
                <Text textStyle='base' textColor='darkGrey' className={styles.headerLinkText}>
                {lang.courses}
                </Text>
              </li> */}
              <li className={styles.headerLink}>
                <Text textStyle='base' textColor='darkGrey' className={styles.headerLinkText}>
                  APP
                </Text>
              </li>
              <li className={styles.headerLink}>
                <Text textStyle='base' textColor='darkGrey' className={styles.headerLinkText}>
                {lang.careerGuide}
                </Text>
              </li>
              {/* <li className={styles.headerLink} style={{ position:'relative' }}>
                  <Text textStyle='base' textColor='darkGrey' className={styles.headerLinkText}>
                    Virtual Career Fair
                    <span className={styles.hotTag}>
                      Hot!
                    </span>
                  </Text>
              </li> */}
            </React.Fragment>
          </ul>
        </div>
        <ul className={styles.headerLinksList}>
          <React.Fragment>
            <li className={styles.headerLink}>
              <Text textStyle='base' textColor='white' className={styles.headerLinkText}>
              {lang.hiring} 
              </Text>
            </li>
            {/* <li className={classNames([styles.headerLink, styles.headerLinkLogin])}>
              <MaterialButton variant='text' size='medium' capitalize>
                <Text textStyle='base' textColor='primaryBlue' bold>
                  Log in
                </Text>
              </MaterialButton>
            </li>
            <li className={styles.headerLink}>
              <MaterialButton variant='outlined' size='medium' capitalize>
                <Text textStyle='base' textColor='primaryBlue' bold>
                  Sign up
                </Text>
              </MaterialButton>
            </li> */}
            <li className={styles.headerLink}>
              <MaterialButton
                variant='outlined'
                size='medium'
                capitalize
                className={styles.getStartedButton}
              >
                <span>{lang.getStarted}</span>
              </MaterialButton>
            </li>

            {/* <li className={styles.headerLink}>
              <div className={classNames([styles.profileWrapper, styles.profileDisabled])}>
                <Text textStyle='base' textColor='white' className={styles.profileCountry}>
                  PH
                </Text>

                <div className={styles.profileCaret} />
              </div>
            </li> */}
          </React.Fragment>
        </ul>
        <div className={styles.mobileIconWrapper}>
          <div className={styles.icon}>
            <Hamburger disabled={true} />
          </div>
        </div>
      </nav>
    </div>
  )
}

export default PlaceHolderPublicHeader
