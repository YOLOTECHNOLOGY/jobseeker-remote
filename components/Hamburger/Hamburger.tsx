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
  return (
    <div
      id={styles.hamburgerMenu}
      className={openState ? styles.active : null}
      onClick={() => {
          toggleMenu(!openState)}
      }
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
