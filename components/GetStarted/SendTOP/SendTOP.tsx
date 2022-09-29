import { useEffect, useRef } from 'react'
import Text from 'components/Text'
import MaterialTextField from 'components/MaterialTextField'
import MaterialButton from 'components/MaterialButton'

// tools
import { handleNumericInput } from 'helpers/handleInput'

import styles from './SendTOP.module.scss'
import { useState } from 'react'
import { useFirstRender } from 'helpers/useFirstRender'

const SendTOP = ({
  userId,
  COUNT_DOWN_VERIFY_DEFAULT,
  handleSendEmailTOP,
  email,
  isLoading
}: any) => {
  const firstRender = useFirstRender()
  const [emailTOP, setEmailTOP] = useState<number>()
  const [emailError] = useState<string>()
  const [sendBtnDisabled, setSendBtnDisabled] = useState(true)

  // CountDown
  const refCountDownTimeName = useRef(null)
  const countDownVerify = useRef(COUNT_DOWN_VERIFY_DEFAULT)
  const [countDown, setCountDown] = useState(COUNT_DOWN_VERIFY_DEFAULT)
  const [isShowCountDownSwitch, setIsShowCountDownSwitch] = useState(false)

  useEffect(() => {
    setIsShowCountDownSwitch(true)
  }, [])

  useEffect(() => {
    if (firstRender) {
      return
    }
    if (isShowCountDownSwitch) {
      const eventCallBack = () => {
        if (countDownVerify.current <= 1) {
          setIsShowCountDownSwitch(false)
        } else {
          countDownVerify.current = countDownVerify.current - 1
          setCountDown(countDownVerify.current)
        }
      }
      refCountDownTimeName.current = setInterval(eventCallBack, 1000)
      return () => clearInterval(refCountDownTimeName.current)
    } else {
      clearInterval(refCountDownTimeName.current)
      // setBtnDisabled(false)
      setSendBtnDisabled(false)
      countDownVerify.current = COUNT_DOWN_VERIFY_DEFAULT
      setCountDown(COUNT_DOWN_VERIFY_DEFAULT)
    }
  }, [isShowCountDownSwitch])

  const sendEmailOTP = () => {
    setSendBtnDisabled(true)
    setIsShowCountDownSwitch(true)
    handleSendEmailTOP()
  }

  const errorText = (errorMessage: string) => {
    return (
      <Text textStyle='sm' textColor='red' tagName='p' className={styles.fieldError}>
        {errorMessage}
      </Text>
    )
  }

  return (
    <div className={styles.SendTOPContainer}>
      <div className={styles.SendTOPContainer_title}>
        <Text bold textStyle='xxxl' tagName='h2'>
          {userId ? 'Welcome back! 👏' : 'Sign up an account 🎉'}
        </Text>
      </div>

      <div className={styles.SendTOPContainer_desc}>
        <Text tagName='p' textStyle='lg' className={styles.SendTOPContainer_desc_text}>
          Please enter the 6-digit one-time password that we sent to {email}.
        </Text>
      </div>
      <div className={styles.SendTOPContainer_main}>
        <MaterialTextField
          className={styles.SendTOPContainer_main_field}
          id='email'
          label='Enter 6-digit OTP'
          variant='outlined'
          size='small'
          value={emailTOP}
          autoComplete='off'
          error={emailError ? true : false}
          onChange={(e) => setEmailTOP(handleNumericInput(e.target.value))}
        />

        <MaterialButton
          capitalize
          size='large'
          variant='contained'
          className={styles.SendTOPContainer_main_submit}
          disabled={sendBtnDisabled}
          // isLoading={isRegisteringJobseeker}
          isLoading={isLoading}
          onClick={sendEmailOTP}
        >
          <Text textStyle='lg' textColor='white' bold>
            {isShowCountDownSwitch && `Resend OTP (${countDown}s)`}
            {!isShowCountDownSwitch && `Get OTP`}
          </Text>
        </MaterialButton>
        {emailError && errorText(emailError)}
      </div>

      <div className={styles.SendTOPContainer_sendMagicLink}>
        <Text tagName='p' textStyle='lg'>
          Having trouble?{' '}
          <a className={styles.SendTOPContainer_sendMagicLink_magicLink}>Request a Magic Link</a>
        </Text>
      </div>
    </div>
  )
}

export default SendTOP
