import React, { useRef, useEffect } from 'react'
import * as ReactDOM from 'react-dom'

/* Vendor */
import classNames from 'classnames/bind'

/* Components */
import Text from 'components/Text'
import Button from 'components/Button'

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
  firstButtonText?: string
  secondButtonText?: string
  customFooter?: React.ReactNode,
  isOTPVerified?: boolean
}

const Modal = ({
  style,
  className,
  children,
  showModal,
  // clearError,
  // disableCloseModal,
  closeModalOnOutsideClick = true,
  headerTitle,
  handleModal,
  handleFirstButton,
  firstButtonIsClose,
  handleSecondButton,
  firstButtonText,
  secondButtonIsClose,
  secondButtonText,
  customFooter,
  isOTPVerified,
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
    if (isOTPVerified) {
      handleModal(isOTPVerified)
    }
  }

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      handleCloseModal()
    }
  }

  const syncHeight = () => {
    document.documentElement.style.setProperty(
      '--window-inner-height',
      `${window.innerHeight}px`
    )
  }

  // const preventDefault = (e) => {
  //   e.preventDefault()
  // }

  useEffect(() => {
    /* To handle IOS Safari footer */
    // Set initial height to window.innerHeight
    document.documentElement.style.setProperty(
      '--window-inner-height',
      `${window.innerHeight}px`
    )
    // When IOS footer/header toggles, it triggers a resize event
    // We update body height on 'resize'
    window.addEventListener('resize', syncHeight)
    
    // const modal = document.querySelector('.modal-wrapper')
    // modal.addEventListener('pointermove', preventDefault)

    /* Setting HTML height will disrupt scroll position, so we store scroll position*/
    scrollY.current = window.pageYOffset
    document.documentElement.classList.add('modal-active')
    
    if (closeModalOnOutsideClick) document.addEventListener('click', handleClickOutside, true)
    return () => {
      if (closeModalOnOutsideClick) document.removeEventListener('click', handleClickOutside, true)
      window.removeEventListener('resize', syncHeight)
      // modal.removeEventListener('pointermove', preventDefault)
    }
  }, [])

  return ReactDOM.createPortal(
    <>
      <div className={styles.modalOverlay} />
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
            ref={ref}
            className={classNames([
              styles.modalContent,
              className,
            ])}
          >
              <div className={styles.modalHeader}>
                <Text textStyle='xl' bold className={styles.modalHeaderTitle}>
                  {headerTitle}
                </Text>
                <div className={styles.modalCloseButton}>
                  <Text onClick={handleCloseModal}>
                    <img
                      src={CloseIcon}
                      title='close modal'
                      alt='close modal'
                      width='14'
                      height='14'
                    />
                  </Text>
                </div>
              </div>
              <div className={styles.modalBody}>{children}</div>
              {customFooter && <div className={styles.modalFooter}>{customFooter}</div>}
              {(hasFirstButton || hasSecondButton) && (
                <div className={styles.modalFooter}>
                  {hasFirstButton && (
                    <Button
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
                      onClick={() => {
                        handleSecondButton()
                        if (secondButtonIsClose) handleCloseModal()
                      }}
                    >
                      {secondButtonText}
                    </Button>
                  )}
                </div>
              )}
          </div>
        </div>
    </>,
    document.body
  )
}

export default Modal
