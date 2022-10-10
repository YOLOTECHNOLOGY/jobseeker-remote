import React from 'react'
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

import styles from 'pages/quick-upload-resume/styles.module.scss'

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />
})

const COUNT_DOWN_VERIFY_DEFAULT = 60

const RegisterInfo = (props: any) => {
  const {
    // firstName,
    // setFirstName,
    // firstNameError,
    // lastName,
    // setLastName,
    // lastNameError,
    email,
    setEmail,
    emailError,
    // password,
    // setPassword,
    // passwordError,
    // showPassword,
    // isSubscribe,
    // setIsSubscribe,
    // errors,
    // register,
    // handleRegister,
    // handleOnShowPassword,
    // isRegisteringJobseeker,
    vertical,
    horizontal,
    open,
    handleSnackbarClose,
    register4Step,
    // isRegisterModuleRedirect,
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
    callbackRequest,
    hideSocialMediaAuth
  } = props

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
              <SocialMediaAuth callbackRequest={callbackRequest} />
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
                Fill in your details to
                <br />
                continue 🎉
              </Text>
            )}
          </div>
          <form className={styles.RegisterForm}>
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
                Submit
              </Text>
            </MaterialButton>

            <Text className={styles.RegisterAgreement} textStyle='sm'>
              By signing up, I have read and agreed to Terms of Use
              <br />
              and Privacy Policy
            </Text>
          </form>
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
        />
      )}

      {step == 3 && <MagicLink userId={userId} email={email} />}

      <Snackbar anchorOrigin={{ vertical, horizontal }} open={open} key={vertical + horizontal}>
        <Alert onClose={handleSnackbarClose} severity='error' sx={{ width: '100%' }}>
          Resume not uploaded
        </Alert>
      </Snackbar>
    </div>
  )
}

export default RegisterInfo
