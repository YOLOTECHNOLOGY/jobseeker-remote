import React, { useRef, useEffect } from 'react'
import * as ReactDOM from 'react-dom'

/* Vendor */
import classNames from 'classnames/bind'

/* Components */
import Text from 'components/Text'

/* Styles */
import styles from './Modal.module.scss'

import { CloseIcon } from 'images'

type ModalProps = {
  style?: object
  className?: string
  children: React.ReactNode
  showModal: boolean
  handleModal: Function
  closeModalOnOutsideClick?: boolean
  fullScreen?: boolean
  customFooter?: React.ReactNode
  bodyClass?: string
}

export const PureModal = ({
  style,
  className,
  children,
  showModal,
  closeModalOnOutsideClick = true,
  handleModal,
  fullScreen = false,
  bodyClass,
  ...rest
}: ModalProps) => {
  const ref = useRef(null)
  const scrollY = useRef(0)
  const handleCloseModal = () => {
    /* Enables scrolling again - moved here as it does not work in useEffect cleanup */
    document.documentElement.classList.remove('modal-active')

    /* For IOS devices, restore scroll position*/
    window.scrollTo(0, scrollY.current)

    handleModal(false)
  }

  const handleClickOutside = (event) => {
    // Invariant: any click outside modal will be caught in modalWrapper
    if (
      event.target.getAttribute('class') &&
      event.target.getAttribute('class').includes('modalWrapper')
    )
      handleCloseModal()
    // if (event.target.className.includes('modalWrapper')) handleCloseModal()
  }

  const syncHeight = () => {
    document.documentElement.style.setProperty('--window-inner-height', `${window.innerHeight}px`)
  }

  // const preventDefault = (e) => {
  //   e.preventDefault()
  // }

  useEffect(() => {
    /* To handle IOS Safari footer */
    // Set initial height to window.innerHeight
    document.documentElement.style.setProperty('--window-inner-height', `${window.innerHeight}px`)
    // When IOS footer/header toggles, it triggers a resize event
    // We update body height on 'resize'
    window.addEventListener('resize', syncHeight)

    // const modal = document.querySelector('.modal-wrapper')
    // modal.addEventListener('pointermove', preventDefault)

    /* Setting HTML height will disrupt scroll position, so we store scroll position*/
    scrollY.current = window.pageYOffset

    if (closeModalOnOutsideClick) document.addEventListener('mousedown', handleClickOutside, true)

    return () => {
      if (closeModalOnOutsideClick) document.removeEventListener('mousedown', handleClickOutside, true)
      window.removeEventListener('resize', syncHeight)
      // modal.removeEventListener('pointermove', preventDefault)
    }
  }, [])
  if (!showModal) return null

  return ReactDOM.createPortal(
    <React.Fragment>
      <div className={styles.modalOverlay} ref={ref} />
      <div
        className={styles.modalWrapper}
        style={style}
        aria-modal
        aria-hidden
        tabIndex={-1}
        role='dialog'
        {...rest}
      >
        <div
          className={classNames([
            fullScreen ? styles.modalContentFullscreen : styles.modalContent,
            className
          ])}
        >
          <div className={classNames([styles.modalCloseButton, styles.pureModalClose])}>
            <Text onClick={handleCloseModal}>
              <img src={CloseIcon} title='close modal' alt='close modal' width='14' height='14' />
            </Text>
          </div>
          <div className={classNames([styles.modalBody, bodyClass])}>{children}</div>
        </div>
      </div>
    </React.Fragment>,
    document.body
  )
}
