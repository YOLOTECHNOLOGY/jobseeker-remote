import React from 'react'
import VerifyMailAndBindEmail from '../VerifyMailAndBindEmail/email'
import VerifyPhoneNumber from '../VerifyPhoneNumber/phone'
import styles from './index.module.scss'

interface IProps {
  lang: any
  userDetail: any
  config: any
}

const index = (props: IProps) => {
  const { lang, userDetail, config } = props
  const { accountSetting } = lang

  return (
    <div className={styles.accountSettingWrapper}>
      <div className={styles.navTitle}>{accountSetting?.title}</div>
      <VerifyMailAndBindEmail
        label={accountSetting.email}
        userDetail={userDetail}
        lang={lang}
      />

      <VerifyPhoneNumber
        label={accountSetting.mobile}
        userDetail={userDetail}
        config={config}
        lang={lang}
      />
    </div>
  )
}

export default index
