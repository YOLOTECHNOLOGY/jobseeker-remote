import React, { useState } from 'react'

/* Style */
import styles from '../Header.module.scss'

/* components */
import Text from 'components/Text'
// import Button from 'components/Button'
import Hamburger from 'components/Hamburger'
import MaterialButton from 'components/MaterialButton'

/* Images */
import { BossjobLogoWhite as BossjobLogo, BossjobLogoWhite, ChevronDownIcon } from 'images'
import Link from '../../Link'
import classNames from 'classnames/bind'
import { getCountryKey, getLang } from '../../../helpers/country'
import SwitchNation from '../../SwitchNation/SwitchNation'
import { usePathname } from 'next/navigation'
import logo from './logo.svg'

// this Header will be used when user is not logged in
const LandingHeader = (props: any) => {
  const { lang = {} } = props
  const { findJobs, companies, courses, careerGuide, getStarted, hiring, home } = lang || {}
  const pathname = usePathname()
  const [openSwitchNationModal, setOpenSwitchNationModal] = useState<boolean>(false)
  const langKey = getLang()
  return (
    <div className={styles.LandingHeaderContainer}>
      <div className={styles.LandingHeader}>
        <div className={styles.header}>
          <nav className={styles.headerContainer}>
            <div className={styles.headerLogo}>
              <Link className={styles.logo} title='Home' to={'/' + langKey}>
                <img src={logo.src} />
              </Link>
            </div>
            <div className={styles.headerLinksWrapper}>
              <ul className={styles.headerLinksList}>
                <React.Fragment>
                  <li className={styles.headerLink}>
                    <Link title='Home' to={'/' + langKey}>
                      <Text textStyle='base' textColor='darkGrey' className={styles.headerLinkText}>
                        {home}
                      </Text>
                    </Link>
                  </li>
                  <li className={styles.headerLink}>
                    {!pathname.includes('/jobs-hiring/') ? (
                      <Link title='Jobs' to={'/' + langKey + '/jobs-hiring/job-search'}>
                        <Text
                          textStyle='base'
                          textColor='darkGrey'
                          className={styles.headerLinkText}
                        >
                          {findJobs}
                        </Text>
                      </Link>
                    ) : (
                      <Text
                        textStyle='base'
                        textColor='darkGrey'
                        className={classNames([
                          styles.headerLinkText,
                          styles.headerLinkTextCurrentPage
                        ])}
                      >
                        {findJobs}
                      </Text>
                    )}
                  </li>

                  <li className={styles.headerLink}>
                    {!pathname.includes('/companies') ? (
                      <Link title='Companies' to={'/' + langKey + '/companies'}>
                        <Text
                          textStyle='base'
                          textColor='darkGrey'
                          className={styles.headerLinkText}
                        >
                          {companies}
                        </Text>
                      </Link>
                    ) : (
                      <Text
                        textStyle='base'
                        textColor='darkGrey'
                        className={classNames([
                          styles.headerLinkText,
                          styles.headerLinkTextCurrentPage
                        ])}
                      >
                        {companies}
                      </Text>
                    )}
                  </li>
                  <li className={styles.headerLink}>
                    <Link
                      title='APP'
                      to={'/' + langKey + '/talents'}
                      aTag
                    >
                      <Text textStyle='base' textColor='darkGrey' className={styles.headerLinkText}>
                        APP
                      </Text>
                    </Link>
                  </li>

                  <li className={styles.headerLink}>
                    <Link title='Career Guide' to='https://blog.bossjob.ph/' external>
                      <Text textStyle='base' textColor='darkGrey' className={styles.headerLinkText}>
                        {careerGuide}
                      </Text>
                    </Link>
                  </li>
                </React.Fragment>
              </ul>
            </div>
            <ul className={styles.headerLinksList}>
              <React.Fragment>
                <li className={styles.headerLink}>
                  <Link title='Employer' to={process.env.BOSSHUNT_URL+'/boss'} aTag>
                    <Text textStyle='base' textColor='white' className={styles.headerLinkText}>
                      {hiring}
                    </Text>
                  </Link>
                </li>
                <li className={styles.headerLink} style={{ width: '162px' }}>
                  {!pathname?.includes?.('/get-started') ? (
                    <Link to={'/' + langKey + '/get-started'} title='Get Started'>
                      <MaterialButton
                        variant='outlined'
                        size='medium'
                        capitalize
                        sx={{
                          width: '123px',
                          height: '35px !important',
                          border: '1.5px solid #136FD3',
                          borderRadius: '10px',
                          maxWidth: '153px',
                          paddingLeft: '0',
                          paddingRight: '0',
                          backgroundColor: '#ffffff',
                          ':hover': {
                            border: '1px solid #136FD3'
                          }
                        }}
                      >
                        <Text
                          textStyle='base'
                          style={{ fontWeight: '400' }}
                          textColor='#136FD3'
                          bold
                        >
                          {getStarted}
                        </Text>
                      </MaterialButton>
                    </Link>
                  ) : (
                    <MaterialButton
                      variant='outlined'
                      size='medium'
                      capitalize
                      sx={{
                        width: '123px',
                        height: '35px !important',
                        border: '1.5px solid #FFFFFF',
                        borderRadius: '10px',
                        maxWidth: '153px',
                        paddingLeft: '0',
                        paddingRight: '0',
                        backgroundColor: '#136FD3',
                        ':hover': {
                          border: '1px solid #fff'
                        }
                      }}
                    >
                      <Text textStyle='base' textColor='white' bold>
                        {getStarted}
                      </Text>
                    </MaterialButton>
                  )}
                </li>
                <li className={classNames(styles.headerLink)} style={{ width: '60px' }}>
                  <div
                    className={styles.countryItem}
                    onClick={() => {
                      setOpenSwitchNationModal(true)
                    }}
                  >
                    <span className={styles.label}>{getCountryKey().toUpperCase()}</span>
                    <object
                      className={styles.object}
                      data={ChevronDownIcon}
                      type='image/svg+xml'
                    ></object>
                  </div>
                </li>
              </React.Fragment>
            </ul>
            <div className={styles.mobileIconWrapper}>
              <div className={styles.icon}>
                <Hamburger />
              </div>
            </div>
          </nav>

          {/* switch nation */}
          <SwitchNation
            lang={lang}
            open={openSwitchNationModal}
            close={() => setOpenSwitchNationModal(false)}
          />
        </div>
      </div>
    </div>
  )
}

export default LandingHeader
