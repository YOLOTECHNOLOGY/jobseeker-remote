import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import MaterialTextField from 'components/MaterialTextField'
import MaterialButton from 'components/MaterialButton'
import Text from 'components/Text'
import SendTOP from 'components/GetStarted/SendTOP/SendTOP'
import MagicLink from 'components/GetStarted/MagicLink/MagicLink'
import SocialMediaAuth from 'components/SocialMediaAuth/SocialMediaAuth'

// import { Visibility, VisibilityOff } from '@mui/icons-material'
// import InputAdornment from '@mui/material/InputAdornment'
// import IconButton from '@mui/material/IconButton'
// import FormControlLabel from '@mui/material/FormControlLabel'
// import Checkbox from '@mui/material/Checkbox'
import { Snackbar } from '@mui/material'
import MuiAlert, { AlertProps } from '@mui/material/Alert'

import { getItem } from 'helpers/localStorage'

import styles from 'pages/[lang]/quick-upload-resume/styles.module.scss'

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />
})

const COUNT_DOWN_VERIFY_DEFAULT = 60

const RegisterInfo = (props: any) => {
  const {
    email,
    setEmail,
    emailError,
    vertical,
    horizontal,
    open,
    handleSnackbarClose,
    register4Step,
    OTPIsLoading,
    handleSendEmailTOP,
    userId,
    sendOTPBtnDisabled,
    step,
    handleAuthenticationJobseekersLogin,
    handleAuthenticationSendEmailMagicLink,
    emailTOP,
    setEmailTOP,
    emailOTPInputDisabled,
    emailTOPError,
    socialAUTHLoginCallBack,
    hideSocialMediaAuth,
    setSnackbarState,
    lang
  } = props

  // upFileError
  const fileError = useSelector((store: any) => store.users.uploadUserResume.error)

  const [quickUpladResume, setQuickUpladResume] = useState(getItem('quickUpladResume'))
  const [snackbarContext, setSnackbarContext] = useState<string | null>(null)

  useEffect(() => {
    if (fileError?.message) {
      setSnackbarContext(fileError.message)
      setSnackbarState({ vertical: 'top', horizontal: 'center', open: true })
    }
  }, [fileError])

  useEffect(() => {
    window.addEventListener('keydown', handleOnKeyDownEnter)
    return () => window.removeEventListener('keydown', handleOnKeyDownEnter)
  }, [sendOTPBtnDisabled, handleSendEmailTOP])

  const handleOnKeyDownEnter = (e) => {
    if (e.key === 'Enter' && e.keyCode === 13) {
      if (!sendOTPBtnDisabled) {
        handleSendEmailTOP()
      }
    }
  }

  useEffect(() => {
    setQuickUpladResume(getItem('quickUpladResume'))
  }, [])
  const {
    quickUploadResume: { register }
  } = lang

  const errorText = (errorMessage: string) => {
    return (
      <Text textStyle='sm' textColor='red' tagName='p' className={styles.fieldError}>
        {errorMessage}
      </Text>
    )
  }

  return (
    <div>
      {step == 1 && (
        <div>
          {!hideSocialMediaAuth && (
            <div className={styles.Register}>
              <SocialMediaAuth callbackRequest={socialAUTHLoginCallBack} />
              <div className={styles.RegisterDivider}>
                <Text textStyle='lg' className={styles.RegisterDividerText}>
                  Or
                </Text>
              </div>
            </div>
          )}

          <div className={styles.AuthLayoutTitle}>
            {!register4Step && (
              <Text bold textStyle='xxxl' tagName='h2'>
                {' '}
                {register.join}
                <br />
                {register.start} 🎉
              </Text>
            )}
          </div>
          <div className={styles.RegisterForm}>
            <div>
              <MaterialTextField
                className={styles.RegisterFormInput}
                id='email'
                label='Email Address'
                variant='outlined'
                value={email}
                size='small'
                defaultValue={email}
                autoComplete='off'
                error={emailError ? true : false}
                onChange={(e) => setEmail(e.target.value)}
              />
              {emailError && errorText(emailError)}
            </div>

            <MaterialButton
              capitalize
              size='large'
              variant='contained'
              className={styles.RegisterButton}
              isLoading={OTPIsLoading}
              // onClick={() => handleRegister(register4Step ? true : false, isRegisterModuleRedirect)}
              onClick={handleSendEmailTOP}
              disabled={sendOTPBtnDisabled}
            >
              {/* hanleRegister false 3step; true 4step */}
              <Text textStyle='xl' textColor='white' bold>
                {register.submit}
              </Text>
            </MaterialButton>

            <Text className={styles.RegisterAgreement} textStyle='sm'>
              {register.term}
              <br />
              {register.policy}
            </Text>
          </div>
        </div>
      )}

      {step == 2 && (
        <SendTOP
          userId={userId}
          COUNT_DOWN_VERIFY_DEFAULT={COUNT_DOWN_VERIFY_DEFAULT}
          handleSendEmailTOP={handleSendEmailTOP}
          email={email}
          emailTOP={emailTOP}
          setEmailTOP={setEmailTOP}
          isLoading={OTPIsLoading}
          emailOTPInputDisabled={emailOTPInputDisabled}
          login={handleAuthenticationJobseekersLogin}
          magicLink={handleAuthenticationSendEmailMagicLink}
          emailTOPError={emailTOPError}
          customizeSendOTPContainerMainFieldStyle={styles.customizeSendOTPContainerMainField}
          hideMagicLink={quickUpladResume === 'upFile'}
        />
      )}

      {step == 3 && <MagicLink userId={userId} email={email} />}

      <Snackbar anchorOrigin={{ vertical, horizontal }} open={open} key={vertical + horizontal}>
        <Alert onClose={handleSnackbarClose} severity='error' sx={{ width: '100%' }}>
          {snackbarContext ? snackbarContext : 'Resume not uploaded'}
        </Alert>
      </Snackbar>
    </div>
  )
}

export default RegisterInfo
