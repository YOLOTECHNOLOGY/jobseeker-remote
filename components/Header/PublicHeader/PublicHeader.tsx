import React, { useState, useContext } from 'react'
import { usePathname } from 'next/navigation'
import classNames from 'classnames/bind'
import Image from 'next/image'
/* Style */
import styles from '../Header.module.scss'

/* components */
import Link from 'components/Link'
import Text from 'components/Text'
// import Button from 'components/Button'
import Hamburger from 'components/Hamburger'
import MaterialButton from 'components/MaterialButton'
// nation
import SwitchNation from 'components/SwitchNation/SwitchNation'
import { getCountryKey, getLang } from 'helpers/country'
import DialogLogin from 'app/components/LoginDialog'

/* Images */
import { BossjobLogo, navbar_location_icon } from 'images'

const PublicHeader = ({ lang }: any) => {
  const { findJobs, companies, courses, careerGuide, getStarted, hiring, home } = lang || {}
  const pathname = usePathname()
  const [openSwitchNationModal, setOpenSwitchNationModal] = useState<boolean>(false)
  const langKey = getLang()
  const [open, setOpen] = useState(false)
  return (
    <div className={styles.header}>
      {open && <DialogLogin open={open} handleClose={() => setOpen(false)} />}
      <nav className={styles.headerContainer}>
        <div className={styles.headerLogo}>
          <Link title='Home' to={'/' + langKey}>
            <Image
              width={124}
              height={32}
              src={BossjobLogo}
              title='Bossjob logo'
              alt='Bossjob logo'
              style={{
                marginTop: '3px'
              }}
            />
          </Link>
        </div>
        <div className={styles.headerLinksWrapper}>
          <ul className={styles.headerLinksList}>
            <React.Fragment>
              {/* home */}
              <li className={styles.headerLink}>
                {pathname != '/' + langKey ? (
                  <Link title='Home' to={'/' + langKey}>
                    <Text textStyle='base' className={styles.headerLinkText}>
                      {home}
                    </Text>
                  </Link>
                ) : (
                  <Text
                    textStyle='base'
                    className={classNames([
                      styles.headerLinkText,
                      styles.headerLinkTextCurrentPage
                    ])}
                  >
                    {home}
                  </Text>
                )}
              </li>
              {/* find jobs */}
              <li className={styles.headerLink}>
                {!pathname.includes('/jobs-hiring/') ? (
                  <Link title='Jobs' to={'/' + langKey + '/jobs-hiring/job-search'}>
                    <Text textStyle='base' className={styles.headerLinkText}>
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
              {/* companies */}
              <li className={styles.headerLink}>
                {!pathname.includes('/companies') ? (
                  <Link title='Companies' to={'/' + langKey + '/companies'}>
                    <Text textStyle='base' className={styles.headerLinkText}>
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
              {/* talents app */}
              <li className={styles.headerLink}>
                {!pathname.includes('/talents') ? (
                  <Link title='APP' to={'/' + langKey + '/talents'} aTag>
                    <Text textStyle='base' className={styles.headerLinkText}>
                      APP
                    </Text>
                  </Link>
                ) : (
                  <Text
                    textStyle='base'
                    className={classNames([
                      styles.headerLinkText,
                      styles.headerLinkTextCurrentPage
                    ])}
                  >
                    APP
                  </Text>
                )}
              </li>
              {/* career guide */}
              <li className={styles.headerLink}>
                <Link title='Career Guide' to='https://blog.bossjob.ph/' external>
                  <Text textStyle='base' className={styles.headerLinkText}>
                    {careerGuide}
                  </Text>
                </Link>
              </li>
            </React.Fragment>
          </ul>
        </div>

        <ul className={styles.headerLinksList}>
          <React.Fragment>
            <li className={classNames([styles.headerLink, styles.headerLinkRightItem])}>
              <Link title='Employer' to={process.env.BOSSHUNT_URL + '/boss'} aTag>
                <Text textStyle='base' className={styles.headerLinkText}>
                  {hiring}
                </Text>
              </Link>
            </li>
            <li className={classNames([styles.headerLink, styles.headerLinkRightItem])}>
              {!pathname?.includes?.('/get-started') ? (
                <MaterialButton
                  variant='outlined'
                  size='medium'
                  capitalize
                  className={styles.getStartedButton}
                  onClick={() => setOpen(true)}
                >
                  <span>{getStarted}</span>
                </MaterialButton>
              ) : (
                <MaterialButton
                  variant='outlined'
                  size='medium'
                  capitalize
                  className={styles.getStartedButton}
                >
                  <span>{getStarted} </span>
                </MaterialButton>
              )}
            </li>
            <li className={classNames([styles.headerLink, styles.headerLinkRightItem])}>
              <div
                className={styles.countryItem}
                onClick={() => {
                  setOpenSwitchNationModal(true)
                }}
              >
                <Image
                  src={navbar_location_icon}
                  className={styles.locationIcon}
                  width={16}
                  height={16}
                  alt={'location'}
                ></Image>
                <span className={styles.label}>{getCountryKey().toUpperCase()}</span>
              </div>
            </li>
          </React.Fragment>
        </ul>
        {/* mobile */}
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
  )
}

export default PublicHeader
