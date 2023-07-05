import React from 'react'
import { usePathname } from 'next/navigation'
/* Style */
import styles from '../Header.module.scss'

import Hamburger from 'components/Hamburger'
// nation
import { getLang } from 'helpers/country'

// components
import NavLogo from '../Common/NavLogo'
import NavLeft from '../Common/NavLeft'
import NavRight from './NavRight'

const PublicHeader = ({ lang }: any) => {
  const pathname = usePathname()
  const langKey = getLang()
  return (
    <div className={styles.header}>
      <nav className={styles.headerContainer}>

        {/* Logo */}
        <NavLogo langKey={langKey} />

        {/* Left Menu */}
        <div className={styles.headerLinksWrapper}>
          <NavLeft langKey={langKey} lang={lang} pathname={pathname} />
        </div>

        {/* Right Menu */}
        <NavRight lang={lang} />

        {/* mobile */}
        <div className={styles.mobileIconWrapper}>
          <div className={styles.icon}>
            <Hamburger />
          </div>
        </div>
      </nav>
    </div>
  )
}

export default PublicHeader
