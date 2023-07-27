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
    <>
      <div className={styles.navTitle}>{accountSetting?.title}</div>
      <VerifyMailAndBindEmail
        label={accountSetting.email}
        emailDefault={userDetail?.email ? userDetail.email : null}
        verify={userDetail.is_email_verify}
        lang={lang}
      />

      <VerifyPhoneNumber
        label={accountSetting.mobile}
        userDetail={userDetail}
        phoneDefault={userDetail.phone_num ? userDetail.phone_num : null}
        verify={userDetail.is_mobile_verified}
        config={config}
        lang={lang}
      />
    </>
  )
}

export default index
