import { useEffect, useState, useRef } from 'react'
import { useDispatch } from 'react-redux'

import FieldFormWrapper from 'components/AccountSettings/FieldFormWrapper'
import MaterialTextField from 'components/MaterialTextField'
import Text from 'components/Text'
import { BlueTickIcon } from 'images'

// tools
import { handleNumericInput } from 'helpers/handleInput'

// ui
import { Button } from '@mui/material'
import Tooltip from '@mui/material/Tooltip'

// api
import { sendEmaillOtp, changeEmail, verifyEmail } from 'store/services/auth/changeEmail'

// actions
import { displayNotification } from 'store/actions/notificationBar/notificationBar'

// styles
import styles from './index.module.scss'
import { useFirstRender } from 'helpers/useFirstRender'

const VerifyMailAndBindEmail = ({
  label,
  setEdit,
  edit,
  emailDefault,
  verify,
  errorText,
  getInitData,
  COUNT_DOWN_VERIFY_DEFAULT
}: any) => {
  const dispatch = useDispatch()

  let countDownVerify = COUNT_DOWN_VERIFY_DEFAULT
  const [countDown, setCountDown] = useState(COUNT_DOWN_VERIFY_DEFAULT)
  const [isShowCountDownSwitch, setIsShowCountDownSwitch] = useState(false)
  const refCountDownTimeName = useRef(null)

  const firstRender = useFirstRender()
  const [isBtnDisabled, setBtnDisabled] = useState(verify)
  const [isBtnDisabledVerify, setIsBtnDisabledVerify] = useState(true)

  const [emailError, setEmailError] = useState(null)
  const [email, setEmail] = useState(emailDefault)

  const [isShowemailVerify, setIsShowemailVerify] = useState(false)
  const [otp, setOtp] = useState('')
  const [otpError, setOtpError] = useState('')
  const [emailTip, setEmailTip] = useState(
    verify
      ? 'Your email has been verified. You will be able to receive job applications update through your email. To change your email address, please verify your new email address.'
      : 'To receive job applications update, please verify your email.'
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
    setEmail(emailDefault ? emailDefault : null)
    setIsShowemailVerify(false)
    setOtp('')
    // setEmailTip('To receive job applications update, please verify your email.')
    setOtpError(null)
    setBtnDisabled(verify)
  }

  useEffect(() => {
    if (firstRender || isShowCountDownSwitch) {
      return
    }
    let errorText = null
    if (email && !/\S+@\S+\.\S+/.test(email)) {
      errorText = 'Please enter a valid email address.'
    }

    if (errorText) {
      setBtnDisabled(true)
    } else {
      setBtnDisabled(false)
    }

    setEmailError(errorText)
  }, [email])

  useEffect(() => {
    if (firstRender) {
      return
    }
    if (otp.length > 6) {
      setIsBtnDisabledVerify(true)
      setOtpError('Incorrect format of verification code')
    } else {
      setIsBtnDisabledVerify(false)
      setOtpError(null)
    }
  }, [otp])

  useEffect(() => {
    if (firstRender) {
      return
    }
    setBtnDisabled(isShowCountDownSwitch)
  }, [isShowCountDownSwitch])

  const sendEmailOTPS = () => {
    setIsShowCountDownSwitch(true)
    setIsShowemailVerify(true)
    setEmail(email)
    sendEmaillOtp({ email }).then(() => {
      // if (data.success) {
      //   dispatch(
      //     displayNotification({
      //       open: true,
      //       message: 'The verification code has been sent to your email, please check it',
      //       severity: 'success'
      //     })
      //   )
      // }
    })
  }

  const emailVerifiSuccess = () => {
    setEmailTip(
      'Your email has been verified. You will be able to receive job applications update through your email.'
    )
    setIsShowemailVerify(false)
    // setDone(true)
    getInitData()
    setOtpError(null)
    setEdit(null)
  }

  const emailVerifiError = () => {
    setOtpError('OTP is incorrect. Please try again.')
  }

  const verifyEmailOrChangeEmail = () => {
    if (emailDefault === email) {
      // verify
      verifyEmail({ otp })
        .then(() => {
          dispatch(
            displayNotification({
              open: true,
              message: 'Your email account has been verified successfully',
              severity: 'success'
            })
          )
          emailVerifiSuccess()
        })
        .catch(() => {
          emailVerifiError()
        })
    } else {
      // change
      changeEmail({ otp, email })
        .then(() => {
          dispatch(
            displayNotification({
              open: true,
              message: 'Your email account has been verified successfully',
              severity: 'success'
            })
          )
          emailVerifiSuccess()
        })
        .catch(() => {
          emailVerifiError()
        })
    }
  }

  const requiredLabel = (text: string) => {
    return (
      <>
        <span>{text}&nbsp;</span>
        <span className={styles.stepFieldRequired}>* &nbsp; &nbsp;</span>
      </>
    )
  }

  return (
    <div className={styles.VerifyMailAndBindEmail}>
      <FieldFormWrapper
        label={label}
        setEdit={setEdit}
        edit={edit}
        isEdit
        titleTips='Receive job applications updates through your email. '
      >
        {edit === 'Email' ? (
          <div className={styles.accessSettingsContainer_fromWrapper}>
            {emailTip}
            <div className={styles.accessSettingsContainer_fromWrapper_edit}>
              <MaterialTextField
                className={styles.accessSettingsContainer_fromWrapper_edit_input}
                id='email'
                label={requiredLabel('Email Address')}
                variant='outlined'
                size='small'
                value={email}
                autoComplete='off'
                error={emailError ? true : false}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isShowemailVerify}
              />
              {emailError && errorText(emailError)}
            </div>

            <div className={styles.VerifyMailAndBindEmail_button}>
              <Button variant='contained' disabled={isBtnDisabled} onClick={sendEmailOTPS}>
                Send OTP {isShowCountDownSwitch && `(${countDown}s)`}
              </Button>
              {!isShowemailVerify && (
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

            {isShowemailVerify && (
              <div className={styles.accessSettingsContainer_fromWrapper_verifyContainer}>
                <Text>Enter the code that we have sent to {email}</Text>
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
            <Text className={styles.bottomSpacing}>{email}</Text>
            {verify && (
              <Tooltip
                title='Verified'
                placement='top'
                arrow
                // classes={{ tooltip: styles.formWrapper_tooltip }}
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

export default VerifyMailAndBindEmail
