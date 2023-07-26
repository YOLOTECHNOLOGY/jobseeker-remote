import React from 'react'
import VerifyMailAndBindEmail from '../VerifyMailAndBindEmail/email'
import VerifyPhoneNumber from '../VerifyPhoneNumber/phone'
import Text from 'components/Text'
import styles from './index.module.scss'

const errorText = (errorMessage: string) => {
  return (
    <Text textStyle='sm' textColor='red' tagName='p' className={styles.fieldError}>
      {errorMessage}
    </Text>
  )
}

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
        errorText={errorText}
        emailDefault={userDetail?.email ? userDetail.email : null}
        verify={userDetail.is_email_verify}
        lang={lang}
      />

      <VerifyPhoneNumber
        label={accountSetting.mobile}
        errorText={errorText}
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
