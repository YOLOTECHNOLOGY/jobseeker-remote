import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import FieldFormWrapper from 'components/AccountSettings/FieldFormWrapper'
import MaterialTextField from 'components/MaterialTextField'
import Text from 'components/Text'
import MaterialBasicSelect from 'components/MaterialBasicSelect'

// tools
import { handleNumericInput } from 'helpers/handleInput'
import { getSmsCountryList } from 'helpers/jobPayloadFormatter'

// ui
import { Button } from '@mui/material'

// api
import {
  sendPhoneNumberOTP,
  verifyPhoneNumber,
  changePhoneNumber
} from 'store/services/auth/changeEmail'

// actions
import { displayNotification } from 'store/actions/notificationBar/notificationBar'

// styles
import styles from './index.module.scss'

const VerifyPhoneNumber = ({
  label,
  setEdit,
  edit,
  phoneDefault,
  Verify,
  errorText,
  setIsShowCountDownSwitch,
  isShowCountDownSwitch,
  countDown,
  config
}: any) => {
  const dispatch = useDispatch()

  const smsCountryList = getSmsCountryList(config)
  const getSmsCountryCode = (phoneNumber, smsCountryList) => {
    if (!phoneNumber || !smsCountryList) return null

    const matchedCountryCode = smsCountryList.filter((country) => {
      return phoneNumber.includes(country.value)
    })

    return matchedCountryCode ? matchedCountryCode[0]?.value : null
  }
  const [smsCode, setSmsCode] = useState(getSmsCountryCode(phoneDefault, smsCountryList) || '+63')

  const [isBtnDisabled, setBtnDisabled] = useState(Verify)
  const [isBtnDisabledVerify, setIsBtnDisabledVerify] = useState(true)

  const [phoneNumError] = useState(null)
  const [phoneNum, setPhoneNum] = useState(phoneDefault)

  const [isShowPhoneVerify, setIsShowPhoneVerify] = useState(false)
  const [otp, setOtp] = useState('')

  const reductionEmail = () => {
    setPhoneNum(phoneDefault ? phoneDefault : null)
    setIsShowPhoneVerify(false)
    setOtp('')
  }

  useEffect(() => {
    if (otp.length === 6) {
      setIsBtnDisabledVerify(false)
    } else {
      setIsBtnDisabledVerify(true)
    }
  }, [otp])

  useEffect(() => {
    if (phoneNumError) {
      setBtnDisabled(true)
    } else {
      setBtnDisabled(false)
    }
  }, [phoneNumError])

  useEffect(() => {
    setBtnDisabled(isShowCountDownSwitch)
  }, [isShowCountDownSwitch])

  const sendPhoneNumberOTPS = () => {
    setIsShowCountDownSwitch(true)
    setIsShowPhoneVerify(true)
    setPhoneNum(phoneNum)
    sendPhoneNumberOTP({ phone_number: phoneNum }).then(({ data }) => {
      if (data.success) {
        dispatch(
          displayNotification({
            open: true,
            message: '验证码已发送注意查收',
            severity: 'success'
          })
        )
      }
    })
  }

  const verifyEmailOrChangeEmail = () => {
    if (phoneDefault === phoneNum) {
      // verify
      verifyPhoneNumber({ otp: Number(otp) }).then(({ data }) => {
        if (data.success) {
          dispatch(
            displayNotification({
              open: true,
              message: '手机验证成功',
              severity: 'success'
            })
          )
        } else {
          dispatch(
            displayNotification({
              open: true,
              message: '手机验证失败' + data?.error?.message,
              severity: 'warning'
            })
          )
        }
      })
    } else {
      // change
      changePhoneNumber({ otp: Number(otp), phoneNum }).then(({ data }) => {
        if (data.success) {
          dispatch(
            displayNotification({
              open: true,
              message: '手机修改成功',
              severity: 'success'
            })
          )
        }
      })
    }
  }

  return (
    <div className={styles.VerifyMailAndBindEmail}>
      <FieldFormWrapper
        label={label}
        setEdit={setEdit}
        isEdit
        titleTips='Help recruiters to better contact you for job opportunities.'
      >
        {edit === 'Mobile Number' ? (
          <div className={styles.accessSettingsContainer_fromWrapper}>
            <Text>
              To help recruiters to better contact you for job opportunities. please verify your
              mobile number.
            </Text>

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
                />
                {phoneNumError && errorText(phoneNumError)}
              </div>

              <div className={styles.accessSettingsContainer_fromWrapper_edit_wrapper_block}>
                <MaterialTextField
                  className={styles.accessSettingsContainer_fromWrapper_edit_input}
                  label={'Contact Number'}
                  size='small'
                  error={phoneNumError ? true : false}
                  value={phoneNum}
                  onChange={(e) => setPhoneNum(handleNumericInput(e.target.value))}
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
                    error={phoneNumError ? true : false}
                    onChange={(e) => setOtp(handleNumericInput(e.target.value))}
                  />
                  {phoneNumError && errorText(phoneNumError)}
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
            <Text className={styles.bottomSpacing}>{phoneNum}</Text>
          </div>
        )}
      </FieldFormWrapper>
    </div>
  )
}

export default VerifyPhoneNumber
