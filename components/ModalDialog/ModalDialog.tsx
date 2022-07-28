/* Vendor */
import classNames from 'classnames/bind'

/* Components */
import Text from 'components/Text'
import Button from 'components/Button'

/* Styles */
import styles from './ModalDialog.module.scss'

import { CloseIcon } from 'images'
import { Breakpoint, Dialog, DialogContent } from '@mui/material'
import useWindowDimensions from '../../helpers/useWindowDimensions'

type ModalDialogProps = {
  className?: string
  children: React.ReactNode
  open: boolean
  onClose: any
  firstButtonText?: string
  secondButtonText?: string
  handleFirstButton?: Function
  handleSecondButton?: Function
  firstButtonIsClose?: boolean
  secondButtonIsClose?: boolean
  headerTitle: string
  customFooter?: React.ReactNode
  fullScreen?: boolean
  maxWidth?: Breakpoint
  maxHeight?: string
}

//
//  * 1. Invariant: If a modal is not full screen, it is a bottom sheet
//  * 2. If a modal is a bottom sheet, you must set $max-height on the children's root div
//  * 3. For $max-height, use vh values to account for small screens
//  * 4. Take note that setting $max-height on the children's root div will only set the height for the Body of the Modal
//  * i.e. does not account for Header or Footer
//
const ModalDialog = ({
  className,
  children,
  open,
  onClose,
  firstButtonText,
  secondButtonText,
  handleFirstButton,
  handleSecondButton,
  firstButtonIsClose,
  secondButtonIsClose,
  headerTitle,
  customFooter,
  fullScreen = false,
  maxWidth = 'lg',
  maxHeight = '684px',
}: ModalDialogProps) => {
  const { width } = useWindowDimensions()

  const isMobile = width < 768 ? true : false
  const isMobileFullScreen = isMobile && fullScreen

  const hasFirstButton = handleFirstButton && firstButtonText
  const hasSecondButton = handleSecondButton && secondButtonText

  const PaperStyles = {
    maxHeight: !isMobile ? maxHeight : 'fit-content', // default 100vh
    height: isMobileFullScreen ? '100vh' : undefined, // default is 100vh
    margin: 0, // default is 32
    alignSelf: isMobile ? 'flex-end' : undefined, // default is center
  }

  return (
    <Dialog
      fullScreen={isMobileFullScreen}
      scroll='paper'
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      PaperProps={{
        sx: {
          ...PaperStyles,
        },
      }}
    >
      <div className={classNames([styles.modalContent, className])}>
        <div className={styles.modalHeader}>
          <Text textStyle='xl' bold className={styles.modalHeaderTitle}>
            {headerTitle}
          </Text>
          <div className={styles.modalCloseButton}>
            <Text onClick={onClose}>
              <img src={CloseIcon} title='close modal' alt='close modal' width='14' height='14' />
            </Text>
          </div>
        </div>
        <DialogContent>
          <div className={styles.modalBody}>{children}</div>
        </DialogContent>
        {customFooter && <div className={styles.modalFooter}>{customFooter}</div>}
        {(hasFirstButton || hasSecondButton) && (
          <div className={styles.modalFooter}>
            {hasFirstButton && (
              <Button
                onClick={() => {
                  handleFirstButton()
                  if (firstButtonIsClose) onClose()
                }}
              >
                {firstButtonText}
              </Button>
            )}
            {hasSecondButton && (
              <Button
                onClick={() => {
                  handleSecondButton()
                  if (secondButtonIsClose) onClose()
                }}
              >
                {secondButtonText}
              </Button>
            )}
          </div>
        )}
      </div>
    </Dialog>
  )
}

export default ModalDialog
