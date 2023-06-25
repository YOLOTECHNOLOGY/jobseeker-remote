import React, { useState,useContext } from 'react'
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
import { BossjobLogoWhite as BossjobLogo, ChevronDownIcon } from 'images'

const PublicHeader = ({ lang }: any) => {
  const { findJobs, companies, courses, careerGuide, getStarted, hiring, home } = lang || {}
  const pathname = usePathname()
  const [openSwitchNationModal, setOpenSwitchNationModal] = useState<boolean>(false)
  const langKey = getLang()
  const [open,setOpen] = useState(false)
  return (
    <div className={styles.header}>
      {
        open && <DialogLogin open={open} handleClose={()=>setOpen(false)}/>
      }

      <nav className={styles.headerContainer}>
        <div className={styles.headerLogo}>
          <Link title='Home' to={'/' + langKey}>
            <img
              className={styles.headerLogoImage}
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
              <li className={styles.headerLink}>
                {pathname != ('/' + langKey) ? (
                  <Link title='Home' to={'/' + langKey}>
                    <Text textStyle='base' textColor='darkGrey' className={styles.headerLinkText}>
                      {home}
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
                    {home}
                  </Text>
                )}
              </li>
              <li className={styles.headerLink}>

                {!pathname.includes('/jobs-hiring/') ? (
                  <Link title='Jobs' to={'/' + langKey + '/jobs-hiring/job-search'}>
                    <Text textStyle='base' textColor='darkGrey' className={styles.headerLinkText}>
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
                    <Text textStyle='base' textColor='darkGrey' className={styles.headerLinkText}>
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
                <Link title='APP' to={'/' + langKey + '/talents'}>
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
                // <Link to={'/' + langKey + '/get-started'} title='Get Started'>
                  <MaterialButton
                    variant='outlined'
                    size='medium'
                    capitalize
                    onClick={()=>setOpen(true)}
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
                    <Text textStyle='base' style={{ fontWeight: '400' }} textColor='white' bold>
                      {getStarted}
                    </Text>
                  </MaterialButton>
                // </Link>
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
                <Image
                  className={styles.object}
                  src={ChevronDownIcon} alt={''}
                  width={11}
                  height={7}
                  ></Image>
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
  )
}

export default PublicHeader
