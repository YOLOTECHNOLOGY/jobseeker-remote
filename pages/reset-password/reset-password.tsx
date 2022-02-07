import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

/* Components */
import MaterialButton from 'components/MaterialButton'
import MaterialTextField from 'components/MaterialTextField'
import SEO from 'components/SEO'
import AuthLayout from 'components/AuthLayout'
import Text from 'components/Text'

/* Redux Actions */
import { sendResetPasswordCodeRequest } from 'store/actions/auth/sendResetPasswordCode'
import { checkResetPasswordCodeRequest } from 'store/actions/auth/checkResetPasswordCode'

/* Styles */
import styles from './ResetPassword.module.scss'

const ResetPassword = () => {
  const dispatch = useDispatch()

  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [isOtpSent, setIsOtpSent] = useState(false)

  const handleSendResetPasswordCode = () => {
    if (email) {
      dispatch(sendResetPasswordCodeRequest({ email }))
      setIsOtpSent(true)
    }
  }

  const handleCheckResetPasswordCode = () => {
    if (email && otp) {
      dispatch(checkResetPasswordCodeRequest({ email, otp }))
    }
  }

  return (
    <AuthLayout 
      headingText='Reset Password'
      ctaSignup
      isBackToLogin
    >
      <SEO
        title='Reset Password - Bossjob'
        description='Bossjob - Career Platform for Professionals in Philippines'
        canonical='/reset-password'
      />
      <div className={styles.ResetPasswordSubHeading}>
        <Text textStyle='xsm' tagName='p'>Please enter your registered email</Text>
        <Text textStyle='xsm' tagName='p'>A verification code will be sent to you shortly.</Text>
      </div>
       <form className={styles.ResetPasswordForm}>
          <div className={styles.ResetPasswordEmailOTP}>
            <MaterialTextField 
              className={styles.ResetPasswordFormInput}
              id='email' 
              label='Email Address' 
              variant='outlined'
              value={email}
              size='small'
              defaultValue={email}
              autoComplete='off'
              onChange={(e) => setEmail(e.target.value)}
            />
            {!isOtpSent && (
              <div
                className={styles.ResetPasswordOTP}
                onClick={() => handleSendResetPasswordCode()}
              >
              <Text textStyle='base' textColor='primaryBlue'>Get OTP</Text>
              </div>
            )}
            {isOtpSent && (
              <Text className={styles.ResetPasswordOTP} textStyle='base' textColor='darkgrey'>OTP Sent</Text>
            )}
          </div>

          <MaterialTextField 
            className={styles.ResetPasswordFormInput}
            id='otp' 
            label='Enter 6-digit OTP' 
            variant='outlined'
            value={otp}
            size='small'
            defaultValue={otp}
            autoComplete='off'
            onChange={(e) => setOtp(e.target.value)}
          />

          <MaterialButton 
            capitalize 
            size='large' 
            variant='contained'
            className={styles.ResetPasswordFormButton}
            onClick={() => handleCheckResetPasswordCode()}
          >
            <Text textStyle='xl' textColor='white' bold>Reset Password</Text>
          </MaterialButton>
        </form>
    </AuthLayout>
  )
}

export default ResetPassword