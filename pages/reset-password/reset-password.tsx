import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

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

function validateEmail(mail) {
  return (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
}

const ResetPassword = () => {
  const dispatch = useDispatch()

  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [isOtpSent, setIsOtpSent] = useState(false)

  const [emailError, setEmailError] = useState('');
  const [otpError, setOtpError] = useState('');

  const isVerifyingCode = useSelector((store: any) => store.auth.checkResetPasswordCode.fetching)
  const sendOTPError = useSelector((store: any) => store.auth.sendResetPasswordCode.error);
  const checkOTPError = useSelector((store: any) => store.auth.checkResetPasswordCode.error);

  useEffect(() => { // send OTP
    switch(sendOTPError?.response?.status) {
      case 404: { // email does not exist on database
        setEmailError('Please enter a valid email address')
        setIsOtpSent(false); // should reset Get OTP button so user does not have to refresh
        break;
      }
    }
  }, [sendOTPError])

  useEffect(() => { // verify OTP
    switch(checkOTPError?.response?.status) {
      case 404: { // email does not exist on database
        setEmailError('Please enter a valid email address')
        break;
      }
      case 400: { // OTP verification failed for given email
        setOtpError('The OTP you have entered is wrong. Please try again')
        break;
      }
      case 422: { // invalid OTP >6 characters
        setOtpError('Please enter a valid 6 digit OTP')
        break;
      }
    }
  }, [checkOTPError])

  const handleSendResetPasswordCode = () => {
    if (!email) {
      setEmailError('Please enter your email address')
    } else if (validateEmail(email)) {
      setEmailError('');
      dispatch(sendResetPasswordCodeRequest({ email }))
      setIsOtpSent(true)
    } else {
      setEmailError('Please enter a valid email address')
    }
  }

  const handleCheckResetPasswordCode = () => {
    if (!otp) {
      setOtpError('Please enter the OTP sent to your email address')
      return;
    }
    if (!email) {
      setEmailError('Please enter your email address')
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address')
    } else {
      setEmailError('')
      setOtpError('')
      dispatch(checkResetPasswordCodeRequest({ email, otp }))
    }
  }

  const errorText = (errorMessage: string) => {
    return <Text textStyle='sm' textColor='red' tagName='p' className={styles.errorMessage}>{errorMessage}</Text>
  }

  return (
    <AuthLayout 
      headingText={<Text bold textStyle='xxxl' tagName='h2'> Reset Password</Text>}
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
          <div className={emailError ? styles.ResetPasswordEmailOTPError : styles.ResetPasswordEmailOTP}>
              <MaterialTextField 
                className={styles.ResetPasswordFormInput}
                id='email' 
                label='Email Address' 
                variant='outlined'
                value={email}
                size='small'
                defaultValue={email}
                error={emailError}
                autoComplete='off'
                onChange={(e) => setEmail(e.target.value)}
                onTouchStart={()=> setEmailError('')}
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
          {emailError && errorText(emailError)}
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
          {otpError && errorText(otpError)}
          <MaterialButton 
            capitalize 
            size='large' 
            variant='contained'
            className={styles.ResetPasswordFormButton}
            isLoading={isVerifyingCode}
            onClick={() => handleCheckResetPasswordCode()}
            disabled={!isOtpSent}
          >
            <Text textStyle='xl' textColor='white' bold>Reset Password</Text>
          </MaterialButton>
        </form>
    </AuthLayout>
  )
}

export default ResetPassword