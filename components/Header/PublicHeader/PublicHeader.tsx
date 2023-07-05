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

import NavLogo from '../Common/NavLogo'
import NavLeft from '../Common/NavLeft'

const PublicHeader = ({ lang }: any) => {
  const { getStarted, hiring } = lang || {}
  const pathname = usePathname()
  const [openSwitchNationModal, setOpenSwitchNationModal] = useState<boolean>(false)
  const langKey = getLang()
  const [open, setOpen] = useState(false)
  return (
    <div className={styles.header}>
      {/* Dialog Login Modal */}
      {open && <DialogLogin open={open} handleClose={() => setOpen(false)} />}
      <nav className={styles.headerContainer}>

        {/* Logo */}
        <NavLogo langKey={langKey} />

        {/* Left Menu */}
        <div className={styles.headerLinksWrapper}>
          <NavLeft langKey={langKey} lang={lang} pathname={pathname} />
        </div>

        {/* Right Menu */}
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
