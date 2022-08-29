import React, {  } from 'react'

import { Visibility, VisibilityOff } from '@mui/icons-material'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'

/* Redux Actions */

/* Components */
import MaterialButton from 'components/MaterialButton'
import MaterialTextField from 'components/MaterialTextField'
import SEO from 'components/SEO'
import AuthLayout from 'components/AuthLayout'
import Text from 'components/Text'

import SocialMediaAuth from 'components/SocialMediaAuth/SocialMediaAuth'

/* Styles */
import styles from './Register.module.scss'
import MetaText from '../../components/MetaText'
import useRegister from 'pages/hooks/useRegister'

const Register = () => {
  const {
    firstName, setFirstName, 
    firstNameError, lastName, setLastName, 
    lastNameError, email, setEmail, 
    emailError, password, setPassword, 
    passwordError, showPassword, isSubscribe, setIsSubscribe,
    errors,
    register,
    handleRegister,
    isRegisteringJobseeker,
    handleOnShowPassword,
    callbackRequest,
  } = useRegister()

  const errorText = (errorMessage: string) => {
    return (
      <Text textStyle='sm' textColor='red' tagName='p' className={styles.fieldError}>
        {errorMessage}
      </Text>
    )
  }
  return (
    <AuthLayout
      headingText={
        <>
          <MetaText tagName='h1'>Sign up as Jobseeker</MetaText>
          <Text bold textStyle='xxxl' tagName='h2'>
            {' '}
            Join Bossjob, <br />
            kick-start your career
          </Text>
        </>
      }
      ctaSignup
    >
      <SEO
        title='Sign Up | Bossjob'
        description='Join Bossjob to accelerate your professional career today! Access courses and job opportunities in Philippines. Network of 2 million+ professionals.'
        canonical='/register/jobseeker'
      />

      <div className={styles.Register}>
        <SocialMediaAuth callbackRequest={callbackRequest} />
        <div className={styles.RegisterDivider}>
          <Text textStyle='lg' className={styles.RegisterDividerText}>
            Or
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
              ),
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
              label={
                <Text textStyle='sm'>
                  Email me exclusive newsletters & job updates from Bossjob.
                </Text>
              }
            />
          </div>

          <MaterialButton
            capitalize
            size='large'
            variant='contained'
            className={styles.RegisterButton}
            isLoading={isRegisteringJobseeker}
            onClick={() => handleRegister()}
          >
            <Text textStyle='xl' textColor='white' bold>
              Sign up
            </Text>
          </MaterialButton>

          <Text className={styles.RegisterAgreement} textStyle='sm'>
            By signing up, I have read and agreed to Terms of Use and Privacy Policy
          </Text>
        </form>
      </div>
    </AuthLayout>
  )
}

Register.getInitialProps = async ({ req, res }) => {
  const accessToken = req?.cookies.accessToken
  if (accessToken) {
    res.setHeader('location', `/jobs-hiring/job-search`)
    res.statusCode = 301
    res.end()
  }
  return {}
}

export default Register
