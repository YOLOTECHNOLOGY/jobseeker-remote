import { useEffect, useState, useRef } from 'react'
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

const VerifyPhoneNumber = ({
  label,
  setEdit,
  edit,
  phoneDefault,
  verify,
  errorText,
  config,
  getInitData,
  COUNT_DOWN_VERIFY_DEFAULT
}: any) => {
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
  const [isBtnDisabled, setBtnDisabled] = useState(verify)
  const [isBtnDisabledVerify, setIsBtnDisabledVerify] = useState(true)

  const [phoneNumError] = useState(null)
  const [phoneNum, setPhoneNum] = useState(phoneDefault)

  const [isShowPhoneVerify, setIsShowPhoneVerify] = useState(false)
  const [otp, setOtp] = useState('')
  const [otpError, setOtpError] = useState('')
  const [phoneTip, setPhoneTip] = useState(
    verify
      ? 'Your mobile number has been verified. Recruiters will be able to contact you through your mobile number. To change your mobile number, please verify your new mobile number.'
      : 'To help recruiters to better contact you for job opportunities. please verify your mobile number.'
  )

  useEffect(() => {
    if (isShowCountDownSwitch) {
      const eventCallBack = () => {
        if (countDownVerify <= 1) {
          setIsShowCountDownSwitch(false)
          clearInterval()
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
    if (firstRender) {
      return
    }
    if (otp.length > 6) {
      setIsBtnDisabledVerify(true)
      setOtpError('OTP is incorrect. Please try again.')
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
    smsOTPChangePhoneNumverGenerate({ phone_num: smsCode + phoneNum })
      .then()
      .catch((exceptionHandler) => {
        const { data } = exceptionHandler.response
        let errorMessage
        if (data?.data) {
          errorMessage = data?.data?.detail
        } else {
          errorMessage = data?.errors?.phone_num[0]
        }
        dispatch(
          displayNotification({
            open: true,
            message: exceptionHandler.message ?? errorMessage,
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
    getInitData()
    setOtpError(null)
    setEdit(null)
  }

  const verifiError = (errorMessage?: string) => {
    if (errorMessage == 'Invalid otp') {
      errorMessage = 'OTP is incorrect. Please try again.'
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
          const resultError = response.data?.errors
          verifiError(error.message ?? resultError?.error[0])
        })
    } else {
      // change
      changePhoneNumber({ otp: Number(otp), phone_num: smsCode + Number(phoneNum) })
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
          const resultError = response?.data?.errors
          verifiError(error.message ?? resultError?.error[0])
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
        titleTips='Help recruiters to better contact you for job opportunities.'
      >
        {edit === 'Mobile Number' ? (
          <div className={styles.accessSettingsContainer_fromWrapper}>
            <Text>{phoneTip}</Text>

            <div className={styles.accessSettingsContainer_fromWrapper_edit_wrapper}>
              <div className={styles.accessSettingsContainer_fromWrapper_edit_wrapper_block}>
                <MaterialBasicSelect
                  className={styles.accessSettingsContainer_fromWrapper_edit_input}
                  label='Country'
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
                  label={'Contact Number'}
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
                Send OTP {isShowCountDownSwitch && `(${countDown}s)`}
              </Button>
              {!isShowPhoneVerify && (
                <Button
                  variant='outlined'
                  onClick={() => {
                    reductionEmail()
                    setEdit(null)
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>

            {isShowPhoneVerify && (
              <div className={styles.accessSettingsContainer_fromWrapper_verifyContainer}>
                <Text>Enter the code that we have sent to {phoneNum}</Text>
                <div className={styles.accessSettingsContainer_fromWrapper_edit}>
                  <MaterialTextField
                    className={styles.accessSettingsContainer_fromWrapper_edit_input}
                    id='email'
                    label='6-digit OTP'
                    variant='outlined'
                    size='small'
                    value={otp}
                    autoComplete='off'
                    error={otpError ? true : false}
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
                    Verify
                  </Button>

                  <Button
                    variant='outlined'
                    onClick={() => {
                      reductionEmail()
                      setEdit(null)
                    }}
                  >
                    Cancel
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
