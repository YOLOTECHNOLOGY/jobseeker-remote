import React from 'react'

/** Vendors */
import classNames from 'classnames'

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
  sideNode,
  titleInlineBlock,
  ...rest
}: any) => {
  return (
    <div className={classNames([className, styles.fieldFromWrapper])} style={style} {...rest}>
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
          <img src={AccountSettingEditIconPen} alt='account setting edit icon pen' />
          <img src={AccountSettingDeleteIconBin} alt='account setting eelete icon bin' />
        </div>
      </div>
      {sideNode}
      <div style={{ padding: '10px 0 2em', marginBottom: '1.25em' }}>{children}</div>
    </div>
  )
}

export default FieldFormWrapper
