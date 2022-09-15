import React from 'react'

/** Vendors */
import classNames from 'classnames/bind'

/** Component */
import Text from 'components/Text'
import { AccountSettingEditIconPen, AccountSettingDeleteIconBin } from 'images'
import { Button } from '@mui/material'

// styles
import styles from './FieldFormWrapper.module.scss'

const FieldFormWrapper = ({
  label,
  children,
  className,
  style,
  sideNode,
  titleInlineBlock,
  edit,
  setEdit,
  btnSuccessText,
  isEdit,
  isDetele,
  isBtnDisabled,
  handleConfirm,
  handleCancel
}: any) => {
  return (
    <div className={classNames([className, styles.fieldFromWrapper])} style={style}>
      <div className={styles.fieldFromWrapper_title}>
        <Text
          tagName='h2'
          textStyle='xl'
          style={{
            margin: '0 0 0.5em',
            ...(titleInlineBlock ? { display: 'inline-block' } : '')
          }}
          bold
        >
          {label}
        </Text>
        <div className={styles.fieldFromWrapper_title_edit_icon}>
          {isEdit && (
            <img
              onClick={() => {
                setEdit(label)
              }}
              src={AccountSettingEditIconPen}
              alt='account setting edit icon pen'
            />
          )}

          {isDetele && (
            <img src={AccountSettingDeleteIconBin} alt='account setting eelete icon bin' />
          )}
        </div>
      </div>
      {sideNode}
      <div style={{ padding: '10px 0 0' }}>
        {children}
        {edit == label && (
          <div className={styles.fieldFromWrapper_button}>
            <Button
              variant='contained'
              disableElevation
              disabled={isBtnDisabled}
              onClick={handleConfirm}
            >
              {btnSuccessText ? btnSuccessText : 'Send OTP'}
            </Button>
            <Button
              variant='outlined'
              onClick={() => {
                handleCancel()
                setEdit(null)
              }}
            >
              Cancel
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default React.memo(FieldFormWrapper)
