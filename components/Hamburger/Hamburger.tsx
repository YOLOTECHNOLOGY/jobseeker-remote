'use client'
import React, { useEffect } from 'react'
import { getCookie } from 'helpers/cookies'
import { useRouter } from 'next/navigation'

/* Redux */
import { connect } from 'react-redux'
import { toggleMenu } from 'store/actions/navigationBar/toggleMenu'

/* Images */
import { DefaultAvatar } from 'images'
import Image from 'next/image'
/* Styles */
import styles from './Hamburger.module.scss'
import classNames from 'classnames'
import { fetchUserOwnDetailRequest } from 'store/actions/users/fetchUserOwnDetail'
import { useDispatch, useSelector } from 'react-redux'

interface HamburgerProps {
  openState: boolean
  toggleMenu: Function
  disabled?: boolean
  lang?: any
}
const Hamburger = ({ toggleMenu, openState, disabled, lang }: HamburgerProps) => {
  const router = useRouter()
  const currentUser = getCookie('user')
  const currentToken = getCookie('accessToken')
  const dispatch = useDispatch()
  const userInfo = useSelector((store: any) => store.users.fetchUserOwnDetail.response || {})

  const handleShowMenu = () => {
    if (!openState) {
      // opening menu, disable scrolling of body
      document.body.style.position = 'fixed'
      document.body.style.width = '100%'
    }

    if (openState) {
      // closing menu, enable scrolling of body
      const scrollY = document.body.style.top
      document.body.style.position = ''
      document.body.style.top = ''
      // retrieve previous scroll position
      window.scrollTo(0, parseInt(scrollY || '0') * -1)
    }

    toggleMenu(!openState)
  }

  const handleToGetStarted = () => {
    router.push('/get-started')
  }
  useEffect(() => {
    currentToken && dispatch(fetchUserOwnDetailRequest({ currentToken }))
  }, [currentToken])

  return (
    <div className={styles.hamburgerWrapper}>
      {!currentToken && (
        <div className={styles.hamburgerWrapper_getStarted} onClick={handleToGetStarted}>
          {lang.getStarted}
        </div>
      )}

      <div
        className={classNames([styles.mobile_menu_off, openState ? styles.mobile_menu_open : null])}
        onClick={disabled ? null : handleShowMenu}
      >
        <div id={styles.hamburgerMenu} className={openState ? styles.active : null}>
          {currentToken && !openState ? !userInfo?.vip?.is_vip ? (
            <img
              src={currentUser?.avatar || DefaultAvatar}
              // className={styles.profileAvatar}
              alt='avatar'
            />

          ) : (
            <div className={styles.vipAvatar}>
              <img
                src={currentUser?.avatar || DefaultAvatar}
                className={styles.profileAvatar}
                alt='avatar'
              />
              <img
                src={require('./vip_user_icon.png').default.src}
                width={22}
                height={9}
                alt=""
                style={{ position: 'absolute', bottom: '-2px', right: 0 }}
              />

            </div>
          ) : (
            <>
              <span />
              <span />
              <span />
            </>
          )}
        </div>
      </div>
    </div >
  )
}

const mapStateToProps = (state) => {
  return {
    openState: state.navbar.toggleMenu.menu
  }
}

const mapDispatchToProps = (dispatch) => ({
  toggleMenu: (bool) => dispatch(toggleMenu(bool))
})

export default connect(mapStateToProps, mapDispatchToProps)(Hamburger)
