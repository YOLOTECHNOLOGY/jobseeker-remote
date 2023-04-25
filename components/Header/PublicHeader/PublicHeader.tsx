import React, { useState } from 'react'
import { usePathname } from 'next/navigation'
import classNames from 'classnames/bind'

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


/* Images */
import { BossjobLogoWhite as BossjobLogo } from 'images'

const PublicHeader = ({LG}:any) => {
  console.log(LG,'LG1111')
  const {findJobs,companies,courses,careerGuide,getStarted,hiring} = LG || {}
  const pathname = usePathname()
  const [openSwitchNationModal, setOpenSwitchNationModal] = useState<boolean>(false)

  return (
    <div className={styles.header}>
      <nav className={styles.headerContainer}>
        <div className={styles.headerLogo}>
          <Link title='Home' to={'/'}>
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
                {/* <Link title='Jobs' to='/jobs-hiring/job-search'>
                  <Text textStyle='base' textColor='darkGrey' className={styles.headerLinkText}>
                    Jobs
                  </Text>
                </Link> */}
                {/* {router.route !== '/chat/[chat_id]' ? (
                  <Link title='Chats' to='/chat/list'>
                    <Text textStyle='base' textColor='darkGrey' className={styles.headerLinkText}>
                      Chats
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
                    Chats
                  </Text>
                )} */}
                {!pathname.includes('/jobs-hiring/') ? (
                  <Link title='Jobs' to='/jobs-hiring/job-search'>
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
              {/* <li className={styles.headerLink}>
                <Link title='Headhunt Me' to={`${process.env.OLD_PROJECT_URL}/headhunt-me`} aTag>
                  <Text textStyle='base' textColor='darkGrey' className={styles.headerLinkText}>
                    Headhunt Me
                  </Text>
                </Link>
              </li> */}
              <li className={styles.headerLink}>
                {/* <Link title='Companies' to='/companies'>
                  <Text textStyle='base' textColor='darkGrey' className={styles.headerLinkText}>
                    Companies
                  </Text>
                </Link> */}
                {pathname !== '/companies' ? (
                  <Link title='Companies' to='/companies'>
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
                <Link title='Courses' to='https://academy.bossjob.ph/courses/search-courses' aTag>
                  <Text textStyle='base' textColor='darkGrey' className={styles.headerLinkText}>
                    {courses}
                  </Text>
                </Link>
              </li>
              {/* <li className={styles.headerLink} style={{ position:'relative' }}>
                <Link title='Virtual Career Fair' to={process.env.VCF_CLIENT_URL} aTag>
                  <Text textStyle='base' textColor='darkGrey' className={styles.headerLinkText}>
                    Virtual Career Fair
                    <span className={styles.hotTag}>
                      Hot!
                    </span>
                  </Text>
                </Link>
              </li> */}
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
              <Link title='Employer' to={process.env.BOSSHUNT_URL} aTag>
                <Text textStyle='base' textColor='white' className={styles.headerLinkText}>
                 {hiring}
                </Text>
              </Link>
            </li>
            <li className={styles.headerLink}>
              {pathname !== '/get-started' ? (
                <Link to='/get-started' title='Get Started'>
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
                    <Text textStyle='base' style={{ fontWeight: '400' }} textColor='white' bold>
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
            {/* <select
              // onChange={(e) => {
              //   const value = e.target.value
              //   // console.log({ onChange: e.target.value })
              //   const countryKey = getCountryKey()
              //   if (value === countryKey) {
              //     return
              //   }
              //   // const accessToken = getCookie('accessToken')
              //   const url = 'https://dev.bossjob.' + value
              //   window.location.href = url
              // }}
              value={undefined}
              onClick={() => setOpenSwitchNationModal(true)}
            >
              <option value='ph' label='PH' />
              <option value='sg' label='SGP' />
            </select> */}

            {/* <li className={styles.headerLink} onClick={() => setOpenSwitchNationModal(true)}>
              <div className={classNames([styles.profileWrapper, styles.profileDisabled])}>
                <Text textStyle='base' textColor='white' className={styles.profileCountry}>
                  {getCountryKey()?.toUpperCase()}
                </Text>

                <div className={styles.profileCaret} />
              </div>
            </li> */}
          </React.Fragment>
        </ul>
        <div className={styles.mobileIconWrapper}>
          <div className={styles.icon}>
            <Hamburger />
          </div>
        </div>
      </nav>

      {/* switch nation */}
      <SwitchNation open={openSwitchNationModal} close={() => setOpenSwitchNationModal(false)} />
    </div>
  )
}

export default PublicHeader
