import React from 'react'
import MaterialTextField from 'components/MaterialTextField'
import MaterialButton from 'components/MaterialButton'
import Text from 'components/Text'

import { Visibility, VisibilityOff } from '@mui/icons-material'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import { Snackbar } from '@mui/material'
import MuiAlert, { AlertProps } from '@mui/material/Alert'

import styles from 'pages/Increase-user-conversion/quick-upload-resume/styles.module.scss'

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />
})

const RegisterInfo = (props: any) => {
  const {
    firstName,
    setFirstName,
    firstNameError,
    lastName,
    setLastName,
    lastNameError,
    email,
    setEmail,
    emailError,
    password,
    setPassword,
    passwordError,
    showPassword,
    isSubscribe,
    setIsSubscribe,
    errors,
    register,
    handleRegister,
    handleOnShowPassword,
    isRegisteringJobseeker,
    vertical,
    horizontal,
    open,
    handleSnackbarClose
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
      <div className={styles.AuthLayoutTitle}>
        <Text bold textStyle='xxxl' tagName='h2'>
          {' '}
          Fill in your details to
          <br />
          continue 🎉
        </Text>
      </div>
      <form className={styles.RegisterForm}>
        <div className={styles.RegisterFormName}>
          <div>
            <MaterialTextField
              refs={{ ...register('firstName', { required: true }) }}
              className={styles.RegisterFormInput}
              name='firstName'
              label='First Name'
              variant='outlined'
              value={firstName}
              size='small'
              defaultValue={firstName}
              autoComplete='off'
              onChange={(e) => setFirstName(e.target.value)}
              error={firstNameError ? true : false}
            />
            {firstNameError && errorText(firstNameError)}
            {errors.firstName && (
              <Text textColor='red' textStyle='sm'>
                This field is required.
              </Text>
            )}
          </div>

          <div>
            <MaterialTextField
              className={styles.RegisterFormInput}
              id='lastName'
              label='Last Name'
              variant='outlined'
              value={lastName}
              size='small'
              defaultValue={lastName}
              autoComplete='off'
              onChange={(e) => setLastName(e.target.value)}
              error={lastNameError ? true : false}
            />
            {lastNameError && errorText(lastNameError)}
          </div>
        </div>

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

        <MaterialTextField
          className={styles.RegisterFormInput}
          id='password'
          name='password'
          type={showPassword ? 'text' : 'password'}
          label='Password'
          variant='outlined'
          size='small'
          value={password}
          autoComplete='off'
          error={passwordError ? true : false}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <IconButton
                  aria-label='toggle password visibility'
                  onClick={handleOnShowPassword}
                  onMouseDown={handleOnShowPassword}
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            )
          }}
          isSubmitOnEnter={true}
          onSubmit={handleRegister}
        />
        {passwordError && errorText(passwordError)}

        <div className={styles.RegisterEmailNewsletter}>
          <FormControlLabel
            control={
              <Checkbox
                defaultChecked
                value={isSubscribe}
                onChange={(e) => setIsSubscribe(e.target.checked)}
              />
            }
            label={<Text textStyle='sm'>Email me exclusive newsletters & job updates</Text>}
          />
        </div>

        <MaterialButton
          capitalize
          size='large'
          variant='contained'
          className={styles.RegisterButton}
          isLoading={isRegisteringJobseeker}
          onClick={() => handleRegister(false)}
        >
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

      <Snackbar anchorOrigin={{ vertical, horizontal }} open={open} key={vertical + horizontal}>
        <Alert onClose={handleSnackbarClose} severity='error' sx={{ width: '100%' }}>
          Resume not uploaded
        </Alert>
      </Snackbar>
    </div>
  )
}

export default RegisterInfo
