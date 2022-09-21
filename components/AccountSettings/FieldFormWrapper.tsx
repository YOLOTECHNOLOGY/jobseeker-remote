import React from 'react'

/** Vendors */
import classNames from 'classnames/bind'

/** Component */
import Text from 'components/Text'
import { AccountSettingEditIconPen, AccountSettingDeleteIconBin } from 'images'
import Tooltip from '@mui/material/Tooltip'
import { TooltipIcon } from 'images'

// styles
import styles from './FieldFormWrapper.module.scss'

const FieldFormWrapper = ({
  label,
  children,
  className,
  style,
  setEdit,
  isEdit,
  edit,
  isDetele,
  textClassName,
  deleteJobAlert,
  titleTips,
  alertTitle
}: any) => {
  return (
    <div className={classNames([className, styles.fieldFromWrapper])} style={style}>
      <div className={styles.fieldFromWrapper_title}>
        <div className={styles.fieldFromWrapper_title_tips}>
          <Text
            tagName='h2'
            textStyle='xl'
            bold
            className={classNames([styles.fieldFromWrapper_title_context, textClassName])}
          >
            {alertTitle ? alertTitle : label}
          </Text>
          {titleTips && (
            <Tooltip
              title={titleTips}
              placement='top'
              arrow
              classes={{ tooltip: styles.fieldFromWrapper_title_toolTip }}
            >
              <img src={TooltipIcon} alt='icon' width='20' height='20' />
            </Tooltip>
          )}
        </div>
        <div className={styles.fieldFromWrapper_title_edit_icon}>
          {isEdit && edit !== label && (
            <img
              onClick={() => {
                setEdit(label)
              }}
              src={AccountSettingEditIconPen}
              alt='account setting edit icon pen'
            />
          )}

          {isDetele && (
            <img
              src={AccountSettingDeleteIconBin}
              onClick={() => deleteJobAlert(label)}
              alt='account setting eelete icon bin'
            />
          )}
        </div>
      </div>
      <div style={{ padding: '10px 0 0' }}>{children}</div>
    </div>
  )
}

export default React.memo(FieldFormWrapper)
