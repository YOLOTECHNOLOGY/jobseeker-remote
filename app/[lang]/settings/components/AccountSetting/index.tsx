import React, { useState } from 'react'
import VerifyMailAndBindEmail from '../VerifyMailAndBindEmail'
import VerifyPhoneNumber from '../VerifyPhoneNumber'
import Text from 'components/Text'
import styles from '../../settings.module.scss'

const errorText = (errorMessage: string) => {
  return (
    <Text textStyle='sm' textColor='red' tagName='p' className={styles.fieldError}>
      {errorMessage}
    </Text>
  )
}

const COUNT_DOWN_VERIFY_DEFAULT = 60

interface IProps {
  lang: any
  userDetail: any
  config: any
}

const index = (props: IProps) => {
  const { lang, userDetail, config } = props
  const [edit, setEdit] = useState(null)
  const { accountSetting } = lang

  return (
    <>
      <div className={styles.navTitle}>Account Setting</div>
      <VerifyMailAndBindEmail
        label={accountSetting.email}
        edit={edit}
        setEdit={setEdit}
        isEdit
        errorText={errorText}
        emailDefault={userDetail?.email ? userDetail.email : null}
        verify={userDetail.is_email_verify}
        COUNT_DOWN_VERIFY_DEFAULT={COUNT_DOWN_VERIFY_DEFAULT}
        lang={lang}
      />

      <VerifyPhoneNumber
        label={accountSetting.mobile}
        edit={edit}
        setEdit={setEdit}
        isEdit
        errorText={errorText}
        phoneDefault={userDetail.phone_num ? userDetail.phone_num : null}
        verify={userDetail.is_mobile_verified}
        config={config}
        COUNT_DOWN_VERIFY_DEFAULT={COUNT_DOWN_VERIFY_DEFAULT}
        lang={lang}
      />
    </>
  )
}

export default index
