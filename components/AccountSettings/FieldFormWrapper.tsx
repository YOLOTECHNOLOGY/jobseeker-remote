import React from 'react'

/** Vendors */
import classNames from 'classnames/bind'

/** Component */
import Text from 'components/Text'
import { AccountSettingEditIconPen, AccountSettingDeleteIconBin } from 'images'

// styles
import styles from './FieldFormWrapper.module.scss'

const FieldFormWrapper = ({
  label,
  children,
  className,
  style,
  setEdit,
  isEdit,
  isDetele
}: any) => {
  return (
    <div className={classNames([className, styles.fieldFromWrapper])} style={style}>
      <div className={styles.fieldFromWrapper_title}>
        <Text tagName='h2' textStyle='xl' bold>
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
      <div style={{ padding: '10px 0 0' }}>{children}</div>
    </div>
  )
}

export default React.memo(FieldFormWrapper)
