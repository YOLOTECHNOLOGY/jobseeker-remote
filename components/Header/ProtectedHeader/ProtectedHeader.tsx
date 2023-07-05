import React, { useState, useRef, useEffect, useContext } from 'react'
import { useDispatch } from 'react-redux'
import { usePathname } from 'next/navigation'
import { ChatCircleDots } from 'images'
import { useSelector } from 'react-redux'
/* components */
import Link from 'components/Link'
import Hamburger from 'components/Hamburger'
import SwitchNation from 'components/SwitchNation/SwitchNation'
import { getLang } from 'helpers/country'
/* Images */
import Image from 'next/image'
/* Helpers */
import { getCookie } from 'helpers/cookies'
import { IMContext } from 'app/[lang]/chat/[chat_id]/components/IMProvider.client'

/* Style */
import styles from '../Header.module.scss'
import { fetchUserOwnDetailRequest } from 'store/actions/users/fetchUserOwnDetail'

import NavLogo from '../Common/NavLogo'
import NavLeft from '../Common/NavLeft'
import DropDownMenu from '../Common/DropDownMenu'
import NavRight from './NavRight'

const ProtectedHeader = ({ lang }: any) => {
  const pathname = usePathname()
  const dispatch = useDispatch()
  const ref = useRef(null)
  const [isShowHeaderMenu, setIsShowHeaderMenu] = useState(false)
  const [openSwitchNationModal, setOpenSwitchNationModal] = useState<boolean>(false)
  const config = useSelector((store: any) => store.config.config.response)
  const langKey = getLang()
  const { totalUnread } = useContext(IMContext)

  useEffect(() => {
    if (pathname && isShowHeaderMenu) {
      setIsShowHeaderMenu(false)
    }
  }, [pathname])

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setIsShowHeaderMenu(false)
    }
  }

  useEffect(() => {
    const accessToken = getCookie('accessToken')
    if (accessToken) {
      dispatch(fetchUserOwnDetailRequest({ accessToken }))
    }
    document.addEventListener('click', handleClickOutside, true)
    return () => {
      document.removeEventListener('click', handleClickOutside, true)
    }
  }, [])


  const handleChangeNation = () => {
    setOpenSwitchNationModal(true)
    setIsShowHeaderMenu(false)
  }

  const handleShowMenu = () => {
    setIsShowHeaderMenu(!isShowHeaderMenu)
  }

  return (
    <div className={styles.header}>
      <nav className={styles.headerContainer}>

        {/* logo */}
        <NavLogo langKey={langKey} />

        {/* Left Menu */}
        <div className={styles.headerLinksWrapper}>
          <NavLeft langKey={langKey} lang={lang} />
        </div>

        {/* Right Menu */}
        <NavRight lang={lang} langKey={langKey} totalUnread={totalUnread} handleShowMenu={handleShowMenu} />

        {/* mobile */}
        <div className={styles.mobileIconWrapper}>
          {!pathname.includes('/chat/[chat_id]') ? (
            <li
              className={styles.headerLink}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                position: 'relative',
                left: 30
                // top: 5
              }}
            >
              <Link title='Jobs' to={'/' + langKey + '/chat/list'}>
                <Image width={32} height={32} src={ChatCircleDots} alt='Chat logo' />
                {totalUnread ? (
                  <span
                    className={styles.unread}
                    style={{ position: 'absolute', bottom: '50%', right: '50%' }}
                  >
                    {Number(totalUnread) > 99 ? '99+' : totalUnread}
                  </span>
                ) : null}
              </Link>
            </li>
          ) : null}
          <div className={styles.icon} onClick={() => setOpenSwitchNationModal(false)}>
            <Hamburger />
          </div>
        </div>

        {/* Header dropDown Menu */}
        {isShowHeaderMenu && (
          <DropDownMenu
            ref={ref}
            langKey={langKey} 
            lang={lang} 
            pathname={pathname}
            config={config}
            handleChangeNation={handleChangeNation}
          />
        )}
      </nav>

      {/* switch nation */}
      <SwitchNation
        open={openSwitchNationModal}
        lang={lang}
        close={() => setOpenSwitchNationModal(false)}
      />
    </div>
  )
}

export default ProtectedHeader
