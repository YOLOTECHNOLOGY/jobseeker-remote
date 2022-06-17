import React, { useRef, useEffect } from 'react'

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
  handleSecondButton?: Function
  firstButtonText?: string
  secondButtonText?: string
  isFullWidth?: boolean
  isFullHeight?: boolean
  customFooter?: React.ReactNode
}

const Modal = ({
  style,
  className,
  children,
  showModal,
  // clearError,
  // disableCloseModal,
  closeModalOnOutsideClick,
  headerTitle,
  handleModal,
  handleFirstButton,
  handleSecondButton,
  firstButtonText,
  secondButtonText,
  isFullWidth,
  isFullHeight,
  customFooter,
  ...rest
}: ModalProps) => {
  const ref = useRef(null)
  const hasFirstButton = handleFirstButton && firstButtonText
  const hasSecondButton = handleSecondButton && secondButtonText

  const handleCloseModal = () => {
    document.body.style.overflow = 'auto'
    handleModal(false)
  }

  const handleClickOutside = event => {
    if (ref.current && !ref.current.contains(event.target)) {
      handleCloseModal();
    }
  }

  useEffect(() => {
    if (closeModalOnOutsideClick) {
      document.addEventListener('click', handleClickOutside, true)
      return () => {
        document.removeEventListener('click', handleClickOutside, true)
      }
    }
  }, [])

  useEffect(()=>{
    if (showModal) {
      document.body.style.overflow = 'hidden'
    }
  }, [showModal]);

  return (
    <div
      id='modal'
      className={classNames([
        styles.modal,
        isFullHeight ? styles.FullHeight : '',
        showModal ? styles.modalVisible : styles.modalHidden,
      ])}
      style={style}
      {...rest}
    >
      <div>
        <div
          ref={ref}
          className={classNames([
            styles.modalContent,
            className,
            isFullWidth ? styles.isFullWidth : '',
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
            {customFooter && (
              <div className={styles.modalFooter}>
                {customFooter}
              </div>
            )}
            {(hasFirstButton || hasSecondButton) && (
              <div className={styles.modalFooter}>
                {hasFirstButton && (
                  <Button
                    onClick={() => {
                      document.body.style.overflow = 'auto'
                      handleFirstButton()
                    }}
                  >
                    {firstButtonText}
                  </Button>
                )}
                {hasSecondButton && (
                  <Button
                    onClick={() => {
                      document.body.style.overflow = 'auto'
                      handleSecondButton()
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
    </div>
  )
}

export default Modal