import React, { useRef, useEffect } from 'react'
import * as ReactDOM from 'react-dom'

/* Vendor */
import classNames from 'classnames/bind'

/* Components */
import Text from 'components/Text'
// import Button from 'components/Button'
import MaterialButton from 'components/MaterialButton'

/* Styles */
import styles from './Modal.module.scss'

import { CloseIcon } from 'images'

type ModalProps = {
  style?: object
  className?: string
  children: React.ReactNode
  showModal: boolean
  handleModal: Function
  clearError?: Function
  disableCloseModal?: boolean
  closeModalOnOutsideClick?: boolean
  headerTitle: string
  handleFirstButton?: Function
  firstButtonIsClose?: boolean
  handleSecondButton?: Function
  secondButtonIsClose?: boolean
  isFirstButtonLoading?: boolean
  isSecondButtonLoading?: boolean
  isSecondButtonDisabled?: boolean
  firstButtonText?: string
  secondButtonText?: string
  fullScreen?: boolean
  customFooter?: React.ReactNode
  headerClass?: string
  bodyClass?: string
  footerClass?: string
}

const Modal = ({
  style,
  className,
  children,
  showModal,
  closeModalOnOutsideClick = true,
  headerTitle,
  handleModal,
  handleFirstButton,
  firstButtonIsClose,
  handleSecondButton,
  firstButtonText,
  secondButtonIsClose,
  secondButtonText,
  isFirstButtonLoading,
  isSecondButtonLoading,
  isSecondButtonDisabled,
  fullScreen = false,
  customFooter,
  headerClass,
  bodyClass,
  footerClass,
  ...rest
}: ModalProps) => {
  if (!showModal) return null
  const ref = useRef(null)
  const scrollY = useRef(0)
  const hasFirstButton = handleFirstButton && firstButtonText
  const hasSecondButton = handleSecondButton && secondButtonText

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

    if (closeModalOnOutsideClick) document.addEventListener('click', handleClickOutside, true)

    return () => {
      if (closeModalOnOutsideClick) document.removeEventListener('click', handleClickOutside, true)
      window.removeEventListener('resize', syncHeight)
      // modal.removeEventListener('pointermove', preventDefault)
    }
  }, [])

  return ReactDOM.createPortal(
    <React.Fragment>
      <div className={styles.modalOverlay} ref={ref} />
      <div
        id='modal'
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
          <div className={classNames([styles.modalHeader, headerClass])}>
            <Text textStyle='xl' bold className={styles.modalHeaderTitle}>
              {headerTitle}
            </Text>
            <div className={styles.modalCloseButton}>
              <Text onClick={handleCloseModal}>
                <img src={CloseIcon} title='close modal' alt='close modal' width='14' height='14' />
              </Text>
            </div>
          </div>
          <div className={classNames([styles.modalBody, bodyClass])}>{children}</div>
          {customFooter && 
          <div className={classNames([styles.modalFooter, footerClass])}>{customFooter}</div>}
          {/* {(hasFirstButton || hasSecondButton) && (
            <div className={styles.modalFooter}>
              {hasFirstButton && (
                <Button
                  className={styles.modalFooterFirstButtonBock}
                  onClick={() => {
                    handleFirstButton()
                    if (firstButtonIsClose) handleCloseModal()
                  }}
                >
                  {firstButtonText}
                </Button>
              )}
              {hasSecondButton && (
                <Button
                  className={styles.modalFooterSecondButtonOnfirm}
                  onClick={() => {
                    handleSecondButton()
                    if (secondButtonIsClose) handleCloseModal()
                  }}
                >
                  {secondButtonText}
                </Button>
              )} */}
              {(hasFirstButton || hasSecondButton) && (
              <div className={styles.modalFooter}>
                {hasFirstButton && (
                  <MaterialButton
                    variant='outlined'
                    capitalize
                    onClick={() => {
                      handleFirstButton()
                      if (firstButtonIsClose) handleModal()
                    }}
                    isLoading={isFirstButtonLoading}
                    sx={{ height: '44px' }}
                  >
                    <Text textColor='primaryBlue' bold>
                      {firstButtonText}
                    </Text>
                  </MaterialButton>
                )}
                {hasSecondButton && (
                  <MaterialButton
                    variant='contained'
                    capitalize
                    onClick={() => {
                      handleSecondButton()
                      if (secondButtonIsClose) handleModal()
                    }}
                    isLoading={isSecondButtonLoading}
                    sx={{ height: '44px', marginLeft: hasFirstButton ? '18px' : '' }}
                    disabled={isSecondButtonDisabled}
                  >
                    <Text textColor='white' bold>
                      {secondButtonText}
                    </Text>
                  </MaterialButton>
                )}
            </div>
          )}
        </div>
      </div>
    </React.Fragment>,
    document.body
  )
}

export default Modal
