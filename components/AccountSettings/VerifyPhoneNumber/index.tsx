import { useEffect, useState, useRef, useMemo } from 'react'
import { useDispatch } from 'react-redux'

import FieldFormWrapper from 'components/AccountSettings/FieldFormWrapper'
import MaterialTextField from 'components/MaterialTextField'
import Text from 'components/Text'
import MaterialBasicSelect from 'components/MaterialBasicSelect'
import { BlueTickIcon } from 'images'

// tools
import { handleNumericInput } from 'helpers/handleInput'
import { getSmsCountryList } from 'helpers/jobPayloadFormatter'

// ui
import { Button } from '@mui/material'
import Tooltip from '@mui/material/Tooltip'

// api
import { smsOTPChangePhoneNumverGenerate } from 'store/services/auth/smsOTPChangePhoneNumberGenerate'
import { verifyPhoneNumber } from 'store/services/auth/verifyPhoneNumber'
import { changePhoneNumber } from 'store/services/auth/changePhoneNumber'

// actions
import { displayNotification } from 'store/actions/notificationBar/notificationBar'

// styles
import styles from './index.module.scss'
import { useFirstRender } from 'helpers/useFirstRender'
import { formatTemplateString } from 'helpers/formatter'
import { find } from 'lodash-es'
const VerifyPhoneNumber = ({
  label,
  setEdit,
  edit,
  phoneDefault,
  verify,
  errorText,
  config,
  COUNT_DOWN_VERIFY_DEFAULT,
  lang
}: any) => {
  const { accountSetting } = lang
  const dispatch = useDispatch()

  let countDownVerify = COUNT_DOWN_VERIFY_DEFAULT
  const [countDown, setCountDown] = useState(COUNT_DOWN_VERIFY_DEFAULT)
  const [isShowCountDownSwitch, setIsShowCountDownSwitch] = useState(false)
  const refCountDownTimeName = useRef(null)

  const [defaultPhone, setDefaultPhone] = useState(phoneDefault)
  const firstRender = useFirstRender()

  const smsCountryList = getSmsCountryList(config)
  const getSmsCountryCode = (phoneNumber, smsCountryList) => {
    if (!phoneNumber || !smsCountryList) return null

    const matchedCountryCode = smsCountryList.filter((country) => {
      return phoneNumber.includes(country.value)
    })

    return matchedCountryCode ? matchedCountryCode[0]?.value : null
  }

  const [smsCode, setSmsCode] = useState(getSmsCountryCode(phoneDefault, smsCountryList))
  if (!smsCode) {
    setSmsCode('+63')
  } else if (phoneDefault) {
    phoneDefault = phoneDefault.substring(smsCode.length, phoneDefault.length)
  }
  const countryId = useMemo(() => {
    return smsCountryList.find(item => item.value === smsCode)?.id
  }, [smsCode, smsCountryList])

  const [isBtnDisabled, setBtnDisabled] = useState(verify)
  const [isBtnDisabledVerify, setIsBtnDisabledVerify] = useState(true)

  const [phoneNumError] = useState(null)
  const [phoneNum, setPhoneNum] = useState(phoneDefault)

  const [isShowPhoneVerify, setIsShowPhoneVerify] = useState(false)
  const [otp, setOtp] = useState('')
  const [otpError, setOtpError] = useState('')
  const [phoneTip, setPhoneTip] = useState(
    verify ? accountSetting.mobileExplanation : accountSetting.mobileNotVerified
  )

  useEffect(() => {
    if (isShowCountDownSwitch) {
      const eventCallBack = () => {
        if (countDownVerify <= 1) {
          setIsShowCountDownSwitch(false)
          clearInterval(refCountDownTimeName.current)
        } else {
          countDownVerify = countDownVerify - 1
          setCountDown(countDownVerify)
        }
      }
      refCountDownTimeName.current = setInterval(eventCallBack, 1000)
      return () => clearInterval(refCountDownTimeName.current)
    } else {
      clearInterval(refCountDownTimeName.current)
      // setBtnDisabled(false)
      countDownVerify = COUNT_DOWN_VERIFY_DEFAULT
      setCountDown(COUNT_DOWN_VERIFY_DEFAULT)
    }
  }, [isShowCountDownSwitch])

  const reductionEmail = () => {
    setPhoneNum(phoneDefault ? phoneDefault : null)
    setIsShowPhoneVerify(false)
    setOtp('')
  }

  useEffect(() => {
    if (isShowCountDownSwitch) {
      return
    }
    if (phoneNum && phoneNum.length) {
      setBtnDisabled(false)
    } else {
      setBtnDisabled(true)
    }
  }, [phoneNum])

  useEffect(() => {
    setPhoneNum(phoneDefault)
  }, [phoneDefault])

  useEffect(() => {
    if (firstRender) {
      return
    }
    if (otp.length > 6) {
      setIsBtnDisabledVerify(true)
      setOtpError(accountSetting.errorMsg.optIncorrect)
    } else {
      setIsBtnDisabledVerify(false)
      setOtpError('')
    }
  }, [otp])

  useEffect(() => {
    if (firstRender) {
      return
    }
    if (phoneNumError) {
      setBtnDisabled(true)
    } else {
      setBtnDisabled(false)
    }
  }, [phoneNumError])

  useEffect(() => {
    if (firstRender) {
      return
    }
    setBtnDisabled(isShowCountDownSwitch)
  }, [isShowCountDownSwitch])
  const sendPhoneNumberOTPS = () => {
    setIsShowCountDownSwitch(true)
    setIsShowPhoneVerify(true)
    setPhoneNum(phoneNum)
    const mobile_country_id = find(smsCountryList, { 'value': smsCode })?.id
    smsOTPChangePhoneNumverGenerate({ phone_num: smsCode + phoneNum, mobile_country_id })
      .then()
      .catch((exceptionHandler) => {
        const { data } = exceptionHandler.response
        let errorMessage
        if (data?.data) {
          errorMessage = data?.data?.detail ?? data?.message
        } else {
          errorMessage = data?.errors?.phone_num[0]
        }
        dispatch(
          displayNotification({
            open: true,
            message: errorMessage ?? exceptionHandler.message,
            severity: 'warning'
          })
        )
      })
  }

  const verifiSuccess = () => {
    setPhoneTip(
      'Your mobile number has been verified. Recruiters will be able to contact you through your mobile number.'
    )
    setDefaultPhone(smsCode + phoneNum)
    setIsShowPhoneVerify(false)
    setOtpError(null)
    setEdit(null)
  }

  const verifiError = (errorMessage?: string) => {
    if (errorMessage == 'Invalid otp') {
      errorMessage = accountSetting.errorMsg.invalidOtp
    }
    setOtpError(errorMessage)
  }

  const verifyEmailOrChangeEmail = () => {
    const phone = smsCode + phoneNum
    if (defaultPhone === phone) {
      // verify
      verifyPhoneNumber({ otp: Number(otp) })
        .then(({ data }) => {
          if (data.data?.message == 'success') {
            dispatch(
              displayNotification({
                open: true,
                message: 'Your mobile number has been verified successfully.',
                severity: 'success'
              })
            )
            verifiSuccess()
          }
        })
        .catch((error) => {
          const response = error.response
          const resultError = response.data?.message
          verifiError(resultError ?? error.message)
        })
    } else {
      // change
      changePhoneNumber({ otp: Number(otp), mobile_country_id: countryId, phone_num: smsCode + Number(phoneNum) })
        .then(({ data }) => {
          if (data.data?.message == 'success') {
            dispatch(
              displayNotification({
                open: true,
                message: 'Your mobile number has been verified successfully.',
                severity: 'success'
              })
            )
            verifiSuccess()
          }
        })
        .catch((error) => {
          const response = error.response
          const resultError = response?.data?.message
          verifiError(resultError ?? error.message)
        })
    }
  }

  return (
    <div className={styles.VerifyMailAndBindEmail}>
      <FieldFormWrapper
        label={label}
        setEdit={setEdit}
        edit={edit}
        isEdit
        titleTips={accountSetting.mobileTip}
      >
        {edit === label ? (
          <div className={styles.accessSettingsContainer_fromWrapper}>
            <Text>{phoneTip}</Text>

            <div className={styles.accessSettingsContainer_fromWrapper_edit_wrapper}>
              <div className={styles.accessSettingsContainer_fromWrapper_edit_wrapper_block}>
                <MaterialBasicSelect
                  className={styles.accessSettingsContainer_fromWrapper_edit_input}
                  label={accountSetting.country}
                  value={smsCode}
                  options={smsCountryList}
                  onChange={(e) => {
                    setSmsCode(e.target.value)
                  }}
                  disabled={isShowPhoneVerify}
                />
              </div>

              <div className={styles.accessSettingsContainer_fromWrapper_edit_wrapper_block}>
                <MaterialTextField
                  className={styles.accessSettingsContainer_fromWrapper_edit_input}
                  label={accountSetting.contactNumber}
                  size='small'
                  error={phoneNumError ? true : false}
                  value={phoneNum}
                  onChange={(e) => setPhoneNum(handleNumericInput(e.target.value))}
                  disabled={isShowPhoneVerify}
                />
                {phoneNumError && errorText(phoneNumError)}
              </div>
            </div>

            <div className={styles.VerifyMailAndBindEmail_button}>
              <Button variant='contained' disabled={isBtnDisabled} onClick={sendPhoneNumberOTPS}>
                {accountSetting.sendOpt} {isShowCountDownSwitch && `(${countDown}s)`}
              </Button>
              {!isShowPhoneVerify && (
                <Button
                  variant='outlined'
                  onClick={() => {
                    reductionEmail()
                    setEdit(null)
                  }}
                >
                  {accountSetting.cancel}
                </Button>
              )}
            </div>

            {isShowPhoneVerify && (
              <div className={styles.accessSettingsContainer_fromWrapper_verifyContainer}>
                <Text>{formatTemplateString(accountSetting.enterCode, phoneNum)}</Text>
                <div className={styles.accessSettingsContainer_fromWrapper_edit}>
                  <MaterialTextField
                    className={styles.accessSettingsContainer_fromWrapper_edit_input}
                    id='email'
                    label={accountSetting.optLabel}
                    variant='outlined'
                    size='small'
                    value={otp}
                    autoComplete='off'
                    error={otpError ? true : false}
                    maxLength={6}
                    onChange={(e) => setOtp(handleNumericInput(e.target.value))}
                  />
                  {otpError && errorText(otpError)}
                </div>

                <div className={styles.VerifyMailAndBindEmail_button}>
                  <Button
                    variant='contained'
                    disabled={isBtnDisabledVerify}
                    onClick={verifyEmailOrChangeEmail}
                  >
                    {accountSetting.verify}
                  </Button>

                  <Button
                    variant='outlined'
                    onClick={() => {
                      reductionEmail()
                      setEdit(null)
                    }}
                  >
                    {accountSetting.cancel}
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className={styles.formWrapper}>
            <Text className={styles.bottomSpacing}>
              {defaultPhone ? defaultPhone : 'Not provided'}
            </Text>
            {verify && (
              <Tooltip
                title='Verified'
                placement='top'
                arrow
                classes={{ tooltip: styles.formWrapper_tooltip }}
              >
                <img src={BlueTickIcon} alt='icon' width='20' height='20' />
              </Tooltip>
            )}
          </div>
        )}
      </FieldFormWrapper>
    </div>
  )
}

export default VerifyPhoneNumber
