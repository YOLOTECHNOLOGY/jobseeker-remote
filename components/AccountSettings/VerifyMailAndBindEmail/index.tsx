import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import FieldFormWrapper from 'components/AccountSettings/FieldFormWrapper'
import MaterialTextField from 'components/MaterialTextField'
import Text from 'components/Text'

// tools
import { handleNumericInput } from 'helpers/handleInput'

// ui
import { Button } from '@mui/material'
import OfflinePinRounded from '@mui/icons-material/OfflinePinRounded'
import Tooltip from '@mui/material/Tooltip'

// api
import { sendEmaillOtp, changeEmail, verifyEmail } from 'store/services/auth/changeEmail'

// actions
import { displayNotification } from 'store/actions/notificationBar/notificationBar'

// styles
import styles from './index.module.scss'

const VerifyMailAndBindEmail = ({
  label,
  setEdit,
  edit,
  emailDefault,
  Verify,
  errorText,
  setIsShowCountDownSwitch,
  isShowCountDownSwitch,
  countDown
}: any) => {
  const dispatch = useDispatch()
  const [isBtnDisabled, setBtnDisabled] = useState(Verify)
  const [isBtnDisabledVerify, setIsBtnDisabledVerify] = useState(true)

  const [emailError, setEmailError] = useState(null)
  const [email, setEmail] = useState(emailDefault)

  const [isShowemailVerify, setIsShowemailVerify] = useState(false)
  const [otp, setOtp] = useState('')

  const reductionEmail = () => {
    setEmail(emailDefault ? emailDefault : null)
    setIsShowemailVerify(false)
    setOtp('')
  }

  useEffect(() => {
    let errorText = null
    if (email && !/\S+@\S+\.\S+/.test(email)) {
      errorText = 'Please enter a valid email address.'
    }

    setEmailError(errorText)
  }, [email])

  useEffect(() => {
    if (otp.length === 6) {
      setIsBtnDisabledVerify(false)
    } else {
      setIsBtnDisabledVerify(true)
    }
  }, [otp])

  useEffect(() => {
    if (emailError) {
      setBtnDisabled(true)
    } else {
      setBtnDisabled(false)
    }
  }, [emailError])

  useEffect(() => {
    setBtnDisabled(isShowCountDownSwitch)
  }, [isShowCountDownSwitch])

  const sendEmailOTPS = () => {
    setIsShowCountDownSwitch(true)
    setIsShowemailVerify(true)
    setEmail(email)
    sendEmaillOtp({ email }).then(({ data }) => {
      if (data.success) {
        dispatch(
          displayNotification({
            open: true,
            message: '需要给一个提示不然用户感知不到，是否成功',
            severity: 'success'
          })
        )
      }
    })
  }

  const verifyEmailOrChangeEmail = () => {
    if (emailDefault === email) {
      // verify
      verifyEmail({ otp }).then(() => {
        dispatch(
          displayNotification({
            open: true,
            message: '验证邮箱成功',
            severity: 'success'
          })
        )
      })
    } else {
      // change
      changeEmail({ otp, email }).then(() => {
        dispatch(
          displayNotification({
            open: true,
            message: '修改邮箱成功',
            severity: 'success'
          })
        )
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
        isEdit
        titleTips='Receive job applications updates through your email. '
      >
        {edit === 'Email' ? (
          <div className={styles.accessSettingsContainer_fromWrapper}>
            <Text>To receive job applications update, please verify your email.</Text>
            {isShowemailVerify && emailDefault !== email && (
              <Text>
                Your email has been verified. You will be able to receive job applications update
                through your email. To change your email address, please verify your new email
                address.
              </Text>
            )}
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
                    error={emailError ? true : false}
                    onChange={(e) => setOtp(handleNumericInput(e.target.value))}
                  />
                  {emailError && errorText(emailError)}
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
            {Verify && (
              <Tooltip
                title={label}
                placement='top'
                arrow
                classes={{ tooltip: styles.formWrapper_tooltip }}
              >
                <OfflinePinRounded sx={{ color: '#2DA871' }} />
              </Tooltip>
            )}
          </div>
        )}
      </FieldFormWrapper>
    </div>
  )
}

export default VerifyMailAndBindEmail
