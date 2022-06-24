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
  customFooter?: React.ReactNode
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
  ...rest
}: ModalProps) => {
  if (!showModal) return null
  const ref = useRef(null)
  const hasFirstButton = handleFirstButton && firstButtonText
  const hasSecondButton = handleSecondButton && secondButtonText

  const handleCloseModal = () => {
    document.documentElement.setAttribute("modal-active", "false")
    handleModal(false)
  }

  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      handleCloseModal()
    }
  }

  useEffect(() => {
    document.documentElement.setAttribute("modal-active", "true")
    // document.body.style.overflow = 'hidden'
    if (closeModalOnOutsideClick) {
      document.addEventListener('click', handleClickOutside, true)
      return () => {
        document.removeEventListener('click', handleClickOutside, true)
      }
    }
  }, [])

  useEffect(() => {
    return () => {
      document.documentElement.setAttribute("modal-active", "false")
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
            <div>
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
        </div>
    </>,
    document.body
  )
}

export default Modal
