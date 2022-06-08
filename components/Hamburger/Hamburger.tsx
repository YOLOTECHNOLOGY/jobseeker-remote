import React from 'react'

/* Redux */
import { connect } from 'react-redux'
import { toggleMenu } from 'store/actions/navigationBar/toggleMenu'

/* Styles */
import styles from './Hamburger.module.scss'

interface HamburgerProps {
  openState: boolean
  toggleMenu: Function
}
const Hamburger = ({ toggleMenu, openState }: HamburgerProps) => {
  const handleShowMenu = () => {
    if (!openState) { // opening menu, disable scrolling of body
      document.body.style.position = 'fixed';
      document.body.style.width = "100%";
    }
    if (openState) { // closing menu, enable scrolling of body
      const scrollY = document.body.style.top
      document.body.style.position = ''
      document.body.style.top = ''
      // retrieve previous scroll position
      window.scrollTo(0, parseInt(scrollY || '0') * -1)
    }
    toggleMenu(!openState)
  }
  return (
    <div
      id={styles.hamburgerMenu}
      className={openState ? styles.active : null}
      onClick={handleShowMenu}
    >
      <span />
      <span />
      <span />
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    openState: state.navbar.toggleMenu.menu,
  }
}

const mapDispatchToProps = (dispatch) => ({
  toggleMenu: (bool) => dispatch(toggleMenu(bool)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Hamburger)
